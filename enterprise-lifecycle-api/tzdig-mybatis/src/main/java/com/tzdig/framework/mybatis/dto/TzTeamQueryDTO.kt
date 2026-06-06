package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "招商团队名录查询请求参数")
data class TzTeamQueryDTO(
    @Schema(description = "姓名（模糊搜索）")
    val name: String? = null,

    @Schema(description = "专攻方向（模糊搜索）")
    val specialization: String? = null,

    @Schema(description = "职务（模糊搜索）")
    val position: String? = null,

    @Schema(description = "招商区域（模糊搜索）")
    val investPlace: String? = null,

    @Schema(description = "市区编码（前缀匹配）")
    val districtCode: String? = null,

    @Schema(description = "市区名称（模糊搜索）")
    val district: String? = null,

    @Schema(description = "园区code（前缀匹配）")
    val zoneCode: String? = null,

    @Schema(description = "园区名称（模糊搜索）")
    val zone: String? = null,

    @Schema(description = "街镇code（前缀匹配）")
    val townCode: String? = null,

    @Schema(description = "街镇名称（模糊搜索）")
    val town: String? = null,

    @Schema(description = "学历（精确匹配）")
    val xl: String? = null,

    @Schema(description = "联系方式")
    val phone: String? = null,

    @Schema(description = "所属战区（精确匹配），支持两种输入方式：1.旧版5个固定分类：北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区；2.新版字典编码：101-北京、200-上海、300-南京、400-深圳、500-其他地区、81-其他（境内）")
    var countryRegionStandard: String? = null
)
