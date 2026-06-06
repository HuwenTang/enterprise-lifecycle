@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProjectReview

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectKeyProjectReviewExcelRow(
    @field:ExcelProperty("重点项目id")
    var keyProjectId: String? = null,
    @field:ExcelProperty("完成状态")
    var status: String? = null,
    @field:ExcelProperty("项目级别")
    var keyProjectLevel: String? = null,
    @field:ExcelProperty("部门id")
    var departmentId: String? = null,
    @field:ExcelProperty("项目评价")
    var comment: String? = null,
) : ExcelRow<ProjectKeyProjectReviewExcelRow>() {
    fun toProjectKeyProjectReview(): ProjectKeyProjectReview =
        ProjectKeyProjectReview {
            into(this)
        }

    fun into(record: ProjectKeyProjectReview): ProjectKeyProjectReview {
        record.keyProjectId = keyProjectId
        record.status = status
        record.keyProjectLevel = keyProjectLevel
        record.departmentId = departmentId
        record.comment = comment
        return record
    }
}
