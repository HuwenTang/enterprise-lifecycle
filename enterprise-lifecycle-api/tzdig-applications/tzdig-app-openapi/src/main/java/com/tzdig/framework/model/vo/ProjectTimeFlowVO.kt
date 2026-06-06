package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectTimeFlowVO(
    @get:Schema(description = "是否为主节点")
    val isPrimary: Boolean,
    @get:Schema(description = "项目进展")
    val progress: String,
    @get:Schema(description = "标题")
    var title: String,
    @get:Schema(description = "时间")
    val time: LocalDateTime?,
    @get:Schema(description = "审核人名称")
    val name: String? = null,
    @get:Schema(description = "审核结果")
    val result: String? = null,
    @get:Schema(description = "审核评价")
    val comment: String? = null,
    @get:Schema(description = "是否完成")
    val completed: Boolean? = null,
)
