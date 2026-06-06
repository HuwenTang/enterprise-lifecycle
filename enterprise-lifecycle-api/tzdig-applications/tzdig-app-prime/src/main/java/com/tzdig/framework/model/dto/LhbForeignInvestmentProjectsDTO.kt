package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.LhbForeignInvestmentProjects
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbForeignInvestmentProjectsDTO(
    @param:Schema(description = "市（区）名称")
    val cityDistrict: String?,
    @param:Schema(description = "备案项目总数")
    val totalCount: Int?,
    @param:Schema(description = "外资利润再投资项目投资额（万美元）")
    val reinvestmentAmountUsd: BigDecimal?,
    @param:Schema(description = "外资利润再投资项目当月新增数")
    val reinvestmentNewMonthly: Int?,
) {
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
