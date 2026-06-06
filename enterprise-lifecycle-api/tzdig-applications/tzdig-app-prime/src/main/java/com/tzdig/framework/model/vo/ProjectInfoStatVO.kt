package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema

data class ProjectInfoStatVO(

    @get:Schema(description = "合计统计数量")
    val totalCount: Long? = null,
    @get:Schema(description = "未完成数量")
    val unfinishedCount: Long? = null,
    @get:Schema(description = "已完成数量")
    val finishedCount: Long? = null,
)
