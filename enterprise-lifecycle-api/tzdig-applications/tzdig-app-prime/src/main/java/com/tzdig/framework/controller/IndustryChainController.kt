package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.IndustryChainDTO
import com.tzdig.framework.model.dto.IndustryChainExcelRow
import com.tzdig.framework.model.vo.IndustryChainVO
import com.tzdig.framework.mybatis.entity.prime.IndustryChain
import com.tzdig.framework.mybatis.mapper.prime.IndustryChainMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "产业链集群8+13+x管理")
@RestController
@RequestMapping("industry-chain")
class IndustryChainController {
    @Operation(summary = "查询列表")
    //@SaCheckPermission("industry-chain::query")
    @GetMapping
    @PageableQuery
    fun listIndustryChain(
        pageable: Pageable,
        @RequestParam("产业集群") cluster: String
    ): PageableResult<IndustryChainVO> {
        val page = paginate<IndustryChain>(pageable.pageNumber, pageable.pageSize) {
            select(
                IndustryChain::chains,
                IndustryChain::companyNumber,
                IndustryChain::output,
                IndustryChain::outputIncrement,
                IndustryChain::revenue,
                IndustryChain::revenueIncrement,
                IndustryChain::profit,
                IndustryChain::profitIncrement
            )
            where(IndustryChain::cluster eq cluster)
        }.map(::IndustryChainVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询")
    //@SaCheckPermission("industry-chain::query")
    @GetMapping("{id}")
    fun getIndustryChain(
        @PathVariable id: String,
    ): IndustryChainVO {
        val record = queryOneById<IndustryChain>(id)
            ?: throw NotFoundException("不存在")
        return IndustryChainVO(record)
    }

    @Operation(summary = "创建")
    //@SaCheckPermission("industry-chain::create")
    @PostMapping
    fun createIndustryChain(
        @RequestBody dto: IndustryChainDTO,
    ) {
        dto.toIndustryChain().save()
    }

    @Operation(summary = "修改")
    //@SaCheckPermission("industry-chain::update")
    @PutMapping("{id}")
    fun updateIndustryChain(
        @PathVariable id: String,
        @RequestBody dto: IndustryChainDTO,
    ) {
        val record = queryOneById<IndustryChain>(id)
            ?: throw NotFoundException("不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除")
    //@SaCheckPermission("industry-chain::delete")
    @DeleteMapping("{id}")
    fun deleteIndustryChain(
        @PathVariable id: String,
    ) {
        val result = deleteById<IndustryChain>(id)
        if (result == 0) throw NotFoundException("不存在")
    }

    @Operation(summary = "导入模板")
    //@SaCheckPermission("industry-chain::create")
    @GetMapping("template.xlsx")
    fun getIndustryChainImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(IndustryChainExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("导入模板.xlsx")
    }

    @Operation(summary = "批量导入")
    //@SaCheckPermission("industry-chain::create")
    @PostMapping("import.xlsx")
    fun importIndustryChain(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<IndustryChainExcelRow> =
                ExcelReadUtils.readFlux(tempFile, IndustryChainExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<IndustryChainExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toIndustryChain().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(IndustryChainExcelRow::class)
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

    @Operation(summary = "批量导出")
    //@SaCheckPermission("industry-chain::query")
    @GetMapping("export.xlsx")
    fun exportIndustryChain(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(IndustryChainVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<IndustryChainMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(IndustryChainVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("导出.xlsx")
    }
}
