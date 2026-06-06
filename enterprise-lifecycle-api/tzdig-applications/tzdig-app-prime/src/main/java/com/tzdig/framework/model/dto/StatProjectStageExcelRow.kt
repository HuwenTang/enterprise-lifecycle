@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.StatProjectStage
import java.time.LocalDateTime

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class StatProjectStageExcelRow(
    @field:ExcelProperty("工改ID")
    var constructionApprovalId: String? = null,
    @field:ExcelProperty("项目代码")
    var projectCode: String? = null,
    @field:ExcelProperty("项目地址-行政区划")
    var administrativeDivision: String? = null,
    @field:ExcelProperty("项目阶段")
    var stage: String? = null,
    @field:ExcelProperty("进入当前阶段时间")
    var stageCreateTime: LocalDateTime? = null,
) : ExcelRow<StatProjectStageExcelRow>() {
    fun toStatProjectStage(): StatProjectStage =
        StatProjectStage {
            into(this)
        }

    fun into(record: StatProjectStage): StatProjectStage {
        record.constructionApprovalId = constructionApprovalId
        record.projectCode = projectCode
        record.district = administrativeDivision
        record.stage = stage
        record.stageCreateTime = stageCreateTime
        return record
    }
}
