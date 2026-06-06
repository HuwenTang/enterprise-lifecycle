package com.tzdig.framework.controller

import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.LhbNewFourUpEnterprisesDTO
import com.tzdig.framework.model.dto.LhbNewFourUpEnterprisesExcelRow
import com.tzdig.framework.model.qo.LhbNewFourUpEnterprisesQO
import com.tzdig.framework.model.vo.LhbNewFourUpEnterprisesVO
import com.tzdig.framework.mybatis.entity.prime.LhbNewFourUpEnterprises
import com.tzdig.framework.mybatis.mapper.prime.LhbNewFourUpEnterprisesMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "四上企业新增数情况表管理")
@RestController
@RequestMapping("lhb-new-four-up-enterprises")
class LhbNewFourUpEnterprisesController {
    @Operation(summary = "查询四上企业新增数情况表列表")
    //@SaCheckPermission("lhb-new-four-up-enterprises::query")
    @GetMapping
    @PageableQuery
    fun listLhbNewFourUpEnterprises(
        qo: LhbNewFourUpEnterprisesQO,
        pageable: Pageable,
    ): PageableResult<LhbNewFourUpEnterprisesVO> {
        val page = paginate<LhbNewFourUpEnterprises>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::LhbNewFourUpEnterprisesVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询四上企业新增数情况表")
    //@SaCheckPermission("lhb-new-four-up-enterprises::query")
    @GetMapping("{id}")
    fun getLhbNewFourUpEnterprises(
        @PathVariable id: String,
    ): LhbNewFourUpEnterprisesVO {
        val record = queryOneById<LhbNewFourUpEnterprises>(id)
            ?: throw NotFoundException("四上企业新增数情况表不存在")
        return LhbNewFourUpEnterprisesVO(record)
    }

    @Operation(summary = "创建四上企业新增数情况表")
    //@SaCheckPermission("lhb-new-four-up-enterprises::create")
    @PostMapping
    fun createLhbNewFourUpEnterprises(
        @RequestBody dto: LhbNewFourUpEnterprisesDTO,
    ) {
        dto.toLhbNewFourUpEnterprises().save()
    }

    @Operation(summary = "修改四上企业新增数情况表")
    //@SaCheckPermission("lhb-new-four-up-enterprises::update")
    @PutMapping("{id}")
    fun updateLhbNewFourUpEnterprises(
        @PathVariable id: String,
        @RequestBody dto: LhbNewFourUpEnterprisesDTO,
    ) {
        val record = queryOneById<LhbNewFourUpEnterprises>(id)
            ?: throw NotFoundException("四上企业新增数情况表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除四上企业新增数情况表")
    //@SaCheckPermission("lhb-new-four-up-enterprises::delete")
    @DeleteMapping("{id}")
    fun deleteLhbNewFourUpEnterprises(
        @PathVariable id: String,
    ) {
        val result = deleteById<LhbNewFourUpEnterprises>(id)
        if (result == 0) throw NotFoundException("四上企业新增数情况表不存在")
    }

    @Operation(summary = "四上企业新增数情况表导入模板")
    //@SaCheckPermission("lhb-new-four-up-enterprises::create")
    @GetMapping("template.xlsx")
    fun getLhbNewFourUpEnterprisesImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(LhbNewFourUpEnterprisesExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("四上企业新增数情况表导入模板.xlsx")
    }

    @Operation(summary = "批量导入四上企业新增数情况表")
    //@SaCheckPermission("lhb-new-four-up-enterprises::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importLhbNewFourUpEnterprises(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<LhbNewFourUpEnterprisesExcelRow> =
                ExcelReadUtils.readFlux(tempFile, LhbNewFourUpEnterprisesExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<LhbNewFourUpEnterprisesExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toLhbNewFourUpEnterprises().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(LhbNewFourUpEnterprisesExcelRow::class)
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

    @Operation(summary = "批量导出四上企业新增数情况表")
    //@SaCheckPermission("lhb-new-four-up-enterprises::query")
    @GetMapping("export.xlsx")
    fun exportLhbNewFourUpEnterprises(
        qo: LhbNewFourUpEnterprisesQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(LhbNewFourUpEnterprisesVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<LhbNewFourUpEnterprisesMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(LhbNewFourUpEnterprisesVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("四上企业新增数情况表导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: LhbNewFourUpEnterprisesQO) {
        // TODO
    }
}
