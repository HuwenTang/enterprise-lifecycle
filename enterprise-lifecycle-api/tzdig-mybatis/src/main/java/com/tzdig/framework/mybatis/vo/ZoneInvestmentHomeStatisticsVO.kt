package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

/**
 * 五大战区首页统计响应VO
 */
@Schema(description = "五大战区首页统计响应VO")
data class ZoneInvestmentHomeStatisticsVO(
    @get:Schema(description = "五大战区卡片统计数据")
    val regionCards: List<ZoneInvestmentRegionCardVO>,

    @get:Schema(description = "五大战区详细统计数据列表")
    val regionDetails: List<ZoneInvestmentRegionDetailVO>
)

/**
 * 五大战区卡片统计VO（顶部展示）
 */
@Schema(description = "五大战区卡片统计VO")
data class ZoneInvestmentRegionCardVO(
    @get:Schema(description = "战区名称，如：上海(长三角)")
    val regionName: String,

    @get:Schema(description = "项目数量")
    val projectCount: Long,

    @get:Schema(description = "项目金额(亿元)")
    val projectAmount: BigDecimal? = null
)

/**
 * 五大战区详细统计VO（表格数据）
 */
@Schema(description = "五大战区详细统计VO")
data class ZoneInvestmentRegionDetailVO(
    @get:Schema(description = "地区名称")
    val regionName: String,

    @get:Schema(description = "累计签约数(个)")
    val signedCount: Long = 0,

    @get:Schema(description = "累计投资额(亿元)")
    val signedInvestmentAmount: BigDecimal? = null,

    @get:Schema(description = "当月新增数(个)")
    val monthNewCount: Long = 0,

    @get:Schema(description = "当月投资额(亿元)")
    val monthInvestmentAmount: BigDecimal? = null,

    @get:Schema(description = "开工项目数(个)")
    val startProjectCount: Long = 0,

    @get:Schema(description = "开工当月新增数(个)")
    val startMonthNewCount: Long = 0,

    @get:Schema(description = "开工率(%)")
    val startRate: BigDecimal? = null,

    @get:Schema(description = "市重点数量(个)")
    val cityKeyCount: Long = 0,

    @get:Schema(description = "省重大数量(个)")
    val provinceKeyCount: Long = 0,

    @get:Schema(description = "在谈项目数(个)")
    val talkingCount: Long = 0,

    @get:Schema(description = "招商活动数(个)")
    val investmentActivityCount: Long = 0
)
