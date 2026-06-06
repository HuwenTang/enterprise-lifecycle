package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ForeignCapitalUtilizationExcelRow
import com.tzdig.framework.model.vo.ForeignCapitalUtilizationVO
import com.tzdig.framework.model.vo.ForeignCapitalVO
import com.tzdig.framework.mybatis.entity.prime.ForeignCapitalUtilization
import com.tzdig.framework.mybatis.mapper.prime.ForeignCapitalUtilizationMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "泰州市利用外资情况通报表管理")
@RestController
@RequestMapping("foreign-capital-utilization")
class ForeignCapitalUtilizationController {
    @Operation(summary = "查询泰州市利用外资情况通报表列表")
    //@SaCheckPermission("foreign-capital-utilization::query")
    @GetMapping
    @PageableQuery
    fun listForeignCapitalUtilization(
        pageable: Pageable,
        @Schema(description = "年度")
        @RequestParam year: Int,
        @Schema(description = "月份")
        @RequestParam month: Int,
    ): PageableResult<ForeignCapitalUtilizationVO> {
        val page = paginate<ForeignCapitalUtilization>(pageable.pageNumber, pageable.pageSize) {
            //根绝年度和月份查询
            and(ForeignCapitalUtilization::year eq year)
            and(ForeignCapitalUtilization::month eq month)
        }.map(::ForeignCapitalUtilizationVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询泰州市利用外资情况通报表数据")
    //@SaCheckPermission("foreign-capital-utilization::query")
    @GetMapping("statistic")
    fun getForeignCapitalUtilization(
        @Schema(description = "年度")
        @RequestParam year: Int,
        @Schema(description = "月份")
        @RequestParam month: Int,
    ): ForeignCapitalVO {
        val record = query<ForeignCapitalUtilization> {
            where(ForeignCapitalUtilization::month eq month)
            where(ForeignCapitalUtilization::year eq year)
            and(ForeignCapitalUtilization::area eq "全市")
        }.map(::ForeignCapitalVO)
        return record.first()
    }
    /*
    @Operation(summary = "创建泰州市利用外资情况通报表")
    //@SaCheckPermission("foreign-capital-utilization::create")
    @PostMapping
    fun createForeignCapitalUtilization(
        @RequestBody dto: ForeignCapitalUtilizationDTO,
    ) {
        dto.toForeignCapitalUtilization().save()
    }

    @Operation(summary = "修改泰州市利用外资情况通报表")
    //@SaCheckPermission("foreign-capital-utilization::update")
    @PutMapping("{id}")
    fun updateForeignCapitalUtilization(
        @PathVariable id: String,
        @RequestBody dto: ForeignCapitalUtilizationDTO,
    ) {
        val record = queryOneById<ForeignCapitalUtilization>(id)
            ?: throw NotFoundException("泰州市利用外资情况通报表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除泰州市利用外资情况通报表")
    //@SaCheckPermission("foreign-capital-utilization::delete")
    @DeleteMapping("{id}")
    fun deleteForeignCapitalUtilization(
        @PathVariable id: String,
    ) {
        val result = deleteById<ForeignCapitalUtilization>(id)
        if (result == 0) throw NotFoundException("泰州市利用外资情况通报表不存在")
    }*/

    @Operation(summary = "泰州市利用外资情况通报表导入模板")
    //@SaCheckPermission("foreign-capital-utilization::create")
    @GetMapping("template.xlsx")
    fun getForeignCapitalUtilizationImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ForeignCapitalUtilizationExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("泰州市利用外资情况通报表导入模板.xlsx")
    }

    @Operation(summary = "批量导入泰州市利用外资情况通报表")
    //@SaCheckPermission("foreign-capital-utilization::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importForeignCapitalUtilization(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ForeignCapitalUtilizationExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ForeignCapitalUtilizationExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ForeignCapitalUtilizationExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toForeignCapitalUtilization().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ForeignCapitalUtilizationExcelRow::class)
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

    @Operation(summary = "批量导出泰州市利用外资情况通报表")
    //@SaCheckPermission("foreign-capital-utilization::query")
    @GetMapping("export.xlsx")
    fun exportForeignCapitalUtilization(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ForeignCapitalUtilizationVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ForeignCapitalUtilizationMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ForeignCapitalUtilizationVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("泰州市利用外资情况通报表导出.xlsx")
    }
}
