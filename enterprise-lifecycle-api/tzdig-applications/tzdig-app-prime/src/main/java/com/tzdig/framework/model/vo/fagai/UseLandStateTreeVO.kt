package com.tzdig.framework.model.vo.fagai

import io.swagger.v3.oas.annotations.media.Schema

class UseLandStateTreeVO(
    @get:Schema(description = "市（区）")
    val district: String,
    @get:Schema(description = "园区")
    val park: String,
    @get:Schema(description = "备案项目总数")
    val total: KeyProjectsItem,
    @get:Schema(description = "需新增用地项目")
    val increasement: KeyProjectsItem,
    @get:Schema(description = "已供土地")
    val accumulation: KeyProjectsItem,
    @get:Schema(description = "无需新增用地项目")
    val nonLandProject: KeyProjectsItem,
    @get:Schema(description = "其中：租用厂房项目")
    val factoryProject: KeyProjectsItem,
    @get:Schema(description = "children")
    val children: List<UseLandStateTreeVO> = emptyList(),
)
