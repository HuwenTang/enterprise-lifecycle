@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.DigitalEconomicTaxLevel

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class DigitalEconomicTaxLevelExcelRow(
    @ExcelProperty("统一社会信用代码")
    var companyCode: String? = null,
    @ExcelProperty("公司名称")
    var companyName: String? = null,
    @ExcelProperty("2025年7月当月开票销售档次")
    var levelThisMonth: String? = null,
    @ExcelProperty("2025年1-7月开票销售档次")
    var levelThisYear: String? = null,
    @ExcelProperty("市区")
    var district: String? = null,
) : ExcelRow<DigitalEconomicTaxLevelExcelRow>() {
    fun toDigitalEconomicTaxLevel(): DigitalEconomicTaxLevel =
        DigitalEconomicTaxLevel {
            into(this)
        }

    fun into(record: DigitalEconomicTaxLevel): DigitalEconomicTaxLevel {
        record.companyCode = companyCode
        record.companyName = companyName
        record.levelThisMonth = levelThisMonth
        record.levelThisYear = levelThisYear
        record.district = district
        return record
    }
}
