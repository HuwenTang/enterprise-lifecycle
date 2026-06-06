package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.EnterpriseInnovativeClustersDTO
import com.tzdig.framework.model.dto.EnterpriseInnovativeClustersExcelRow
import com.tzdig.framework.model.vo.EnterpriseInnovativeClustersVO
import com.tzdig.framework.model.vo.StatisticCenterVO
import com.tzdig.framework.model.vo.StatisticInnovativeClusterVO
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInnovativeClusters
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "企业创新平台统计表管理")
@RestController
@RequestMapping("enterprise-innovative-clusters")
class EnterpriseInnovativeClustersController {
    @Operation(summary = "查询企业创新平台统计表列表")
    //@SaCheckPermission("enterprise-innovative-clusters::query")
    @GetMapping
    @PageableQuery
    fun listEnterpriseInnovativeClusters(
        @Schema(description = "产业集群")
        @RequestParam(required = false) industryChain: String?,
        @Schema(description = "产业链")
        @RequestParam(required = false) chain: String?,
        @Schema(description = "未来产业链")
        @RequestParam(required = false) futureChain: String?,
        @Schema(description = "企业名称")
        @RequestParam(required = false) enterpriseName: String?,
        @Schema(description = "市（区）")
        @RequestParam(required = false) cityDistrict: String?,
        pageable: Pageable,
    ): PageableResult<EnterpriseInnovativeClustersVO> {
        val page = paginate<EnterpriseInnovativeClusters>(pageable.pageNumber, pageable.pageSize) {
            if (industryChain != null) {
                and(EnterpriseInnovativeClusters::innovativeClusters8 eq industryChain)
            }
            if (chain != null) {
                and(EnterpriseInnovativeClusters::industrialChains13 eq chain)
            }
            if (futureChain != null) {
                and(EnterpriseInnovativeClusters::futureChainsX eq futureChain)
            }
            if (enterpriseName != null) {
                and(EnterpriseInnovativeClusters::enterpriseName like enterpriseName)
            }
            if (cityDistrict != null) {
                and(EnterpriseInnovativeClusters::cityDistrict eq cityDistrict)
            }
        }.map(::EnterpriseInnovativeClustersVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "企业创新平台统计表统计")
    @GetMapping("statistics")
    fun statisticsEnterpriseInnovativeClusters(): List<StatisticInnovativeClusterVO> {
//        val records = query<StatisticInnovativeClusterVO> {
//            select(
//                EnterpriseInnovativeClusters::innovativeClusters8.`as`(StatisticInnovativeClusterVO::name.name),
//                QueryMethods.count().`as`(StatisticInnovativeClusterVO::count.name)
//            )
//            where(EnterpriseInnovativeClusters::innovativeClusters8.isNotNull)
//            groupBy(EnterpriseInnovativeClusters::innovativeClusters8)
//        }
//        val records1 = query<StatisticInnovativeClusterVO> {
//            select(
//                EnterpriseInnovativeClusters::industrialChains13.`as`(StatisticInnovativeClusterVO::name.name),
//                QueryMethods.count().`as`(StatisticInnovativeClusterVO::count.name)
//            )
//            where(EnterpriseInnovativeClusters::industrialChains13.isNotNull)
//            groupBy(EnterpriseInnovativeClusters::industrialChains13)
//        }
//        val records2 = query<StatisticInnovativeClusterVO> {
//            select(
//                EnterpriseInnovativeClusters::futureChainsX.`as`(StatisticInnovativeClusterVO::name.name),
//                QueryMethods.count().`as`(StatisticInnovativeClusterVO::count.name)
//            )
//            where(EnterpriseInnovativeClusters::futureChainsX.isNotNull)
//            groupBy(EnterpriseInnovativeClusters::futureChainsX)
//        }
//        return records + records1 + records2
        val group = all<EnterpriseInnovativeClusters>()
            .groupBy { it.innovativeClusters8 }
        return group.map { (key, list) ->
            val children = list.groupBy { (it.industrialChains13 ?: "") + (it.futureChainsX ?: "") }
                .map { (key1, list1) ->
                    StatisticInnovativeClusterVO(
                        name = key1,
                        count = list1.size,
                    )
                }
            StatisticInnovativeClusterVO(
                name = key,
                count = list.size,
                children = children,
            )
        }
    }

    @Operation(summary = "大中心情况统计")
    @GetMapping("statistics-center")
    fun statisticsCenter() = StatisticCenterVO(
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::fgProvincialLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::fgMunicipalLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::swProvincialLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::swProvincialLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::kjLabProvincialLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::kjLabMunicipalLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::kjLabNationalLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::gxProvincialLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::gxMunicipalLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::kjEngProvincialLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::kjEngMunicipalLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::kjAcademicianProvincialLevel.eq(true))
        },
        queryCount<EnterpriseInnovativeClusters> {
            and(EnterpriseInnovativeClusters::kjAcademicianMunicipalLevel.eq(true))
        }
    )

    @Operation(summary = "查询企业创新平台统计表")
    //@SaCheckPermission("enterprise-innovative-clusters::query")
    @GetMapping("{id}")
    fun getEnterpriseInnovativeClusters(
        @PathVariable id: String,
    ): EnterpriseInnovativeClustersVO {
        val record = queryOneById<EnterpriseInnovativeClusters>(id)
            ?: throw NotFoundException("企业创新平台统计表不存在")
        return EnterpriseInnovativeClustersVO(record)
    }

    @Operation(summary = "创建企业创新平台统计表")
    //@SaCheckPermission("enterprise-innovative-clusters::create")
    @PostMapping
    fun createEnterpriseInnovativeClusters(
        @RequestBody dto: EnterpriseInnovativeClustersDTO,
    ) {
        dto.toEnterpriseInnovativeClusters().save()
    }

    @Operation(summary = "修改企业创新平台统计表")
    //@SaCheckPermission("enterprise-innovative-clusters::update")
    @PutMapping("{id}")
    fun updateEnterpriseInnovativeClusters(
        @PathVariable id: String,
        @RequestBody dto: EnterpriseInnovativeClustersDTO,
    ) {
        val record = queryOneById<EnterpriseInnovativeClusters>(id)
            ?: throw NotFoundException("企业创新平台统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除企业创新平台统计表")
    //@SaCheckPermission("enterprise-innovative-clusters::delete")
    @DeleteMapping("{id}")
    fun deleteEnterpriseInnovativeClusters(
        @PathVariable id: String,
    ) {
        val result = deleteById<EnterpriseInnovativeClusters>(id)
        if (result == 0) throw NotFoundException("企业创新平台统计表不存在")
    }

    @Operation(summary = "企业创新平台统计表导入模板")
    //@SaCheckPermission("enterprise-innovative-clusters::create")
    @GetMapping("template.xlsx")
    fun getEnterpriseInnovativeClustersImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(EnterpriseInnovativeClustersExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("企业创新平台统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入企业创新平台统计表")
    //@SaCheckPermission("enterprise-innovative-clusters::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importEnterpriseInnovativeClusters(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<EnterpriseInnovativeClustersExcelRow> =
                ExcelReadUtils.readFlux(tempFile, EnterpriseInnovativeClustersExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<EnterpriseInnovativeClustersExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toEnterpriseInnovativeClusters().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(EnterpriseInnovativeClustersExcelRow::class)
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

//    @Operation(summary = "批量导出企业创新平台统计表")
//    //@SaCheckPermission("enterprise-innovative-clusters::query")
//    @GetMapping("export.xlsx")
//    fun exportEnterpriseInnovativeClusters(
//        @RequestParam(defaultValue = "") fields: Set<String>,
//    ): FileDownloadVO {
//        val queryWrapper = with(QueryScope()) {
//        }
//        val file = ExcelWriteUtils(EnterpriseInnovativeClustersVO::class)
//            .writeWith(createNewTempFile("xlsx"), fields) {
//                val mapper = mapper<EnterpriseInnovativeClustersMapper>()
//                Flux.create { emitter ->
//                    Db.tx {
//                        val records = mapper.selectCursorByQuery(queryWrapper)
//                        for (record in records) emitter.next(EnterpriseInnovativeClustersVO(record))
//                        emitter.complete()
//                        true
//                    }
//                }
//            }
//        return file.downloadVO("企业创新平台统计表导出.xlsx")
//    }
}
