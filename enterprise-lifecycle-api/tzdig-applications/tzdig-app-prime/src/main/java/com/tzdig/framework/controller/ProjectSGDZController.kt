package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.vo.ProjectScoreVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.mapper.prime.ProjectDigitalProjectReviewAllMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import java.time.LocalDateTime


@Tag(name = "三个大抓管理")
@RestController
@RequestMapping("department-projects")
class ProjectSGDZController {


    @Operation(summary = "计分流水")
    @GetMapping("calculate-score")
    @PageableQuery
    fun calculateScore(
        pageable: Pageable,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") projectName: String,
        @Schema(description = "部门名称")
        @RequestParam(defaultValue = "") deptName: String,
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "部门类别(1,2,3)")
        @RequestParam(defaultValue = "") deptType: String,
//        @RequestParam zsId: String,
    ): PageableResult<ProjectScoreVO> {
        val typeDept = when (deptType) {
            "1" -> filter<SystemDict> { SystemDict::catalog eq "dept_type_1" }
            "2" -> filter<SystemDict> { SystemDict::catalog eq "dept_type_2" }
            "3" -> emptyList()
            else -> null
        }?.mapNotNull { it.label }
        val projectId = if (typeDept?.isNotEmpty() == true) {
            query<ProjectDigitalInvestmentAttracting> {
                where(ProjectDigitalInvestmentAttracting::sjjgName inList typeDept)
            }.mapNotNull { it.id }
        } else if (typeDept != null) {
            query<ProjectDigitalInvestmentAttracting> {
                val type1List = filter<SystemDict> { SystemDict::catalog eq "dept_type_1" }.map { it.label }
                val type2List = filter<SystemDict> { SystemDict::catalog eq "dept_type_2" }.map { it.label }
                where(ProjectDigitalInvestmentAttracting::sjjgName notIn type1List)
                and(ProjectDigitalInvestmentAttracting::sjjgName notIn type2List)
                and(ProjectDigitalInvestmentAttracting::source eq "市级机关推荐")
            }.mapNotNull { it.id }
        } else {
            emptyList()
        }
        val page = paginate<ProjectDigitalProjectReviewAll>(pageable.pageNumber, pageable.pageSize) {
//            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
            if (projectName.isNotBlank()) {
                join(ProjectDigitalInvestmentAttracting::class.java)
                    .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
                where(ProjectDigitalInvestmentAttracting::projectName like "%$projectName%")
            }
            if (projectId.isNotEmpty()) {
                and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList projectId)
            }
            if (deptName.isNotBlank()) {
                val deptProjectList = query<ProjectDigitalInvestmentAttracting> {
                    where(ProjectDigitalInvestmentAttracting::sjjgName eq deptName)
                }.mapNotNull { it.id }
                if (deptProjectList.isNotEmpty()) {
                    and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList deptProjectList)
                } else {
                    return PageableResult.empty(pageable)
                }
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
                    // 特殊处理 2026 年：开工计分开始时间延到 2026-01-08，其他用自然年
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
            and(ProjectDigitalProjectReviewAll::score ge 0f)
            and(
                ProjectDigitalProjectReviewAll::result eq '1'
            )
            orderBy(ProjectDigitalProjectReviewAll::batch).asc()
        }.map(::ProjectScoreVO)
        page.records.forEach { vo ->
            val projectId1 = vo.projectId
            val investment = if (projectId1 != null) {
                queryOneById<ProjectDigitalInvestmentAttracting>(projectId1)
            } else {
                return@forEach
            }
            vo.step = when (vo.step) {
                ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.name -> "签约计分"
                ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW.name -> "开工计分"
                ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE.name -> "新增记分"
                else -> null
            }
            vo.park = filter<SystemArea> { SystemArea::id eq investment!!.park }.firstOrNull()?.name
            vo.type = investment?.projectType
            vo.projectName = investment?.projectName
            vo.attractDept = investment?.sjjgName
            val catalog = query<SystemDict> {
                where(
                    SystemDict::catalog inList listOf(
                        "dept_type_1",
                        "dept_type_2"
                    )
                )
                and(SystemDict::label eq investment?.sjjgName)
            }.map { it.catalog }
            vo.deptType = if (catalog.isEmpty()) {
                "三类"
            } else if (catalog.first() == "dept_type_1") {
                "一类"
            } else if (catalog.first() == "dept_type_2") {
                "二类"
            } else {
                null
            }
            vo.year = when (vo.step) {
                ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.name -> {
                    query<ProjectDigitalProjectReviewAll> {
                        where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq projectId1)
                        and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
                    }.firstNotNullOf { it.createTime }.year.toString()
                }

                else -> {
                    val createTime = vo.createTime
                    if (createTime!! >= LocalDateTime.of(2025, 1, 1, 0, 0, 0)
                        && createTime < LocalDateTime.of(2026, 1, 8, 0, 0, 0)
                    ) {
                        "2025"
                    } else {
                        createTime.year.toString()
                    }
                }
            }
        }
