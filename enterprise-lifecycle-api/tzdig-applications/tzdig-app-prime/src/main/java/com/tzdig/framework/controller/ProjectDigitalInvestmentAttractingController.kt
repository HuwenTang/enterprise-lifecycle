package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckRole
import cn.dev33.satoken.annotation.SaMode
import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.kotlin.extensions.condition.and
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.mybatisflex.kotlin.extensions.sql.div
import com.mybatisflex.kotlin.extensions.sql.times
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.AreaConstant.DISTRICT_LIST
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.dto.ProjectDigitalInvestmentAttractingDTO
import com.tzdig.framework.model.dto.ProjectDigitalInvestmentAttractingDataDashboardParam
import com.tzdig.framework.model.pojo.*
import com.tzdig.framework.model.vo.ProjectDigitalInvestmentAttractingVO
import com.tzdig.framework.model.vo.ProjectInvestmentAttractingCountVO
import com.tzdig.framework.model.vo.ProjectNotStartVO
import com.tzdig.framework.model.vo.ProjectScoreVO
import com.tzdig.framework.model.vo.fagai.KeyProjectsItem
import com.tzdig.framework.mybatis.bo.ProjectDigitalInvestmentAttractingParam
import com.tzdig.framework.mybatis.entity.prime.*
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.entity.zsxt.TProjType
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.hasAnyRole
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.CalenderService
import com.tzdig.framework.service.InvestmentAttractingService
import com.tzdig.framework.service.ProjectTimeFlowService
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.service.AreaService
import com.tzdig.framework.web.util.DictUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.apache.commons.lang3.StringUtils
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Tag(name = "数字化招商项目管理")
@RestController
@RequestMapping("project-digital-investment-attracting")
class ProjectDigitalInvestmentAttractingController(
    private val userService: UserService,
    private val calenderService: CalenderService,
    private val projectTimeFlowService: ProjectTimeFlowService,
    private val investmentAttractingService: InvestmentAttractingService,
    private val areaService: AreaService,
) {
    @Operation(summary = "查询数字化招商列表")
    //@SaCheckPermission("project-digital-investment-attracting::query")
    @GetMapping
    @PageableQuery
    fun listProjectDigitalInvestmentAttracting(
        param: ProjectDigitalInvestmentAttractingParam,
        pageable: Pageable,
    ): PageableResult<ProjectDigitalInvestmentAttractingVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val deptList = if (param.showAll && userAccount.hasAnyRole(
                // 允许查看全部项目的角色
                SystemRole.ROOT,
                SystemRole.PROJECT_CITY,
                SystemRole.PROJECT_DISTRICT,
                SystemRole.PROJECT_TOWN,
                SystemRole.QUALITY_EVALUATION,
                SystemRole.PROJECT_REVIEW_DEPT,
                SystemRole.PROJECT_REVIEW_ZB,
                SystemRole.PROJECT_REVIEW_START,
                SystemRole.PROJECT_REVIEW_COMPLETION,
            )
        ) null else {
            // 只允许查看本部门项目
            userService.getCobsByUserid(userAccount.id!!)
                .map { DictUtils.getDictLabelByCode("project_dept", it) }
        }
        if (deptList != null && deptList.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val cobList = userService.getCobsByUserid(userAccount.id!!)
        val page = paginate<ProjectDigitalInvestmentAttracting>(pageable.pageNumber, pageable.pageSize) {
            investmentAttractingService.apply(
                queryScope = this,
                param = param,
                grantedAreas = grantedAreas,
                deptList = deptList,
                cobList = cobList,
            )
        }.map(::ProjectDigitalInvestmentAttractingVO)
        if (page.records.isNotEmpty()) {
            val areas = page.records.mapNotNull { it.district } + page.records.mapNotNull { it.park }
            val areaNames = filter<SystemArea> { SystemArea::id inList areas }.associate { it.id to it.name }
            page.records.forEach { vo ->
                val projectReviewAll = filter<ProjectDigitalProjectReviewAll> {
                    ProjectDigitalProjectReviewAll::digitalInvestmentId eq vo.id
                }
//                if (param.isProjectReview == true) {
//                    val reviewZb = projectReviewAll.filter {
//                        it.step == ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB
//                    }.maxByOrNull { it.batch ?: 0 }
//                    val review = projectReviewAll.filter {
//                        it.step == ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW
//                                && it.cobId in cobList
//                    }.maxByOrNull { it.batch ?: 0 }
//                    if (userAccount.hasRole(SystemRole.PROJECT_REVIEW_DEPT)) {
//                        //亮灯逻辑
//                        if (review?.status == "已完成")
//                            vo.light = "green"
//                        else if (review?.status == "未完成")
//                            if (calenderService.getWorkdaysBetween(review.createTime!!.toLocalDate()) >= 4)
//                                vo.light = "red"
//                            else if (calenderService.getWorkdaysBetween(review.createTime!!.toLocalDate()) >= 3)
//                                vo.light = "yellow"
//                    } else if (userAccount.hasRole(SystemRole.PROJECT_REVIEW_ZB)) {
//                        //亮灯逻辑
//                        if (reviewZb?.status == "已完成")
//                            vo.light = "green"
//                        else if (reviewZb?.status == "未完成")
//                            if (calenderService.getWorkdaysBetween(reviewZb.createTime!!.toLocalDate()) >= 4)
//                                vo.light = "red"
//                            else if (calenderService.getWorkdaysBetween(reviewZb.createTime!!.toLocalDate()) >= 3)
//                                vo.light = "yellow"
//                    } else {
//                        val reviewDept = projectReviewAll.filter {
//                            it.step == ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW
//                                    && it.status == "未完成"
//                        }.maxByOrNull { it.batch ?: 0 }
//                        if (vo.isProjectReviewComplete == true) {
//                            vo.light = "green"
//                        } else if (reviewDept != null) {
//                            if (calenderService.getWorkdaysBetween(reviewDept.createTime!!.toLocalDate()) >= 4)
//                                vo.light = "red"
//                            else if (calenderService.getWorkdaysBetween(reviewDept.createTime!!.toLocalDate()) >= 3)
//                                vo.light = "yellow"
//                        } else {
//                            val reviewZb = projectReviewAll.filter {
//                                it.step == ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB
//                                        && it.status == "未完成"
//                            }.maxByOrNull { it.batch ?: 0 }
//                            if (reviewZb != null) {
//                                if (calenderService.getWorkdaysBetween(reviewZb.createTime!!.toLocalDate()) >= 4)
//                                    vo.light = "red"
//                                else if (calenderService.getWorkdaysBetween(reviewZb.createTime!!.toLocalDate()) >= 3)
//                                    vo.light = "yellow"
//                            }
//                        }
//                    }
//                } else
                if (param.isQualityEvaluation == true) {
                    if (userAccount.hasRole(SystemRole.QUALITY_EVALUATION)) {
                        val review = projectReviewAll.filter {
                            it.step == ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION
                                    && it.cobId in cobList
                        }.maxByOrNull { it.batch ?: 0 }
                        //亮灯逻辑、项目质量评价结果逻辑
                        if (review?.status == "已完成" || review?.status == "超时自动完成") {
                            vo.light = "green"
                            vo.auditStatus = "已评估"
                        } else {
                            vo.auditStatus = "未评估"
                            if (calenderService.getWorkdaysBetween(review?.createTime!!.toLocalDate()) >= 2)
                                vo.light = "red"
                        }
                    } else {
                        if (vo.isQualityEvaluationComplete == true) {
                            vo.auditStatus = "已全部评估"
                            vo.light = "green"
                        } else {
                            vo.auditStatus = "评估未完成"
                            val review = projectReviewAll.filter {
                                it.step == ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION
                            }.maxByOrNull { it.batch ?: 0 }
                            if (calenderService.getWorkdaysBetween(review?.createTime!!.toLocalDate()) >= 2)
                                vo.light = "red"
                        }
                    }
                } else if (param.isCompletionApproval == true) {
                    val review = projectReviewAll.filter {
                        it.step == ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW
                    }
                    vo.auditStatus = when {
                        review.isEmpty() -> "审核未完成"
                        review.any { it.status == "已完成" && it.result == "1" } -> "审核通过"
                        review.any { it.status == "已完成" && it.result == "0" } -> "审核未通过"
                        else -> "审核未完成"
                    }
                }
                val last = projectTimeFlowService.getTimeFlow(vo.id!!).lastOrNull { it.time != null && it.isPrimary }
                val projectDynamicsTime = last?.time?.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) ?: ""
                val projectDynamicsTitle = last?.title ?: ""
                val score = projectReviewAll.filter {
                    it.digitalInvestmentId == vo.id
                }.mapNotNull { it.score }.sum()
                val start = query<ProjectDigitalProjectReviewAll> {
                    where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq vo.id)
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
                    orderBy(ProjectDigitalProjectReviewAll::createTime)
                }
                val signing = query<ProjectDigitalProjectReviewAll> {
                    where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq vo.id)
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
                    orderBy(ProjectDigitalProjectReviewAll::createTime)
                }
                val completion = query<ProjectDigitalProjectReviewAll> {
                    where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq vo.id)
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
                    orderBy(ProjectDigitalProjectReviewAll::createTime)
                }
                vo.projectDynamics = "$projectDynamicsTime $projectDynamicsTitle"
                vo.districtName = areaNames[vo.district] ?: vo.district
                vo.parkName = areaNames[vo.park] ?: vo.park
                vo.projectScore = score
                vo.startApplyTime = if (start.isNotEmpty()) start.first().createTime?.toLocalDate() else null
                vo.signingApplyTime = if (signing.isNotEmpty()) signing.first().createTime?.toLocalDate() else null
                vo.completionApplyTime =
                    if (completion.isNotEmpty()) completion.first().createTime?.toLocalDate() else null
                if (queryCount<ProjectKeyProject> {
                        where(ProjectKeyProject::digitalInvestmentId eq vo.projectCode)
                    } != 0L) {
                    vo.isFilled = true
                }
                if (vo.isKcProj == "是") {
                    vo.projectAttributeList.add("科创")
                }
                if (vo.projectCode != null) {
                    val projectKeyProject = query<ProjectKeyProject> {
                        where(ProjectKeyProject::digitalInvestmentId eq vo.projectCode)
                        and(ProjectKeyProject::status eq 2)
                    }
                    if (projectKeyProject.isNotEmpty()) {
                        vo.projectAttributeList.add("市重点")
                    }
                }
                if (vo.source == "增资扩产") {
                    vo.projectAttributeList.add("增")
                }
            }
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询记分事件")
    @GetMapping("project-dynamics")
    fun getProjectDynamics(
        @RequestParam(defaultValue = "") projectId: String,
    ): List<ProjectScoreVO> {
        val projectDynamics = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq projectId)
            and(
                ProjectDigitalProjectReviewAll::step inList listOf(
                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                )
            )
            and(ProjectDigitalProjectReviewAll::score ge 0f)
        }.map(::ProjectScoreVO)
        projectDynamics.forEach { vo ->
            vo.step = when (vo.step) {
                ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.name -> {
                    "签约计分"
                }

                ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW.name -> {
                    "开工计分"
                }

                ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE.name -> {
                    "新增记分"
                }

                else -> {
                    null
                }
            }
            vo.year = when (vo.step) {
                ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB.name -> {
                    query<ProjectDigitalProjectReviewAll> {
                        where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq projectId)
                        and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
                    }.firstNotNullOf { it.createTime }.year.toString()
                }

                else -> {
                    val createTime = vo.createTime!!
                    if (createTime >= LocalDateTime.of(2025, 1, 1, 0, 0, 0)
                        && createTime < LocalDateTime.of(2026, 1, 8, 0, 0, 0)
                    ) {
                        "2025"
                    } else {
                        createTime.year.toString()
                    }
                }
            }
        }
        return projectDynamics
    }

    @Operation(summary = "查询待评估数目")
    @GetMapping("quality-evaluation-count")
    fun countQualityEvaluation(
    ): Long {
        val cobList = userService.getCobsByUserid(userAccount.id!!)
        return if (cobList.isEmpty()) {
            0L
        } else {
            queryCount<ProjectDigitalProjectReviewAll> {
                rightJoin(ProjectDigitalInvestmentAttracting::class.java)
                    .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
                where(ProjectDigitalInvestmentAttracting::isQualityEvaluation eq "1")
                and(ProjectDigitalProjectReviewAll::cobId inList cobList)
                and(ProjectDigitalProjectReviewAll::status notIn listOf("已完成", "超时完成", "超时自动完成"))
                and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
            }
        }
    }

    @Operation(summary = "查询核定数目")
    @GetMapping("project-review-count")
    fun countProjectReview(
    ): Long {
        val cobList = userService.getCobsByUserid(userAccount.id!!)
        return if (cobList.isEmpty()) {
            0L
        } else {
            queryCount<ProjectDigitalProjectReviewAll> {
                rightJoin(ProjectDigitalInvestmentAttracting::class.java)
                    .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
                where(ProjectDigitalInvestmentAttracting::isProjectReview eq "1")
                and(ProjectDigitalProjectReviewAll::status notIn listOf("已完成", "超时完成"))
                if (userAccount.hasRole(SystemRole.PROJECT_REVIEW_ZB)) {
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB)
                } else {
                    and(ProjectDigitalProjectReviewAll::cobId inList cobList)
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
                }
            }
        }
    }

    @Operation(summary = "查询开工数目")
    @GetMapping("project-start-count")
    fun countProjectStart(
    ): Long {
        val cobList = userService.getCobsByUserid(userAccount.id!!)
        return if (cobList.isEmpty()) {
            0L
        } else {
            queryCount<ProjectDigitalProjectReviewAll> {
                rightJoin(ProjectDigitalInvestmentAttracting::class.java)
                    .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
                where(ProjectDigitalInvestmentAttracting::isStartApproval eq "1")
                and(ProjectDigitalProjectReviewAll::status eq "未完成")
                and(ProjectDigitalProjectReviewAll::cobId inList cobList)
                and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
                if (userAccount.hasRole(SystemRole.FAGAI_INDUSTRY_FLOW)) {
                    and(ProjectDigitalInvestmentAttracting::projectType eq "工业")
                }
                if (userAccount.hasRole(SystemRole.FAGAI_SERVICE_FLOW)) {
                    and(ProjectDigitalInvestmentAttracting::projectType eq "服务业")
                }
            }
        }
    }

    @Operation(summary = "查询竣工数目")
    @GetMapping("project-completion-count")
    fun countProjectCompletion(
    ): Long {
        val cobList = userService.getCobsByUserid(userAccount.id!!)
        return if (cobList.isEmpty()) {
            0L
        } else {
            queryCount<ProjectDigitalProjectReviewAll> {
                rightJoin(ProjectDigitalInvestmentAttracting::class.java)
                    .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
                where(ProjectDigitalInvestmentAttracting::isCompletionApproval eq "1")
                and(ProjectDigitalProjectReviewAll::cobId inList cobList)
                and(ProjectDigitalProjectReviewAll::status eq "未完成")
                and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
                if (userAccount.hasRole(SystemRole.FAGAI_INDUSTRY_FLOW)) {
                    and(ProjectDigitalInvestmentAttracting::projectType eq "工业")
                }
                if (userAccount.hasRole(SystemRole.FAGAI_SERVICE_FLOW)) {
                    and(ProjectDigitalInvestmentAttracting::projectType eq "服务业")
                }
            }
        }
    }

    @Operation(summary = "查询数字化招商")
