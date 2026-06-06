package com.tzdig.framework.service.impl

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.core.query.RawQueryOrderBy
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.mybatisflex.kotlin.extensions.sql.div
import com.mybatisflex.kotlin.extensions.sql.times
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.model.vo.fagai.KeyProjectsItem
import com.tzdig.framework.mybatis.bo.ProjectDigitalInvestmentAttractingParam
import com.tzdig.framework.mybatis.entity.prime.*
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.InvestmentAttractingService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class InvestmentAttractingServiceImpl(private val userService: UserService) : InvestmentAttractingService {
    override fun apply(
        queryScope: QueryScope,
        param: ProjectDigitalInvestmentAttractingParam,
        grantedAreas: Set<String>,
        deptList: List<String>?,
        cobList: Set<String>,
    ) {
        queryScope.select(ProjectDigitalInvestmentAttracting::class.allColumns)
        queryScope.and {
            it.or(ProjectDigitalInvestmentAttracting::district inList grantedAreas)
            it.or(ProjectDigitalInvestmentAttracting::park inList grantedAreas)
        }
        if (deptList != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::source eq "市级机关推荐")
            queryScope.and(ProjectDigitalInvestmentAttracting::sjjgName inList deptList)
        }
        val year = param.year
        if (year != null) {
            val startTime = LocalDate.of(year, 1, 1)
            val endTime = LocalDate.of(year, 12, 31)
            if (param.currentProjectProgress.size == 1 && "1" in param.currentProjectProgress || param.signedProject == false) {
                val timeRange = startTime.atTime(0, 0, 0)..endTime.atTime(23, 59, 59)
                queryScope.and(ProjectDigitalInvestmentAttracting::entryTime between timeRange)
            } else {
                queryScope.and(ProjectDigitalInvestmentAttracting::signingTime between startTime..endTime)
                queryScope.and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }
        }
        if (param.currentMonth) {
            val now = LocalDate.now()
            val startTime = LocalDate.of(now.year, now.month, 1)
            val endTime = startTime.plusMonths(1).minusDays(1)
            if (param.signedProject == false) {
                val timeRange = startTime.atTime(0, 0, 0)..endTime.atTime(23, 59, 59)
                queryScope.and(ProjectDigitalInvestmentAttracting::entryTime between timeRange)
            } else {
                queryScope.and(ProjectDigitalInvestmentAttracting::signingTime between startTime..endTime)
            }
        }
        if (!param.projectCode.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::projectCode eq param.projectCode)
        }
        if (!param.projectName.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::projectName like param.projectName)
        }
        if (param.currentProjectProgress.isNotEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::currentProjectProgress inList param.currentProjectProgress.mapNotNull { value -> ProjectProgress.entries.find { it.value == value } })
        }
        if (param.signedProject == true) {
            queryScope.and(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.NEGOTIATION)
        } else if (param.signedProject == false) {
            queryScope.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.NEGOTIATION)
        }
        if (!param.projectContent.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::projectContent like param.projectContent)
        }
        if (!param.projectCategory.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::projectCategory eq param.projectCategory)
        }
        if (!param.investmentFlag.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::investmentFlag eq param.investmentFlag)
        }
        if (!param.investor.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::investor like param.investor)
        }
        if (!param.projectSource.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::source eq param.projectSource)
        }
        if (param.investmentAmount1 != null) {
            queryScope.and { it ->
                it.or {
                    it.and(ProjectDigitalInvestmentAttracting::investmentAmount ge param.investmentAmount1!!)
                    it.and(ProjectDigitalInvestmentAttracting::investmentFlag eq 1)
                }
                it.or {
                    it.and(ProjectDigitalInvestmentAttracting::investmentFlag eq 2)
                    if (param.investmentAmount1 == 0.05) {
                        it.and(ProjectDigitalInvestmentAttracting::investmentAmount ge 500.0)
                    } else if (param.investmentAmount1 == 1.0) {
                        it.and(ProjectDigitalInvestmentAttracting::investmentAmount ge 1000.0)
                    } else if (param.investmentAmount1 == 5.0) {
                        it.and(ProjectDigitalInvestmentAttracting::investmentAmount ge 3000.0)
                    } else if (param.investmentAmount1 == 10.0) {
                        it.and(ProjectDigitalInvestmentAttracting::investmentAmount ge 10000.0)
                    }
                    it.and(ProjectDigitalInvestmentAttracting::investmentAmount ge param.investmentAmount1!!)
                }
            }
        }
        if (param.investmentAmount2 != null) {
            queryScope.and { it ->
                it.or {
                    it.and(ProjectDigitalInvestmentAttracting::investmentAmount lt param.investmentAmount2!!)
                    it.and(ProjectDigitalInvestmentAttracting::investmentFlag eq 1)
                }
                it.or {
                    it.and(ProjectDigitalInvestmentAttracting::investmentFlag eq 2)
                    if (param.investmentAmount2 == 1.0) {
                        it.and(ProjectDigitalInvestmentAttracting::investmentAmount lt 1000.0)
                    }
                }
            }
        }
        if (!param.attractorUnit.isNullOrEmpty())
            queryScope.and(ProjectDigitalInvestmentAttracting::sjjgName like param.attractorUnit)
        if (param.isQualityEvaluation == true) {

            queryScope.join(ProjectDigitalProjectReviewAll::class.java)
                .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
            queryScope.and(ProjectDigitalInvestmentAttracting::isQualityEvaluation eq "1")
            queryScope.and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
            if (param.qualityEvaluationCompleted == true)
                queryScope.and(ProjectDigitalProjectReviewAll::status inList listOf("已完成", "超时完成"))
            else if (param.qualityEvaluationCompleted == false)
                queryScope.and(ProjectDigitalProjectReviewAll::status notIn listOf("已完成", "超时完成"))
            queryScope.groupBy(ProjectDigitalInvestmentAttracting::id)
            queryScope.orderBy(RawQueryOrderBy("MAX(project_digital_project_review_all.create_time) DESC", false))
            queryScope.orderBy(ProjectDigitalInvestmentAttracting::isQualityEvaluationComplete)
        }
        if (param.isProjectReview == true) {
//            queryScope.orderBy(
//                RawQueryOrderBy(
//                    "project_digital_investment_attracting.id != '79564141403010140'",
//                    false
//                )
//            )
//            queryScope.orderBy(
//                RawQueryOrderBy(
//                    "project_digital_investment_attracting.id != '79564141410010104'",
//                    false
//                )
//            )
            queryScope.join(ProjectDigitalProjectReviewAll::class.java)
                .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
            queryScope.and(ProjectDigitalInvestmentAttracting::isProjectReview eq "1")
            queryScope.and {
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne 2)
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress eq 2)
                    .and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
            }
            queryScope.and(ProjectDigitalInvestmentAttracting::source eq "市级机关推荐")
            queryScope.and(
                ProjectDigitalProjectReviewAll::step inList listOf(
                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB,
                )
            )
            if (param.applyTime1 != null && param.applyTime2 != null) {
                queryScope.and(
                    ProjectDigitalProjectReviewAll::createTime ge LocalDateTime.of(
                        param.applyTime1,
                        LocalTime.MIN
                    )
                )
                queryScope.and(
                    ProjectDigitalProjectReviewAll::createTime le LocalDateTime.of(
                        param.applyTime2,
                        LocalTime.MAX
                    )
                )
                queryScope.and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
            }
            if (userAccount.hasRole(SystemRole.PROJECT_REVIEW_DEPT))
                queryScope.and(ProjectDigitalProjectReviewAll::cobId inList cobList)
            if (param.projectReviewCompleted == true)
                queryScope.and(ProjectDigitalProjectReviewAll::status inList listOf("已完成"))
            else if (param.projectReviewCompleted == false)
                queryScope.and(ProjectDigitalProjectReviewAll::status notIn listOf("已完成"))
            queryScope.groupBy(ProjectDigitalInvestmentAttracting::id)
            queryScope.orderBy(RawQueryOrderBy("MAX(project_digital_project_review_all.create_time) DESC", false))
            queryScope.orderBy(ProjectDigitalInvestmentAttracting::isProjectReviewComplete).desc()
        }
        if (param.isStartApproval == true) {
//            queryScope.orderBy(
//                RawQueryOrderBy(
//                    "project_digital_investment_attracting.id != '71104171081020192'",
//                    false
//                )
//            )
            queryScope.join(ProjectDigitalProjectReviewAll::class.java)
                .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
            if (userAccount.hasRole(SystemRole.FAGAI_INDUSTRY_FLOW)) {
                //区县发改委分流审核
                queryScope.and(ProjectDigitalInvestmentAttracting::projectType eq "工业")
                queryScope.and(ProjectDigitalProjectReviewAll::cobId inList userService.getCobsByUserid(userAccount.id!!))
            } else if (userAccount.hasRole(SystemRole.FAGAI_SERVICE_FLOW)) {
                queryScope.and(ProjectDigitalInvestmentAttracting::projectType eq "服务业")
                queryScope.and(ProjectDigitalProjectReviewAll::cobId inList userService.getCobsByUserid(userAccount.id!!))
            }
            if (param.applyTime1 != null || param.applyTime2 != null) {
                queryScope.and(
                    ProjectDigitalProjectReviewAll::createTime ge LocalDateTime.of(
                        param.applyTime1,
                        LocalTime.MIN
                    )
                )
                queryScope.and(
                    ProjectDigitalProjectReviewAll::createTime le LocalDateTime.of(
                        param.applyTime2,
                        LocalTime.MAX
                    )
                )
            }
            if (param.startApprovalTime1 != null && param.startApprovalTime2 != null) {
                val list = query<ProjectDigitalProjectReviewAll> {
                    and(
                        ProjectDigitalProjectReviewAll::updateTime between param.startApprovalTime1!!.atTime(
                            0,
                            0,
                            0
                        )..param.startApprovalTime2!!.atTime(23, 59, 59)
                    )
                    and(ProjectDigitalProjectReviewAll::status eq "已完成")
                    and(ProjectDigitalProjectReviewAll::result eq 1)
                    and(ProjectDigitalProjectReviewAll::step eq 4)
                }.mapNotNull { it.digitalInvestmentId }
                if (list.isEmpty()) {
                    queryScope.and(ProjectDigitalInvestmentAttracting::id.isNull)
                } else {
                    val nList = query<ProjectDigitalProjectReviewAll> {
                        and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList list)
                        and(ProjectDigitalProjectReviewAll::step eq 4)
                        and(ProjectDigitalProjectReviewAll::status eq "未完成")
                    }.mapNotNull { it.digitalInvestmentId }
                    val fList = list - nList.toSet()
                    queryScope.and(ProjectDigitalInvestmentAttracting::id inList fList)

                }
            }
            queryScope.and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            queryScope.and(ProjectDigitalInvestmentAttracting::isStartApproval eq "1")
            queryScope.groupBy(ProjectDigitalInvestmentAttracting::id)
            queryScope.orderBy(RawQueryOrderBy("MAX(project_digital_project_review_all.create_time) DESC", false))
        }
        if (param.actualSigningTime1 != null && param.actualSigningTime2 != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::actualSigningTime between param.actualSigningTime1!!..param.actualSigningTime2!!)
        }
        if (param.signingTime1 != null && param.signingTime2 != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::signingTime between param.signingTime1!!..param.signingTime2!!)
        }
        if (param.recordTime1 != null && param.recordTime2 != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::filingInfoStatisticsDate between param.recordTime1!!..param.recordTime2!!)
        }
        if (param.startTime1 != null && param.startTime2 != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::startConfirmDate between param.startTime1!!..param.startTime2!!)
        }
        if (param.endTime1 != null && param.endTime2 != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::endConfirmDate between param.endTime1!!..param.endTime2!!)
        }
        if (param.isCompletionApproval == true) {
//            queryScope.orderBy(
//                RawQueryOrderBy(
//                    "project_digital_investment_attracting.id != '71104171497020158'",
//                    false
//                )
//            )
            queryScope.join(ProjectDigitalProjectReviewAll::class.java)
                .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
            queryScope.and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
            queryScope.and(ProjectDigitalInvestmentAttracting::isCompletionApproval eq true)
            if (param.applyTime1 != null || param.applyTime2 != null) {
                queryScope.and(
                    ProjectDigitalProjectReviewAll::createTime ge LocalDateTime.of(
                        param.applyTime1,
                        LocalTime.MIN
                    )
                )
                queryScope.and(
                    ProjectDigitalProjectReviewAll::createTime le LocalDateTime.of(
                        param.applyTime2,
                        LocalTime.MAX
                    )
                )
            }
            if (param.endApprovalTime1 != null && param.endApprovalTime2 != null) {
                val list = query<ProjectDigitalProjectReviewAll> {
                    and(
                        ProjectDigitalProjectReviewAll::updateTime between param.endApprovalTime1!!.atTime(
                            0,
                            0,
                            0
                        )..param.endApprovalTime2!!.atTime(23, 59, 59)
                    )
                    and(ProjectDigitalProjectReviewAll::status eq "已完成")
                    and(ProjectDigitalProjectReviewAll::result eq 1)
                    and(ProjectDigitalProjectReviewAll::step eq 5)
                }.mapNotNull { it.digitalInvestmentId }
                if (list.isEmpty()) {
                    queryScope.and(ProjectDigitalInvestmentAttracting::id.isNull)
                } else {
                    if (queryCount<ProjectDigitalProjectReviewAll> {
                            and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList list)
                            and(ProjectDigitalProjectReviewAll::step eq 5)
                            and(ProjectDigitalProjectReviewAll::status eq "未完成")
                        } == 0L) {
                        queryScope.and(ProjectDigitalInvestmentAttracting::id inList list)
                    } else {
                        queryScope.and(ProjectDigitalInvestmentAttracting::id.isNull)
                    }
                }
            }
            if (userAccount.hasRole(SystemRole.FAGAI_INDUSTRY_FLOW)) {
                //区县发改委分流审核
                queryScope.and(ProjectDigitalInvestmentAttracting::projectType eq "工业")
                queryScope.and(ProjectDigitalProjectReviewAll::cobId inList userService.getCobsByUserid(userAccount.id!!))
            } else if (userAccount.hasRole(SystemRole.FAGAI_SERVICE_FLOW)) {
                queryScope.and(ProjectDigitalInvestmentAttracting::projectType eq "服务业")
                queryScope.and(ProjectDigitalProjectReviewAll::cobId inList userService.getCobsByUserid(userAccount.id!!))
            }
            queryScope.groupBy(ProjectDigitalInvestmentAttracting::id)
            queryScope.orderBy(RawQueryOrderBy("MAX(project_digital_project_review_all.create_time) DESC", false))
        }
        if (param.isSDZProject == true) {
            queryScope.and(ProjectDigitalInvestmentAttracting::source eq "市级机关推荐")
        } else if (param.isSDZProject == false) {
            queryScope.and(ProjectDigitalInvestmentAttracting::source eq "自行接洽")
        }
        if (!param.industryOrService.isNullOrEmpty()) {
            queryScope.and(ProjectDigitalInvestmentAttracting::projectType eq param.industryOrService)
        }
        if (param.signedProjectStatus != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::auditStatus eq param.signedProjectStatus)
        }
        if (param.startApprovalStatus != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq param.startApprovalStatus)
        }
        if (param.endApprovalStatus != null) {
            val projectList = if (param.endApprovalStatus == "审核未完成") {
                query<ProjectDigitalProjectReviewAll> {
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
                    and(ProjectDigitalProjectReviewAll::status ne "已完成")
                }.mapNotNull { it.digitalInvestmentId }
            } else if (param.endApprovalStatus == "审核通过") {
                query<ProjectDigitalProjectReviewAll> {
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
                    and(ProjectDigitalProjectReviewAll::status eq "已完成")
                    and(ProjectDigitalProjectReviewAll::result eq 1)
                }.mapNotNull { it.digitalInvestmentId }
            } else if (param.endApprovalStatus == "审核不通过") {
                query<ProjectDigitalProjectReviewAll> {
                    and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
                    and(ProjectDigitalProjectReviewAll::status eq "已完成")
                    and(ProjectDigitalProjectReviewAll::result eq 0)
                }.mapNotNull { it.digitalInvestmentId }
            } else emptyList()
            if (projectList.isNotEmpty()) {
                queryScope.and(ProjectDigitalInvestmentAttracting::id inList projectList)
            } else {
                queryScope.and(ProjectDigitalInvestmentAttracting::id.isNull)
            }
        }
        if (param.qualityEvaluationStatus != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::isQualityEvaluationComplete eq param.qualityEvaluationStatus)
        }
        if (param.isRecommendedProject == true) {
            val recommendedProjects = query<ProjectInvestmentRecommend> {
                and(ProjectInvestmentRecommend::digitalInvestmentId.isNotNull)
                if (userAccount.hasRole(SystemRole.DEPARTMENT_PROJECT)) {
                    val userDept = userService.getCobsByUserid(userAccount.id!!)
                    and(ProjectInvestmentRecommend::dept inList userDept)
                }
            }.mapNotNull { it.digitalInvestmentId }
            queryScope.and(ProjectDigitalInvestmentAttracting::id inList recommendedProjects)
        }
        if (param.isListedProject == true) {
            queryScope.and(ProjectDigitalInvestmentAttracting::isLt eq true)
            queryScope.and(ProjectDigitalInvestmentAttracting::ltCode.isNotNull)
            queryScope.and(ProjectDigitalInvestmentAttracting::ltCode ne "")
        } else if (param.isListedProject == false) {
            queryScope.and(ProjectDigitalInvestmentAttracting::isLt eq false)
        }
        if (param.park != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::park eq param.park)
        }
        if (param.district != null) {
            queryScope.and(ProjectDigitalInvestmentAttracting::district eq param.district)
        }
        if (param.recordNumber != null) {
            val investmentId = query<ProjectInvestmentXOnlineApproval> {
                and(ProjectInvestmentXOnlineApproval::onlineApprovalId eq param.recordNumber)
            }.mapNotNull { it.investmentId }
            if (investmentId.isNotEmpty()) {
                queryScope.and(ProjectDigitalInvestmentAttracting::id inList investmentId)
            } else {
                queryScope.and(ProjectDigitalInvestmentAttracting::id eq "")
            }
        }
        if (param.isKc != null) {
            if (param.isKc!!) {
                queryScope.and(ProjectDigitalInvestmentAttracting::isKcProj eq "是")
            } else {
                queryScope.and(ProjectDigitalInvestmentAttracting::isKcProj eq "否")
            }
        }
        if (param.isQflp != null) {
            if (param.isQflp!!) {
                queryScope.and(ProjectDigitalInvestmentAttracting::isQflp eq "是")
            } else {
                queryScope.and(ProjectDigitalInvestmentAttracting::isQflp eq "否")
            }
        }
        if (param.recordName != null) {
            val recordId = query<ProjectOnlineApproval> {
                and(ProjectOnlineApproval::projectName like param.recordName)
            }.mapNotNull { it.id }
            if (recordId.isNotEmpty()) {
                val investmentId = query<ProjectInvestmentXOnlineApproval> {
                    and(ProjectInvestmentXOnlineApproval::onlineApprovalId inList recordId)
                }.mapNotNull { it.investmentId }
                if (investmentId.isNotEmpty()) {
                    queryScope.and(ProjectDigitalInvestmentAttracting::id inList investmentId)
                } else {
                    queryScope.and(ProjectDigitalInvestmentAttracting::id eq "")
                }
            } else {
                queryScope.and(ProjectDigitalInvestmentAttracting::id eq "")
            }
        }
        queryScope.orderBy(RawQueryOrderBy("project_digital_investment_attracting.id != '71104170769030118'", false))
        queryScope.orderBy(RawQueryOrderBy("project_digital_investment_attracting.id != '79564141441020135'", false))
        queryScope.orderBy(RawQueryOrderBy("project_digital_investment_attracting.id != '67258759577600172'", false))
        queryScope.orderBy(RawQueryOrderBy("project_digital_investment_attracting.id != '2044683878452224000'", false))
        queryScope.orderBy(RawQueryOrderBy("project_digital_investment_attracting.id != '71104171859050176'", false))
    }

    override fun getParkInfoOfInvestmentAttracting(investmentId: String): ProjectDigitalInvestmentAttracting? {
        return queryOneById<ProjectDigitalInvestmentAttracting>(investmentId)
    }

    override fun notStartProjects(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        projectType: String?,
        // 是否科创
        isKcProj: Boolean?,
        step: String
    ) = query<KeyProjectsItem> {
//        val grantedAreas = DataGrantsUtils.grantedAreas
        from(ProjectDigitalInvestmentAttracting::class.java)
        select(ProjectDigitalInvestmentAttracting::district, ProjectDigitalInvestmentAttracting::park)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(
                QueryMethods.case_()
                    .`when`(ProjectDigitalInvestmentAttracting::investmentFlag eq "1")
                    .then(ProjectDigitalInvestmentAttracting::investmentAmount.column)
                    .`when`(ProjectDigitalInvestmentAttracting::investmentFlag eq "2")
                    .then(ProjectDigitalInvestmentAttracting::investmentAmount.column * 7 / 10000)
                    .end()
            ).`as`(KeyProjectsItem::amount.name)
        )
        and(ProjectDigitalInvestmentAttracting::district.isNotNull)
//        and(ProjectDigitalInvestmentAttracting::park inList grantedAreas)
        and(ProjectDigitalInvestmentAttracting::deleted eq false)
        if (step == "2") {
            and(ProjectDigitalInvestmentAttracting::checkStatus eq "1")
        }
        and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq step)
        groupBy(ProjectDigitalInvestmentAttracting::district, ProjectDigitalInvestmentAttracting::park)
        from(ProjectDigitalInvestmentAttracting::class.java)
        if (projectType != null)
            and(ProjectDigitalInvestmentAttracting::projectType eq projectType)
        if (startTime != null)
            and(ProjectDigitalInvestmentAttracting::signingTime ge startTime)
        if (endTime != null)
            and(ProjectDigitalInvestmentAttracting::signingTime le endTime)
        if (minAmount != null)
            and(ProjectDigitalInvestmentAttracting::investmentAmount ge minAmount)
        if (maxAmount != null)
            and(ProjectDigitalInvestmentAttracting::investmentAmount lt maxAmount)
        if (isKcProj != null)
            and(ProjectDigitalInvestmentAttracting::isKcProj eq isKcProj)
    }
}
