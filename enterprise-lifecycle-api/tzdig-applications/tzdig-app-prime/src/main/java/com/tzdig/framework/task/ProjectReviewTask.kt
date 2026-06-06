package com.tzdig.framework.task

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.le
import com.mybatisflex.kotlin.extensions.model.batchUpdateById
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.service.ProjectDigitalProjectReviewService
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class ProjectReviewTask(
    private val projectDigitalProjectReviewService: ProjectDigitalProjectReviewService
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Operation(summary = "质态评估三天自动评估同步")
    @Scheduled(cron = "0 0/30 * * * ?")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        logger.info("ProjectReviewTask execute start")
//        val dt = calenderService.minusWorkdays(LocalDateTime.now(), 3)
        val dt = LocalDateTime.now().minusDays(3)
        val list = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::createTime le dt)
        }
        for (record in list) {
            record.status = "超时自动完成"
            record.comment = "质态评估超时自动完成"
            record.deptName = "<系统>"
            record.name = "System"
        }
        val group = list.groupBy { it.digitalInvestmentId!! }
        for ((digitalInvestmentId, records) in group) {
            logger.info("质态评估超时自动完成: {}", records.joinToString { it.id!! })
            records.batchUpdateById()
            val investment = queryOneById<ProjectDigitalInvestmentAttracting>(digitalInvestmentId)
                ?: continue
            investment.isQualityEvaluationComplete = true
            investment.updateById()
            try {
                projectDigitalProjectReviewService.evaluationCallBack(investment)
            } catch (e: Exception) {
                logger.error("质态评估超时自动完成回调失败: {}", investment.id, e)
                records.onEach { it.status = "未完成" }.batchUpdateById()
            }
        }
        logger.info("ProjectReviewTask execute finished")
    }
}
