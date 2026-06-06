package com.tzdig.framework.mybatis.bo

import io.swagger.v3.oas.annotations.media.Schema

data class StageOverViewDeptGroupBO(
    @get:Schema(description = "部门名称")
    val approvalDepartment: String,
    @get:Schema(description = "办件数量")
    val documentCount: Int,
    @get:Schema(description = "平均时长")
    val avgDuration: Double,
)
