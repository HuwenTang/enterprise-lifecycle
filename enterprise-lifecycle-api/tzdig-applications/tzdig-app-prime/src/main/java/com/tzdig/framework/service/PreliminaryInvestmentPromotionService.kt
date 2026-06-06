package com.tzdig.framework.service

import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.web.bind.annotation.RequestParam

interface PreliminaryInvestmentPromotionService {
    fun getStatisticsSignedProjectInfo(
        @Schema(description = "金额")
        @RequestParam(required = false) rmb: Int?,
        @Schema(description = "人民币下限（亿元人民币）")
        @RequestParam(required = false) rmb1: Double?,
        @Schema(description = "人民币上限（亿元人民币）")
        @RequestParam(required = false) rmb2: Double?,
        @Schema(description = "开始日期")
        @RequestParam(defaultValue = "2024-01-01") currStartDate: String,
        @Schema(description = "结束日期")
        @RequestParam(defaultValue = "2026-01-01") currEndDate: String,
        @Schema(description = "当前日期")
        @RequestParam(defaultValue = "2025-10-01") currDate: String,
        @Schema(description = "年度")
        @RequestParam(defaultValue = "2025") year: String,
        @Schema(description = "投资方")
        @RequestParam(required = false) investor: String?,
        @Schema(description = "投资方类型（10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它）")
        @RequestParam(required = false) investorType: String?,
        @Schema(description = "投资注册地（90-香港 ,100-台湾,110-日本,120-韩国,130-美国,140-欧洲,150-新加坡,80-外资其他，" +
                "10 北京，20 上海，30 广州，40 深圳，50 苏州，60 长三角其他城市，70 内资其他）")
        @RequestParam(required = false) investorPlace: String?,
        @Schema(description = "是否上市 （1 是 2 否）")
        @RequestParam(required = false) isListed: String?,
        @Schema(description = "1-服务业 2-制造业")
        @RequestParam(required = false) industry: String?,
        @Schema(description = "是否科创 （是/否）")
        @RequestParam(required = false) isKcProj: String?,
        @Schema(description = "重点项目(市重点/省重大)")
        @RequestParam(required = false) isMainProj: String?,
    ): List<Map<String, Any>>

    fun getStatisticsSignedProjectZoneInfo(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        currDate: String,
        year: String,
        zoneCode: String,
        investor: String?,
        investorType: String?,
        investorPlace: String?,
        isListed: String?,
        industry: String?,
        isKcProj: String?,
        isMainProj: String?
    ) : List<Map<String, Any>>

    fun getStatisticsProjectStatusInfo(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        investor: String?,
        investorType: String?,
        investorPlace: String?,
        isListed: String?,
        industry: String?,
        isKcProj: String?,
        isMainProj: String?
    ) : List<Map<String, Any>>

    fun getStatisticsProjectStatusZoneInfo(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        zoneCode : String,
        investor: String?,
        investorType: String?,
        investorPlace: String?,
        isListed: String?,
        industry: String?,
        isKcProj: String?,
        isMainProj: String?
    ) : List<Map<String, Any>>

    fun getCountSignedProjTypeByLevel(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        currDate: String,
        level: Int,
        code: String?,
        isMainProj: String?
    ) : List<Map<String, Any>>

}
