package com.tzdig.framework.mybatis.dto

import io.swagger.v3.oas.annotations.media.Schema

/**
 * 五大战区首页统计查询DTO
 */
@Schema(description = "五大战区首页统计查询DTO")
data class ZoneInvestmentHomeStatisticsQueryDTO(
    @Schema(description = "年度筛选")
    var year: Int? = null,

    @Schema(description = "金额范围筛选：all-全部, above-亿元以上, below-亿元以下")
    var amountRange: String? = null,

    @Schema(description = "排序类型：all-全部, count-项目数, amount-投资额")
    var sortBy: String? = null,

    @Schema(description = "所属战区编码（逗号分隔），如：101,200,300,400,500,81")
    var countryRegionStandard: String? = null
)
