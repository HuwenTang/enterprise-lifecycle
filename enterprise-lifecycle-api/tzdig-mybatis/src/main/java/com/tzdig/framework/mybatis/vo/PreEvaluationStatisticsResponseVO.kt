package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "预评估统计响应VO")
data class PreEvaluationStatisticsResponseVO(
    @get:Schema(description = "统计数据")
    val statistics: PreEvaluationStatisticsVO?,
    
    @get:Schema(description = "各部门超时项目占比列表")
    val deptTimeoutList: List<DeptTimeoutVO>
)
