@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalService
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectDigitalServiceVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "招商id")
    @ExcelProperty("招商id")
    val digitalInvestmentId: String?,
    @get:Schema(description = "项目名称（自动填充，不可输入）")
    @ExcelProperty("项目名称（自动填充，不可输入）")
    val projectName: String?,
    @get:Schema(description = "所属部门（自动填充，不可输入）")
    @ExcelProperty("所属部门（自动填充，不可输入）")
    val department: String?,
    @get:Schema(description = "区县（自动填充，不可输入）")
    @ExcelProperty("区县（自动填充，不可输入）")
    val district: String?,
    @get:Schema(description = "承载园区（自动填充，不可输入）")
    @ExcelProperty("承载园区（自动填充，不可输入）")
    val carrierArea: String?,
    @get:Schema(description = "审批事项（必填下拉选择）")
    @ExcelProperty("审批事项（必填下拉选择）")
    val approvalItem: String?,
    @get:Schema(description = "参与人员列表（JSON 格式，如 [{&quot;name&quot;: &quot;张三&quot;, &quot;dept&quot;: &quot;技术部&quot;}]）")
    @ExcelProperty("参与人员列表（JSON 格式，如 [{&quot;name&quot;: &quot;张三&quot;, &quot;dept&quot;: &quot;技术部&quot;}]）")
    val participants: String?,
    @get:Schema(description = "拜访对象（必填）")
    @ExcelProperty("拜访对象（必填）")
    val visitTarget: String?,
    @get:Schema(description = "协调过程（必填，最多 1000 字）")
    @ExcelProperty("协调过程（必填，最多 1000 字）")
    val coordinationProcess: String?,
    @get:Schema(description = "取得成果（必填，最多 1000 字）")
    @ExcelProperty("取得成果（必填，最多 1000 字）")
    val achievements: String?,
    @get:Schema(description = "附件上传路径（可为空）")
    @ExcelProperty("附件上传路径（可为空）")
    val attachmentUrl: String?,
) {
    constructor(record: ProjectDigitalService) : this(
        id = record.id,
        digitalInvestmentId = record.digitalInvestmentId,
        projectName = record.projectName,
        department = record.department,
        district = record.district,
        carrierArea = record.carrierArea,
        approvalItem = record.approvalItem,
        participants = record.participants,
        visitTarget = record.visitTarget,
        coordinationProcess = record.coordinationProcess,
        achievements = record.achievements,
        attachmentUrl = record.attachmentUrl,
    )
}
