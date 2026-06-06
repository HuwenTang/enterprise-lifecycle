@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDeptScore
import io.swagger.v3.oas.annotations.media.Schema

data class DeptScoreVO(
    @get:Schema(description = "部门名称")
    @ExcelProperty("部门名称")
    val deptName: String?,
    @get:Schema(description = "部门分类")
    @ExcelProperty("部门分类")
    val deptClass: String?,
    @get:Schema(description = "年度")
    @ExcelProperty("年度")
    val year: Int?,
    @get:Schema(description = "计分")
    @ExcelProperty("计分")
    val score: Float?,
    @get:Schema(description = "实际得分")
    @ExcelProperty("实际得分")
    val actualScore: Float?,
    @get:Schema(description = "签约得分")
    @ExcelProperty("签约得分")
    val signScore: Float?,
    @get:Schema(description = "实际签约得分")
    @ExcelProperty("实际签约得分")
    val actualSignScore: Float?,
    @get:Schema(description = "开工得分")
    @ExcelProperty("开工得分")
    val startScore: Float?,
    @get:Schema(description = "实际开工得分")
    @ExcelProperty("实际开工得分")
    val actualStartScore: Float?,
) {
    constructor(record: ProjectDeptScore) : this(
        deptName = record.deptName,
        deptClass = record.deptClass,
        year = record.year,
        score = record.score,
        actualScore = record.actualScore,
        signScore = record.signScore,
        actualSignScore = record.actualSignScore,
        startScore = record.startScore,
        actualStartScore = record.actualStartScore,
    )
}
