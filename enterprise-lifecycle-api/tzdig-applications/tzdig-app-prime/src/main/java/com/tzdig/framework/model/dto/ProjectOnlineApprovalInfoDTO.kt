@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfo
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectOnlineApprovalInfoDTO(
    @Schema(description = "在线审批ID")
    val onlineApprovalId: String?,
    @Schema(description = "行ID")
    val rowId: Short?,
    @Schema(description = "实施主体")
    val implementingSubject: String?,
    @Schema(description = "承办部门")
    val undertakingDepartment: String?,
    @Schema(description = "部门区划")
    val administrativeDivision: String?,
    @Schema(description = "审批事项")
    val approvalItem: String?,
    @Schema(description = "办理状态及时间")
    val approvalStatus: String?,
) {
    fun toProjectOnlineApprovalInfo(): ProjectOnlineApprovalInfo =
        ProjectOnlineApprovalInfo {
            into(this)
        }

    fun into(record: ProjectOnlineApprovalInfo): ProjectOnlineApprovalInfo {
        record.onlineApprovalId = onlineApprovalId
        record.rowId = rowId
        record.implementingSubject = implementingSubject
        record.undertakingDepartment = undertakingDepartment
        record.administrativeDivision = administrativeDivision
        record.approvalItem = approvalItem
        record.approvalStatus = approvalStatus
        return record
    }
}
