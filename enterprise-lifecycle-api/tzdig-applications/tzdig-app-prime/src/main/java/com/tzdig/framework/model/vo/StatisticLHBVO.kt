package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

/**
 * 综合统计报表 VO (基于图片表头结构)
 */
data class StatisticLHBVO(

    @get:Schema(description = "市（区）名称")
    var regionName: String? = null,

    // 1. 排名情况
    @get:Schema(description = "排名信息")
    var rankings: Rankings? = null,

    // 2. 固定资产投资情况
    @get:Schema(description = "固定资产投资情况")
    var fixedAssetInvestment: FixedAssetInvestment? = null,

    // 3. 省重大项目情况
    @get:Schema(description = "省重大项目情况")
    var provincialMajorProjects: ProvincialMajorProject? = null,

    // 4. 市重点项目情况
    @get:Schema(description = "市重点项目情况")
    var municipalKeyProjects: MunicipalKeyProject? = null,

    // 5. 签约项目情况
    @get:Schema(description = "签约项目情况")
    var signedProjects: SignedProjects? = null,

    // 6. 备案项目情况
    @get:Schema(description = "备案项目情况")
    var filedProjects: FiledProjects? = null,

    // 7. 开工项目情况 (数量)
    @get:Schema(description = "开工项目数量情况")
    var constructionStartProjects: ConstructionStartProjects? = null,

    // 8. 开工项目投资情况
    @get:Schema(description = "开工项目投资情况")
    var constructionStartInvestment: ConstructionStartInvestment? = null,

    // 9. 竣工项目情况
    @get:Schema(description = "竣工项目情况")
    var completedProjects: CompletedProjects? = null,

    // 10. "四上"企业新增数情况
    @get:Schema(description = "四上企业新增数情况")
    var fourAboveEnterprises: FourAboveEnterprises? = null
) {
    // --- 内部数据类定义 ---

    data class Rankings(
        @get:Schema(description = "第一名") var first: String? = null,
        @get:Schema(description = "第二名") var second: String? = null,
        @get:Schema(description = "第三名") var third: String? = null,
        @get:Schema(description = "第四名") var fourth: String? = null,
        @get:Schema(description = "第五名") var fifth: String? = null,
        @get:Schema(description = "第六名") var sixth: String? = null
    )

    data class FixedAssetInvestment(
        @get:Schema(description = "1-2月完成数") @get:JsonDecimal(2) var monthCompleted: BigDecimal? = null,
        @get:Schema(description = "一季度预测数") @get:JsonDecimal(2) var q1Forecast: BigDecimal? = null,
        @get:Schema(description = "一季度投资完成进度") @get:JsonDecimal(2) var q1Progress: BigDecimal? = null,
        @get:Schema(description = "全年预测数") @get:JsonDecimal(2) var yearForecast: BigDecimal? = null,
        @get:Schema(description = "全年完成进度") @get:JsonDecimal(2) var yearProgress: BigDecimal? = null
    )

    data class ProvincialMajorProject(
        @get:Schema(description = "项目数量") var projectCount: Int? = null,
        @get:Schema(description = "计划总投资") @get:JsonDecimal(2) var plannedTotalInvestment: BigDecimal? = null,
        @get:Schema(description = "年度投资") @get:JsonDecimal(2) var annualInvestment: BigDecimal? = null,
        // 年度投资完成情况
        @get:Schema(description = "已列统项目数") var listedProjectCount: Int? = null,
        @get:Schema(description = "实际入库投资") @get:JsonDecimal(2) var actualStoredInvestment: BigDecimal? = null,
        @get:Schema(description = "投资完成率") @get:JsonDecimal(2) var investmentCompletionRate: BigDecimal? = null,
        // 项目开工情况
        @get:Schema(description = "新开工项目数") var newStartProjectCount: Int? = null,
        @get:Schema(description = "已开工项目数") var startedProjectCount: Int? = null,
        @get:Schema(description = "开工率") @get:JsonDecimal(2) var startRate: BigDecimal? = null,
        @get:Schema(description = "已开工未列统项目数") var startedButUnlistedCount: Int? = null
    )

    data class MunicipalKeyProject(
        @get:Schema(description = "项目数量") var projectCount: Long? = null,
        @get:Schema(description = "计划总投资") @get:JsonDecimal(2) var plannedTotalInvestment: BigDecimal? = null,
        @get:Schema(description = "年度投资") @get:JsonDecimal(2) var annualInvestment: BigDecimal? = null,
        // 年度投资完成情况
        @get:Schema(description = "已列统项目数") var listedProjectCount: Long? = null,
        @get:Schema(description = "实际入库投资") @get:JsonDecimal(2) var actualStoredInvestment: BigDecimal? = null,
        @get:Schema(description = "投资完成率") @get:JsonDecimal(2) var investmentCompletionRate: BigDecimal? = null,
        // 项目开工情况
        @get:Schema(description = "新开工项目数") var newStartProjectCount: Long? = null,
        @get:Schema(description = "已开工项目数") var startedProjectCount: Long? = null,
        @get:Schema(description = "开工率") @get:JsonDecimal(2) var startRate: Double? = null,
        @get:Schema(description = "已开工未列统项目数") var startedButUnlistedCount: Long? = null
    )

    data class SignedProjects(
        @get:Schema(description = "5000万-1亿元项目") var range50mTo100m: ProjectCountInfo? = null,
        @get:Schema(description = "1亿元以上项目") var range100mPlus: ProjectCountInfo? = null,
        @get:Schema(description = "其中：3000万美元以上项目") var range30mUsdPlus: ProjectCountInfo? = null,
        @get:Schema(description = "其中：年度投资1亿元以上项目") var annualInv100mPlus: ProjectCountInfo? = null
    )

    data class FiledProjects(
        @get:Schema(description = "5000万-1亿元项目") var range50mTo100m: ProjectCountInfo? = null,
        @get:Schema(description = "1亿元以上项目") var range100mPlus: ProjectCountInfo? = null,
        @get:Schema(description = "其中：3000万美元以上项目") var range30mUsdPlus: ProjectCountInfo? = null,
        @get:Schema(description = "其中：增资扩产项目") var expansionProjects: ProjectCountInfo? = null,
        @get:Schema(description = "其中：外资利润再投资项目") var reinvestmentProjects: ProjectCountInfo? = null
    )

    data class ConstructionStartProjects(
        @get:Schema(description = "5000万-1亿元项目") var range50mTo100m: ProjectCountInfo? = null,
        @get:Schema(description = "1亿元以上项目") var range100mPlus: ProjectCountInfo? = null,
        @get:Schema(description = "其中：3000万美元以上项目") var range30mUsdPlus: ProjectCountInfo? = null
    )

    data class ConstructionStartInvestment(
        @get:Schema(description = "5000万-1亿元项目投资") var range50mTo100m: InvestmentInfo? = null,
        @get:Schema(description = "1亿元以上项目投资") var range100mPlus: InvestmentInfo? = null
    )

    data class CompletedProjects(
        @get:Schema(description = "5000万-1亿元项目") var range50mTo100m: ProjectCountInfo? = null,
        @get:Schema(description = "1亿元以上项目") var range100mPlus: ProjectCountInfo? = null
    )

    data class FourAboveEnterprises(
        @get:Schema(description = "总数") var total: ProjectCountInfo? = null,
        @get:Schema(description = "工业") var industry: ProjectCountInfo? = null,
        @get:Schema(description = "建筑业") var construction: ProjectCountInfo? = null,
        @get:Schema(description = "批零业") var wholesaleRetail: ProjectCountInfo? = null,
        @get:Schema(description = "住餐业") var hospitality: ProjectCountInfo? = null,
        @get:Schema(description = "房地产业") var realEstate: ProjectCountInfo? = null,
        @get:Schema(description = "服务业") var service: ProjectCountInfo? = null
    )

    // --- 通用子结构 ---

    data class ProjectCountInfo(
        @get:Schema(description = "总数") var total: Long? = null,
        @get:Schema(description = "当月新增") var monthNew: Long? = null
    )

    data class InvestmentInfo(
        @get:Schema(description = "计划总投资") @get:JsonDecimal(2) var plannedTotalInvestment: BigDecimal? = null,
        @get:Schema(description = "年度计划投资") @get:JsonDecimal(2) var annualPlannedInvestment: BigDecimal? = null,
        @get:Schema(description = "已完成投资") @get:JsonDecimal(2) var completedInvestment: BigDecimal? = null,
        @get:Schema(description = "年度计划完成率") @get:JsonDecimal(2) var annualCompletionRate: BigDecimal? = null
    )
}
