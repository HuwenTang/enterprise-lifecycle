package com.tzdig.framework.model.vo

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

@Suppress("unused")
data class IndexEnterpriseVO(
    @get:Schema(description = "指标名称")
    val index: String? = null,
    @get:Schema(description = "季度")
    val quarter: Int? = null,
    @get:Schema(description = "样本单位数量")
    val count: Int? = null,
    @get:Schema(description = "营收（亿元）")
    @get:JsonDecimal(scale = 2)
    val revenue: Float? = null,
    @JsonIgnore
    @get:Schema(description = "同比营收（亿元）")
    val revenue4tb: Float? = null,
) {
    @get:Schema(description = "同比")
    @get:JsonDecimal(scale = 2)
    val tb: Float?
        get() = if (revenue == null || revenue4tb == null || revenue <= 0 || revenue4tb <= 0) null
        else 100f * (revenue - revenue4tb) / revenue4tb
}
