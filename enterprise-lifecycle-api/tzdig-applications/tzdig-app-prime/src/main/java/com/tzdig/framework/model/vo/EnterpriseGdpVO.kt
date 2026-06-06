package com.tzdig.framework.model.vo

import com.fasterxml.jackson.annotation.JsonIgnore
import com.mybatisflex.annotation.Table
import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

@Table("enterprise_info")
data class EnterpriseGdpVO(
    @get:Schema(description = "统一社会信用代码")
    val uscc: String = "",
    @get:Schema(description = "企业名称")
    val name: String = "",
    @get:Schema(description = "板块")
    val park: String = "",
    @get:Schema(description = "板块Label")
    val parkLabel: String = "",
    @get:Schema(description = "实绩")
    @get:JsonDecimal(2)
    val actualValue: Float? = null,
    @JsonIgnore
    @get:Schema(description = "同比实绩")
    val actualValue4tb: Float? = null,
) {
    @Suppress("unused")
    @get:Schema(description = "同比")
    @get:JsonDecimal(2)
    val tb: Float?
        get() = if (actualValue == null || actualValue4tb == null || actualValue4tb <= 0) null
        else 100f * (actualValue - actualValue4tb) / actualValue4tb
}
