@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalService
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectDigitalServiceDTO(
    @param:Schema(description = "招商id")
    val digitalInvestmentId: String?,
    @param:Schema(description = "项目名称（自动填充，不可输入）")
    val projectName: String?,
    @param:Schema(description = "所属部门（自动填充，不可输入）")
    val department: String?,
    @param:Schema(description = "区县（自动填充，不可输入）")
    val district: String?,
    @param:Schema(description = "承载园区（自动填充，不可输入）")
    val carrierArea: String?,
    @param:Schema(description = "审批事项（必填下拉选择）")
    val approvalItem: String?,
    @param:Schema(description = "参与人员列表（JSON 格式，如 [{&quot;name&quot;: &quot;张三&quot;, &quot;dept&quot;: &quot;技术部&quot;}]）")
    val participants: String?,
    @param:Schema(description = "拜访对象（必填）")
    val visitTarget: String?,
    @param:Schema(description = "协调过程（必填，最多 1000 字）")
    val coordinationProcess: String?,
    @param:Schema(description = "取得成果（必填，最多 1000 字）")
    val achievements: String?,
    @param:Schema(description = "附件上传路径（可为空）")
    val attachmentUrl: String?,
) {
    fun toProjectDigitalService(): ProjectDigitalService =
        ProjectDigitalService {
            into(this)
        }

    fun into(record: ProjectDigitalService): ProjectDigitalService {
        record.digitalInvestmentId = digitalInvestmentId
        record.projectName = projectName
        record.department = department
        record.district = district
        record.carrierArea = carrierArea
        record.approvalItem = approvalItem
        record.participants = participants
        record.visitTarget = visitTarget
        record.coordinationProcess = coordinationProcess
        record.achievements = achievements
        record.attachmentUrl = attachmentUrl
        return record
    }
}
