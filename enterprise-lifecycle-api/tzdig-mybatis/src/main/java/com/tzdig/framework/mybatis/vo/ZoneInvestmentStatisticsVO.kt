package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Schema(description = "五大战区投资项目统计VO")
data class ZoneInvestmentStatisticsVO(
    @get:Schema(description = "在谈项目数")
    val talkingCount: Long = 0,

    @get:Schema(description = "招商活动数")
    val investmentActivityCount: Long = 0,

    @get:Schema(description = "招商人员数量")
    val investmentPersonnelCount: Long = 0,

    @get:Schema(description = "累计投资额(亿元)")
    val totalInvestmentAmount: BigDecimal? = null,

    @get:Schema(description = "本月新增项目数")
    val monthNewCount: Long = 0,

    @get:Schema(description = "累计新增项目数")
    val totalNewCount: Long = 0,

    @get:Schema(description = "因公出访数量")
    val officialVisitCount: Long = 0
)
