package com.tzdig.framework.model.vo.fagai

import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema

data class UnderConstructionProjectsTreeVO(
    @get:Schema(description = "市（区）")
    val district: String,
    @get:Schema(description = "园区")
    val park: String,
    @get:Schema(description = "本月新增")
    val increasement: KeyProjectsItem,
    @get:Schema(description = "本年累计")
    val accumulation: KeyProjectsItem,
    @get:Schema(description = "内资项目")
    val domestic: KeyProjectsItem,
    @get:Schema(description = "外资项目")
    val foreign: KeyProjectsItem,
    @get:Schema(description = "children")
    val children: List<UnderConstructionProjectsTreeVO> = emptyList(),
) {
    @Suppress("unused")
    @get:Schema(description = "市（区）")
    @get:JsonAreaName
    val districtName: String
        get() = district

    @Suppress("unused")
    @get:Schema(description = "园区")
    @get:JsonAreaName
    val parkName: String
        get() = park
}
