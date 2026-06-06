package com.tzdig.framework.controller

import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.model.vo.ElectricIndustryRevenueVO
import com.tzdig.framework.mybatis.dao.ElectricInfoDAO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal

@Tag(name = "电子信息产业统计")
@RestController
@RequestMapping("electronic-information")
class ElectricInformationIndustryController(
    private val electricInfoDAO: ElectricInfoDAO,
) {
    @Operation(summary = "查询电子信息产业营收情况统计")
    @GetMapping
    fun getElectricInformationIndustry(
        @RequestParam year: Int,
        @RequestParam quarter: Int
    ): List<ElectricIndustryRevenueVO> {
        val areaList = AreaConstant.DISTRICT_LIST
        val totalOperatingIncome =
            electricInfoDAO.getTotalOperatingIncome("revenue_${year}_quarter_${quarter}", year, quarter)
                ?: BigDecimal.ZERO
        return areaList.map { (areaCode, areaName) ->
            val expectRevenue =
                electricInfoDAO.getExpectRevenue(areaName, "q${quarter}_operating_income", "quarterly_forecast_${year}")
                    ?: BigDecimal.ZERO
            val realRevenue =
                electricInfoDAO.getRealRevenue("revenue_${year}_quarter_${quarter}", areaCode, year, quarter)
                    ?: BigDecimal.ZERO
            ElectricIndustryRevenueVO(
                areaName,
                expectRevenue,
                realRevenue,
                if (expectRevenue == BigDecimal.ZERO) {
                    BigDecimal.ZERO
                } else {
                    realRevenue.div(expectRevenue).times(BigDecimal.valueOf(100))
                },
                totalOperatingIncome,
                if (realRevenue == BigDecimal.ZERO) {
                    BigDecimal.ZERO
                } else {
                    realRevenue.div(totalOperatingIncome).times(BigDecimal.valueOf(100))
                }
            )
        }
    }
}
