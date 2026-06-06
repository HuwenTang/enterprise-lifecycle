package com.tzdig.framework.util

import com.tzdig.framework.mybatis.entity.prime.EnterpriseEconomicInfo
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.util.SettingsUtils
import java.time.LocalDate

object EnterpriseEconomyUtils {
    val CURRENT_YEAR: Int
        get() = SettingsUtils["current_year"]
            ?.toIntOrNull()
            ?: LocalDate.now().year
    val CURRENT_YEAR_LAST_QUARTER: Int
        get() = SettingsUtils["current_year.last_quarter"]
            ?.toIntOrNull()
            ?: 1

    fun getLastQuarter(year: Int): Int {
        if (year < 2023) throw ApiException("无效的年份")
        if (year > CURRENT_YEAR) throw ApiException("无效的年份")
        return if (year == CURRENT_YEAR) CURRENT_YEAR_LAST_QUARTER else 4
    }

    fun getRevenueField(
        year: Int,
        quarter: Int,
    ) = when (year to quarter) {
        // 2023
        Pair(2023, 1) -> EnterpriseEconomicInfo::revenue2023Quarter1
        Pair(2023, 2) -> EnterpriseEconomicInfo::revenue2023Quarter2
        Pair(2023, 3) -> EnterpriseEconomicInfo::revenue2023Quarter3
        Pair(2023, 4) -> EnterpriseEconomicInfo::revenue2023Quarter4
        // 2024
        Pair(2024, 1) -> EnterpriseEconomicInfo::revenue2024Quarter1
        Pair(2024, 2) -> EnterpriseEconomicInfo::revenue2024Quarter2
        Pair(2024, 3) -> EnterpriseEconomicInfo::revenue2024Quarter3
        Pair(2024, 4) -> EnterpriseEconomicInfo::revenue2024Quarter4
        // 2025
        Pair(2025, 1) -> EnterpriseEconomicInfo::revenue2025Quarter1
        Pair(2025, 2) -> EnterpriseEconomicInfo::revenue2025Quarter2
        Pair(2025, 3) -> EnterpriseEconomicInfo::revenue2025Quarter3
        Pair(2025, 4) -> EnterpriseEconomicInfo::revenue2025Quarter4
        else -> null
    }
}
