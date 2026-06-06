package com.tzdig.framework.mybatis.bo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class ResultBO(
    @get:Schema(description = "月度")
    val month: String,
    @get:Schema(description = "项目总数量")
    val projectCount: Int?,
    @get:Schema(description = "项目总金额")
    @get:JsonDecimal(2)
    val projectTotal: Float?,
    @get:Schema(description = "项目数同比")
    @get:JsonDecimal(2)
    val projectCountTrend: Float?,
    @get:Schema(description = "项目金额同比")
    @get:JsonDecimal(2)
    val projectTotalTrend: Float?,
)
