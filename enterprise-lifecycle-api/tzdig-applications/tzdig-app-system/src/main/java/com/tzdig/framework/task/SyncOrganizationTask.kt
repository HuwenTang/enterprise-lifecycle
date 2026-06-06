package com.tzdig.framework.task

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.kproperty.ne
import com.tzdig.framework.core.annotation.ConditionalOnTaizhengtong
import com.tzdig.framework.core.annotation.CustomJob
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.TaizhengtongService
import com.tzdig.framework.tzt.service.TaizhengtongClient
import io.swagger.v3.oas.annotations.Operation
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
@ConditionalOnTaizhengtong
class SyncOrganizationTask(
    private val taizhengtongClient: TaizhengtongClient,
    private val taizhengtongService: TaizhengtongService,
    private val userService: UserService,
) {
    @Scheduled(cron = "0 20 6,13,18 * * ?")
    @Operation(summary = "同步泰政通组织架构")
    fun execute() {
        syncDepartments()
        val organizations = filter<UserOrganization> { UserOrganization::id ne DeptConstant.ROOT }
        for (organization in organizations) {
            syncStaffs(organization.id!!, false)
        }
        userService.rebuildLowerOrganizationIdsCache(DeptConstant.ROOT)
    }

    @CustomJob
    @Operation(summary = "同步泰政通部门")
    @DistributedLock(policy = Policy.STRICT)
    fun syncDepartments() {
        val appToken = taizhengtongClient.getAppToken()
        taizhengtongService.syncDepartments(appToken, DeptConstant.ROOT)
    }

    @CustomJob
    @Operation(summary = "同步泰政通部门人员")
    @DistributedLock(key = "#organizationId", policy = Policy.NON_BLOCKING)
    fun syncStaffs(organizationId: String, includeLowerOrg: Boolean) {
        val appToken = taizhengtongClient.getAppToken()
        if (!includeLowerOrg) {
            taizhengtongService.syncStaffs(appToken, organizationId)
            return
        }
        val orgList = userService.getLowerOrganizationIds(organizationId)
        for (org in orgList) {
            taizhengtongService.syncStaffs(appToken, org)
        }
    }

    @Async
    @EventListener(ApplicationReadyEvent::class)
    fun rebuildLowerOrganizationIdsCache() {
        userService.getLowerOrganizationIds(DeptConstant.ROOT)
    }
}
