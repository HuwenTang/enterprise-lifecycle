@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ForeignCapitalUtilization
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ForeignCapitalUtilizationExcelRow(
    @field:ExcelProperty("地区")
    var area: String? = null,
    @field:ExcelProperty("新设企业数（当期）")
    var newEnterpriseCountCurrent: Int? = null,
    @field:ExcelProperty("新设企业数（去年同期）")
    var newEnterpriseCountLastYear: Int? = null,
    @field:ExcelProperty("合同外资累计金额")
    var contractedForeignCapitalAmount: BigDecimal? = null,
    @field:ExcelProperty("合同外资金额同比")
    var contractedForeignCapitalAmountYoY: String? = null,
    @field:ExcelProperty("合同外资占全市比重")
    var contractedShareInCityTotal: String? = null,
    @field:ExcelProperty("实际使用外资金额")
    var actuallyUtilizedForeignCapitalAmount: BigDecimal? = null,
    @field:ExcelProperty("实际使用外资金额同比")
    var actuallyUtilizedForeignCapitalAmountYoY: String? = null,
    @field:ExcelProperty("实际使用外资占全市比重")
    var auShareInCityTotal: String? = null,
    @field:ExcelProperty("实际使用外资占年度计划比重")
    var auShareInAnnualPlan: String? = null,
    @field:ExcelProperty("年")
    var year: Int? = null,
    @field:ExcelProperty("月份")
    var month: Int? = null,
    @field:ExcelProperty("数据记录关联id")
    var recordId: String? = null,
) : ExcelRow<ForeignCapitalUtilizationExcelRow>() {
    fun toForeignCapitalUtilization(): ForeignCapitalUtilization =
        ForeignCapitalUtilization {
            into(this)
        }

    fun into(record: ForeignCapitalUtilization): ForeignCapitalUtilization {
        record.area = area
        record.newEnterpriseCountCurrent = newEnterpriseCountCurrent
        record.newEnterpriseCountLastYear = newEnterpriseCountLastYear
        record.contractedForeignCapitalAmount = contractedForeignCapitalAmount
        record.contractedForeignCapitalAmountYoY = contractedForeignCapitalAmountYoY
        record.contractedShareInCityTotal = contractedShareInCityTotal
        record.actuallyUtilizedForeignCapitalAmount = actuallyUtilizedForeignCapitalAmount
        record.actuallyUtilizedForeignCapitalAmountYoY = actuallyUtilizedForeignCapitalAmountYoY
        record.auShareInCityTotal = auShareInCityTotal
        record.auShareInAnnualPlan = auShareInAnnualPlan
        record.year = year
        record.month = month
        record.recordId = recordId
        return record
    }
}
