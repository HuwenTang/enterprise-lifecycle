package com.tzdig.framework.controller

import com.alibaba.fastjson2.toJSONString
import com.mybatisflex.core.query.RawQueryOrderBy
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.model.dto.UserFeedbackDTO
import com.tzdig.framework.model.qo.UserFeedbackQO
import com.tzdig.framework.model.vo.UserFeedbackVO
import com.tzdig.framework.mybatis.entity.prime.UserFeedback
import com.tzdig.framework.mybatis.entity.prime.UserFeedbackComment
import com.tzdig.framework.mybatis.entity.prime.UserVirtualOrg
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.mapper.prime.UserVirtualOrgMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.web.exception.ForbiddenException
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.LocalTime

@Tag(name = "问题反馈管理")
@RestController
@RequestMapping("user-feedback")
class UserFeedbackController(
    private val userService: UserService,
    private val userVirtualOrgMapper: UserVirtualOrgMapper,
) {
    @Operation(summary = "查询问题反馈列表")
    //@SaCheckPermission("user-feedback::query")
    @GetMapping
    @PageableQuery
    fun listUserFeedback(
        qo: UserFeedbackQO,
        pageable: Pageable,
    ): PageableResult<UserFeedbackVO> {
        val page = paginate<UserFeedback>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::UserFeedbackVO)
        if (page.records.isNotEmpty()) {
            val userMap = queryListByIds<UserAccount>(page.records.map { it.userid })
                .associateBy { it.id }
            val orgMap = queryListByIds<UserOrganization>(page.records.map { it.orgId })
                .associateBy { it.id }
            val virtualOrgList = filter<UserVirtualOrg> { UserVirtualOrg::userid eq userAccount.id }
                .map { it.orgName }
            page.records.forEach {
                it.userName = userMap[it.userid]?.realName
                it.orgName = orgMap[it.orgId]?.name
                it.beOperator = it.operator in virtualOrgList
            }
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询问题反馈")
    //@SaCheckPermission("user-feedback::query")
    @GetMapping("{id}")
    fun getUserFeedback(
        @PathVariable id: String,
    ): UserFeedbackVO {
        val record = queryOneById<UserFeedback>(id)
            ?: throw NotFoundException("问题反馈不存在")
        val vo = UserFeedbackVO(record)
        val virtualOrgList = filter<UserVirtualOrg> { UserVirtualOrg::userid eq userAccount.id }
            .map { it.orgName }
        vo.beOperator = vo.operator in virtualOrgList
        vo.userName = userService.getUserAccountById(vo.userid)?.realName
        vo.orgName = userService.getUserOrganizationById(vo.orgId)?.name
        return vo
    }

    @Operation(summary = "创建问题反馈")
    //@SaCheckPermission("user-feedback::create")
    @PostMapping
    fun createUserFeedback(
        @RequestBody dto: UserFeedbackDTO,
    ) {
        val userAccount = userAccount
        val organizations = userService.getCobsByUserid(userAccount.id!!)
        if (dto.orgId !in organizations) throw ForbiddenException
        dto.toUserFeedback(userAccount).save()
    }

    @Transactional
    @Operation(summary = "修改问题反馈")
    //@SaCheckPermission("user-feedback::update")
    @PutMapping("{id}")
    fun updateUserFeedback(
        @PathVariable id: String,
        @RequestBody dto: UserFeedbackDTO,
    ) {
        val record = queryOneById<UserFeedback>(id)
            ?: throw NotFoundException("问题反馈不存在")
        record.problemCategory = dto.problemCategory
        record.result = dto.result
        record.status = dto.status
        record.operator = dto.operator
        record.updateById()
        UserFeedbackComment {
            feedbackId = id
            userid = userAccount.id
            content = dto.result
            images = dto.images2.toJSONString()
        }.save()
    }

    @Operation(summary = "待处理数量")
    @GetMapping("pending-count")
    fun getPendingCount(): Long {
        return queryCount<UserFeedback> {
            val orgNameList = filter<UserVirtualOrg> {
                UserVirtualOrg::userid eq userAccount.id
            }.mapNotNull { it.orgName }
            if (orgNameList.isEmpty()) {
                and(UserFeedback::operator.isNull)
            } else {
                and(UserFeedback::operator inList orgNameList)
            }
            and {
                it.or(UserFeedback::status eq false)
                it.or(UserFeedback::status.isNull)
            }
        }
    }

    @Operation(summary = "删除问题反馈")
    //@SaCheckPermission("user-feedback::delete")
    @DeleteMapping("{id}")
    fun deleteUserFeedback(
        @PathVariable id: String,
    ) {
        val result = deleteById<UserFeedback>(id)
        if (result == 0) throw NotFoundException("问题反馈不存在")
    }

//    @Operation(summary = "问题反馈导入模板")
//    //@SaCheckPermission("user-feedback::create")
//    @GetMapping("template.xlsx")
//    fun getUserFeedbackImportTemplate(): FileDownloadVO {
//        val file = ExcelWriteUtils(UserFeedbackExcelRow::class)
//            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
//        return file.downloadVO("问题反馈导入模板.xlsx")
//    }
//
//    @Operation(summary = "批量导入问题反馈")
//    //@SaCheckPermission("user-feedback::create")
//    @PostMapping("import.xlsx")
//    fun importUserFeedback(
//        @RequestPart file: MultipartFile,
//    ): ExcelImportResultVO {
//        val tempFile = file.tempFile(".xlsx")
//        try {
//            val flux1: Flux<UserFeedbackExcelRow> =
//                ExcelReadUtils.readFlux(tempFile, UserFeedbackExcelRow::class)
//            val totalCount = flux1.count().block() ?: 0
//            val flux2: Flux<UserFeedbackExcelRow> = flux1.mapNotNull {
//                try {
//                    it.verify()
//                    it.toUserFeedback().save()
//                    null
//                } catch (e: IllegalArgumentException) {
//                    it.failReason = e.message
//                    it
//                }
//            }
//            val failCount = flux2.count().block() ?: 0
//            val file = if (failCount == 0L) null else {
//                ExcelWriteUtils(UserFeedbackExcelRow::class)
//                    .writeWith(createNewTempFile("xlsx")) { flux2 }
//            }
//            return ExcelImportResultVO(
//                totalCount = totalCount,
//                successCount = totalCount - failCount,
//                failCount = failCount,
//                result = file?.downloadVO("导入失败记录.xlsx")
//            )
//        } finally {
//            tempFile.delete()
//        }
//    }
//
//    @Operation(summary = "批量导出问题反馈")
//    //@SaCheckPermission("user-feedback::query")
//    @GetMapping("export.xlsx")
//    fun exportUserFeedback(
//        @RequestParam(defaultValue = "") fields: Set<String>,
//    ): FileDownloadVO {
//        val file = ExcelWriteUtils(UserFeedbackVO::class)
//            .writeWith(createNewTempFile("xlsx"), fields) {
//                val mapper = mapper<UserFeedbackMapper>()
//                Flux.create { emitter ->
//                    Db.tx {
//                        val records = mapper.selectCursorByQuery(QueryWrapper())
//                        for (record in records) emitter.next(UserFeedbackVO(record))
//                        emitter.complete()
//                        true
//                    }
//                }
//            }
//        return file.downloadVO("问题反馈导出.xlsx")
//    }

    private fun QueryScope.queryWrapper(qo: UserFeedbackQO) {
        if (qo.userMobile.isNotBlank()) {
            and(UserFeedback::userMobile eq qo.userMobile)
        }
        if (qo.name.isNotBlank()) {
            val userList = filter<UserAccount> { UserAccount::realName like qo.name }.mapNotNull { it.mobile }
            and(UserFeedback::userMobile inList userList)
        }
        if (qo.problemCategory != null) {
            and(UserFeedback::problemCategory eq qo.problemCategory)
        }
        if (qo.status != null) {
            and(UserFeedback::status eq qo.status)
        }
        if (qo.createTime1 != null) {
            and(UserFeedback::createTime ge qo.createTime1.atTime(LocalTime.MIN))
        }
        if (qo.createTime2 != null) {
            and(UserFeedback::createTime le qo.createTime2.atTime(LocalTime.MAX))
        }
        if (qo.updateTime1 != null) {
            and(UserFeedback::updateTime ge qo.updateTime1.atTime(LocalTime.MIN))
        }
        if (qo.updateTime2 != null) {
            and(UserFeedback::updateTime le qo.updateTime2.atTime(LocalTime.MAX))
        }
        if (qo.department.isNotBlank()) {
            and(UserFeedback::operator like qo.department)
        }
        orderBy(RawQueryOrderBy("user_feedback.id != '98074311789000139'", false))
        orderBy(RawQueryOrderBy("user_feedback.id != '96412692198000176'", false))
        orderBy(RawQueryOrderBy("user_feedback.id != '97812262859000161'", false))
        orderBy(UserFeedback::status).asc()
        orderBy(UserFeedback::createTime).desc()
    }
}
