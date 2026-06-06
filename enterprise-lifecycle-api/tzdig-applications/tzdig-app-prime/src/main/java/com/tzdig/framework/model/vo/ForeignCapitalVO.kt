@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ForeignCapitalUtilization
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ForeignCapitalVO(
    @get:Schema(description = "新设企业数（当期）")
    @ExcelProperty("新设企业数（当期）")
    val newEnterpriseCountCurrent: Int?,
    @get:Schema(description = "合同外资累计金额")
    @ExcelProperty("合同外资累计金额")
    val contractedForeignCapitalAmount: BigDecimal?,
    @get:Schema(description = "实际使用外资金额")
    @ExcelProperty("实际使用外资金额")
    val actuallyUtilizedForeignCapitalAmount: BigDecimal?
) {
    constructor(record: ForeignCapitalUtilization) : this(
        newEnterpriseCountCurrent = record.newEnterpriseCountCurrent,
        contractedForeignCapitalAmount = record.contractedForeignCapitalAmount,
        actuallyUtilizedForeignCapitalAmount = record.actuallyUtilizedForeignCapitalAmount
    )
}
