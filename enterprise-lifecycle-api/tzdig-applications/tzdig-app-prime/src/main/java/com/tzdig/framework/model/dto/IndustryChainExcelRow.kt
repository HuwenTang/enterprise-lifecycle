@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.IndustryChain

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class IndustryChainExcelRow(
    @ExcelProperty("产业集群分类")
    var cluster: String? = null,
    @ExcelProperty("所属产业链")
    var chains: String? = null,
    @ExcelProperty("企业数量")
    var companyNumber: Int? = null,
    @ExcelProperty("本期产值")
    var output: Float? = null,
    @ExcelProperty("产值增长 （%）")
    var outputIncrement: Float? = null,
    @ExcelProperty("本期营收（亿元）")
    var revenue: Float? = null,
    @ExcelProperty("营收增长(%)")
    var revenueIncrement: Float? = null,
    @ExcelProperty("本期利润")
    var profit: Float? = null,
    @ExcelProperty("利润增长（%）")
    var profitIncrement: Float? = null,
) : ExcelRow<IndustryChainExcelRow>() {
    fun toIndustryChain(): IndustryChain =
        IndustryChain {
            into(this)
        }

    fun into(record: IndustryChain): IndustryChain {
        record.cluster = cluster
        record.chains = chains
        record.companyNumber = companyNumber
        record.output = output
        record.outputIncrement = outputIncrement
        record.revenue = revenue
        record.revenueIncrement = revenueIncrement
        record.profit = profit
        record.profitIncrement = profitIncrement
        return record
    }
}
