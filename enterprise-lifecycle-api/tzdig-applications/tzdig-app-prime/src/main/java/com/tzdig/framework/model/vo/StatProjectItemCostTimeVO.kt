@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.StatProjectItemCostTime
import io.swagger.v3.oas.annotations.media.Schema

data class StatProjectItemCostTimeVO(
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
    @get:Schema(description = "办件编号")
    @ExcelProperty("办件编号")
    val documentNumber: String?,
    @get:Schema(description = "事项名称")
    @ExcelProperty("事项名称")
    val itemName: String?,
    @get:Schema(description = "办件状态")
    @ExcelProperty("办件状态")
    val docStatus: String?,
    @get:Schema(description = "花费时间（小时）")
    @ExcelProperty("花费时间（小时）")
    val spendTime: Long?,
) {
    constructor(record: StatProjectItemCostTime) : this(
        id = record.id,
        constructionApprovalId = record.constructionApprovalId,
        projectCode = record.projectCode,
        administrativeDivision = record.district,
        documentNumber = record.documentNumber,
        itemName = record.itemName,
        docStatus = record.docStatus,
        spendTime = record.spendTime,
    )
}
