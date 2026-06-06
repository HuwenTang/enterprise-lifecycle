package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectNonInvestmentConfirmation
import com.tzdig.framework.web.annotation.ExcelAreaName
import com.tzdig.framework.web.annotation.ExcelLabel
import com.tzdig.framework.web.annotation.JsonAreaName
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class LHBProjectInfoVO(
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    var projectName: String?,
    @get:Schema(description = "项目编号")
    @ExcelProperty("项目编号")
    var projectCode: String?,
    @get:Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    var projectType: String?,
    @get:Schema(description = "项目状态")
    @ExcelProperty("项目状态")
    @ExcelLabel("project_progress")
    var projectStatus: String?,
    @get:Schema(description = "市区")
    @ExcelProperty("市区")
    @ExcelAreaName
    var district: String?,
    @get:Schema(description = "园区")
    @ExcelProperty("园区")
    @ExcelAreaName
    var park: String?,
    @get:Schema(description = "统一社会信用代码")
    @ExcelProperty("统一社会信用代码")
    var unifiedSocialCreditCode: String?,
    @get:Schema(description = "是否外资")
    @ExcelProperty("是否外资")
    var ifForeignCapital: String?,
    @get:Schema(description = "投资方")
    @ExcelProperty("投资方")
    var investor: String?,
    @get:Schema(description = "投资金额")
    @ExcelProperty("投资金额")
    var investmentAmount: Double?,
    @get:Schema(description = "开工时间")
    @ExcelProperty("开工时间")
    var commencementDate: LocalDate?,
    @get:Schema(description = "竣工时间")
    @ExcelProperty("竣工时间")
    var endDate: LocalDate?,
    @get:Schema(description = "行业方向")
    @ExcelProperty("行业方向")
    var industryDirection: String?,
    @get:Schema(description = "行业分类")
    @ExcelProperty("行业分类")
    var industryClassification: String?,
    @get:Schema(description = "主要产品")
    @ExcelProperty("主要产品")
    var mainProducts: String?,
    @get:Schema(description = "固定资产投资")
    @ExcelProperty("固定资产投资")
    var fixedAssetInvestment: Float?,
    @get:Schema(description = "是否列统")
    @ExcelProperty("是否列统")
    var ifIncludedInDatabase: String?,
    @get:Schema(description = "列统代码")
    @ExcelProperty("列统代码")
    var ltCode: String?,
    ) {

    @Suppress("unused")
    @get:JsonLabel("project_progress")
    @get:Schema(description = "当前项目进度")
    @ExcelIgnore
    var projectProgressLabel: String? = null
        get() = projectStatus
        private set

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

    constructor(record: ProjectDigitalInvestmentAttracting) : this(
        projectName = record.projectName,
        projectCode = record.projectCode,
        projectType = record.projectType,
        projectStatus = record.currentProjectProgress?.value,
        district = record.district,
        park = record.park,
        unifiedSocialCreditCode = record.uscc,
        ifForeignCapital = if (record.investmentFlag == "1") "内资" else "外资",
        investor = record.investor,
        investmentAmount = record.investmentAmount,
        commencementDate = record.startConfirmDate,
        endDate = record.endConfirmDate,
        industryDirection = record.projectCategory,
        industryClassification = record.industryClassification,
        mainProducts = record.projectContent,
        fixedAssetInvestment = record.fixedAssetInvestment,
        ifIncludedInDatabase = if (record.isLt == true) "是" else "否",
        ltCode = record.ltCode,
    )

    constructor(record: ProjectNonInvestmentConfirmation) : this(
        projectName = record.projectName,
        projectCode = record.projectCode,
        projectType = if (record.projectType == "1") {
            "服务业"
        } else {
            "工业"
        },
        projectStatus = record.progress?.value,
        district = record.cityDistrict,
        park = record.park,
        unifiedSocialCreditCode = record.unifiedSocialCreditCode,
        ifForeignCapital = if (record.isForeignCapital == true) "外资" else "内资",
        investor = record.investor,
        investmentAmount = record.investmentAmount?.toDouble(),
        commencementDate = record.commencementDate,
        endDate = record.endDate,
        industryDirection = record.industryDirection,
        industryClassification = record.industryClassification,
        mainProducts = record.mainProducts,
        fixedAssetInvestment = record.fixedAssetInvestment?.toFloat(),
        ifIncludedInDatabase = if (record.isIncludedInDatabase == true) "是" else "否",
        ltCode = record.ltCode,
    )

}
