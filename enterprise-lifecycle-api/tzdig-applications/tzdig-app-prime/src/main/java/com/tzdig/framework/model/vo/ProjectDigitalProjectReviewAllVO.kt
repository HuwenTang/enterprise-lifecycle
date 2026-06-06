@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.DeptConstant.FAGAI_LIST
import com.tzdig.framework.core.constant.DeptConstant.GONGXIN_LIST
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectDigitalProjectReviewAllVO(
    @get:Schema(description = "创建时间")
    @ExcelProperty("创建时间")
    val createTime: LocalDateTime?,
    @get:Schema(description = "审核步骤")
    @ExcelProperty("审核步骤")
    var step: String?,
    @get:Schema(description = "项目id")
    @ExcelProperty("项目id")
    val id: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    var projectName: String?,
    @get:Schema(description = "完成状态")
    @ExcelProperty("完成状态")
    val status: String?,
    @get:Schema(description = "审核委办局id")
    @ExcelProperty("审核委办局id")
    val cobName: String?,
    @get:Schema(description = "审核人部门名称")
    @ExcelProperty("审核人部门名称")
    val deptName: String?,
    @get:Schema(description = "审核人名称")
    @ExcelProperty("审核人名称")
    val name: String?,
    @get:Schema(description = "审核结果")
    @ExcelProperty("审核结果")
    val result: String?,
    @get:Schema(description = "审核评价")
    @ExcelProperty("审核评价")
    val comment: String?,
    @get:Schema(description = "批次")
    @ExcelProperty("批次")
    val batch: Int?,
    @get:Schema(description = "实际完成投资（亿元）")
    @ExcelProperty("实际完成投资（亿元）")
    val actualInvestment: Float?,
    @get:Schema(description = "得分")
    @ExcelProperty("得分")
    val score: Float?,
    @get:Schema(description = "记分年度")
    @ExcelProperty("记分年度")
    val year: String?,
) {
    constructor(record: ProjectDigitalProjectReviewAll) : this(
        createTime = if (record.status == "未完成") {
            record.createTime
        } else {
            record.updateTime
        },
        step = record.step?.name,
        id = record.digitalInvestmentId,
        projectName = null,
        status = record.status,
        cobName = DeptConstant.DEPARTMENT_LIST.find { it.first == record.cobId }?.second
            ?: FAGAI_LIST.find { it.first.first == record.cobId }?.second
            ?: GONGXIN_LIST.find { it.first.first == record.cobId }?.second,
        deptName = record.deptName,
        name = record.name,
        result = when (record.result) {
            "0" -> "退回"
            "1" -> "通过"
            "2" -> "不通过"
            "3" -> "不计分"
            else -> "待审核"
        },
        comment = record.comment,
        batch = record.batch,
        actualInvestment = record.completionInvestMoney,
        score = record.score,
        year = if (record.createTime!! >= LocalDateTime.of(2025, 1, 1, 0, 0, 0)
            && record.createTime!! < LocalDateTime.of(2026, 1, 8, 0, 0, 0)
        ) {
            "2025"
        } else {
            record.createTime?.year.toString()
        },
    )
}
