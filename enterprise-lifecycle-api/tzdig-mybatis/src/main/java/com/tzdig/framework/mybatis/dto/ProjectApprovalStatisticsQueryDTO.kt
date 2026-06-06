package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

/**
 * 项目认定统计查询请求参数
 */
@Schema(description = "项目认定统计查询请求参数")
data class ProjectApprovalStatisticsQueryDTO(
    @Schema(description = "项目阶段：signed-签约核定, start-开工认定, complete-竣工认定")
    var projectStage: String? = null,

    @Schema(description = "年度")
    var year: Int? = null,

    @Schema(description = "项目类型（工业/服务业）")
    var projectType: String? = null,

    @Schema(description = "审核状态（0-无审核，1-部门审核中，2-部门审核通过，3-部门审核退回，4-专班审核中，5-专班审核通过，6-专班审核退回，7-审核不通过，8-通过不计分）")
    var auditStatus: Int? = null
)
