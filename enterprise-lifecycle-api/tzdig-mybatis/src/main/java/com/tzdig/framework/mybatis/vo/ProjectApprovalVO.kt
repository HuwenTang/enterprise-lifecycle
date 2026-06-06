package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema

/**
 * 项目认定列表统一VO（签约/开工/竣工）
 */
@Schema(description = "项目认定列表VO")
data class ProjectApprovalVO(
    @get:Schema(description = "项目ID")
    val id: String?,

    @get:Schema(description = "项目名称")
    val projectName: String?,

    @get:Schema(description = "所属板块（园区名称）")
    val zoneName: String?,

    @get:Schema(description = "国民经济分类")
    val industryClassification: String?,

    @get:Schema(description = "投资方")
    val investor: String?,

    @get:Schema(description = "投资总额（亿元）")
    val investmentAmount: Double?,

    @get:Schema(description = "签约日期")
    val signedDate: String?,

    @get:Schema(description = "开工日期")
    val startDate: String?,

    @get:Schema(description = "竣工日期")
    val completeDate: String?,

    @get:Schema(description = "签约金额（万元）")
    val signedAmount: Double?,

    @get:Schema(description = "项目类别（内资/外资）")
    val projectCategory: String?,

    @get:Schema(description = "项目类型")
    val projectType: String?,

    @get:Schema(description = "审核状态：0-无审核，1-部门审核中，2-部门审核通过，3-部门审核退回，4-专班审核中，5-专班审核通过，6-专班审核退回，7-审核不通过，8-通过不计分")
    val auditStatus: Int?,

    @get:Schema(description = "审核状态名称")
    val auditStatusName: String?,

    @get:Schema(description = "年度（用于前端展示）")
    val year: Int?,

    @get:Schema(description = "所属行业（用于前端展示）")
    val industry: String?
)
