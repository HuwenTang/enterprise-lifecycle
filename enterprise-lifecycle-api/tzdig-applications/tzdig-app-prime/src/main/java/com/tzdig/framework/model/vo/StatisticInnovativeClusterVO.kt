package com.tzdig.framework.model.vo

import com.mybatisflex.annotation.Table
import io.swagger.v3.oas.annotations.media.Schema

@Table("enterprise_innovative_clusters")
data class StatisticInnovativeClusterVO(
    @get:Schema(description = "名称")
    val name: String? = null,
    @get:Schema(description = "数量")
    val count: Int? = null,
    @get:Schema(description = "")
    val children: List<StatisticInnovativeClusterVO>? = null,
)
