@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.DeptConstant.FAGAI_LIST
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectScoreVO(
    @get:Schema(description = "创建时间")
    @ExcelProperty("创建时间")
    val createTime: LocalDateTime?,
    @get:Schema(description = "记分事件")
    @ExcelProperty("记分事件")
    var step: String?,
    @get:Schema(description = "完成状态")
    @ExcelProperty("完成状态")
    val status: String?,
    @get:Schema(description = "项目id")
    @ExcelProperty("项目id")
    val projectId: String?,
    @get:Schema(description = "审核委办局id")
    @ExcelProperty("审核委办局id")
    var cobName: String?,
    @get:Schema(description = "审核人部门名称")
    @ExcelProperty("审核人部门名称")
    val deptName: String?,
    @get:Schema(description = "审核人名称")
    @ExcelProperty("审核人名称")
    val name: String?,
    @get:Schema(description = "计分状态")
    @ExcelProperty("计分状态")
    val result: String?,
    @get:Schema(description = "审核评价")
    @ExcelProperty("审核评价")
    val comment: String?,
    @get:Schema(description = "得分")
    @ExcelProperty("得分")
    val score: Float?,
    @get:Schema(description = "所属板块")
    @ExcelProperty("所属板块")
    var park: String?,
    @get:Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    var type: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    var projectName: String?,
    @get:Schema(description = "招引部门")
    @ExcelProperty("招引部门")
    var attractDept: String?,
    @get:Schema(description = "部门类别")
    @ExcelProperty("部门类别")
    var deptType: String?,
    @get:Schema(description = "是否科创项目")
    @ExcelProperty("是否科创项目")
    var isKc: String?,
    @get:Schema(description = "年份")
    @ExcelProperty("年份")
    var year: String?
) {
    constructor(record: ProjectDigitalProjectReviewAll) : this(
        createTime = record.createTime,
        step = record.step?.name,
        status = record.status,
        projectId = record.digitalInvestmentId,
        cobName = DeptConstant.DEPARTMENT_LIST.find { it.first == record.cobId }?.second
            ?: FAGAI_LIST.find { it.first.first == record.cobId }?.second,
        deptName = record.deptName,
        name = record.name,
        result = when (record.result) {
            "0" -> "退回"
            "1" -> "通过"
            "2" -> "未通过"
            "3" -> "不计分"
            else -> "待审核"
        },
        comment = record.comment,
        score = record.score ?: 0f,
        park = null,
        type = null,
        projectName = null,
        attractDept = null,
        deptType = null,
        isKc = null,
        year =
            if (record.createTime!! >= LocalDateTime.of(2025, 1, 1, 0, 0, 0)
                && record.createTime!! < LocalDateTime.of(2026, 1, 8, 0, 0, 0)
            ) {
                "2025"
            } else {
                record.createTime?.year.toString()
            },
    )
}
