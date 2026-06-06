@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfoDetail
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ProjectOnlineApprovalInfoDetailVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "在线审批ID")
    @ExcelProperty("在线审批ID")
    val onlineApprovalId: String?,
    @Schema(description = "在线审批信息ID")
    @ExcelProperty("在线审批信息ID")
    val onlineApprovalInfoId: String?,
    @Schema(description = "办理环节")
    @ExcelProperty("办理环节")
    val handlingProcess: String?,
    @Schema(description = "办理日期")
    @ExcelProperty("办理日期")
    val handlingDate: LocalDate?,
    @Schema(description = "办理部门")
    @ExcelProperty("办理部门")
    val handlingDepartment: String?,
    @Schema(description = "部门区划")
    @ExcelProperty("部门区划")
    val administrativeDivision: String?,
    @Schema(description = "内部办理科室")
    @ExcelProperty("内部办理科室")
    val internalHandlingDepartment: String?,
    @Schema(description = "其他办理科室")
    @ExcelProperty("其他办理科室")
    val otherHandlingDepartment: String?,
    @Schema(description = "备注")
    @ExcelProperty("备注")
    val remark: String?,
) {
    constructor(record: ProjectOnlineApprovalInfoDetail) : this(
        id = record.id,
        onlineApprovalId = record.onlineApprovalId,
        onlineApprovalInfoId = record.onlineApprovalInfoId,
        handlingProcess = record.handlingProcess,
        handlingDate = record.handlingDate,
        handlingDepartment = record.handlingDepartment,
        administrativeDivision = record.administrativeDivision,
        internalHandlingDepartment = record.internalHandlingDepartment,
        otherHandlingDepartment = record.otherHandlingDepartment,
        remark = record.remark,
    )
}
