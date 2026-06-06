@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfoDetail
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ProjectOnlineApprovalInfoDetailDTO(
    @Schema(description = "在线审批ID")
    val onlineApprovalId: String?,
    @Schema(description = "在线审批信息ID")
    val onlineApprovalInfoId: String?,
    @Schema(description = "办理环节")
    val handlingProcess: String?,
    @Schema(description = "办理日期")
    val handlingDate: LocalDate?,
    @Schema(description = "办理部门")
    val handlingDepartment: String?,
    @Schema(description = "部门区划")
    val administrativeDivision: String?,
    @Schema(description = "内部办理科室")
    val internalHandlingDepartment: String?,
    @Schema(description = "其他办理科室")
    val otherHandlingDepartment: String?,
    @Schema(description = "备注")
    val remark: String?,
) {
    fun toProjectOnlineApprovalInfoDetail(): ProjectOnlineApprovalInfoDetail =
        ProjectOnlineApprovalInfoDetail {
            into(this)
        }

    fun into(record: ProjectOnlineApprovalInfoDetail): ProjectOnlineApprovalInfoDetail {
        record.onlineApprovalId = onlineApprovalId
        record.onlineApprovalInfoId = onlineApprovalInfoId
        record.handlingProcess = handlingProcess
        record.handlingDate = handlingDate
        record.handlingDepartment = handlingDepartment
        record.administrativeDivision = administrativeDivision
        record.internalHandlingDepartment = internalHandlingDepartment
        record.otherHandlingDepartment = otherHandlingDepartment
        record.remark = remark
        return record
    }
}
