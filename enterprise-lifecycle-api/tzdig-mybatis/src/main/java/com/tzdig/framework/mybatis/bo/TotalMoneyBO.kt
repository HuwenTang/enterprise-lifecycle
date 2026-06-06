package com.tzdig.framework.mybatis.bo

import io.swagger.v3.oas.annotations.media.Schema

data class TotalMoneyBO(
    @Schema(description = "地区")
    val name: String?,
    @Schema(description = "年份")
    val year: String?,
    @Schema(description = "项目数")
    val total: Int?,
    @Schema(description = "项目总金额")
    val totalMoney: Float?
)
