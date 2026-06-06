package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.vo.KeySciTechProjectsVO
import com.tzdig.framework.mybatis.entity.prime.KeySciTechProjects
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "重点科创项目表管理")
@RestController
@RequestMapping("key-sci-tech-projects")
class KeySciTechProjectsController {
    @Operation(summary = "查询重点科创项目表列表")
    //@SaCheckPermission("key-sci-tech-projects::query")
    @GetMapping
    @PageableQuery
    fun listKeySciTechProjects(
        pageable: Pageable,
        @Schema(description = "地区")
        @RequestParam district: String?,
        @Schema(description = "园区")
        @RequestParam park: String?,
        @Schema(description = "申请条件")
        @RequestParam applicationCondition: String?,
    ): PageableResult<KeySciTechProjectsVO> {
        val page = paginate<KeySciTechProjects>(pageable.pageNumber, pageable.pageSize) {
            val map = mapOf(
                "知识产权类" to "知识产权类项目",
                "高层次人才类" to "高层次人才项目",
                "科技计划或大赛类" to "大赛类项目",
                "风险投资类" to "风险投资项目",
                "省市产研院类" to "省市产研院项目",
                "重大创新平台类" to "重大创新平台类项目"
            )
            if (district != null) {
                and(KeySciTechProjects::district eq district)
            }
            if (park != null) {
                and(KeySciTechProjects::park eq park)
            }
            if (applicationCondition != null) {
                if (map.containsKey(applicationCondition)) {
                    and(KeySciTechProjects::applicationConditions eq map[applicationCondition])
                }
            }
        }.map(::KeySciTechProjectsVO)
        return PageableResult.of(page)
    }

    /* @Operation(summary = "查询重点科创项目表")
     //@SaCheckPermission("key-sci-tech-projects::query")
     @GetMapping("{id}")
     fun getKeySciTechProjects(
         @PathVariable id: String,
     ): KeySciTechProjectsVO {
         val record = queryOneById<KeySciTechProjects>(id)
             ?: throw NotFoundException("重点科创项目表不存在")
         return KeySciTechProjectsVO(record)
     }

     @Operation(summary = "创建重点科创项目表")
     //@SaCheckPermission("key-sci-tech-projects::create")
     @PostMapping
     fun createKeySciTechProjects(
         @RequestBody dto: KeySciTechProjectsDTO,
     ) {
         dto.toKeySciTechProjects().save()
     }

     @Operation(summary = "修改重点科创项目表")
     //@SaCheckPermission("key-sci-tech-projects::update")
     @PutMapping("{id}")
     fun updateKeySciTechProjects(
         @PathVariable id: String,
         @RequestBody dto: KeySciTechProjectsDTO,
     ) {
         val record = queryOneById<KeySciTechProjects>(id)
             ?: throw NotFoundException("重点科创项目表不存在")
         dto.into(record).updateById()
     }

     @Operation(summary = "删除重点科创项目表")
     //@SaCheckPermission("key-sci-tech-projects::delete")
     @DeleteMapping("{id}")
     fun deleteKeySciTechProjects(
         @PathVariable id: String,
     ) {
         val result = deleteById<KeySciTechProjects>(id)
         if (result == 0) throw NotFoundException("重点科创项目表不存在")
     }*/

//    @Operation(summary = "重点科创项目表导入模板")
//    //@SaCheckPermission("key-sci-tech-projects::create")
//    @GetMapping("template.xlsx")
//    fun getKeySciTechProjectsImportTemplate(): FileDownloadVO {
//        val file = ExcelWriteUtils(KeySciTechProjectsExcelRow::class)
//            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
//        return file.downloadVO("重点科创项目表导入模板.xlsx")
//    }
//
//    @Operation(summary = "批量导入重点科创项目表")
//    //@SaCheckPermission("key-sci-tech-projects::create")
//    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
//    fun importKeySciTechProjects(
//        @RequestPart file: MultipartFile,
//    ): ExcelImportResultVO {
//        val tempFile = file.tempFile(".xlsx")
//        try {
//            val flux1: Flux<KeySciTechProjectsExcelRow> =
//                ExcelReadUtils.readFlux(tempFile, KeySciTechProjectsExcelRow::class)
//            val totalCount = flux1.count().block() ?: 0
//            val flux2: Flux<KeySciTechProjectsExcelRow> = flux1.mapNotNull {
//                try {
//                    it.verify()
//                    it.toKeySciTechProjects().save()
//                    null
//                } catch (e: IllegalArgumentException) {
//                    it.failReason = e.message
//                    it
//                }
//            }
//            val failCount = flux2.count().block() ?: 0
//            val file = if (failCount == 0L) null else {
//                ExcelWriteUtils(KeySciTechProjectsExcelRow::class)
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

    /*@Operation(summary = "批量导出重点科创项目表")
    //@SaCheckPermission("key-sci-tech-projects::query")
    @GetMapping("export.xlsx")
    fun exportKeySciTechProjects(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(KeySciTechProjectsVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<KeySciTechProjectsMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(KeySciTechProjectsVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("重点科创项目表导出.xlsx")
    }*/
}
