package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

/**
 * 项目认定列表查询请求参数（统一：签约/开工/竣工）
 */
@Schema(description = "项目认定列表查询请求参数")
data class ProjectApprovalQueryDTO(
    @Schema(description = "项目阶段：signed-签约核定, start-开工认定, complete-竣工认定")
    val projectStage: String? = null,

    @Schema(description = "项目名称（模糊搜索）")
    val projectName: String? = null,

    @Schema(description = "园区编码")
    val zoneCode: String? = null,

    @Schema(description = "国民经济分类/所属行业（模糊搜索）")
    val industryClassification: String? = null,

    @Schema(description = "投资方名称（模糊搜索）")
    val investor: String? = null,

    @Schema(description = "最小投资额（亿元）")
    val minInvestment: Double? = null,

    @Schema(description = "最大投资额（亿元）")
    val maxInvestment: Double? = null,

    @Schema(description = "年度")
    val year: Int? = null,

    @Schema(description = "所属行业（工业/服务业/其他）")
    val projectType: String? = null,

    @Schema(description = "审核状态：0-无审核，1-部门审核中，2-部门审核通过，3-部门审核退回，4-专班审核中，5-专班审核通过，6-专班审核退回，7-审核不通过，8-通过不计分")
    val auditStatus: Int? = null
)
