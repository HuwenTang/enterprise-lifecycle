package com.tzdig.framework.model.vo.fagai

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class KeyProjectsItem(
    @get:Schema(description = "市（区）", hidden = true)
    @JsonIgnore
    val district: String = "",
    @get:Schema(description = "园区", hidden = true)
    @JsonIgnore
    val park: String = "",
    @get:Schema(description = "创新集群", hidden = true)
    @JsonIgnore
    val innovativeCluster: String = "",
    @get:Schema(description = "产业链", hidden = true)
    @JsonIgnore
    val industrialChain: String = "",
    @get:Schema(description = "数量")
    val count: Int = 0,
    @get:Schema(description = "投资额")
    @get:JsonDecimal(2)
    val amount: Double = 0.0,
) {
    constructor(list: List<KeyProjectsItem>) : this(
        count = list.sumOf { it.count },
        amount = list.sumOf { it.amount },
    )
}
