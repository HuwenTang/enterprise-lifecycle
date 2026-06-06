@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfo
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectOnlineApprovalInfoVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "在线审批ID")
    @ExcelProperty("在线审批ID")
    val onlineApprovalId: String?,
    @Schema(description = "行ID")
    @ExcelProperty("行ID")
    val rowId: Short?,
    @Schema(description = "实施主体")
    @ExcelProperty("实施主体")
    val implementingSubject: String?,
    @Schema(description = "承办部门")
    @ExcelProperty("承办部门")
    val undertakingDepartment: String?,
    @Schema(description = "部门区划")
    @ExcelProperty("部门区划")
    val administrativeDivision: String?,
    @Schema(description = "审批事项")
    @ExcelProperty("审批事项")
    val approvalItem: String?,
    @Schema(description = "办理状态及时间")
    @ExcelProperty("办理状态及时间")
    val approvalStatus: String?,
) {
    constructor(record: ProjectOnlineApprovalInfo) : this(
        id = record.id,
        onlineApprovalId = record.onlineApprovalId,
        rowId = record.rowId,
        implementingSubject = record.implementingSubject,
        undertakingDepartment = record.undertakingDepartment,
        administrativeDivision = record.administrativeDivision,
        approvalItem = record.approvalItem,
        approvalStatus = record.approvalStatus,
    )
}
