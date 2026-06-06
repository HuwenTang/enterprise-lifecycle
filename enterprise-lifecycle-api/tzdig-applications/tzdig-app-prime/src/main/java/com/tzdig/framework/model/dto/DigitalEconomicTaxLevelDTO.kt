@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.DigitalEconomicTaxLevel
import io.swagger.v3.oas.annotations.media.Schema

data class DigitalEconomicTaxLevelDTO(
    @Schema(description = "统一社会信用代码")
    val companyCode: String?,
    @Schema(description = "公司名称")
    val companyName: String?,
    @Schema(description = "2025年7月当月开票销售档次")
    val levelThisMonth: String?,
    @Schema(description = "2025年1-7月开票销售档次")
    val levelThisYear: String?,
    @Schema(description = "市区")
    val district: String?,
) {
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
