package com.tzdig.framework.mybatis.bo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class InvestOnlineBO(
    @get:Schema(description = "地区名称")
    val name: String,
    @get:Schema(description = "总金额")
    @get:JsonDecimal(2)
    val total: Double?,
    @get:Schema(description = "一亿以上")
    @get:JsonDecimal(2)
    val yyys: Double?,
    @get:Schema(description = "五亿以上")
    @get:JsonDecimal(2)
    val wyys: Double?,
    @get:Schema(description = "十亿以上")
    @get:JsonDecimal(2)
    val syys: Double?,
)
