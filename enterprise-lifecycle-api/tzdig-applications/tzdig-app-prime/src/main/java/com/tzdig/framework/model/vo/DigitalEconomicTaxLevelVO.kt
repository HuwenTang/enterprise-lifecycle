@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.DigitalEconomicTaxLevel
import io.swagger.v3.oas.annotations.media.Schema

data class DigitalEconomicTaxLevelVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "统一社会信用代码")
    @ExcelProperty("统一社会信用代码")
    val companyCode: String?,
    @Schema(description = "公司名称")
    @ExcelProperty("公司名称")
    val companyName: String?,
    @Schema(description = "2025年7月当月开票销售档次")
    @ExcelProperty("2025年7月当月开票销售档次")
    val levelThisMonth: String?,
    @Schema(description = "2025年1-7月开票销售档次")
    @ExcelProperty("2025年1-7月开票销售档次")
    val levelThisYear: String?,
    @Schema(description = "市区")
    @ExcelProperty("市区")
    val district: String?,
) {
    constructor(record: DigitalEconomicTaxLevel) : this(
        id = record.id,
        companyCode = record.companyCode,
        companyName = record.companyName,
        levelThisMonth = record.levelThisMonth,
        levelThisYear = record.levelThisYear,
        district = record.district,
    )
}
