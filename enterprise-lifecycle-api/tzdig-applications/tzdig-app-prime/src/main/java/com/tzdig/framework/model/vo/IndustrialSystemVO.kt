package com.tzdig.framework.model.vo

import com.fasterxml.jackson.annotation.JsonIgnore
import com.mybatisflex.annotation.Table
import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

@Suppress("unused")
@Table("enterprise_info")
data class IndustrialSystemVO(
    @get:Schema(description = "产业体系")
    var industrialSystem: String? = null,
    @get:Schema(description = "产业集群")
    var innovativeCluster: String? = null,
    @get:Schema(description = "样本数量")
    var count: Long = 0,
    @get:Schema(description = "实绩")
    @get:JsonDecimal(2)
    val actualValue: Double? = null,
    @JsonIgnore
    @get:Schema(description = "同比实绩")
    val actualValue4tb: Double? = null,
    @get:Schema(description = "index")
    var index: Int = -1,
) {
    @get:Schema(description = "同比")
    @get:JsonDecimal(2)
    val tb: Double?
        get() = if (actualValue == null || actualValue4tb == null || actualValue4tb <= 0) null
        else 100f * (actualValue - actualValue4tb) / actualValue4tb
}
