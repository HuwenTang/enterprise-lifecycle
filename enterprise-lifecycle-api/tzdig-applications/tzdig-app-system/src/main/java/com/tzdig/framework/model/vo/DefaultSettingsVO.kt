package com.tzdig.framework.model.vo

import com.tzdig.framework.web.util.SettingsUtils
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

@Suppress("unused")
object DefaultSettingsVO {
    @get:Schema(description = "系统名称")
    val name: String =
        SettingsUtils["name"] ?: ""

    @get:Schema(description = "系统图标")
    val logo: String =
        SettingsUtils["logo"] ?: ""

    @get:Schema(description = "当前年份")
    val currentYear: Int =
        SettingsUtils["current_year"]?.toIntOrNull() ?: LocalDate.now().year

    @get:Schema(description = "当前年份最后一季度")
    val currentYearLastQuarter: Int =
        SettingsUtils["current_year.last_quarter"]?.toIntOrNull() ?: 1
}
