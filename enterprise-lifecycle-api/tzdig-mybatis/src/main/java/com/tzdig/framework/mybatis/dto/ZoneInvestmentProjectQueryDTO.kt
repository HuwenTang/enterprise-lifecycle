package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "战区招商投资项目列表查询请求参数")
data class ZoneInvestmentProjectQueryDTO(
    @Schema(description = "项目名称（模糊搜索）")
    val projectName: String? = null,

    @Schema(description = "投资方名称（模糊搜索），示例：华为、腾讯、比亚迪")
    val investorName: String? = null,

    @Schema(description = "项目类别，可选值：内资、外资")
    val projectCategory: String? = null,

    @Schema(description = "洽谈进度（模糊匹配），对应 t_proj_project 表的 progress 字段，示例：接洽中、签约等")
    var dataStatus: String? = null,

    @Schema(description = "市区编码（前缀匹配），示例：321202（海陵区）")
    val districtCode: String? = null,

    @Schema(description = "市区名称（模糊搜索），示例：海陵区")
    val district: String? = null,

    @Schema(description = "园区code（前缀匹配），示例：321283-3（泰兴高新技术开发区）、321203000000（医药高新区（高港区））等")
    val zoneCode: String? = null,

    @Schema(description = "园区名称（模糊搜索），示例：泰兴高新技术开发区")
    val zoneName: String? = null,

    @Schema(description = "街镇code（前缀匹配），示例：321202001001")
    val townCode: String? = null,

    @Schema(description = "街镇名称（模糊搜索），示例：某某街道")
    val townName: String? = null,

    @Schema(description = "投资方注册地/所属战区（精确匹配），字典编码或战区名称。示例： 1. 旧版5个固定分类：北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区  2. 新版字典编码：101-北京、200-上海、300-南京、400-深圳、500-其他地区、81-其他（境内）")
    var countryRegionStandard: String? = null,

    @Schema(description = "原始投资方注册地字典编码（模糊搜索），示例：101、200、90、100等")
    val countryRegionOriginal: String? = null,

    // 招商活动相关字段
    @Schema(description = "活动内容（模糊搜索）")
    val activityContent: String? = null,

    @Schema(description = "主要领导（模糊搜索）")
    val leaders: String? = null,

    @Schema(description = "所属产业链（模糊搜索）")
    val industryName: String? = null,

    // 招商团队相关字段
    @Schema(description = "姓名（模糊搜索）")
    val name: String? = null,

    @Schema(description = "专攻方向（模糊搜索）")
    val specialization: String? = null,

    @Schema(description = "职务（模糊搜索）")
    val position: String? = null,

    @Schema(description = "招商区域（模糊搜索）")
    val investPlace: String? = null,

    @Schema(description = "园区名称（模糊搜索，招商团队）")
    val zone: String? = null,

    @Schema(description = "街镇名称（模糊搜索，招商团队）")
    val town: String? = null,

    @Schema(description = "学历（精确匹配）")
    val xl: String? = null,

    @Schema(description = "联系方式")
    val phone: String? = null
)
