@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProject
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectKeyProjectExcelRow(
    @field:ExcelProperty("项目ID（在线平台项目代码）")
    var digitalInvestmentId: String? = null,
    @field:ExcelProperty("项目名称")
    var projectName: String? = null,
    @field:ExcelProperty("所属区县")
    var district: String? = null,
    @field:ExcelProperty("所属园区")
    var park: String? = null,
    @field:ExcelProperty("产业类别（工业/服务业）")
    var industryCategory: String? = null,
    @field:ExcelProperty("8+13+x")
    var x: String? = null,
    @field:ExcelProperty("计划总投资类型（外资/内资）")
    var investmentType: String? = null,
    @field:ExcelProperty("计划总投资金额")
    var totalInvestmentAmount: BigDecimal? = null,
    @field:ExcelProperty("是否分期 (0:否, 1:是)")
    var ifPhased: Boolean? = null,
    @field:ExcelProperty("本期金额（万元）")
    var currentAmount: BigDecimal? = null,
    @field:ExcelProperty("建设内容及规模")
    var constructionContent: String? = null,
    @field:ExcelProperty("主要产品及产能")
    var mainProductsCapacity: String? = null,
    @field:ExcelProperty("预期产值(万元)")
    var expectOutput: BigDecimal? = null,
    @field:ExcelProperty("用工（人）")
    var worker: Int? = null,
    @field:ExcelProperty("亩均税收")
    var revenuePerMu: BigDecimal? = null,
    @field:ExcelProperty("建设起始年限-开工年份")
    var startYear: Int? = null,
    @field:ExcelProperty("建设起止年限-竣工年份")
    var endYear: Int? = null,
    @field:ExcelProperty("年度计划投资（万元）")
    var annualPlanInvestment: BigDecimal? = null,
    @field:ExcelProperty("年度形象进度")
    var annualImageProgress: String? = null,
    @field:ExcelProperty("项目类型")
    var projectType: String? = null,
    @field:ExcelProperty("投资主体名称")
    var investorName: String? = null,
    @field:ExcelProperty("统一信用代码")
    var creditCode: String? = null,
    @field:ExcelProperty("投资主体性质 (多选)")
    var investorNature: String? = null,
    @field:ExcelProperty("投资主体简介")
    var investorIntro: String? = null,
    @field:ExcelProperty("行业代码")
    var industryCode: String? = null,
    @field:ExcelProperty("研发平台")
    var rdPlatform: String? = null,
    @field:ExcelProperty("近三年平均研发投入占比 (%)")
    var rdRatioAvg3y: BigDecimal? = null,
    @field:ExcelProperty("发明专利（件）")
    var inventionPatents: Int? = null,
    @field:ExcelProperty("实用新型或外观专利（件）")
    var utilityPatents: Int? = null,
    @field:ExcelProperty("用地类型 (新增用地/存量厂房)")
    var landType: String? = null,
    @field:ExcelProperty("用地面积(亩")
    var landArea: BigDecimal? = null,
    @field:ExcelProperty("用地手续办理情况")
    var landSituation: String? = null,
    @field:ExcelProperty("土地情况-基本农田")
    var isBasicFarmland: Boolean? = null,
    @field:ExcelProperty("土地情况-生态红线")
    var isEcologicalBoundary: Boolean? = null,
    @field:ExcelProperty("用地手续办理情况")
    var landUseProcedures: String? = null,
    @field:ExcelProperty("是否为&quot;两高&quot;项目 (0:否, 1:是)")
    var ifTwoHigh: Boolean? = null,
    @field:ExcelProperty("是否完成节能审查 (0:否, 1:是)")
    var energyReviewDone: Boolean? = null,
    @field:ExcelProperty("能评佐证材料")
    var energyZzcl: String? = null,
    @field:ExcelProperty("是否完成环评 (0:否, 1:是)")
    var envAssessmentDone: Boolean? = null,
    @field:ExcelProperty("项目环境影响情况")
    var envSitu: String? = null,
    @field:ExcelProperty("环评佐证材料")
    var environmentZzcl: String? = null,
    @field:ExcelProperty("是否备案 (0:否, 1:是)")
    var ifFiled: Boolean? = null,
    @field:ExcelProperty("备案佐证材料")
    var filedZzcl: String? = null,
    @field:ExcelProperty("是否取得安评批复 (0:否, 1:是)")
    var safetyApprovalDone: Boolean? = null,
    @field:ExcelProperty("安评佐证材料")
    var safetyZzcl: String? = null,
    @field:ExcelProperty("项目特色亮点")
    var highlights: String? = null,
    @field:ExcelProperty("项目评估状态")
    var projectEvaluationStatus: String? = null,
    @field:ExcelProperty("计划开工时间")
    var planStartDate: LocalDate? = null,
    @field:ExcelProperty("入库时间")
    var storageInTime: LocalDateTime? = null,
    @field:ExcelProperty("出库时间")
    var storageOutTime: LocalDateTime? = null,
    @field:ExcelProperty("所属年度")
    var belongYear: Int? = null,
    @field:ExcelProperty("是否市重点")
    var ifCityKey: Boolean? = null,
    @field:ExcelProperty("是否省重点")
    var ifProvinceKey: Boolean? = null,
    @field:ExcelProperty("项目来源")
    var projectSource: String? = null,
    @field:ExcelProperty("发改项目名称")
    var fgName: String? = null,
    @field:ExcelProperty("是否2026年新开工")
    var ifNewStart2026: Boolean? = null,
    @field:ExcelProperty("是否开工项目")
    var ifStart: Boolean? = null,
    @field:ExcelProperty("是否统计入库")
    var ifStorage: Boolean? = null,
    @field:ExcelProperty("累计列统投资")
    var inInvest: Double? = null,
    @field:ExcelProperty("列统投资完成率")
    var investmentCompletionRate: Double? = null,
    @field:ExcelProperty("统计代码")
    var inInvestCode: String? = null,
) : ExcelRow<ProjectKeyProjectExcelRow>() {
    fun toProjectKeyProject(): ProjectKeyProject =
        ProjectKeyProject {
            into(this)
        }

    fun into(record: ProjectKeyProject): ProjectKeyProject {
        record.digitalInvestmentId = digitalInvestmentId
        record.projectName = projectName
        record.district = district
        record.park = park
        record.industryCategory = industryCategory
        record.x = x
        record.investmentType = investmentType
        record.totalInvestmentAmount = totalInvestmentAmount
        record.ifPhased = ifPhased
        record.currentAmount = currentAmount
        record.constructionContent = constructionContent
        record.mainProductsCapacity = mainProductsCapacity
        record.expectOutput = expectOutput
        record.worker = worker
        record.revenuePerMu = revenuePerMu
        record.startYear = startYear
        record.endYear = endYear
        record.annualPlanInvestment = annualPlanInvestment
        record.annualImageProgress = annualImageProgress
        record.projectType = projectType
        record.investorName = investorName
        record.creditCode = creditCode
        record.investorNature = investorNature
        record.investorIntro = investorIntro
        record.industryCode = industryCode
        record.rdPlatform = rdPlatform
        record.rdRatioAvg3y = rdRatioAvg3y
        record.inventionPatents = inventionPatents
        record.utilityPatents = utilityPatents
        record.landType = landType
        record.landArea = landArea
        record.landSituation = landSituation
        record.isBasicFarmland = isBasicFarmland
        record.isEcologicalBoundary = isEcologicalBoundary
        record.landUseProcedures = landUseProcedures
        record.ifTwoHigh = ifTwoHigh
        record.energyReviewDone = energyReviewDone
        record.energyZzcl = energyZzcl
        record.envAssessmentDone = envAssessmentDone
        record.envSitu = envSitu
        record.environmentZzcl = environmentZzcl
        record.ifFiled = ifFiled
        record.filedZzcl = filedZzcl
        record.safetyApprovalDone = safetyApprovalDone
        record.safetyZzcl = safetyZzcl
        record.highlights = highlights
        record.projectEvaluationStatus = projectEvaluationStatus
        record.planStartDate = planStartDate
        record.storageInTime = storageInTime
        record.storageOutTime = storageOutTime
        record.belongYear = belongYear
        record.ifCityKey = ifCityKey
        record.ifProvinceKey = ifProvinceKey
        record.projectSource = projectSource
        record.fgName = fgName
        record.ifNewStart2026 = ifNewStart2026
        record.ifStart = ifStart
        record.ifStorage = ifStorage
        record.inInvest = inInvest
        record.investmentCompletionRate = investmentCompletionRate
        record.inInvestCode = inInvestCode
        return record
    }
}
