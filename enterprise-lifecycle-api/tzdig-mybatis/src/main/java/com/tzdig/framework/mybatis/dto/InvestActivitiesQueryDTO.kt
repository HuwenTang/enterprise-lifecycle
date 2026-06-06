package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "招商活动登记列表查询请求参数")
data class InvestActivitiesQueryDTO(
    @Schema(description = "活动内容（模糊搜索）")
    val activityContent: String? = null,

    @Schema(description = "主要领导（模糊搜索）")
    val leaders: String? = null,

    @Schema(description = "所属产业链（模糊搜索）")
    val industryName: String? = null,

    @Schema(description = "市区编码（前缀匹配）")
    val districtCode: String? = null,

    @Schema(description = "市区名称（模糊搜索）")
    val district: String? = null,

    @Schema(description = "园区code（前缀匹配）")
    val zoneCode: String? = null,

    @Schema(description = "园区名称（模糊搜索）")
    val zoneName: String? = null,

    @Schema(description = "街镇code（前缀匹配）")
    val townCode: String? = null,

    @Schema(description = "街镇名称（模糊搜索）")
    val townName: String? = null,

    @Schema(description = "开始时间")
    val startTime: String? = null,

    @Schema(description = "结束时间")
    val endTime: String? = null,

    @Schema(description = "审核状态（0 待审核 1 审核通过 2 审核不通过）")
    val auditStatus: Int? = null,

    @Schema(description = "所属战区（精确匹配），支持两种输入方式：1.旧版5个固定分类：北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区；2.新版字典编码：101-北京、200-上海、300-南京、400-深圳、500-其他地区、81-其他（境内）")
    var countryRegionStandard: String? = null
)
