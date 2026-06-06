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
import com.tzdig.framework.model.dto.LhbInvestmentFixedAssetsDTO
import com.tzdig.framework.model.dto.LhbInvestmentFixedAssetsExcelRow
import com.tzdig.framework.model.qo.LhbInvestmentFixedAssetsQO
import com.tzdig.framework.model.vo.LhbInvestmentFixedAssetsVO
import com.tzdig.framework.mybatis.entity.prime.LhbInvestmentFixedAssets
import com.tzdig.framework.mybatis.mapper.prime.LhbInvestmentFixedAssetsMapper
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

@Tag(name = "固定资产投资情况统计表管理")
@RestController
@RequestMapping("lhb-investment-fixed-assets")
class LhbInvestmentFixedAssetsController {
    @Operation(summary = "查询固定资产投资情况统计表列表")
    //@SaCheckPermission("lhb-investment-fixed-assets::query")
    @GetMapping
    @PageableQuery
    fun listLhbInvestmentFixedAssets(
        qo: LhbInvestmentFixedAssetsQO,
        pageable: Pageable,
    ): PageableResult<LhbInvestmentFixedAssetsVO> {
        val page = paginate<LhbInvestmentFixedAssets>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::LhbInvestmentFixedAssetsVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询固定资产投资情况统计表")
    //@SaCheckPermission("lhb-investment-fixed-assets::query")
    @GetMapping("{id}")
    fun getLhbInvestmentFixedAssets(
        @PathVariable id: String,
    ): LhbInvestmentFixedAssetsVO {
        val record = queryOneById<LhbInvestmentFixedAssets>(id)
            ?: throw NotFoundException("固定资产投资情况统计表不存在")
        return LhbInvestmentFixedAssetsVO(record)
    }

    @Operation(summary = "创建固定资产投资情况统计表")
    //@SaCheckPermission("lhb-investment-fixed-assets::create")
    @PostMapping
    fun createLhbInvestmentFixedAssets(
        @RequestBody dto: LhbInvestmentFixedAssetsDTO,
    ) {
        dto.toLhbInvestmentFixedAssets().save()
    }

    @Operation(summary = "修改固定资产投资情况统计表")
    //@SaCheckPermission("lhb-investment-fixed-assets::update")
    @PutMapping("{id}")
    fun updateLhbInvestmentFixedAssets(
        @PathVariable id: String,
        @RequestBody dto: LhbInvestmentFixedAssetsDTO,
    ) {
        val record = queryOneById<LhbInvestmentFixedAssets>(id)
            ?: throw NotFoundException("固定资产投资情况统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除固定资产投资情况统计表")
    //@SaCheckPermission("lhb-investment-fixed-assets::delete")
    @DeleteMapping("{id}")
    fun deleteLhbInvestmentFixedAssets(
        @PathVariable id: String,
    ) {
        val result = deleteById<LhbInvestmentFixedAssets>(id)
        if (result == 0) throw NotFoundException("固定资产投资情况统计表不存在")
    }

    @Operation(summary = "固定资产投资情况统计表导入模板")
    //@SaCheckPermission("lhb-investment-fixed-assets::create")
    @GetMapping("template.xlsx")
    fun getLhbInvestmentFixedAssetsImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(LhbInvestmentFixedAssetsExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("固定资产投资情况统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入固定资产投资情况统计表")
    //@SaCheckPermission("lhb-investment-fixed-assets::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importLhbInvestmentFixedAssets(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<LhbInvestmentFixedAssetsExcelRow> =
                ExcelReadUtils.readFlux(tempFile, LhbInvestmentFixedAssetsExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<LhbInvestmentFixedAssetsExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toLhbInvestmentFixedAssets().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(LhbInvestmentFixedAssetsExcelRow::class)
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

    @Operation(summary = "批量导出固定资产投资情况统计表")
    //@SaCheckPermission("lhb-investment-fixed-assets::query")
    @GetMapping("export.xlsx")
    fun exportLhbInvestmentFixedAssets(
        qo: LhbInvestmentFixedAssetsQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(LhbInvestmentFixedAssetsVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<LhbInvestmentFixedAssetsMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(LhbInvestmentFixedAssetsVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("固定资产投资情况统计表导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: LhbInvestmentFixedAssetsQO) {
        // TODO
    }
}
