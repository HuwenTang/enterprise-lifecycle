package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectAreaVO(
    @Schema(description = "地区")
    val region: String? = null,
    @Schema(description = "计划总投资")
    @get:JsonDecimal(2)
    val planDomesticInvest: Double = 0.0,
    @Schema(description = "实际总投资")
    @get:JsonDecimal(2)
    val actualDomesticInvest: Double = 0.0,
    @Schema(description = "投资完成率")
    @get:JsonDecimal(2)
    var investRatio: Double =  0.0,
)
