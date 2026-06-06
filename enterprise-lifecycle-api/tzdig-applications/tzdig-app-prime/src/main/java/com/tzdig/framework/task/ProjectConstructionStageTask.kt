package com.tzdig.framework.task

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNotNull
import com.mybatisflex.kotlin.extensions.kproperty.isNull
import com.mybatisflex.kotlin.extensions.model.batchUpdateById
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval
import com.tzdig.framework.service.ProjectConstructionApprovalService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class ProjectConstructionStageTask(
    private val projectConstructionApprovalService: ProjectConstructionApprovalService,
) {
    @Scheduled(cron = "0 0 2 * * ?")
    @Operation(summary = "更新工改阶段")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        val list = query<ProjectConstructionApproval> {
            where(ProjectConstructionApproval::stage.isNull)
            or(ProjectConstructionApproval::stage inList listOf(1, 2, 3))
            where(ProjectConstructionApproval::projectCode.isNotNull)
        }
        list.forEach {
            it.stage = projectConstructionApprovalService.getProjectConstructionApprovalStage(it.projectCode!!)
        }
        list.batchUpdateById()
    }
}
