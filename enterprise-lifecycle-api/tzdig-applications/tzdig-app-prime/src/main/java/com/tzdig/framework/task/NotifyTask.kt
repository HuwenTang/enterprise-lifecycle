package com.tzdig.framework.task

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.system.SystemCalendar
import com.tzdig.framework.service.ProjectDigitalProjectReviewService
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.LocalDateTime

@Component
class NotifyTask(
    private val projectDigitalProjectReviewService: ProjectDigitalProjectReviewService,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Scheduled(cron = "0 25 8 * * ?")
    @Operation(summary = "降级执行创建待办")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun executeCreate() {
        logger.info("招商项目审核-降级执行create")
        val list = filter<ProjectDigitalProjectReviewAll> { ProjectDigitalProjectReviewAll::taskCode.isNull }
        projectDigitalProjectReviewService.createTask(list.map { it.id!! })
    }

    @Scheduled(cron = "0 0 7 * * ?")
    @Operation(summary = "降级执行更新待办")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun executeUpdate() {
        logger.info("招商项目审核-降级执行update")
        val dt = LocalDateTime.now().minusDays(3) // 3天内
        val list = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::taskCode.isNotNull)
            and(ProjectDigitalProjectReviewAll::status ne "未完成")
            and(ProjectDigitalProjectReviewAll::updateTime gt dt)
        }
        for (item in list) {
            projectDigitalProjectReviewService.updateTaskStatus(item.id!!)
        }
    }

    @Scheduled(cron = "0 30 8 * * ?")
    @Scheduled(cron = "0 0 14 * * ?")
    fun batchSendSms() {
        val calendar = filterOne<SystemCalendar> { SystemCalendar::date eq LocalDate.now() }
        val isWorkday = calendar?.attr == SystemCalendar.Attr.WORKDAY
        logger.info("招商项目审核-降级执行sms: {}", isWorkday)
        if (!isWorkday) return
        val list = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::taskCode.isNotNull)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
        }
        projectDigitalProjectReviewService.sendSms(list)
    }
}
