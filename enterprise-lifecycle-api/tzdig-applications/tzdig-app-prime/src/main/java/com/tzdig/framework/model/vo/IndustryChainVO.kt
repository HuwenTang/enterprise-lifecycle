@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.IndustryChain
import io.swagger.v3.oas.annotations.media.Schema

data class IndustryChainVO(
//    @Schema(description = "产业集群分类")
//    @ExcelProperty("产业集群分类")
//    val cluster: String?,
    @Schema(description = "所属产业链")
    @ExcelProperty("所属产业链")
    val chains: String?,
    @Schema(description = "企业数量")
    @ExcelProperty("企业数量")
    val companyNumber: Int?,
    @Schema(description = "本期产值")
    @ExcelProperty("本期产值")
    val output: Float?,
    @Schema(description = "产值增长 （%）")
    @ExcelProperty("产值增长 （%）")
    val outputIncrement: Float?,
    @Schema(description = "本期营收（亿元）")
    @ExcelProperty("本期营收（亿元）")
    val revenue: Float?,
    @Schema(description = "营收增长(%)")
    @ExcelProperty("营收增长(%)")
    val revenueIncrement: Float?,
    @Schema(description = "本期利润")
    @ExcelProperty("本期利润")
    val profit: Float?,
    @Schema(description = "利润增长（%）")
    @ExcelProperty("利润增长（%）")
    val profitIncrement: Float?,
) {
    constructor(record: IndustryChain) : this(
//        cluster = record.cluster,
        chains = record.chains,
        companyNumber = record.companyNumber,
        output = record.output,
        outputIncrement = record.outputIncrement,
        revenue = record.revenue,
        revenueIncrement = record.revenueIncrement,
        profit = record.profit,
        profitIncrement = record.profitIncrement,
    )
}
