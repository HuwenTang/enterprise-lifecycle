package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "招商需求留言板查询请求参数")
data class InvestDemandQueryDTO(
    @Schema(description = "市区编码（前缀匹配）")
    val districtCode: String? = null,

    @Schema(description = "市区名称（模糊搜索）")
    val districtName: String? = null,

    @Schema(description = "园区编码（前缀匹配）")
    val zoneCode: String? = null,

    @Schema(description = "园区名称（模糊搜索）")
    val zoneName: String? = null,

    @Schema(description = "街镇编码（前缀匹配）")
    val townCode: String? = null,

    @Schema(description = "街镇名称（模糊搜索）")
    val townName: String? = null,

    @Schema(description = "需求标题（模糊搜索）")
    val title: String? = null,

    @Schema(description = "联系人（模糊搜索）")
    val linkerName: String? = null,

    @Schema(description = "联系方式")
    val linkerTel: String? = null,

    @Schema(description = "审核状态（0-待审核 1-已审核 2-已答复）")
    val status: Int? = null,

    @Schema(description = "所属战区（精确匹配），支持两种输入方式：1.旧版5个固定分类：北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区；2.新版字典编码：101-北京、200-上海、300-南京、400-深圳、500-其他地区、81-其他（境内）")
    var countryRegionStandard: String? = null
)