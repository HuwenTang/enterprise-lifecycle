package com.tzdig.framework.mybatis.bo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class TotalBO(
    @get:Schema(description = "地区")
    val name: String?,
    @get:Schema(description = "项目数")
    val total: Int?,
    @get:Schema(description = "项目数占比")
    @get:JsonDecimal(2)
    val zb: Float?,
    @get:Schema(description = "项目总金额")
    @get:JsonDecimal(2)
    val totalMoney: Float?,
    @get:Schema(description = "项目总金额占比")
    @get:JsonDecimal(2)
    val zbMoney: Float?,
)
