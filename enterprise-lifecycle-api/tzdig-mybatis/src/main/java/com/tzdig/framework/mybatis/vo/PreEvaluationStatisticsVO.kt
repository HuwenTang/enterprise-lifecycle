package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "预评估统计VO")
data class PreEvaluationStatisticsVO(
    @get:Schema(description = "合计统计数量")
    val totalCount: Long = 0,
    
    @get:Schema(description = "评估未完成数量")
    val unfinishedCount: Long = 0,
    
    @get:Schema(description = "已全部评估数量")
    val finishedCount: Long = 0
)

@Schema(description = "部门超时统计VO")
data class DeptTimeoutVO(
    @get:Schema(description = "部门名称")
    val deptName: String?,
    
    @get:Schema(description = "超时项目数")
    val timeoutCount: Long = 0,
    
    @get:Schema(description = "未超时项目数")
    val nonTimeoutCount: Long = 0,
    
    @get:Schema(description = "部门参与的预评估项目总数")
    val totalProjectCount: Long = 0,
    
    @get:Schema(description = "超时占比百分比")
    val percentage: Double = 0.0
)
