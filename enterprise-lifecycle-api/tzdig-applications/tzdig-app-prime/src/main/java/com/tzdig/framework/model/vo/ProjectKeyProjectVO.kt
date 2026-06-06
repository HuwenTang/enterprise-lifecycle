@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.alibaba.fastjson2.parseArray
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProject
import com.tzdig.framework.web.annotation.ExcelAreaName
import com.tzdig.framework.web.annotation.ExcelLabel
import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectKeyProjectVO(
    @get:Schema(description = "主键")
    @ExcelIgnore
    val id: String?,
    @get:Schema(description = "项目ID（在线平台项目代码）")
    @ExcelIgnore
    val digitalInvestmentId: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "所属区县")
    @field:ExcelAreaName
    @ExcelProperty("所属区县")
    val district: String?,
    @get:Schema(description = "所属园区")
    @field:ExcelAreaName
    @ExcelProperty("所属园区")
    val park: String?,
    @get:Schema(description = "产业类别（工业/服务业）")
    @ExcelProperty("产业类别（工业/服务业）")
    val industryCategory: String?,
    @get:Schema(description = "8+13+x")
    @field:ExcelLabel("8_13_x")
    @ExcelProperty("8+13+x")
    val x: String?,
    @get:Schema(description = "计划总投资类型（外资/内资）")
    @ExcelProperty("计划总投资类型（外资/内资）")
    val investmentType: String?,
    @get:Schema(description = "计划总投资金额")
    @ExcelProperty("计划总投资金额")
    val totalInvestmentAmount: BigDecimal?,
    @get:Schema(description = "是否分期 (0:否, 1:是)")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否分期 ")
    val ifPhased: Boolean?,
    @get:Schema(description = "本期金额（万元）")
    @ExcelProperty("本期金额（万元）")
    val currentAmount: BigDecimal?,
    @get:Schema(description = "建设内容及规模")
    @ExcelProperty("建设内容及规模")
    val constructionContent: String?,
    @get:Schema(description = "主要产品及产能")
    @ExcelProperty("主要产品及产能")
    val mainProductsCapacity: String?,
    @get:Schema(description = "预期产值(万元)")
    @ExcelProperty("预期产值(万元)")
    val expectOutput: BigDecimal?,
    @get:Schema(description = "用工（人）")
    @ExcelProperty("用工（人）")
    val worker: Int?,
    @get:Schema(description = "亩均税收")
    @ExcelProperty("亩均税收")
    val revenuePerMu: BigDecimal?,
    @get:Schema(description = "建设起始年限-开工年份")
    @ExcelProperty("建设起始年限-开工年份")
    val startYear: Int?,
    @get:Schema(description = "建设起止年限-竣工年份")
    @ExcelProperty("建设起止年限-竣工年份")
    val endYear: Int?,
    @get:Schema(description = "年度计划投资（万元）")
    @ExcelProperty("年度计划投资（万元）")
    val annualPlanInvestment: BigDecimal?,
    @get:Schema(description = "年度形象进度")
    @ExcelProperty("年度形象进度")
    val annualImageProgress: String?,
    @get:Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    val projectType: String?,
    @get:Schema(description = "投资主体名称")
    @ExcelProperty("投资主体名称")
    val investorName: String?,
    @get:Schema(description = "统一信用代码")
    @ExcelProperty("统一信用代码")
    val creditCode: String?,
    @get:Schema(description = "投资主体性质 (多选)")
    @ExcelProperty("投资主体性质 (多选)")
    val investorNature: String?,
    @get:Schema(description = "投资主体简介")
    @ExcelProperty("投资主体简介")
    val investorIntro: String?,
    @get:Schema(description = "行业代码")
    @ExcelProperty("行业代码")
    val industryCode: String?,
    @get:Schema(description = "研发平台")
    @ExcelProperty("研发平台")
    val rdPlatform: String?,
    @get:Schema(description = "近三年平均研发投入占比 (%)")
    @ExcelProperty("近三年平均研发投入占比 (%)")
    val rdRatioAvg3y: BigDecimal?,
    @get:Schema(description = "发明专利（件）")
    @ExcelProperty("发明专利（件）")
    val inventionPatents: Int?,
    @get:Schema(description = "实用新型或外观专利（件）")
    @ExcelProperty("实用新型或外观专利（件）")
    val utilityPatents: Int?,
    @get:Schema(description = "用地类型 (新增用地/存量厂房)")
    @ExcelProperty("用地类型 (新增用地/存量厂房)")
    val landType: String?,
    @get:Schema(description = "用地面积(亩")
    @ExcelProperty("用地面积(亩")
    val landArea: BigDecimal?,
    @get:Schema(description = "用地手续办理情况")
    @ExcelProperty("用地手续办理情况")
    val landSituation: String?,
    @get:Schema(description = "土地情况-基本农田")
    @ExcelProperty("土地情况-基本农田")
    val isBasicFarmland: Boolean?,
    @get:Schema(description = "土地情况-生态红线")
    @ExcelProperty("土地情况-生态红线")
    val isEcologicalBoundary: Boolean?,
    @get:Schema(description = "用地手续办理情况")
    @ExcelProperty("用地手续办理情况")
    val landUseProcedures: String?,
    @get:Schema(description = "是否为两高项目 (0:否, 1:是)")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否为两高项目 ")
    val ifTwoHigh: Boolean?,
    @get:Schema(description = "是否完成节能审查 (0:否, 1:是)")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否完成节能审查")
    val energyReviewDone: Boolean?,
    @get:Schema(description = "能评佐证材料")
    @ExcelIgnore
    val energyZzcl: List<FileDownloadVO>,
    @get:Schema(description = "是否完成环评 (0:否, 1:是)")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否完成环评")
    val envAssessmentDone: Boolean?,
    @get:Schema(description = "项目环境影响情况")
    @ExcelProperty("项目环境影响情况")
    val envSitu: String?,
    @get:Schema(description = "环评佐证材料")
    @ExcelIgnore
    val environmentZzcl: List<FileDownloadVO>,
    @get:Schema(description = "是否备案 (0:否, 1:是)")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否备案")
    val ifFiled: Boolean?,
    @get:Schema(description = "备案佐证材料")
    @ExcelIgnore
    val filedZzcl: List<FileDownloadVO>,
    @get:Schema(description = "是否取得安评批复 (0:否, 1:是)")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否取得安评批复")
    val safetyApprovalDone: Boolean?,
    @get:Schema(description = "安评佐证材料")
    @ExcelIgnore
    val safetyZzcl: List<FileDownloadVO>,
    @get:Schema(description = "项目特色亮点")
    @ExcelProperty("项目特色亮点")
    val highlights: String?,
    @get:Schema(description = "项目评估状态")
    @ExcelProperty("项目评估状态")
    val projectEvaluationStatus: String?,
    @get:Schema(description = "计划开工时间")
    @ExcelProperty("计划开工时间")
    val planStartDate: LocalDate?,
    @get:Schema(description = "入库时间")
    @ExcelProperty("入库时间")
    val storageInTime: LocalDateTime?,
    @get:Schema(description = "出库时间")
    @ExcelProperty("出库时间")
    val storageOutTime: LocalDateTime?,
    @get:Schema(description = "所属年度")
    @ExcelProperty("所属年度")
    val belongYear: Int?,
    @get:Schema(description = "是否市重点")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否市重点")
    val ifCityKey: Boolean?,
    @get:Schema(description = "是否省重点")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否省重点")
    val ifProvinceKey: Boolean?,
    @get:Schema(description = "项目来源")
    @ExcelProperty("项目来源")
    val projectSource: String?,
    @get:Schema(description = "发改项目名称")
    @ExcelProperty("发改项目名称")
    val fgName: String?,
    @get:Schema(description = "是否2026年新开工")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否2026年新开工")
    val ifNewStart2026: Boolean?,
    @get:Schema(description = "是否开工项目")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否开工项目")
    var ifStart: Boolean?,
    @get:Schema(description = "是否统计入库")
    @field:ExcelLabel("boolean")
    @ExcelProperty("是否列统项目")
    val ifStorage: Boolean?,
    @get:Schema(description = "累计列统投资")
    @ExcelProperty("累计列统投资")
    val inInvest: Double?,
    @get:Schema(description = "列统投资完成率")
    @ExcelProperty("列统投资完成率")
    val investmentCompletionRate: Double?,
    @get:Schema(description = "统计代码")
    @ExcelProperty("统计代码")
    val inInvestCode: String?,
    @get:Schema(description = "创建人")
    @ExcelIgnore
    val creator: String?,
    @get:Schema(description = "状态1、草稿2、正文")
    @ExcelIgnore
    val status: Int?,
) : S3Transformable {

    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "市（区）名称")
    val districtName: String?
        get() = district

    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "园区名称")
    val parkName: String?
        get() = park


    constructor(record: ProjectKeyProject) : this(
        id = record.id,
        digitalInvestmentId = record.digitalInvestmentId,
        projectName = record.projectName,
        district = record.district,
        park = record.park,
        industryCategory = record.industryCategory,
        x = record.x,
        investmentType = record.investmentType,
        totalInvestmentAmount = record.totalInvestmentAmount,
        ifPhased = record.ifPhased,
        currentAmount = record.currentAmount,
        constructionContent = record.constructionContent,
        mainProductsCapacity = record.mainProductsCapacity,
        expectOutput = record.expectOutput,
        worker = record.worker,
        revenuePerMu = record.revenuePerMu,
        startYear = record.startYear,
        endYear = record.endYear,
        annualPlanInvestment = record.annualPlanInvestment,
        annualImageProgress = record.annualImageProgress,
        projectType = record.projectType,
        investorName = record.investorName,
        creditCode = record.creditCode,
        investorNature = record.investorNature,
        investorIntro = record.investorIntro,
        industryCode = record.industryCode,
        rdPlatform = record.rdPlatform,
        rdRatioAvg3y = record.rdRatioAvg3y,
        inventionPatents = record.inventionPatents,
        utilityPatents = record.utilityPatents,
        landType = record.landType,
        landArea = record.landArea,
        landSituation = record.landSituation,
        isBasicFarmland = record.isBasicFarmland,
        isEcologicalBoundary = record.isEcologicalBoundary,
        landUseProcedures = record.landUseProcedures,
        ifTwoHigh = record.ifTwoHigh,
        energyReviewDone = record.energyReviewDone,
        energyZzcl = record.energyZzcl?.parseArray<FileDownloadVO>() ?: emptyList(),
        envAssessmentDone = record.envAssessmentDone,
        envSitu = record.envSitu,
        environmentZzcl = record.environmentZzcl?.parseArray<FileDownloadVO>() ?: emptyList(),
        ifFiled = record.ifFiled,
        filedZzcl = record.filedZzcl?.parseArray<FileDownloadVO>() ?: emptyList(),
        safetyApprovalDone = record.safetyApprovalDone,
        safetyZzcl = record.safetyZzcl?.parseArray<FileDownloadVO>() ?: emptyList(),
        highlights = record.highlights,
        projectEvaluationStatus = record.projectEvaluationStatus,
        planStartDate = record.planStartDate,
        storageInTime = record.storageInTime,
        storageOutTime = record.storageOutTime,
        belongYear = record.belongYear,
        ifCityKey = record.ifCityKey,
        ifProvinceKey = record.ifProvinceKey,
        projectSource = record.projectSource,
        fgName = record.fgName,
        ifNewStart2026 = record.ifNewStart2026,
        ifStart = record.ifStart,
        ifStorage = record.ifStorage,
        inInvest = record.inInvest,
        investmentCompletionRate = record.investmentCompletionRate,
        inInvestCode = record.inInvestCode,
        creator = record.creator,
        status = record.status,
    )

    override fun s3transform(transform: (String) -> String) {
        energyZzcl.forEach { it.path = transform(it.path) }
        environmentZzcl.forEach { it.path = transform(it.path) }
        filedZzcl.forEach { it.path = transform(it.path) }
        safetyZzcl.forEach { it.path = transform(it.path) }
    }
}
