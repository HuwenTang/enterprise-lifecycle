package com.tzdig.framework.task

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.ge
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.le
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.model.dto.ProjectDeptScoreDTO
import com.tzdig.framework.mybatis.entity.prime.ProjectDeptScore
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.system.SystemDict
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Component
class SyncDeptScoreTask {

    private val logger = LoggerFactory.getLogger(javaClass)

    @Transactional
    @Scheduled(cron = "0 10 * * * ?")
    @Operation(summary = "同步部门得分")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        logger.info("开始同步部门得分")
        val deptList = filter<SystemDict> { SystemDict::catalog eq "project_dept" }
        deptList.forEach { dept ->
            for (year in 2025..2026) {
                val deptProjectList = query<ProjectDigitalInvestmentAttracting> {
                    where(ProjectDigitalInvestmentAttracting::sjjgName eq dept.label)
                    and(ProjectDigitalInvestmentAttracting::source eq "市级机关推荐")
                }.mapNotNull { it.id }
                if (deptProjectList.isEmpty()) {
                    continue
                }
                val signProject = query<ProjectDigitalProjectReviewAll> {
                    where(ProjectDigitalProjectReviewAll::digitalInvestmentId inList deptProjectList)
                    and(
                        ProjectDigitalProjectReviewAll::step eq
                                ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW
                    )
                    val startOfYear = LocalDateTime.of(year, 1, 1, 0, 0)
                    val endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59)
                    and(ProjectDigitalProjectReviewAll::createTime ge startOfYear)
                    and(ProjectDigitalProjectReviewAll::createTime le endOfYear)
                }.mapNotNull { it.digitalInvestmentId }
                val deptScoreQy = if (signProject.isNotEmpty()) {
                    query<ProjectDigitalProjectReviewAll> {
                        where(ProjectDigitalProjectReviewAll::digitalInvestmentId inList signProject)
                        and(
                            ProjectDigitalProjectReviewAll::step eq
                                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB
                        )
                    }.mapNotNull { it.score }.sum()
                } else {
                    0f
                }
                val deptScoreKg = query<ProjectDigitalProjectReviewAll> {
                    where(ProjectDigitalProjectReviewAll::digitalInvestmentId inList deptProjectList)
                    and(
                        ProjectDigitalProjectReviewAll::step eq
                                ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW
                    )
                    and(ProjectDigitalProjectReviewAll::score ge 0f)
                    //记分按照1月8日开始计分，次年1月7日结束计分
                    val startOfYear = LocalDateTime.of(year, 1, 8, 0, 0)
                    val endOfYear = LocalDateTime.of(year + 1, 1, 7, 23, 59, 59)
                    and(ProjectDigitalProjectReviewAll::createTime ge startOfYear)
                    and(ProjectDigitalProjectReviewAll::createTime le endOfYear)
                }.mapNotNull { it.score }.sum()
                val deptScoreExt = query<ProjectDigitalProjectReviewAll> {
                    where(ProjectDigitalProjectReviewAll::digitalInvestmentId inList deptProjectList)
                    and(
                        ProjectDigitalProjectReviewAll::step eq
                                ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE
                    )
                    val startOfYear = LocalDateTime.of(year, 1, 1, 0, 0)
                    val endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59)
                    and(ProjectDigitalProjectReviewAll::createTime ge startOfYear)
                    and(ProjectDigitalProjectReviewAll::createTime le endOfYear)
                }.mapNotNull { it.score }.sum()
                val deptScoreQyActual = if (deptScoreQy + deptScoreExt >= 2.5) 2.5f else deptScoreQy + deptScoreExt
                val deptScoreKgActual = if (deptScoreQy >= 5) 5f else deptScoreKg
                var deptScore = deptScoreQyActual + deptScoreKgActual
                val catalog = query<SystemDict> {
                    where(
                        SystemDict::catalog inList listOf(
                            "dept_type_1",
                            "dept_type_2"
                        )
                    )
                    and(SystemDict::code eq dept.code)
                }.map { it.catalog }.firstOrNull()
                deptScore = if (catalog == "dept_type_1") {
                    if (deptScore < 0.9f) {
                        0f
                    } else deptScore
                } else if (catalog == "dept_type_2") {
                    if (deptScore < 0.6f) {
                        0f
                    } else deptScore
                } else deptScore
                val actualScore = deptScoreKg + deptScoreQy + deptScoreExt
                val projectDeptScore = queryOne<ProjectDeptScore> {
                    where(ProjectDeptScore::deptName eq dept.label)
                    and(ProjectDeptScore::year eq year)
                }
                if (projectDeptScore == null) {
                    ProjectDeptScoreDTO(
                        deptName = dept.label,
                        deptId = dept.code,
                        deptClass = when (catalog) {
                            "dept_type_1" -> {
                                "一类"
                            }

                            "dept_type_2" -> {
                                "二类"
                            }

                            else -> {
                                "三类"
                            }
                        },
                        year = year,
                        score = if (deptScore > 5) 5f else deptScore,
                        actualScore = actualScore,
                        signScore = deptScoreQy,
                        actualSignScore = deptScoreQyActual,
                        startScore = deptScoreKg,
                        actualStartScore = deptScoreKgActual,
                    ).toProjectDeptScore().save()
                } else {
                    projectDeptScore.deptId = dept.code
                    projectDeptScore.score = if (deptScore > 5) 5f else deptScore
                    projectDeptScore.actualScore = actualScore
                    projectDeptScore.signScore = deptScoreQy
                    projectDeptScore.actualSignScore = deptScoreQyActual
                    projectDeptScore.startScore = deptScoreKg
                    projectDeptScore.actualStartScore = deptScoreKgActual
                    projectDeptScore.updateById()
                }
            }
        }
        logger.info("同步部门得分完成")
    }
}
