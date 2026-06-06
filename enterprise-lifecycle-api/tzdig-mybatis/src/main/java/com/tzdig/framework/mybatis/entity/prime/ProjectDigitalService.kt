@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_digital_service", comment = "招商项目跟踪服务表")
class ProjectDigitalService() : BaseModel<ProjectDigitalService>() {
    constructor(init: ProjectDigitalService.() -> Unit) : this() {
        this.init()
    }

    /**
     * 招商id
     */
    @Column("digital_investment_id", comment = "招商id")
    var digitalInvestmentId: String? = null

    /**
     * 项目名称（自动填充，不可输入）
     */
    @Column("project_name", comment = "项目名称（自动填充，不可输入）")
    var projectName: String? = null

    /**
     * 所属部门（自动填充，不可输入）
     */
    @Column("department", comment = "所属部门（自动填充，不可输入）")
    var department: String? = null

    /**
     * 区县（自动填充，不可输入）
     */
    @Column("district", comment = "区县（自动填充，不可输入）")
    var district: String? = null

    /**
     * 承载园区（自动填充，不可输入）
     */
    @Column("carrier_area", comment = "承载园区（自动填充，不可输入）")
    var carrierArea: String? = null

    /**
     * 审批事项（必填下拉选择）
     */
    @Column("approval_item", comment = "审批事项（必填下拉选择）")
    var approvalItem: String? = null

    /**
     * 参与人员列表（JSON 格式，如 [{&quot;name&quot;: &quot;张三&quot;, &quot;dept&quot;: &quot;技术部&quot;}]）
     */
    @Column(
        "participants",
        comment = "参与人员列表（JSON 格式，如 [{&quot;name&quot;: &quot;张三&quot;, &quot;dept&quot;: &quot;技术部&quot;}]）"
    )
    var participants: String? = null

    /**
     * 拜访对象（必填）
     */
    @Column("visit_target", comment = "拜访对象（必填）")
    var visitTarget: String? = null

    /**
     * 协调过程（必填，最多 1000 字）
     */
    @Column("coordination_process", comment = "协调过程（必填，最多 1000 字）")
    var coordinationProcess: String? = null

    /**
     * 取得成果（必填，最多 1000 字）
     */
    @Column("achievements", comment = "取得成果（必填，最多 1000 字）")
    var achievements: String? = null

    /**
     * 附件上传路径（可为空）
     */
    @Column("attachment_url", comment = "附件上传路径（可为空）")
    var attachmentUrl: String? = null
}
