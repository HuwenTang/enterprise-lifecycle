@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProjectReview
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectKeyProjectReviewListVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "重点项目id")
    @ExcelProperty("重点项目id")
    val keyProjectId: String?,
    @get:Schema(description = "完成状态")
    @ExcelProperty("完成状态")
    val status: String?,
    @get:Schema(description = "项目级别")
    @ExcelProperty("项目级别")
    val keyProjectLevel: String?,
    @get:Schema(description = "部门id")
    @ExcelProperty("部门id")
    val departmentId: String?,
    @get:Schema(description = "项目评价")
    @ExcelProperty("项目评价")
    val comment: String?,
) {

    @get:Schema(description = "责任部门名称")
    @ExcelProperty("责任部门名称")
    @get:JsonLabel("key_proj_dept")
    var departmentName: String? = null
        get() = departmentId
        private set


    constructor(record: ProjectKeyProjectReview) : this(
        id = record.id,
        keyProjectId = record.keyProjectId,
        status = record.status,
        keyProjectLevel = record.keyProjectLevel,
        departmentId = record.departmentId,
        comment = record.comment,
    )
}
