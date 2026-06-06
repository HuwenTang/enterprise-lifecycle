package com.tzdig.framework.model.vo

import com.tzdig.framework.model.vo.fagai.KeyProjectsItem
import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectNotStartVO(
    @get:Schema(description = "市（区）")
    val district: String,
    @get:Schema(description = "园区")
    val park: String,
//    @get:Schema(description = "处于在谈")
//    val inTalk: KeyProjectsItem,
    @get:Schema(description = "处于签约")
    val sign: KeyProjectsItem,
    @get:Schema(description = "处于注册")
    val register: KeyProjectsItem,
    @get:Schema(description = "处于备案")
    val record: KeyProjectsItem,
    @get:Schema(description = "处于报批")
    val approval: KeyProjectsItem,
    @get:Schema(description = "children")
    val children: List<ProjectNotStartVO>? = emptyList(),
) {
    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "市（区）名称")
    val districtName: String
        get() = district

    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "园区名称")
    val parkName: String
        get() = park

}
