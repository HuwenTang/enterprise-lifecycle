package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.LhbForeignInvestmentProjects
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class LhbForeignInvestmentProjectsExcelRow(
    @field:ExcelProperty("市（区）名称")
    var cityDistrict: String? = null,
    @field:ExcelProperty("备案项目总数")
    var totalCount: Int? = null,
    @field:ExcelProperty("外资利润再投资项目投资额（万美元）")
    var reinvestmentAmountUsd: BigDecimal? = null,
    @field:ExcelProperty("外资利润再投资项目当月新增数")
    var reinvestmentNewMonthly: Int? = null,
) : ExcelRow<LhbForeignInvestmentProjectsExcelRow>() {
    fun toLhbForeignInvestmentProjects(): LhbForeignInvestmentProjects =
        LhbForeignInvestmentProjects {
            into(this)
        }

    fun into(record: LhbForeignInvestmentProjects): LhbForeignInvestmentProjects {
        record.cityDistrict = cityDistrict
        record.totalCount = totalCount
        record.reinvestmentAmountUsd = reinvestmentAmountUsd
        record.reinvestmentNewMonthly = reinvestmentNewMonthly
        return record
    }
}
