@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.alibaba.fastjson2.toJSONString
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProject
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectKeyProjectDTO(
    @param:Schema(description = "项目ID（在线平台项目代码）")
    val digitalInvestmentId: String?,
    @param:Schema(description = "项目名称")
    val projectName: String?,
    @param:Schema(description = "所属区县")
    val district: String?,
    @param:Schema(description = "所属园区")
    val park: String?,
    @param:Schema(description = "产业类别（工业/服务业）")
    val industryCategory: String?,
    @param:Schema(description = "8+13+x")
    val x: String?,
    @param:Schema(description = "计划总投资类型（外资/内资）")
    val investmentType: String?,
    @param:Schema(description = "计划总投资金额")
    val totalInvestmentAmount: BigDecimal?,
    @param:Schema(description = "是否分期 (0:否, 1:是)")
    val ifPhased: Boolean?,
    @param:Schema(description = "本期金额（万元）")
    val currentAmount: BigDecimal?,
    @param:Schema(description = "建设内容及规模")
    val constructionContent: String?,
    @param:Schema(description = "主要产品及产能")
    val mainProductsCapacity: String?,
    @param:Schema(description = "预期产值(万元)")
    val expectOutput: BigDecimal?,
    @param:Schema(description = "用工（人）")
    val worker: Int?,
    @param:Schema(description = "亩均税收")
    val revenuePerMu: BigDecimal?,
    @param:Schema(description = "建设起始年限-开工年份")
    val startYear: Int?,
    @param:Schema(description = "建设起止年限-竣工年份")
    val endYear: Int?,
    @param:Schema(description = "年度计划投资（万元）")
    val annualPlanInvestment: BigDecimal?,
    @param:Schema(description = "年度形象进度")
    val annualImageProgress: String?,
    @param:Schema(description = "项目类型")
    val projectType: String?,
    @param:Schema(description = "投资主体名称")
    val investorName: String?,
    @param:Schema(description = "统一信用代码")
    val creditCode: String?,
    @param:Schema(description = "投资主体性质 (多选)")
    val investorNature: String?,
    @param:Schema(description = "投资主体简介")
    val investorIntro: String?,
    @param:Schema(description = "行业代码")
    val industryCode: String?,
    @param:Schema(description = "研发平台")
    val rdPlatform: String?,
    @param:Schema(description = "近三年平均研发投入占比 (%)")
    val rdRatioAvg3y: BigDecimal?,
    @param:Schema(description = "发明专利（件）")
    val inventionPatents: Int?,
    @param:Schema(description = "实用新型或外观专利（件）")
    val utilityPatents: Int?,
    @param:Schema(description = "用地类型 (新增用地/存量厂房)")
    val landType: String?,
    @param:Schema(description = "用地面积(亩")
    val landArea: BigDecimal?,
    @param:Schema(description = "用地手续办理情况")
    val landSituation: String?,
    @param:Schema(description = "土地情况-基本农田")
    val isBasicFarmland: Boolean?,
    @param:Schema(description = "土地情况-生态红线")
    val isEcologicalBoundary: Boolean?,
    @param:Schema(description = "用地手续办理情况")
    val landUseProcedures: String?,
    @param:Schema(description = "是否为&quot;两高&quot;项目 (0:否, 1:是)")
    val ifTwoHigh: Boolean?,
    @param:Schema(description = "是否完成节能审查 (0:否, 1:是)")
    val energyReviewDone: Boolean?,
    @param:Schema(description = "能评佐证材料")
    val energyZzcl: List<FileDownloadVO>,
    @param:Schema(description = "是否完成环评 (0:否, 1:是)")
    val envAssessmentDone: Boolean?,
    @param:Schema(description = "项目环境影响情况")
    val envSitu: String?,
    @param:Schema(description = "环评佐证材料")
    val environmentZzcl: List<FileDownloadVO>,
    @param:Schema(description = "是否备案 (0:否, 1:是)")
    val ifFiled: Boolean?,
    @param:Schema(description = "备案佐证材料")
    val filedZzcl: List<FileDownloadVO>,
    @param:Schema(description = "是否取得安评批复 (0:否, 1:是)")
    val safetyApprovalDone: Boolean?,
    @param:Schema(description = "安评佐证材料")
    val safetyZzcl: List<FileDownloadVO>,
    @param:Schema(description = "项目特色亮点")
    val highlights: String?,
    @param:Schema(description = "项目评估状态")
    val projectEvaluationStatus: String?,
    @param:Schema(description = "计划开工时间")
    val planStartDate: LocalDate?,
    @param:Schema(description = "入库时间")
    val storageInTime: LocalDateTime?,
    @param:Schema(description = "出库时间")
    val storageOutTime: LocalDateTime?,
    @param:Schema(description = "所属年度")
    val belongYear: Int?,
    @param:Schema(description = "是否市重点")
    val ifCityKey: Boolean?,
    @param:Schema(description = "是否省重点")
    val ifProvinceKey: Boolean?,
    @param:Schema(description = "项目来源")
    val projectSource: String?,
    @param:Schema(description = "发改项目名称")
    val fgName: String?,
    @param:Schema(description = "是否2026年新开工")
    val ifNewStart2026: Boolean?,
    @param:Schema(description = "是否开工项目")
    val ifStart: Boolean?,
    @param:Schema(description = "是否统计入库")
    val ifStorage: Boolean?,
    @param:Schema(description = "累计列统投资")
    val inInvest: Double?,
    @param:Schema(description = "列统投资完成率")
    val investmentCompletionRate: Double?,
    @param:Schema(description = "统计代码")
    val inInvestCode: String?,
    @param:Schema(description = "创建人")
    var creator: String?,
    @param:Schema(description = "状态1、草稿2、正文")
    val status: Int?,
) {
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
        record.energyZzcl = energyZzcl.toJSONString()
        record.envAssessmentDone = envAssessmentDone
        record.environmentZzcl = environmentZzcl.toJSONString()
        record.ifFiled = ifFiled
        record.filedZzcl = filedZzcl.toJSONString()
        record.safetyApprovalDone = safetyApprovalDone
        record.safetyZzcl = safetyZzcl.toJSONString()
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
        record.creator = creator
        record.status = status
        return record
    }
}
