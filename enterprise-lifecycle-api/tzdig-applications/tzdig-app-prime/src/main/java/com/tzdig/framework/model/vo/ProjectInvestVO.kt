package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectInvestVO(
    @Schema(description = "内资计划总投资")
    @get:JsonDecimal(2)
    val planDomesticInvest: Double = 0.0,
    @Schema(description = "内资实际总投资")
    @get:JsonDecimal(2)
    val actualDomesticInvest: Double = 0.0,
    @Schema(description = "内资投资完成率")
    @get:JsonDecimal(2)
    var domesticInvestRatio: Double =  0.0,
    @Schema(description = "外资计划总投资")
    @get:JsonDecimal(2)
    val planForeignInvest: Double = 0.0,
    @Schema(description = "外资实际总投资")
    @get:JsonDecimal(2)
    val actualForeignInvest: Double = 0.0,
    @get:JsonDecimal(2)
    @Schema(description = "外资投资完成率")
    var foreignInvestRatio: Double =  0.0,
)
