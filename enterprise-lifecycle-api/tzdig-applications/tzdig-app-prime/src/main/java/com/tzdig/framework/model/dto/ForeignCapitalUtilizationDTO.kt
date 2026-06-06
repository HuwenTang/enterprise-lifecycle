@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ForeignCapitalUtilization
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ForeignCapitalUtilizationDTO(
    @param:Schema(description = "地区")
    val area: String?,
    @param:Schema(description = "新设企业数（当期）")
    val newEnterpriseCountCurrent: Int?,
    @param:Schema(description = "新设企业数（去年同期）")
    val newEnterpriseCountLastYear: Int?,
    @param:Schema(description = "合同外资累计金额")
    val contractedForeignCapitalAmount: BigDecimal?,
    @param:Schema(description = "合同外资金额同比")
    val contractedForeignCapitalAmountYoY: String?,
    @param:Schema(description = "合同外资占全市比重")
    val contractedShareInCityTotal: String?,
    @param:Schema(description = "实际使用外资金额")
    val actuallyUtilizedForeignCapitalAmount: BigDecimal?,
    @param:Schema(description = "实际使用外资金额同比")
    val actuallyUtilizedForeignCapitalAmountYoY: String?,
    @param:Schema(description = "实际使用外资占全市比重")
    val auShareInCityTotal: String?,
    @param:Schema(description = "实际使用外资占年度计划比重")
    val auShareInAnnualPlan: String?,
    @param:Schema(description = "年")
    val year: Int?,
    @param:Schema(description = "月份")
    val month: Int?,
    @param:Schema(description = "数据记录关联id")
    val recordId: String?,
) {
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
