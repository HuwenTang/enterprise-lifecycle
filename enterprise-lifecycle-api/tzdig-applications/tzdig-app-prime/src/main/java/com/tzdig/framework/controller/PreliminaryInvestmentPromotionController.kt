package com.tzdig.framework.controller

import com.tzdig.framework.service.PreliminaryInvestmentPromotionService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import okhttp3.OkHttpClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "前期招商数据查询接口")
@RestController
@RequestMapping("preliminary-investment-promotion")
class PreliminaryInvestmentPromotionController(private val okHttpClient: OkHttpClient,
                                               private val preliminaryInvestmentPromotionService: PreliminaryInvestmentPromotionService,) {

    @Operation(summary = "全市新签约项目情况")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("statisticsSignedProjectInfo")
    fun statisticsSignedProjectInfo(
        @Schema(description = "金额")
        @RequestParam(required = false) rmb: Int?,
        @Schema(description = "人民币下限（亿元人民币）")
        @RequestParam(required = false) rmb1: Double?,
        @Schema(description = "人民币上限（亿元人民币）")
        @RequestParam(required = false) rmb2: Double?,
        @Schema(description = "开始日期")
        @RequestParam(defaultValue = "2025-01-01") currStartDate: String,
        @Schema(description = "结束日期")
        @RequestParam(defaultValue = "2026-01-01") currEndDate: String,
        @Schema(description = "当前日期")
        @RequestParam(defaultValue = "2025-11-01") currDate: String,
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
        @Schema(description = "服务业/工业")
        @RequestParam(required = false) industry: String?,
        @Schema(description = "是否科创 （是/否）")
        @RequestParam(required = false) isKcProj: String?,
        @Schema(description = "重点项目(市重点/省重大)")
        @RequestParam(required = false) isMainProj: String?,
    ): List<Map<String, Any>> {
        /*val requestBody = mapOf(
            "rmb" to rmb,
            "rmb1" to rmb1,
            "rmb2" to rmb2,
            "doller1" to doller1,
            "doller2" to doller2,
            "currStartDate" to currStartDate,
            "currEndDate" to currEndDate,
            "currDate" to currDate,
            "year" to year,
            "investor" to investor,
            "investorType" to investorType,
            "investorPlace" to investorPlace,
            "isListed" to isListed,
            "industry" to industry,
            "isKcProj" to isKcProj,
        ).toJsonRequest()
        val request = Request.Builder()
            .url("http://172.22.26.71:8003/api/proj/project/signed/statisticsSignedProjectInfo")
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()*/

        val list = preliminaryInvestmentPromotionService.getStatisticsSignedProjectInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            currDate = currDate,
            year = year,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            isMainProj = isMainProj
        )

        return list
    }

    @Operation(summary = "新签约项目园区数据查询")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("statisticsSignedProjectZoneInfo")
    fun statisticsSignedProjectZoneInfo(
        @Schema(description = "金额")
        @RequestParam(required = false) rmb: Int?,
        @Schema(description = "人民币下限（亿元人民币）")
        @RequestParam(required = false) rmb1: Double?,
        @Schema(description = "人民币上限（亿元人民币）")
        @RequestParam(required = false) rmb2: Double?,
        @Schema(description = "开始日期")
        @RequestParam(defaultValue = "2025-01-01") currStartDate: String,
        @Schema(description = "结束日期")
        @RequestParam(defaultValue = "2025-08-01") currEndDate: String,
        @Schema(description = "当月第一天")
        @RequestParam(defaultValue = "2025-10-01") currDate: String,
        @Schema(description = "年度")
        @RequestParam(defaultValue = "2025") year: String,
        @Schema(description = "区县编码")
        @RequestParam(defaultValue = "001001") zoneCode: String,
        @Schema(description = "投资方")
        @RequestParam(required = false) investor: String?,
        @Schema(description = "投资方类型（10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它）")
        @RequestParam(required = false) investorType: String?,
        @Schema(description = "投资注册地（90-香港 ,100-台湾,110-日本,120-韩国,130-美国,140-欧洲,150-新加坡,80-外资其他，" +
                "10 北京，20 上海，30 广州，40 深圳，50 苏州，60 长三角其他城市，70 内资其他）")
        @RequestParam(required = false) investorPlace: String?,
        @Schema(description = "是否上市 （1 是 2 否）")
        @RequestParam(required = false) isListed: String?,
        @Schema(description = "服务业/工业")
        @RequestParam(required = false) industry: String?,
        @Schema(description = "是否科创 （是/否）")
        @RequestParam(required = false) isKcProj: String?,
        @Schema(description = "重点项目(市重点/省重大)")
        @RequestParam(required = false) isMainProj: String?,
    ): List<Map<String, Any>> {
       /* val requestBody = mapOf(
            "rmb" to rmb,
            "rmb1" to rmb1,
            "rmb2" to rmb2,
            "currStartDate" to currStartDate,
            "currEndDate" to currEndDate,
            "currDate" to currDate,
            "year" to year,
            "zoneCode" to zoneCode,
            "investor" to investor,
            "investorType" to investorType,
            "investorPlace" to investorPlace,
            "isListed" to isListed,
            "industry" to industry,
            "isKcProj" to isKcProj,
        ).toJsonRequest()
        val request = Request.Builder()
            .url("http://172.22.26.71:8003/api/proj/project/signed/statisticsSignedProjectZoneInfo")
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()*/

        val list = preliminaryInvestmentPromotionService.getStatisticsSignedProjectZoneInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            currDate = currDate,
            year = year,
            zoneCode = zoneCode,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            isMainProj = isMainProj
        )

        return list
    }

    @Operation(summary = "全市新签约进度情况")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("statisticsProjectStatusInfo")
    fun statisticsProjectStatusInfo(
        @Schema(description = "金额")
        @RequestParam(required = false) rmb: Int?,
        @Schema(description = "人民币下限（亿元人民币）")
        @RequestParam(required = false) rmb1: Double?,
        @Schema(description = "人民币上限（亿元人民币）")
        @RequestParam(required = false) rmb2: Double?,
        @Schema(description = "开始日期")
        @RequestParam(defaultValue = "2025-01-01") currStartDate: String,
        @Schema(description = "结束日期")
        @RequestParam(defaultValue = "2025-12-31") currEndDate: String,
        @Schema(description = "投资方")
        @RequestParam(required = false) investor: String?,
        @Schema(description = "投资方类型（10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它）")
        @RequestParam(required = false) investorType: String?,
        @Schema(description = "投资注册地（90-香港 ,100-台湾,110-日本,120-韩国,130-美国,140-欧洲,150-新加坡,80-外资其他，" +
                "10 北京，20 上海，30 广州，40 深圳，50 苏州，60 长三角其他城市，70 内资其他）")
        @RequestParam(required = false) investorPlace: String?,
        @Schema(description = "是否上市 （1 是 2 否）")
        @RequestParam(required = false) isListed: String?,
        @Schema(description = "服务业/工业")
        @RequestParam(required = false) industry: String?,
        @Schema(description = "是否科创 （是/否）")
        @RequestParam(required = false) isKcProj: String?,
        @Schema(description = "重点项目(市重点/省重大)")
        @RequestParam(required = false) isMainProj: String?,
    ): List<Map<String, Any>> {
       /* val requestBody = mapOf(
            "rmb" to rmb,
            "rmb1" to rmb1,
            "rmb2" to rmb2,
            "currStartDate" to currStartDate,
            "currEndDate" to currEndDate,
            "investor" to investor,
            "investorType" to investorType,
            "investorPlace" to investorPlace,
            "isListed" to isListed,
            "industry" to industry,
            "isKcProj" to isKcProj,
        ).toJsonRequest()
        val request = Request.Builder()
            .url("http://172.22.26.71:8003/api/proj/project/signed/statisticsProjectStatusInfo")
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()*/
        val list = preliminaryInvestmentPromotionService.getStatisticsProjectStatusInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            isMainProj = isMainProj
        )

        return list
    }

    @Operation(summary = "全市新签约进度情况园区查询")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("statisticsProjectStatusZoneInfo")
    fun statisticsProjectStatusZoneInfo(
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
        @Schema(description = "区县编码")
        @RequestParam(defaultValue = "001001") zoneCode: String,
        @Schema(description = "投资方")
        @RequestParam(required = false) investor: String?,
        @Schema(description = "投资方类型（10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它）")
        @RequestParam(required = false) investorType: String?,
        @Schema(description = "投资注册地（90-香港 ,100-台湾,110-日本,120-韩国,130-美国,140-欧洲,150-新加坡,80-外资其他，" +
                "10 北京，20 上海，30 广州，40 深圳，50 苏州，60 长三角其他城市，70 内资其他）")
        @RequestParam(required = false) investorPlace: String?,
        @Schema(description = "是否上市 （1 是 2 否）")
        @RequestParam(required = false) isListed: String?,
        @Schema(description = "服务业/工业")
        @RequestParam(required = false) industry: String?,
        @Schema(description = "是否科创 （是/否）")
        @RequestParam(required = false) isKcProj: String?,
        @Schema(description = "重点项目(市重点/省重大)")
        @RequestParam(required = false) isMainProj: String?,
    ): List<Map<String, Any>> {
       /* val requestBody = mapOf(
            "rmb" to rmb,
            "rmb1" to rmb1,
            "rmb2" to rmb2,
            "doller1" to doller1,
            "doller2" to doller2,
            "currStartDate" to currStartDate,
            "currEndDate" to currEndDate,
            "zoneCode" to zoneCode,
            "investor" to investor,
            "investorType" to investorType,
            "investorPlace" to investorPlace,
            "isListed" to isListed,
            "industry" to industry,
            "isKcProj" to isKcProj,
        ).toJsonRequest()
        val request = Request.Builder()
            .url("http://172.22.26.71:8003/api/proj/project/signed/statisticsProjectStatusZoneInfo")
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()*/
        val list = preliminaryInvestmentPromotionService.getStatisticsProjectStatusZoneInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            zoneCode = zoneCode,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            isMainProj = isMainProj
        )

        return list
    }


   /* @Operation(summary = "“四重”工作产业链项目招引情况")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("countSignedProjType")
    fun countSignedProjType(
        @Schema(description = "金额")
        @RequestParam(required = false) rmb: Int?,
        @Schema(description = "人民币下限（亿元人民币）")
        @RequestParam(required = false) rmb1: Int?,
        @Schema(description = "人民币上限（亿元人民币）")
        @RequestParam(required = false) rmb2: Int?,
        @Schema(description = "开始日期")
        @RequestParam(defaultValue = "2024-01-01") currStartDate: String,
        @Schema(description = "结束日期")
        @RequestParam(defaultValue = "2026-01-01") currEndDate: String,
        @Schema(description = "当前日期")
        @RequestParam(defaultValue = "2025-10-01") currDate: String,
        @Schema(description = "投资方")
        @RequestParam(required = false) investor: String?,
        @Schema(description = "投资方类型（10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它）")
        @RequestParam(required = false) investorType: String?,
        @Schema(description = "投资注册地（90-香港 ,100-台湾,110-日本,120-韩国,130-美国,140-欧洲,150-新加坡,80-外资其他，" +
                "10 北京，20 上海，30 广州，40 深圳，50 苏州，60 长三角其他城市，70 内资其他）")
        @RequestParam(required = false) investorPlace: String?,
        @Schema(description = "是否上市 （1 是 2 否）")
        @RequestParam(required = false) isListed: String?,
        @Schema(description = "服务业/工业")
        @RequestParam(required = false) industry: String?,
        @Schema(description = "是否科创 （是/否）")
        @RequestParam(required = false) isKcProj: String?,
    ): String {
        val requestBody = mapOf(
            "rmb" to rmb,
            "rmb1" to rmb1,
            "rmb2" to rmb2,
            "currStartDate" to currStartDate,
            "currEndDate" to currEndDate,
            "currDate" to currDate,
            "investor" to investor,
            "investorType" to investorType,
            "investorPlace" to investorPlace,
            "isListed" to isListed,
            "industry" to industry,
            "isKcProj" to isKcProj,
        ).toJsonRequest()
        val request = Request.Builder()
            .url("http://172.22.26.71:8003/api/proj/project/signed/countSignedProjType")
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        return response.string();
    }*/

    @Operation(summary = "“四重”工作产业链项目招引情况层级查询")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("countSignedProjTypeByLevel")
    fun countSignedProjTypeByLevel(
        @Schema(description = "金额")
        @RequestParam(required = false) rmb: Int?,
        @Schema(description = "人民币下限（亿元人民币）")
        @RequestParam(required = false) rmb1: Double?,
        @Schema(description = "人民币上限（亿元人民币）")
        @RequestParam(required = false) rmb2: Double?,
        @Schema(description = "开始日期")
        @RequestParam(defaultValue = "2025-01-01") currStartDate: String,
        @Schema(description = "结束日期")
        @RequestParam(defaultValue = "2025-12-31") currEndDate: String,
        @Schema(description = "当前日期")
        @RequestParam(defaultValue = "2025-11-01") currDate: String,
        @Schema(description = "层级 3级传值3 2级传值2")
        @RequestParam() level: Int,
        @Schema(description = "产业链code")
        @RequestParam(required = false) code: String?,
        @Schema(description = "重点项目(市重点/省重大)")
        @RequestParam(required = false) isMainProj: String?,
    ): List<Map<String, Any>> {
        /*val requestBody = mapOf(
            "rmb" to rmb,
            "rmb1" to rmb1,
            "rmb2" to rmb2,
            "currStartDate" to currStartDate,
            "currEndDate" to currEndDate,
            "currDate" to currDate,
            "level" to level,
            "code" to code,
        ).toJsonRequest()
        val request = Request.Builder()
            .url("http://172.22.26.71:8003/api/proj/project/signed/countSignedProjTypeByLevel")
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()*/
        val list = preliminaryInvestmentPromotionService.getCountSignedProjTypeByLevel(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            currDate = currDate,
            level = level,
            code = code,
            isMainProj = isMainProj
        )

        return list
    }
}
