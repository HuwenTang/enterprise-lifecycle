package com.tzdig.framework.mybatis.bo

import io.swagger.v3.oas.annotations.media.Schema

data class CheckRankBO(
    @Schema(description = "企业")
    val company: String? = null,
    @Schema(description = "发起部门")
    val depart: String? = null,
    @Schema(description = "检查次数")
    val checkTimes: Int? = 0,
    @Schema(description = "占比")
    val proportion: Double? = 0.0,
)
