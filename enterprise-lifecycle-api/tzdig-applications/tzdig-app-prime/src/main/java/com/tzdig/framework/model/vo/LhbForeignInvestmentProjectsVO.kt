package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.LhbForeignInvestmentProjects
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbForeignInvestmentProjectsVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市（区）名称")
    @ExcelProperty("市（区）名称")
    val cityDistrict: String?,
    @get:Schema(description = "备案项目总数")
    @ExcelProperty("备案项目总数")
    val totalCount: Int?,
    @get:Schema(description = "外资利润再投资项目投资额（万美元）")
    @ExcelProperty("外资利润再投资项目投资额（万美元）")
    val reinvestmentAmountUsd: BigDecimal?,
    @get:Schema(description = "外资利润再投资项目当月新增数")
    @ExcelProperty("外资利润再投资项目当月新增数")
    val reinvestmentNewMonthly: Int?,
) {
    constructor(record: LhbForeignInvestmentProjects) : this(
        id = record.id,
        cityDistrict = record.cityDistrict,
        totalCount = record.totalCount,
        reinvestmentAmountUsd = record.reinvestmentAmountUsd,
        reinvestmentNewMonthly = record.reinvestmentNewMonthly,
    )
}
