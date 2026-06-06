package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "招商活动列表查询请求参数")
data class RecruitmentActivityQueryDTO(
    @Schema(description = "活动内容（模糊搜索）")
    val activityContent: String? = null,

    @Schema(description = "市区编码")
    val districtCode: String? = null,

    @Schema(description = "市区名称（模糊搜索）")
    val district: String? = null,

    @Schema(description = "园区code")
    val zoneCode: String? = null,

    @Schema(description = "园区名称（模糊搜索）")
    val zoneName: String? = null,

    @Schema(description = "街镇code")
    val townCode: String? = null,

    @Schema(description = "街镇名称（模糊搜索）")
    val townName: String? = null,

    @Schema(description = "所属产业链")
    val industryChain: String? = null,

    @Schema(description = "审核状态（0-无审核，1-部门审核中，2-部门审核通过，3-部门审核退回，4-专班审核中，5-专班审核通过，6-专班审核退回，7-审核不通过，8-通过不计分）")
    val auditStatus: Int? = null
)
