@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfo

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectOnlineApprovalInfoExcelRow(
    @ExcelProperty("在线审批ID")
    var onlineApprovalId: String? = null,
    @ExcelProperty("行ID")
    var rowId: Short? = null,
    @ExcelProperty("实施主体")
    var implementingSubject: String? = null,
    @ExcelProperty("承办部门")
    var undertakingDepartment: String? = null,
    @ExcelProperty("部门区划")
    var administrativeDivision: String? = null,
    @ExcelProperty("审批事项")
    var approvalItem: String? = null,
    @ExcelProperty("办理状态及时间")
    var approvalStatus: String? = null,
) : ExcelRow<ProjectOnlineApprovalInfoExcelRow>() {
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
