package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbForeignInvestmentProjectsQO(
    @param:Schema(description = "市（区）名称")
    val cityDistrict: String? = null,
    @param:Schema(description = "备案项目总数")
    val totalCount: Int? = null,
    @param:Schema(description = "外资利润再投资项目投资额（万美元）")
    val reinvestmentAmountUsd: BigDecimal? = null,
    @param:Schema(description = "外资利润再投资项目当月新增数")
    val reinvestmentNewMonthly: Int? = null,
)
