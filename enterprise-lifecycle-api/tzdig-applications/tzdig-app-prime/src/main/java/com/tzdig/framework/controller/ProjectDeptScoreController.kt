package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectDeptScoreDTO
import com.tzdig.framework.model.dto.ProjectDeptScoreExcelRow
import com.tzdig.framework.model.vo.DeptScoreVO
import com.tzdig.framework.model.vo.ProjectDeptScoreVO
import com.tzdig.framework.model.vo.ProjectDigitalProjectReviewAllVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDeptScore
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.mapper.prime.ProjectDeptScoreMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
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
import java.time.LocalDateTime

@Tag(name = "三个大抓-部门得分管理")
@RestController
@RequestMapping("project-dept-score")
class ProjectDeptScoreController(private val userService: UserService) {
    @Operation(summary = "查询三个大抓-部门得分列表")
    //@SaCheckPermission("project-dept-score::query")
    @GetMapping
    @PageableQuery
    fun listProjectDeptScore(
        pageable: Pageable,
        @Schema(description = "招引部门")
        @RequestParam(defaultValue = "") dept: String,
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "部门分类(一类、二类、三类)")
        @RequestParam(defaultValue = "") deptClass: String,
    ): PageableResult<ProjectDeptScoreVO> {
        val page = paginate<ProjectDeptScore>(pageable.pageNumber, pageable.pageSize) {
            if (dept.isNotEmpty()) {
                and(ProjectDeptScore::deptName eq dept)
            }
            if (year != null) {
                and(ProjectDeptScore::year eq year)
            }
            if (deptClass.isNotEmpty()) {
                and(ProjectDeptScore::deptClass eq deptClass)
            }
            orderBy(ProjectDeptScore::year).desc()
            orderBy(ProjectDeptScore::score).desc()
        }.map(::ProjectDeptScoreVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询部门得分总览")
    //@SaCheckPermission("project-dept-score::query")
    @GetMapping("score")
    @PageableQuery
    fun listProjectDeptScoreDetail(
        pageable: Pageable,
        @Schema(description = "招引部门")
        @RequestParam(defaultValue = "") dept: String,
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
    ): PageableResult<ProjectDigitalProjectReviewAllVO> {
        val page = paginate<ProjectDigitalProjectReviewAll>(pageable.pageNumber, pageable.pageSize) {
            val deptProjectList = query<ProjectDigitalInvestmentAttracting> {
                where(ProjectDigitalInvestmentAttracting::sjjgName eq dept)
            }
            if (deptProjectList.isNotEmpty()) {
                and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList deptProjectList.mapNotNull { it.id })
            }
            if (year != null) {
                val naturalStart = LocalDateTime.of(year, 1, 1, 0, 0)
                val naturalEnd = LocalDateTime.of(year, 12, 31, 23, 59, 59)

                if (year == 2025) {
                    // 特殊处理 2025 年：开工计分延到 2026-01-07，其他用自然年
                    val extendedEnd = LocalDateTime.of(year + 1, 1, 7, 23, 59, 59)
                    val signedProject = query<ProjectDigitalProjectReviewAll> {
                        where(
                            ProjectDigitalProjectReviewAll::step eq
                                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW
                        )
                        and(ProjectDigitalProjectReviewAll::createTime ge naturalStart)
                        and(ProjectDigitalProjectReviewAll::createTime le naturalEnd)
                    }.mapNotNull { it.digitalInvestmentId }
                    and { wrapper ->
                        // 开工计分：用扩展时间范围
                        wrapper.or {
                            it.and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
                            it.and(ProjectDigitalProjectReviewAll::createTime ge naturalStart)
                            it.and(ProjectDigitalProjectReviewAll::createTime le extendedEnd)
                            it.and(ProjectDigitalProjectReviewAll::score ge 0f)
                        }
                        wrapper.or {
                            it.and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList signedProject)
                            it.and(
                                ProjectDigitalProjectReviewAll::step eq
                                        ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB
                            )
                        }
                        // 其他 step：用自然年
                        wrapper.or {
                            it.and(
                                ProjectDigitalProjectReviewAll::step eq
                                        ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE
                            )
                            it.and(ProjectDigitalProjectReviewAll::createTime ge naturalStart)
                            it.and(ProjectDigitalProjectReviewAll::createTime le naturalEnd)
                        }
                    }
                } else if (year == 2026) {
                    // 特殊处理 2026 年：开工计分开始时间延到 2026-01-07，其他用自然年
                    val extendedStart = LocalDateTime.of(2026, 1, 8, 0, 0, 0)
                    val signedProject = query<ProjectDigitalProjectReviewAll> {
                        where(
                            ProjectDigitalProjectReviewAll::step eq
                                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW
                        )
                        and(ProjectDigitalProjectReviewAll::createTime ge naturalStart)
                        and(ProjectDigitalProjectReviewAll::createTime le naturalEnd)
                    }.mapNotNull { it.digitalInvestmentId }
                    and { wrapper ->
                        // 开工计分：用扩展时间范围
                        wrapper.or {
                            it.and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
                            it.and(ProjectDigitalProjectReviewAll::createTime ge extendedStart)
                            it.and(ProjectDigitalProjectReviewAll::createTime le naturalEnd)
                            it.and(ProjectDigitalProjectReviewAll::score ge 0f)
                        }
                        wrapper.or {
                            if (signedProject.isNotEmpty()) {
                                it.and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList signedProject)
                            } else {
                                it.and(ProjectDigitalProjectReviewAll::digitalInvestmentId.isNull)
                            }
                            it.and(
                                ProjectDigitalProjectReviewAll::step eq
                                        ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB
                            )
                        }
                        // 其他 step：用自然年
                        wrapper.or {
                            it.and(
                                ProjectDigitalProjectReviewAll::step eq
                                        ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE
                            )
                            it.and(ProjectDigitalProjectReviewAll::createTime ge naturalStart)
                            it.and(ProjectDigitalProjectReviewAll::createTime le naturalEnd)
                        }
                    }
                } else {
                    // 非 2025 年：全部用自然年
                    and(ProjectDigitalProjectReviewAll::createTime ge naturalStart)
                    and(ProjectDigitalProjectReviewAll::createTime le naturalEnd)
                }
            }
            and(ProjectDigitalProjectReviewAll::result eq '1')
        }.map(::ProjectDigitalProjectReviewAllVO)
        page.records.forEach { vo ->
            vo.step = when (vo.step) {
                ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.name -> "签约计分"
                ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW.name -> "开工计分"
                ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE.name -> "新增记分"
                else -> null
            }
            vo.projectName = queryOneById<ProjectDigitalInvestmentAttracting>(vo.id!!)?.projectName
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询部门得分详情")
    @GetMapping("dept-score")
    fun projectDeptScoreDetail(
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
    ): List<DeptScoreVO> {
        if (userAccount.id == null)
            return emptyList()
        val records = query<ProjectDeptScore> {
            where(ProjectDeptScore::year eq year)
            and(ProjectDeptScore::deptId inList userService.getCobsByUserid(userAccount.id!!))
        }.map(::DeptScoreVO)
        return records
    }

    @Operation(summary = "查询三个大抓-部门得分")
    //@SaCheckPermission("project-dept-score::query")
    @GetMapping("{id}")
    fun getProjectDeptScore(
        @PathVariable id: String,
    ): ProjectDeptScoreVO {
        val record = queryOneById<ProjectDeptScore>(id)
            ?: throw NotFoundException("三个大抓-部门得分不存在")
        return ProjectDeptScoreVO(record)
    }

    @Operation(summary = "创建三个大抓-部门得分")
    //@SaCheckPermission("project-dept-score::create")
    @PostMapping
    fun createProjectDeptScore(
        @RequestBody dto: ProjectDeptScoreDTO,
    ) {
        dto.toProjectDeptScore().save()
    }

    @Operation(summary = "修改三个大抓-部门得分")
    //@SaCheckPermission("project-dept-score::update")
    @PutMapping("{id}")
    fun updateProjectDeptScore(
        @PathVariable id: String,
        @RequestBody dto: ProjectDeptScoreDTO,
    ) {
        val record = queryOneById<ProjectDeptScore>(id)
            ?: throw NotFoundException("三个大抓-部门得分不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除三个大抓-部门得分")
    //@SaCheckPermission("project-dept-score::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDeptScore(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDeptScore>(id)
        if (result == 0) throw NotFoundException("三个大抓-部门得分不存在")
    }

    @Operation(summary = "三个大抓-部门得分导入模板")
    //@SaCheckPermission("project-dept-score::create")
    @GetMapping("template.xlsx")
    fun getProjectDeptScoreImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDeptScoreExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("三个大抓-部门得分导入模板.xlsx")
    }

    @Operation(summary = "批量导入三个大抓-部门得分")
    //@SaCheckPermission("project-dept-score::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectDeptScore(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectDeptScoreExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectDeptScoreExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectDeptScoreExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectDeptScore().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectDeptScoreExcelRow::class)
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

    @Operation(summary = "批量导出三个大抓-部门得分")
    //@SaCheckPermission("project-dept-score::query")
    @GetMapping("export.xlsx")
    fun exportProjectDeptScore(
        @RequestParam(defaultValue = "") fields: Set<String>,
        @Schema(description = "招引部门")
        @RequestParam(defaultValue = "") dept: String,
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDeptScoreVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDeptScoreMapper>()
                val queryWrapper = QueryWrapper()
                if (dept.isNotEmpty()) {
                    queryWrapper.and(ProjectDeptScore::deptName eq dept)
                }
                if (year != null) {
                    queryWrapper.and(ProjectDeptScore::year eq year)
                }
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(ProjectDeptScoreVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("三个大抓-部门得分导出.xlsx")
    }
}
