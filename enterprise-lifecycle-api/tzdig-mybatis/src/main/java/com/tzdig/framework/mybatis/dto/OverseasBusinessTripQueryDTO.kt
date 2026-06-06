package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "境外战区因公出访列表查询请求参数")
data class OverseasBusinessTripQueryDTO(
    @Schema(description = "出访地（国家、地区）（模糊搜索）")
    val visitDestination: String? = null,

    @Schema(description = "团组名称（模糊搜索）")
    val groupName: String? = null,

    @Schema(description = "主要成员（模糊搜索）")
    val mainMembers: String? = null,

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

    @Schema(description = "年份筛选")
    val year: String? = null
)
