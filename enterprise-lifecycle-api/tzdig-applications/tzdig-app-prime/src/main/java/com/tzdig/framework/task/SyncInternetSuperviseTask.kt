package com.tzdig.framework.task

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNotNull
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.mybatis.entity.prime.InternetSupervise
import com.tzdig.framework.mybatis.entity.system.SystemMenuXRole
import com.tzdig.framework.mybatis.mapper.prime.InternetSuperviseMapper
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.InternetSuperviseService
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class SyncInternetSuperviseTask(
    private val userService: UserService,
    private val internetSuperviseService: InternetSuperviseService,
    private val internetSuperviseMapper: InternetSuperviseMapper
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Scheduled(cron = "0 0 * * * ?")
    @Operation(summary = "同步互联网+监管")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        logger.info("开始同步互联网 supervision 数据")
        internetSuperviseMapper.deleteByCondition(InternetSupervise::userId.isNotNull)
        val roles = filter<SystemMenuXRole> {
            SystemMenuXRole::menuId inList listOf("66346928295000181", "66348413065000183")
        }.mapNotNull { it.roleId } + SystemRole.ROOT
//        if (roles.isEmpty()) return
        val list = roles.flatMap { userService.getUserIdsByRole(it) }
            .mapNotNull { userService.getUserAccountById(it) }
            .map { internetSuperviseService.getUserInfo(it).toInternetSupervise() }
            .distinctBy { it.userId }
        list.batchInsert()
        logger.info("同步互联网 supervision 数据完成, 数量: {}", list.size)
    }
}
