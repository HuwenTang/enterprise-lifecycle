@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApprovalProcess
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectConstructionApprovalProcessVO(
    @get:Schema(description = "事项编码")
    @ExcelProperty("事项编码")
    val itemCode: String?,
    @get:Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @get:Schema(description = "任务名称")
    @ExcelProperty("任务名称")
    val taskName: String?,
    @get:Schema(description = "接手人")
    @ExcelProperty("接手人")
    val acceptor: String?,
    @get:Schema(description = "完成时间")
    @ExcelProperty("完成时间")
    val finishTime: LocalDateTime?,
    @get:Schema(description = "办理状态")
    @ExcelProperty("办理状态")
    val status: String?,
    @get:Schema(description = "办理意见")
    @ExcelProperty("办理意见")
    val opinion: String?,
) {
    constructor(record: ProjectConstructionApprovalProcess) : this(
        itemCode = record.itemCode,
        projectCode = record.projectCode,
        taskName = record.taskName,
        acceptor = record.acceptor,
        finishTime = record.finishTime,
        status = record.status,
        opinion = record.opinion,
    )
}
