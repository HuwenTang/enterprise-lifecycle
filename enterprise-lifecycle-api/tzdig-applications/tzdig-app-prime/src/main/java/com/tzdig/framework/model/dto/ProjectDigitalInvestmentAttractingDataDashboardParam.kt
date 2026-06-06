package com.tzdig.framework.model.dto

import io.swagger.v3.oas.annotations.media.Schema

data class ProjectDigitalInvestmentAttractingDataDashboardParam(
    @get:Schema(description = "年份")
    val year: Int? = null,
    @get:Schema(description = "开始日期")
    val currStartDate: String? = null,
    @get:Schema(description = "结束日期")
    val currEndDate: String? = null,
    @get:Schema(description = "当前日期")
    val currDate: String? = null,
    @get:Schema(description = "市区")
    val district: String? = null,
    @get:Schema(description = "园区")
    val park: String? = null,
    @get:Schema(description = "当前项目进度")
    val currentProjectProgress: List<String> = emptyList(),
    @get:Schema(description = "认定进度")
    var rProgress: List<String> = emptyList(),
    @get:Schema(description = "内资/外资")
    val projectRating: String? = null,
    @get:Schema(description = "是否已签约")
    val signedProject: Boolean? = null,
    @get:Schema(description = "投资标识")
    val investmentFlag: String? = null,
    @get:Schema(description = "投资金额")
    val investmentAmount: Double? = null,
    @get:Schema(description = "人民币投资金额下限（亿元）")
    val rmb1: Double? = null,
    @get:Schema(description = "人民币投资金额上限（亿元）")
    val rmb2: Double? = null,
    @get:Schema(description = "美元投资金额下限（万美元）")
    val dollar1: Double? = null,
    @get:Schema(description = "美元投资金额上限（万美元）")
    val dollar2: Double? = null,
    @get:Schema(description = "项目类别")
    val projectCategory: String? = null,
    @get:Schema(description = "是否显示全部", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val showAll: Boolean = true,
    @get:Schema(description = "项目类型 （工业/服务业）")
    val projectType: String? = null,
    @get:Schema(description = "是否科创 （是/否）")
    val isKcProj: String? = null,
    @get:Schema(description = "是否产业链项目")
    val isIndustryChainProject: Boolean? = null,
    @get:Schema(description = "市重点、省重大")
    val isCityKey: String? = null,
)
