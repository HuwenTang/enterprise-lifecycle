package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.dto.ProjectKeyProjectReviewDTO
import com.tzdig.framework.model.vo.ProjectKeyProjectReviewListVO
import com.tzdig.framework.model.vo.ProjectKeyProjectReviewVO
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProject
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProjectReview
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "重点项目审核表管理")
@RestController
@RequestMapping("project-key-project-review")
class ProjectKeyProjectReviewController(
    private val userService: UserService,
) {
    @Operation(summary = "查询重点项目审核表列表")
    //@SaCheckPermission("project-key-project-review::query")
    @GetMapping
    @PageableQuery
    fun listProjectKeyProjectReview(
        @RequestParam(defaultValue = "") projectName: String,
        @RequestParam(defaultValue = "") district: String,
        @RequestParam(defaultValue = "") park: String,
    ): PageableResult<ProjectKeyProjectReviewVO> {
        val page = paginate<ProjectKeyProjectReview>(pageable.pageNumber, pageable.pageSize) {
            join(ProjectKeyProject::class.java)
                .on(ProjectKeyProjectReview::keyProjectId eq ProjectKeyProject::id)
            if (projectName.isNotBlank()) {
                where(ProjectKeyProject::projectName like projectName)
            }
            if (district.isNotBlank()) {
                where(ProjectKeyProject::district eq district)
            }
            if (park.isNotBlank()) {
                where(ProjectKeyProject::park eq park)
            }
        }.map(::ProjectKeyProjectReviewVO)
        page.records.forEach { vo ->
            val record = queryOneById<ProjectKeyProject>(vo.keyProjectId!!)
            vo.projectName = record?.projectName
            vo.projectContent = record?.constructionContent
            vo.district = record?.district
            vo.park = record?.park
        }
        return PageableResult.of(page)
    }


    @Operation(summary = "查询评估情况")
    @GetMapping("list")
    @PageableQuery
    fun projectKeyProjectReviewList(
        @RequestParam(defaultValue = "") projectId: String,
    ): PageableResult<ProjectKeyProjectReviewListVO> {
        val page = paginate<ProjectKeyProjectReview>(pageable.pageNumber, pageable.pageSize) {
            if (projectId.isNotBlank()) {
                where(ProjectKeyProjectReview::keyProjectId eq projectId)
            }
        }.map(::ProjectKeyProjectReviewListVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询重点项目审核表")
    //@SaCheckPermission("project-key-project-review::query")
    @GetMapping("{id}")
    fun getProjectKeyProjectReview(
        @PathVariable id: String,
    ): ProjectKeyProjectReviewVO {
        val record = queryOneById<ProjectKeyProjectReview>(id)
            ?: throw NotFoundException("重点项目审核表不存在")
        return ProjectKeyProjectReviewVO(record)
    }

    @Operation(summary = "判断用户是否需要填报评估")
    @GetMapping("check")
    fun checkEstimate(
        @RequestParam projectId: String,
    ): SimpleValueDTO<Boolean> {
//        if (!userAccount.hasRole(SystemRole.DEPARTMENT_PROJECT ))
//            return SimpleValueDTO(false)
        val cob = userService.getCobsByUserid(userAccount.id!!)
        val cnt = queryCount<ProjectKeyProjectReview> {
            where(ProjectKeyProjectReview::keyProjectId eq projectId)
            and(ProjectKeyProjectReview::departmentId inList cob)
            and(ProjectKeyProjectReview::status eq "待评估")
        }
        return SimpleValueDTO(cnt != 0L)
    }

    @Operation(summary = "重点项目审核表审核")
    //@SaCheckPermission("project-key-project-review::update")
    @PutMapping
    fun updateProjectKeyProjectReview(
        @RequestBody dto: ProjectKeyProjectReviewDTO,
    ) {
        val dept = userService.getCobsByUserid(userAccount.id!!).firstOrNull() ?: throw NotFoundException("部门不存在")
        val review = query<ProjectKeyProjectReview> {
            where(ProjectKeyProjectReview::keyProjectId eq dto.keyProjectId)
            and(ProjectKeyProjectReview::status eq "待评估")
            and(ProjectKeyProjectReview::departmentId eq dept)
            limit(1)
        }.firstOrNull()
            ?: throw NotFoundException("重点项目审核表不存在")
        review.status = "已评估"
        dto.into(review).updateById()
        // 校验部门全部完成
        val cnt = queryCount<ProjectKeyProjectReview> {
            where(ProjectKeyProjectReview::keyProjectId eq dto.keyProjectId)
            and(ProjectKeyProjectReview::status eq "待评估")
        }
        if (cnt == 0L) {
            val record = queryOneById<ProjectKeyProject>(dto.keyProjectId)
            record?.projectEvaluationStatus = "已完成"
            record?.updateById()
        }
    }

    @Operation(summary = "删除重点项目审核表")
    //@SaCheckPermission("project-key-project-review::delete")
    @DeleteMapping("{id}")
    fun deleteProjectKeyProjectReview(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectKeyProjectReview>(id)
        if (result == 0) throw NotFoundException("重点项目审核表不存在")
    }

//    @Operation(summary = "重点项目审核表导入模板")
//    //@SaCheckPermission("project-key-project-review::create")
//    @GetMapping("template.xlsx")
//    fun getProjectKeyProjectReviewImportTemplate(): FileDownloadVO {
//        val file = ExcelWriteUtils(ProjectKeyProjectReviewExcelRow::class)
//            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
//        return file.downloadVO("重点项目审核表导入模板.xlsx")
//    }

//    @Operation(summary = "批量导入重点项目审核表")
//    //@SaCheckPermission("project-key-project-review::create")
//    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
//    fun importProjectKeyProjectReview(
//        @RequestPart file: MultipartFile,
//    ): ExcelImportResultVO {
//        val tempFile = file.tempFile(".xlsx")
//        try {
//            val flux1: Flux<ProjectKeyProjectReviewExcelRow> =
//                ExcelReadUtils.readFlux(tempFile, ProjectKeyProjectReviewExcelRow::class)
//            val totalCount = flux1.count().block() ?: 0
//            val flux2: Flux<ProjectKeyProjectReviewExcelRow> = flux1.mapNotNull {
//                try {
//                    it.verify()
//                    it.toProjectKeyProjectReview().save()
//                    null
//                } catch (e: IllegalArgumentException) {
//                    it.failReason = e.message
//                    it
//                }
//            }
//            val failCount = flux2.count().block() ?: 0
//            val file = if (failCount == 0L) null else {
//                ExcelWriteUtils(ProjectKeyProjectReviewExcelRow::class)
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

//    @Operation(summary = "批量导出重点项目审核表")
//    //@SaCheckPermission("project-key-project-review::query")
//    @GetMapping("export.xlsx")
//    fun exportProjectKeyProjectReview(
//        @RequestParam(defaultValue = "") fields: Set<String>,
//    ): FileDownloadVO {
//        val queryWrapper = with(QueryScope()) {
//        }
//        val file = ExcelWriteUtils(ProjectKeyProjectReviewVO::class)
//            .writeWith(createNewTempFile("xlsx"), fields) {
//                val mapper = mapper<ProjectKeyProjectReviewMapper>()
//                Flux.create { emitter ->
//                    Db.tx {
//                        val records = mapper.selectCursorByQuery(queryWrapper)
//                        for (record in records) emitter.next(ProjectKeyProjectReviewVO(record))
//                        emitter.complete()
//                        true
//                    }
//                }
//            }
//        return file.downloadVO("重点项目审核表导出.xlsx")
//    }
}
