package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema

data class UserAreaGrantsVO(
    @get:Schema(description = "用户ID")
    val userid: String = "",
    @get:Schema(description = "区划")
    val areas: List<AreaVO> = emptyList(),
    @get:Schema(description = "Cascader数据")
    val data4cascader: List<List<String>> = emptyList(),
)
