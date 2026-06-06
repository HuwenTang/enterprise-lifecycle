@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.StatProjectItemCostTime

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class StatProjectItemCostTimeExcelRow(
    @field:ExcelProperty("工改ID")
    var constructionApprovalId: String? = null,
    @field:ExcelProperty("项目代码")
    var projectCode: String? = null,
    @field:ExcelProperty("项目地址-行政区划")
    var administrativeDivision: String? = null,
    @field:ExcelProperty("办件编号")
    var documentNumber: String? = null,
    @field:ExcelProperty("事项名称")
    var itemName: String? = null,
    @field:ExcelProperty("办件状态")
    var docStatus: String? = null,
    @field:ExcelProperty("花费时间（小时）")
    var spendTime: Long? = null,
) : ExcelRow<StatProjectItemCostTimeExcelRow>() {
    fun toStatProjectItemCostTime(): StatProjectItemCostTime =
        StatProjectItemCostTime {
            into(this)
        }

    fun into(record: StatProjectItemCostTime): StatProjectItemCostTime {
        record.constructionApprovalId = constructionApprovalId
        record.projectCode = projectCode
        record.district = administrativeDivision
        record.documentNumber = documentNumber
        record.itemName = itemName
        record.docStatus = docStatus
        record.spendTime = spendTime
        return record
    }
}
