@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.DeptConstant.FAGAI_LIST
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectReviewAllStatisticVO(
    @get:Schema(description = "审核委办局id")
    @ExcelProperty("审核委办局id")
    val cobName: String?,
    @get:Schema(description = "审核结果")
    @ExcelProperty("审核结果")
    val result: String?,
    @get:Schema(description = "审核评价")
    @ExcelProperty("审核评价")
    val comment: String?,
) {
    constructor(record: ProjectDigitalProjectReviewAll) : this(
        cobName = DeptConstant.DEPARTMENT_LIST.find { it.first == record.cobId }?.second
            ?: FAGAI_LIST.find { it.first.first == record.cobId }?.second,
        result = when (record.result) {
            "0" -> "退回"
            "1" -> "通过"
            "2" -> "未通过"
            "3" -> "不计分"
            else -> "待审核"
        },
        comment = record.comment,
    )
}
