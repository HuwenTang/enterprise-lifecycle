package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.SystemArea
import io.swagger.v3.oas.annotations.media.Schema

data class AreaVO(
    @get:Schema(description = "区划代码")
    val id: String,
    @get:Schema(description = "区划名称")
    val name: String,
    @get:Schema(description = "区划级别")
    val level: Short,
    @get:Schema(description = "招商系统部门编号")
    val zsDept: String? = null,
) {
    constructor(record: SystemArea) : this(
        id = record.id!!,
        name = record.name!!,
        level = record.level!!,
        zsDept = record.zsDept,
    )
}
