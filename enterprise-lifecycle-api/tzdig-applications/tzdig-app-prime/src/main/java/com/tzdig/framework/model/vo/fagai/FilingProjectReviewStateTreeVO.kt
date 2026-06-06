package com.tzdig.framework.model.vo.fagai

import io.swagger.v3.oas.annotations.media.Schema

class FilingProjectReviewStateTreeVO(
    @get:Schema(description = "市（区）")
    val district: String,
    @get:Schema(description = "园区")
    val park: String,
    @get:Schema(description = "项目数")
    val count: FilingProjectItem,
    @get:Schema(description = "已完成环评")
    val environment: FilingProjectItem,
    @get:Schema(description = "未完成环评")
    val nonEnvironment: FilingProjectItem,
    @get:Schema(description = "已完成能评")
    val energy: FilingProjectItem,
    @get:Schema(description = "未完成能评")
    val nonEnergy: FilingProjectItem,
    @get:Schema(description = "已完成安评")
    val security: FilingProjectItem,
    @get:Schema(description = "未完成安评")
    val nonSecurity: FilingProjectItem,
    @get:Schema(description = "已完成施工图审查")
    val map: FilingProjectItem,
    @get:Schema(description = "未完成施工图审查")
    val nonMap: FilingProjectItem,
    @get:Schema(description = "已完成施工许可证")
    val construction: FilingProjectItem,
    @get:Schema(description = "未完成施工许可证")
    val nonConstruction: FilingProjectItem,
    @get:Schema(description = "已完成规划许可")
    val planning: FilingProjectItem,
    @get:Schema(description = "未完成规划许可")
    val nonPlanning: FilingProjectItem,
    @get:Schema(description = "children")
    val children: List<FilingProjectReviewStateTreeVO>? = emptyList(),
)
