@file:Suppress("unused")

package com.tzdig.framework.model.excel

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.format.DateTimeFormat
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfoDetail
import java.time.LocalDate

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectOnlineApprovalInfoDetailExcelRow(
    @ExcelProperty("办理环节")
    var handlingProcess: String? = null,
    @ExcelProperty("办理日期")
    @DateTimeFormat("yyyy/MM/dd")
    var handlingDate: LocalDate? = null,
    @ExcelProperty("办理部门")
    var handlingDepartment: String? = null,
    @ExcelProperty("部门区划")
    var administrativeDivision: String? = null,
    @ExcelProperty("内部办理科室")
    var internalHandlingDepartment: String? = null,
    @ExcelProperty("其他办理科室")
    var otherHandlingDepartment: String? = null,
    @ExcelProperty("备注")
    var remark: String? = null,
) : ExcelRow<ProjectOnlineApprovalInfoDetailExcelRow>() {
    fun toProjectOnlineApprovalInfoDetail(): ProjectOnlineApprovalInfoDetail =
        ProjectOnlineApprovalInfoDetail {
            into(this)
        }

    fun into(record: ProjectOnlineApprovalInfoDetail): ProjectOnlineApprovalInfoDetail {
//        record.onlineApprovalInfoId = onlineApprovalInfoId
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