//@SaCheckPermission("project-digital-investment-attracting::query")
    @GetMapping("{id}")
    fun getProjectDigitalInvestmentAttracting(
        @PathVariable id: String,
    ): ProjectDigitalInvestmentAttractingVO {
        val record = queryOneById<ProjectDigitalInvestmentAttracting>(id)
            ?: throw NotFoundException("数字化招商不存在")
        val district = record.district?.let { areaService.getById(it) }
        val park = record.park?.let { areaService.getById(it) }
        val onlineApprovalIds =
            filter<ProjectInvestmentXOnlineApproval> { ProjectInvestmentXOnlineApproval::investmentId eq id }
                .map { it.onlineApprovalId!! }
        val constructionApprovalIds =
            filter<ProjectInvestmentXConstructionApproval> { ProjectInvestmentXConstructionApproval::investmentId eq id }
                .map { it.constructionApprovalId!! }
        val result = ProjectDigitalInvestmentAttractingVO(
            record = record,
            districtName = district?.name ?: record.district,
            parkName = park?.name ?: record.park
        )
        result.onlineApprovalIds = onlineApprovalIds
        result.constructionApprovalIds = constructionApprovalIds
        return result
    }

    @Operation(summary = "查询项目时间流")
    @GetMapping("{id}/project-time-flow")
    fun getProjectTimeFlow(@PathVariable id: String) = projectTimeFlowService.getTimeFlow(id)

    @Operation(summary = "按进度统计数字化招商数量")
    @GetMapping("count-by-progress")
    fun countByProgress(
    ): List<ProjectInvestmentAttractingCountVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return emptyList()
        }
        return query<ProjectInvestmentAttractingCountVO> {
            and {
                it.or(ProjectDigitalInvestmentAttracting::district inList grantedAreas)
                it.or(ProjectDigitalInvestmentAttracting::park inList grantedAreas)
            }
            and(ProjectDigitalInvestmentAttracting::currentProjectProgress.isNotNull)
            and(ProjectDigitalInvestmentAttracting::deleted eq false)
            select(ProjectDigitalInvestmentAttracting::currentProjectProgress.`as`(ProjectInvestmentAttractingCountVO::currentProjectProgress.name))
            select(QueryMethods.count().`as`(ProjectInvestmentAttractingCountVO::count.name))
            select(
                QueryMethods.sum(
                    QueryMethods.case_()
                        .`when`(ProjectDigitalInvestmentAttracting::investmentFlag eq "1")
                        .then(ProjectDigitalInvestmentAttracting::investmentAmount.column)
                        .`when`(ProjectDigitalInvestmentAttracting::investmentFlag eq "2")
                        .then(ProjectDigitalInvestmentAttracting::investmentAmount.column * 7 / 10000)
                        .end()
                ).`as`(ProjectInvestmentAttractingCountVO::projectAmount.name)
            )
            groupBy(ProjectDigitalInvestmentAttracting::currentProjectProgress)
        }
    }

    @Operation(summary = " ")
    @GetMapping("project-not-start")
    fun projectNotStart(
        @Schema(description = "金额")
        @RequestParam(required = false) rmb: Int?,
        @Schema(description = "人民币下限（亿元人民币）")
        @RequestParam(required = false) rmb1: Double?,
        @Schema(description = "人民币上限（亿元人民币）")
        @RequestParam(required = false) rmb2: Double?,
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "服务业/工业")
        @RequestParam(required = false) industry: String?,
        @Schema(description = "是否科创")
        @RequestParam(required = false) isKcProj: Boolean?,
    ): ProjectNotStartVO {
        var min: Double? = null
        var max: Double? = null
        if (rmb != null) {
            when (rmb) {
                1 -> {
                    max = 1.0
                    min = 0.0
                }

                5 -> {
                    max = 5.0
                    min = 1.0
                }

                10 -> {
                    max = 10.0
                    min = 5.0
                }
            }
        } else if (rmb1 != null && rmb2 != null) {
            max = rmb2
            min = rmb1
        }
//        val inTalk = investmentAttractingService.notStartProjects(
//            start,
//            end,
//            min,
//            max,
//            industry,
//            isKcProj,
//            "1"
//        ).associateBy { it.district to it.park }
        val sign = investmentAttractingService.notStartProjects(
            start,
            end,
            min,
            max,
            industry,
            isKcProj,
            "2"
        ).associateBy { it.district to it.park }
        val register = investmentAttractingService.notStartProjects(
            start,
            end,
            min,
            max,
            industry,
            isKcProj,
            "3"
        ).associateBy { it.district to it.park }
        val record = investmentAttractingService.notStartProjects(
            start,
            end,
            min,
            max,
            industry,
            isKcProj,
            "4"
        ).associateBy { it.district to it.park }
        val approval = investmentAttractingService.notStartProjects(
            start,
            end,
            min,
            max,
            industry,
            isKcProj,
            "5"
        ).associateBy { it.district to it.park }
        val data =
            sign.keys
//                .union(inTalk.keys)
                .union(register.keys)
                .union(record.keys)
                .union(approval.keys)
                .map { key ->
                    val (district, park) = key
//                val inTalk = inTalk[key]
                    val sign = sign[key]
                    val register = register[key]
                    val record = record[key]
                    val approval = approval[key]
                    ProjectNotStartVO(
                        district, park,
//                    inTalk ?: KeyProjectsItem(district, park),
                        sign ?: KeyProjectsItem(district, park),
                        register ?: KeyProjectsItem(district, park),
                        record ?: KeyProjectsItem(district, park),
                        approval ?: KeyProjectsItem(district, park),
                    )
                }
                .groupBy { it.district }
        val list = DISTRICT_LIST.map { (district, _) ->
            val list = data[district] ?: emptyList()
            makeTree(district, list)
        }
        return makeTree(AreaConstant.TAIZHOU_NAME, list)
    }

    private fun makeTree(
        district: String,
        list: List<ProjectNotStartVO>,
    ) = ProjectNotStartVO(
        district, "",
//        KeyProjectsItem(list.map { it.inTalk }),
        KeyProjectsItem(list.map { it.sign }),
        KeyProjectsItem(list.map { it.register }),
        KeyProjectsItem(list.map { it.record }),
        KeyProjectsItem(list.map { it.approval }),
        list.takeIf { it.size > 1 } ?: emptyList(),
    )

    @Operation(summary = "数据看板-数字化招商列表")
    //@SaCheckPermission("project-digital-investment-attracting::query")
    @GetMapping("data-dashboard")
    @PageableQuery
    fun dataDashboardListProjectDigitalInvestmentAttracting(
        param: ProjectDigitalInvestmentAttractingDataDashboardParam,
        pageable: Pageable,
    ): PageableResult<ProjectDigitalInvestmentAttractingVO> {
        val page = paginate<ProjectDigitalInvestmentAttracting>(pageable.pageNumber, pageable.pageSize) {
            where(ProjectDigitalInvestmentAttracting::currentProjectProgress.isNotNull)
            if (param.currentProjectProgress.isNotEmpty()) {
                and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq param.currentProjectProgress)
            } else {
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }
            if (param.rProgress.isNotEmpty()) {
                and(ProjectDigitalInvestmentAttracting::rProgress inList param.rProgress)
            }
            if (!param.currStartDate.isNullOrEmpty() && !param.currEndDate.isNullOrEmpty()) {
                val startTime = LocalDate.parse(param.currStartDate)
                val endTime = LocalDate.parse(param.currEndDate)
                and(ProjectDigitalInvestmentAttracting::signingTime between startTime..endTime)
            }
            if (StringUtils.isNotEmpty(param.district)) {
                and(ProjectDigitalInvestmentAttracting::district eq param.district)
            }
            if (StringUtils.isNotEmpty(param.park)) {
                and(ProjectDigitalInvestmentAttracting::park eq param.park)
            }
            if (StringUtils.isNotEmpty(param.projectRating)) {
                and(ProjectDigitalInvestmentAttracting::projectRating eq param.projectRating)
            }
            if (StringUtils.isNotEmpty(param.projectCategory)) {
                and(ProjectDigitalInvestmentAttracting::projectCategory eq param.projectCategory)
            }
            if (param.isIndustryChainProject == true) {
                val pTypeList = query<TProjType> {
                    and(TProjType::level eq 3)
                }.mapNotNull { it.name }
                and(ProjectDigitalInvestmentAttracting::projectCategory inList pTypeList)
            }
            if (StringUtils.isNotEmpty(param.projectType)) {
                and(ProjectDigitalInvestmentAttracting::projectType eq param.projectType)
            }
            if (StringUtils.isNotEmpty(param.isKcProj)) {
                and(ProjectDigitalInvestmentAttracting::isKcProj eq param.isKcProj)
            }
            if (param.isCityKey != null) {
                val list = when (param.isCityKey) {
                    "市重点" -> {
                        val cityKeyIds = query<ProjectKeyProject> {
                            where(ProjectKeyProject::ifCityKey eq true)
                        }.mapNotNull { it.digitalInvestmentId }
                        // 如果有市重点项目，用它们的ID；如果没有，传入一个不存在的ID，确保IN条件不匹配
                        cityKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_CITY") }
                    }

                    "省重大" -> {
                        val provinceKeyIds = query<ProjectKeyProject> {
                            where(ProjectKeyProject::ifProvinceKey eq true)
                        }.mapNotNull { it.digitalInvestmentId }
                        // 同理，省重大项目不存在时，用不存在的ID
                        provinceKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_PROVINCE") }
                    }

                    else -> emptyList()
                }
                and(ProjectDigitalInvestmentAttracting::projectCode inList list)
            }
            // 非自定义查询
            //1亿 1000万美元
            //5亿 3000万美元
            //10亿 10000万美元
            val investmentAmount = param.investmentAmount
            if (investmentAmount != null) {
                if (investmentAmount == 1.0) {
                    and { wrapper ->
                        wrapper.or(

                            ProjectDigitalInvestmentAttracting::investmentAmount ge investmentAmount
                                    and (ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                        )
                        wrapper.or {
                            it.ge(ProjectDigitalInvestmentAttracting::investmentAmount, 1000)
                            it.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                        }
                    }
                }
                if (investmentAmount == 5.0) {
                    and { wrapper ->
                        wrapper.or(

                            ProjectDigitalInvestmentAttracting::investmentAmount ge investmentAmount
                                    and (ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                        )
                        wrapper.or {
                            it.ge(ProjectDigitalInvestmentAttracting::investmentAmount, 3000)
                            it.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                        }
                    }
                }
                if (investmentAmount == 10.0) {
                    and { wrapper ->
                        wrapper.or(

                            ProjectDigitalInvestmentAttracting::investmentAmount ge investmentAmount
                                    and (ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                        )
                        wrapper.or {
                            it.ge(ProjectDigitalInvestmentAttracting::investmentAmount, 10000)
                            it.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                        }
                    }
                }
            }

            //自定义查询
            val rmb1 = param.rmb1
            val rmb2 = param.rmb2
            if (rmb1 != null && rmb2 != null) {
                and { wrapper ->
                    wrapper.or(
                        (ProjectDigitalInvestmentAttracting::investmentAmount ge rmb1)
                                and (ProjectDigitalInvestmentAttracting::investmentAmount le rmb2)
                                and (ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                    )
                    wrapper.or {
                        it.ge(ProjectDigitalInvestmentAttracting::investmentAmount, param.dollar1)
                        it.le(ProjectDigitalInvestmentAttracting::investmentAmount, param.dollar2)
                        it.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                    }
                }
            }

        }.map(::ProjectDigitalInvestmentAttractingVO)
        if (page.records.isNotEmpty()) {
            val areas = page.records.mapNotNull { it.district } + page.records.mapNotNull { it.park }
            val areaNames = filter<SystemArea> { SystemArea::id inList areas }.associate { it.id to it.name }
            page.records.forEach { vo ->
                filter<ProjectDigitalProjectReviewAll> {
                    ProjectDigitalProjectReviewAll::digitalInvestmentId eq vo.id
                }
                val last = projectTimeFlowService.getTimeFlow(vo.id!!).lastOrNull { it.time != null && it.isPrimary }
                val projectDynamicsTime = last?.time?.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) ?: ""
                val projectDynamicsTitle = last?.title ?: ""
                vo.projectDynamics = "$projectDynamicsTime $projectDynamicsTitle"
                vo.districtName = areaNames[vo.district] ?: vo.district
                vo.parkName = areaNames[vo.park] ?: vo.park
            }
        }
        return PageableResult.of(page)
    }


    @Operation(summary = "导出市级机关推荐项目")
    @SaCheckRole(SystemRole.ROOT, SystemRole.PROJECT_EXPORT, mode = SaMode.OR)
    @GetMapping("export.xlsx")
    fun exportProject(
        param: ProjectDigitalInvestmentAttractingParam,
    ): FileDownloadVO {
        val records = projectDigitalInvestmentAttractingResult(param).map(::ProjectQYPOJO)
        val file = ExcelWriteUtils(ProjectQYPOJO::class)
            .writeWith(createNewTempFile("xlsx")) {
                Flux.fromIterable(records)
            }
        return file.downloadVO("市级机关推荐项目.xlsx")
    }

    @Operation(summary = "导出项目管理")
//    @SaCheckRole(SystemRole.ROOT, SystemRole.PROJECT_EXPORT, mode = SaMode.OR)
    @GetMapping("exportProjectInfo.xlsx")
    fun exportProjectInfo(
        param: ProjectDigitalInvestmentAttractingParam,
    ): FileDownloadVO {
        val records = projectDigitalInvestmentAttractingResult(param).map(::ProjectPOJO)
        records.forEach { it ->
            it.onlineApprovalCode = query<ProjectInvestmentXOnlineApproval> {
                and(ProjectInvestmentXOnlineApproval::investmentId eq it.id)
            }.mapNotNull { it.onlineApprovalId }.toString()
        }
        val file = ExcelWriteUtils(ProjectPOJO::class)
            .writeWith(createNewTempFile("xlsx")) {
                Flux.fromIterable(records)
            }
        return file.downloadVO("项目管理项目.xlsx")
    }


    @Operation(summary = "导出质态评估项目")
    @SaCheckRole(SystemRole.ROOT, SystemRole.PROJECT_EXPORT, mode = SaMode.OR)
    @GetMapping("exportPG.xlsx")
    fun exportPGProject(
        param: ProjectDigitalInvestmentAttractingParam,
    ): FileDownloadVO {
        val records = projectDigitalInvestmentAttractingResult(param).map(::ProjectZTPGPOJO)
        val file = ExcelWriteUtils(ProjectZTPGPOJO::class)
            .writeWith(createNewTempFile("xlsx")) {
                Flux.fromIterable(records)
            }
        return file.downloadVO("质态评估项目.xlsx")
    }

    @Operation(summary = "导出开工认定项目")
//    @SaCheckRole(SystemRole.ROOT, SystemRole.PROJECT_EXPORT, mode = SaMode.OR)
    @GetMapping("exportKG.xlsx")
    fun exportProjectKG(
        param: ProjectDigitalInvestmentAttractingParam,
    ): FileDownloadVO {
        val records = projectDigitalInvestmentAttractingResult(param).map(::ProjectKGPOJO)
        val file = ExcelWriteUtils(ProjectKGPOJO::class)
            .writeWith(createNewTempFile("xlsx")) {
                Flux.fromIterable(records)
            }
        return file.downloadVO("开工认定项目.xlsx")
    }

    @Operation(summary = "导出竣工认定项目")
//    @SaCheckRole(SystemRole.ROOT, SystemRole.PROJECT_EXPORT, mode = SaMode.OR)
    @GetMapping("exportJG.xlsx")
    fun exportProjectJG(
        param: ProjectDigitalInvestmentAttractingParam,
    ): FileDownloadVO {
        val records = projectDigitalInvestmentAttractingResult(param).map(::ProjectJGPOJO)
        val file = ExcelWriteUtils(ProjectJGPOJO::class)
            .writeWith(createNewTempFile("xlsx")) {
                Flux.fromIterable(records)
            }
        return file.downloadVO("竣工认定项目.xlsx")
    }

    @Operation(summary = "导出三个大抓项目")
//    @SaCheckRole(SystemRole.ROOT, SystemRole.PROJECT_EXPORT, mode = SaMode.OR)
    @GetMapping("exportSGDZ.xlsx")
    fun exportProjectSGDZ(
        param: ProjectDigitalInvestmentAttractingParam,
    ): FileDownloadVO {
        val records = projectDigitalInvestmentAttractingResult(param).map(::ProjectSGDZ)
        records.forEach { it ->
            val score = query<ProjectDigitalProjectReviewAll> {
                where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq it.id)
            }.mapNotNull { it.score }.sum()
            it.projectScore = score
        }
        val file = ExcelWriteUtils(ProjectSGDZ::class)
            .writeWith(createNewTempFile("xlsx")) {
                Flux.fromIterable(records)
            }
        return file.downloadVO("三个大抓项目.xlsx")
    }

    @Operation(summary = "查询数字化招商列表1")
    //@SaCheckPermission("project-digital-investment-attracting::query")
    @GetMapping("proj")
    fun listProjectDigitalInvestmentAttracting(
        @RequestParam projectName: String,
    ): List<ProjectDigitalInvestmentAttractingVO> {
        val list = filter<ProjectDigitalInvestmentAttracting> {
            ProjectDigitalInvestmentAttracting::projectName like projectName
        }.map(::ProjectDigitalInvestmentAttractingVO)
        val areas = list.mapNotNull { it.district } + list.mapNotNull { it.park }
        list.forEach { vo ->
            val areaNames = filter<SystemArea> { SystemArea::id inList areas }.associate { it.id to it.name }
            vo.districtName = areaNames[vo.district] ?: vo.district
            vo.parkName = areaNames[vo.park] ?: vo.park
        }
        return list
    }

    @Operation(summary = "编辑列统")
    //@SaCheckPermission("project-digital-investment-attracting::update")
    @PutMapping("{id}")
    fun updateProjectDigitalInvestmentAttracting(
        @PathVariable id: String,
        @RequestBody dto: ProjectDigitalInvestmentAttractingDTO,
    ) {
        val record = queryOneById<ProjectDigitalInvestmentAttracting>(id)
            ?: throw NotFoundException("数字化招商不存在")
        dto.into(record).updateById()
    }

    fun projectDigitalInvestmentAttractingResult(param: ProjectDigitalInvestmentAttractingParam): List<ProjectDigitalInvestmentAttracting> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return emptyList()
        }
        val deptList = if (param.showAll && userAccount.hasAnyRole(
                // 允许查看全部项目的角色
                SystemRole.ROOT,
                SystemRole.PROJECT_CITY,
                SystemRole.PROJECT_DISTRICT,
                SystemRole.PROJECT_TOWN,
                SystemRole.QUALITY_EVALUATION,
                SystemRole.PROJECT_REVIEW_DEPT,
                SystemRole.PROJECT_REVIEW_ZB,
                SystemRole.PROJECT_REVIEW_START,
                SystemRole.PROJECT_REVIEW_COMPLETION,
            )
        ) null else {
            // 只允许查看本部门项目
            userService.getCobsByUserid(userAccount.id!!)
                .map { DictUtils.getDictLabelByCode("project_dept", it) }
        }
        if (deptList != null && deptList.isEmpty()) {
            return emptyList()
        }
        val cobList = userService.getCobsByUserid(userAccount.id!!)
        return query<ProjectDigitalInvestmentAttracting> {
            investmentAttractingService.apply(
                queryScope = this,
                param = param,
                grantedAreas = grantedAreas,
                deptList = deptList,
                cobList = cobList,
            )
        }
    }
}
