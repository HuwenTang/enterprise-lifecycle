package com.tzdig.framework.model.vo.fagai

import io.swagger.v3.oas.annotations.media.Schema

data class filingStatVO(
    @get:Schema(description = "新备案项目本月")
    val month: Long,
    @get:Schema(description = "新备案项目本月")
    val year: Long,
    @get:Schema(description = "累计备案总投资")
    val total: Double,
    @get:Schema(description = "需新增用地项目")
    val needAddLand: Long = 0,
    @get:Schema(description = "已取得土地")
    val land: Long = 0,
    @get:Schema(description = "无需新增用地项目")
    val noNeedAddLand: Long = 0,
    @get:Schema(description = "环评")
    val environment: Long = 0,
    @get:Schema(description = "能评")
    val energy: Long = 0,
    @get:Schema(description = "安评")
    val security: Long = 0,
    @get:Schema(description = "施工图审查")
    val map: Long = 0,
    @get:Schema(description = "施工许可证")
    val construction: Long = 0,
    @get:Schema(description = "工业项目")
    val industry: Long = 0,
    @get:Schema(description = "工业项目备案总投资")
    val total2: Double,
    @get:Schema(description = "重点链群项目数")
    val keyIndustry: Long = 0,
    @get:Schema(description = "链群项目备案总投资")
    val total3: Double,
)
