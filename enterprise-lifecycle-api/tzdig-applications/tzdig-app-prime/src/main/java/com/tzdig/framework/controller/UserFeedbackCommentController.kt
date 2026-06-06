package com.tzdig.framework.controller

import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.UserFeedbackCommentDTO
import com.tzdig.framework.model.dto.UserFeedbackCommentExcelRow
import com.tzdig.framework.model.qo.UserFeedbackCommentQO
import com.tzdig.framework.model.vo.UserFeedbackCommentVO
import com.tzdig.framework.mybatis.entity.prime.UserFeedbackComment
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.mapper.prime.UserFeedbackCommentMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "问题反馈管理")
@RestController
@RequestMapping("user-feedback-comment")
class UserFeedbackCommentController {
    @Operation(summary = "查询问题反馈回复列表")
    //@SaCheckPermission("user-feedback-comment::query")
    @GetMapping
    @PageableQuery
    fun listUserFeedbackComment(
        qo: UserFeedbackCommentQO,
        pageable: Pageable,
    ): PageableResult<UserFeedbackCommentVO> {
        val page = paginate<UserFeedbackComment>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::UserFeedbackCommentVO)
        if (page.records.isNotEmpty()) {
            val userMap = queryListByIds<UserAccount>(page.records.map { it.userid })
                .associateBy { it.id }
            page.records.forEach {
                it.userName = userMap[it.userid]?.realName
            }
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询问题反馈回复")
    //@SaCheckPermission("user-feedback-comment::query")
    @GetMapping("{id}")
    fun getUserFeedbackComment(
        @PathVariable id: String,
    ): UserFeedbackCommentVO {
        val record = queryOneById<UserFeedbackComment>(id)
            ?: throw NotFoundException("问题反馈回复不存在")
        return UserFeedbackCommentVO(record)
    }

    @Operation(summary = "创建问题反馈回复")
    //@SaCheckPermission("user-feedback-comment::create")
    @PostMapping
    fun createUserFeedbackComment(
        @RequestBody dto: UserFeedbackCommentDTO,
    ) {
        val userid = userAccount.id!!
        dto.toUserFeedbackComment(userid).save()
    }

    @Operation(summary = "修改问题反馈回复")
    //@SaCheckPermission("user-feedback-comment::update")
    @PutMapping("{id}")
    fun updateUserFeedbackComment(
        @PathVariable id: String,
        @RequestBody dto: UserFeedbackCommentDTO,
    ) {
        val record = queryOneById<UserFeedbackComment>(id)
            ?: throw NotFoundException("问题反馈回复不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除问题反馈回复")
    //@SaCheckPermission("user-feedback-comment::delete")
    @DeleteMapping("{id}")
    fun deleteUserFeedbackComment(
        @PathVariable id: String,
    ) {
        val result = deleteById<UserFeedbackComment>(id)
        if (result == 0) throw NotFoundException("问题反馈回复不存在")
    }

    @Operation(summary = "问题反馈回复导入模板")
    //@SaCheckPermission("user-feedback-comment::create")
    @GetMapping("template.xlsx")
    fun getUserFeedbackCommentImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(UserFeedbackCommentExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("问题反馈回复导入模板.xlsx")
    }

    @Operation(summary = "批量导入问题反馈回复")
    //@SaCheckPermission("user-feedback-comment::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importUserFeedbackComment(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<UserFeedbackCommentExcelRow> =
                ExcelReadUtils.readFlux(tempFile, UserFeedbackCommentExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<UserFeedbackCommentExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toUserFeedbackComment().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(UserFeedbackCommentExcelRow::class)
                    .writeWith(createNewTempFile("xlsx")) { flux2 }
            }
            return ExcelImportResultVO(
                totalCount = totalCount,
                successCount = totalCount - failCount,
                failCount = failCount,
                result = file?.downloadVO("导入失败记录.xlsx")
            )
        } finally {
            tempFile.delete()
        }
    }

    @Operation(summary = "批量导出问题反馈回复")
    //@SaCheckPermission("user-feedback-comment::query")
    @GetMapping("export.xlsx")
    fun exportUserFeedbackComment(
        qo: UserFeedbackCommentQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(UserFeedbackCommentVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<UserFeedbackCommentMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(UserFeedbackCommentVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("问题反馈回复导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: UserFeedbackCommentQO) {
        where(UserFeedbackComment::feedbackId eq qo.feedbackId)
        orderBy(UserFeedbackComment::createTime).desc()
    }
}