//        val type = when (deptType) {
//            "1" -> "一类"
//            "2" -> "二类"
//            "3" -> "三类"
//            else -> null
//        }
//        if (type != null) {
//            page.records = page.records.filter {
//                it.deptType == type
//            }
//        }

        return PageableResult.of(page)
    }

    @Operation(summary = "批量导出记分流水")
    //@SaCheckPermission("project-online-approval-info::query")
    @GetMapping("export.xlsx")
    fun exportProjectOnlineApprovalInfo(
        @RequestParam(defaultValue = "") fields: Set<String>,
        @Schema(description = "部门名称")
        @RequestParam(defaultValue = "") deptName: String,
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectScoreVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDigitalProjectReviewAllMapper>()
                val queryWrapper = QueryWrapper()
                if (deptName.isNotEmpty()) {
                    val deptProjectList = query<ProjectDigitalInvestmentAttracting> {
                        where(ProjectDigitalInvestmentAttracting::sjjgName eq deptName)
                    }
                    if (deptProjectList.isNotEmpty()) {
                        queryWrapper.and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList deptProjectList.mapNotNull { it.id })
                    }
                }
                if (year != null) {
                    val startOfYear = LocalDateTime.of(year, 1, 1, 0, 0)
                    val endOfYear = LocalDateTime.of(year + 1, 1, 7, 23, 59, 59)
                    queryWrapper.and(ProjectDigitalProjectReviewAll::createTime ge startOfYear)
                    queryWrapper.and(ProjectDigitalProjectReviewAll::createTime le endOfYear)
                }
                queryWrapper.and(
                    ProjectDigitalProjectReviewAll::step inList listOf(
                        ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                        ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE
                    )
                )
                queryWrapper.and(
                    ProjectDigitalProjectReviewAll::result eq '1'
                )
                queryWrapper.and(ProjectDigitalProjectReviewAll::score ge 0f)
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) {
                            val vo = ProjectScoreVO(record)
                            val projectId = vo.projectId
                            val investment = if (projectId != null) {
                                queryOneById<ProjectDigitalInvestmentAttracting>(projectId)
                            } else {
                                continue
                            }
                            vo.step = if (vo.step == ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.name) {
                                "签约计分"
                            } else if (vo.step == ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW.name) {
                                "开工计分"
                            } else {
                                null
                            }
                            vo.park = filter<SystemArea> { SystemArea::id eq investment!!.park }.firstOrNull()?.name
                            vo.type = investment?.projectType
                            vo.projectName = investment?.projectName
                            vo.attractDept = investment?.sjjgName
                            val catalog = query<SystemDict> {
                                where(
                                    SystemDict::catalog inList listOf(
                                        "dept_type_1",
                                        "dept_type_2"
                                    )
                                )
                                and(SystemDict::label eq investment?.sjjgName)
                            }.map { it.catalog }
                            vo.deptType = if (catalog.isEmpty()) {
                                "三类"
                            } else if (catalog.first() == "dept_type_1") {
                                "一类"
                            } else if (catalog.first() == "dept_type_2") {
                                "二类"
                            } else {
                                null
                            }
                            emitter.next(vo)
                        }
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("记分流水导出.xlsx")
    }

    @Operation(summary = "项目详情查看")
    @GetMapping("detail")
    fun projectDetail(
        @RequestParam projectId: String,
        @Schema(description = "记分事件")
        @RequestParam step: String,
    ): ProjectScoreVO {
        val reviewAll = query<ProjectDigitalProjectReviewAll> {
            val reviewStep = when (step) {
                "签约计分" -> ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.value
                "开工计分" -> ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW.value
                "新增记分" -> ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE.value
                else -> null
            }
            if (reviewStep != null) {
                and(ProjectDigitalProjectReviewAll::step eq reviewStep)
            }
            and(ProjectDigitalProjectReviewAll::score ge 0f)
            and(ProjectDigitalProjectReviewAll::digitalInvestmentId eq projectId)
            and(ProjectDigitalProjectReviewAll::result eq '1')
            orderBy(ProjectDigitalProjectReviewAll::createTime)
        }
        val investment = if (reviewAll.isNotEmpty()) {
            queryOneById<ProjectDigitalInvestmentAttracting>(projectId)
        } else {
            throw NotFoundException("项目不存在")
        }

        val vo = ProjectScoreVO(reviewAll.first())
        vo.step = when (vo.step) {
            ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.name -> "签约计分"
            ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW.name -> "开工计分"
            ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE.name -> "新增记分"
            else -> null
        }
        vo.park = filter<SystemArea> { SystemArea::id eq investment!!.park }.firstOrNull()?.name
        vo.type = investment?.projectType
        vo.projectName = investment?.projectName
        vo.attractDept = investment?.sjjgName
        val catalog = query<SystemDict> {
            where(
                SystemDict::catalog inList listOf(
                    "dept_type_1",
                    "dept_type_2"
                )
            )
            and(SystemDict::label eq investment?.sjjgName)
        }.map { it.catalog }
        vo.deptType = if (catalog.isEmpty()) {
            "三类"
        } else if (catalog.first() == "dept_type_1") {
            "一类"
        } else if (catalog.first() == "dept_type_2") {
            "二类"
        } else {
            null
        }
        vo.isKc = investment?.isKcProj
        return vo
    }
}
