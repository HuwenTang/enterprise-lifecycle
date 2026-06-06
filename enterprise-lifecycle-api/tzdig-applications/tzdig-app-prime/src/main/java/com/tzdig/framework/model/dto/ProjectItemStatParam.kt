package com.tzdig.framework.model.dto

import io.swagger.v3.oas.annotations.media.Schema

data class ProjectItemStatParam(
    @get:Schema(description = "年份")
    val year: Int?,
    @get:Schema(description = "季度")
    val quarter: Int,
    @get:Schema(description = "市（区）")
    val district: String?,
)
