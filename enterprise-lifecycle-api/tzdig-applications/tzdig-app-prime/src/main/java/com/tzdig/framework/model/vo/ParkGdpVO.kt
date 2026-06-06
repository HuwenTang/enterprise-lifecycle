package com.tzdig.framework.model.vo

import com.mybatisflex.annotation.Table
import io.swagger.v3.oas.annotations.media.Schema

@Table("enterprise_info")
data class ParkGdpVO(
    @Schema(description = "板块")
    val park: String = "",
    @Schema(description = "板块Label")
    val parkLabel: String = "",
    @Schema(description = "数量")
    val groupCount: Long = 0,
    @Schema(description = "实绩")
    var actualValue: Double = 0.0,
)
