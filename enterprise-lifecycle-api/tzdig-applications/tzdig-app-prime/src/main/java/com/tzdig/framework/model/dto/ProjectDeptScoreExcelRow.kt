@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectDeptScore

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectDeptScoreExcelRow(
    @field:ExcelProperty("部门名称")
    var deptName: String? = null,
    @field:ExcelProperty("部门id")
    var deptId: String? = null,
    @field:ExcelProperty("部门分类")
    var deptClass: String? = null,
    @field:ExcelProperty("年度")
    var year: Int? = null,
    @field:ExcelProperty("计分")
    var score: Float? = null,
    @field:ExcelProperty("实际得分")
    var actualScore: Float? = null,
    @field:ExcelProperty("签约得分")
    var signScore: Float? = null,
    @field:ExcelProperty("实际签约得分")
    var actualSignScore: Float? = null,
    @field:ExcelProperty("开工得分")
    var startScore: Float? = null,
    @field:ExcelProperty("实际开工得分")
    var actualStartScore: Float? = null,
) : ExcelRow<ProjectDeptScoreExcelRow>() {
    fun toProjectDeptScore(): ProjectDeptScore =
        ProjectDeptScore {
            into(this)
        }

    fun into(record: ProjectDeptScore): ProjectDeptScore {
        record.deptName = deptName
        record.deptId = deptId
        record.deptClass = deptClass
        record.year = year
        record.score = score
        record.actualScore = actualScore
        record.signScore = signScore
        record.actualSignScore = actualSignScore
        record.startScore = startScore
        record.actualStartScore = actualStartScore
        return record
    }
}
