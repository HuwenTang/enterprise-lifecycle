@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.StatProjectStage
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class StatProjectStageVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "工改ID")
    @ExcelProperty("工改ID")
    val constructionApprovalId: String?,
    @get:Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @get:Schema(description = "项目地址-行政区划")
    @ExcelProperty("项目地址-行政区划")
    val administrativeDivision: String?,
    @get:Schema(description = "项目阶段")
    @ExcelProperty("项目阶段")
    val stage: String?,
    @get:Schema(description = "进入当前阶段时间")
    @ExcelProperty("进入当前阶段时间")
    val stageCreateTime: LocalDateTime?,
) {
    constructor(record: StatProjectStage) : this(
        id = record.id,
        constructionApprovalId = record.constructionApprovalId,
        projectCode = record.projectCode,
        administrativeDivision = record.district,
        stage = record.stage,
        stageCreateTime = record.stageCreateTime,
    )
}
