@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ForeignCapitalUtilization
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ForeignCapitalUtilizationVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "地区")
    @ExcelProperty("地区")
    val area: String?,
    @get:Schema(description = "新设企业数（当期）")
    @ExcelProperty("新设企业数（当期）")
    val newEnterpriseCountCurrent: Int?,
    @get:Schema(description = "新设企业数（去年同期）")
    @ExcelProperty("新设企业数（去年同期）")
    val newEnterpriseCountLastYear: Int?,
    @get:Schema(description = "合同外资累计金额")
    @ExcelProperty("合同外资累计金额")
    val contractedForeignCapitalAmount: BigDecimal?,
    @get:Schema(description = "合同外资金额同比")
    @ExcelProperty("合同外资金额同比")
    val contractedForeignCapitalAmountYoY: String?,
    @get:Schema(description = "合同外资占全市比重")
    @ExcelProperty("合同外资占全市比重")
    val contractedShareInCityTotal: String?,
    @get:Schema(description = "实际使用外资金额")
    @ExcelProperty("实际使用外资金额")
    val actuallyUtilizedForeignCapitalAmount: BigDecimal?,
    @get:Schema(description = "实际使用外资金额同比")
    @ExcelProperty("实际使用外资金额同比")
    val actuallyUtilizedForeignCapitalAmountYoY: String?,
    @get:Schema(description = "实际使用外资占全市比重")
    @ExcelProperty("实际使用外资占全市比重")
    val auShareInCityTotal: String?,
    @get:Schema(description = "实际使用外资占年度计划比重")
    @ExcelProperty("实际使用外资占年度计划比重")
    val auShareInAnnualPlan: String?,
    @get:Schema(description = "年")
    @ExcelProperty("年")
    val year: Int?,
    @get:Schema(description = "月份")
    @ExcelProperty("月份")
    val month: Int?,
    @get:Schema(description = "数据记录关联id")
    @ExcelProperty("数据记录关联id")
    val recordId: String?,
) {
    constructor(record: ForeignCapitalUtilization) : this(
        id = record.id,
        area = record.area,
        newEnterpriseCountCurrent = record.newEnterpriseCountCurrent,
        newEnterpriseCountLastYear = record.newEnterpriseCountLastYear,
        contractedForeignCapitalAmount = record.contractedForeignCapitalAmount,
        contractedForeignCapitalAmountYoY = record.contractedForeignCapitalAmountYoY,
        contractedShareInCityTotal = record.contractedShareInCityTotal,
        actuallyUtilizedForeignCapitalAmount = record.actuallyUtilizedForeignCapitalAmount,
        actuallyUtilizedForeignCapitalAmountYoY = record.actuallyUtilizedForeignCapitalAmountYoY,
        auShareInCityTotal = record.auShareInCityTotal,
        auShareInAnnualPlan = record.auShareInAnnualPlan,
        year = record.year,
        month = record.month,
        recordId = record.recordId,
    )
}
