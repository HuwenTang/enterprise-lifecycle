package com.tzdig.framework.model.dto

import io.swagger.v3.oas.annotations.media.Schema

data class ProjectStatParam(
    @get:Schema(description = "年月/yyyy-MM")
    val month: String,
)
