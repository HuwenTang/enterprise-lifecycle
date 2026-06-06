@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.mybatis.entity.prime.ProjectNonInvestmentConfirmation
import com.tzdig.framework.web.annotation.ExcelAreaName
import com.tzdig.framework.web.annotation.ExcelLabel
import com.tzdig.framework.web.annotation.JsonAreaName
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectNonInvestmentConfirmationVO(
    @get:Schema(description = "主键")
    @ExcelIgnore
    val id: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @get:Schema(description = " 市（区）")
    @ExcelProperty(" 市（区）")
    @ExcelAreaName
    val cityDistrict: String?,
    @get:Schema(description = "园区（镇街）")
    @ExcelProperty("园区（镇街）")
    @ExcelAreaName
    var park: String?,
    @get:Schema(description = "项目状态")
    @ExcelProperty("项目状态")
    @ExcelLabel("project_progress")
    val progress: String?,
    @get:Schema(description = "项目地址")
    @ExcelProperty("项目地址")
    val projectAddress: String?,
    @get:Schema(description = "批准部门")
    @ExcelProperty("批准部门")
    val approvalDepartment: String?,
    @get:Schema(description = "备案证号")
    @ExcelIgnore
    val recordNumber: String?,
    @get:Schema(description = "批准日期")
    @ExcelProperty("批准日期")
    val approvalDate: LocalDate?,
    @get:Schema(description = "申请备案时间")
    @ExcelProperty("申请备案时间")
    val applicationTime: LocalDateTime?,
    @get:Schema(description = "投资类型")
    @ExcelProperty("投资类型")
    val investmentType: String?,
    @get:Schema(description = "投资方名称")
    @ExcelProperty("投资方名称")
    val investor: String?,
    @get:Schema(description = "项目投资额(万元)")
    @ExcelProperty("项目投资额(万元)")
    val investmentAmount: BigDecimal?,
    @get:Schema(description = "是否外资项目")
    @ExcelProperty("是否外资项目")
    @ExcelLabel("boolean")
    val ifForeignCapital: Boolean?,
    @get:Schema(description = "申报单位")
    @ExcelProperty("申报单位")
    val department: String?,
    @get:Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    @ExcelLabel("b_industry")
    val projectType: String?,
    @get:Schema(description = "产业方向")
    @ExcelProperty("产业方向")
    @ExcelLabel("8_13_x_2026")
    val industryDirection: String?,
    @get:Schema(description = "行业代码")
    @ExcelIgnore
    val industryCode: String?,
    @get:Schema(description = "行业分类")
    @ExcelProperty("行业分类")
    val industryClassification: String?,
    @get:Schema(description = "固定资产投资（万元）")
    @ExcelProperty("固定资产投资（万元）")
    val fixedAssetInvestment: BigDecimal?,
    @get:Schema(description = "统一社会信用代码")
    @ExcelProperty("统一社会信用代码")
    val unifiedSocialCreditCode: String?,
    @get:Schema(description = "主要产品、产能及主要建设内容")
    @ExcelProperty("主要产品、产能及主要建设内容")
    val mainProducts: String?,
    @get:Schema(description = "用地类型")
    @ExcelProperty("用地类型")
    val landUseType: String?,
    @get:Schema(description = "供地进度")
    @ExcelProperty("供地进度")
    val landSupplyProgress: String?,
    @get:Schema(description = "环评进展")
    @ExcelProperty("环评进展")
    val environmentalAssessment: String?,
    @get:Schema(description = "安评情况")
    @ExcelProperty("安评情况")
    val safetyAssessment: String?,
    @get:Schema(description = "能评情况")
    @ExcelProperty("能评情况")
    val energyAssessment: String?,
    @get:Schema(description = "施工图审查情况")
    @ExcelProperty("施工图审查情况")
    val constructionDrawingReview: String?,
    @get:Schema(description = "施工许可情况")
    @ExcelProperty("施工许可情况")
    val constructionPermitStatus: String?,
    @get:Schema(description = "备注")
    @ExcelProperty("备注")
    val remarks: String?,
    @get:Schema(description = "开工日期")
    @ExcelProperty("开工日期")
    val commencementDate: LocalDate?,
    @get:Schema(description = "项目开工相关佐证资料")
    @ExcelIgnore
    var kgzzcl: List<String>,
    @get:Schema(description = "项目进展图片")
    @ExcelIgnore
    var progressImages: List<String>,
    @get:Schema(description = "是否已入库纳统")
    @ExcelProperty("是否列统项目")
    @ExcelLabel("boolean")
    val ifIncludedInDatabase: Boolean?,
    @get:Schema(description = "竣工日期")
    @ExcelProperty("竣工日期")
    val endDate: LocalDate?,
    @get:Schema(description = "项目竣工相关佐证资料")
    @ExcelIgnore
    var jgzzcl: List<String>,
    @get:Schema(description = "是否在线审批项目")
    @ExcelIgnore
    val isOnlineApproval: Boolean?,
    @get:Schema(description = "是否已填报")
    @ExcelIgnore
    var isFilled: Boolean?,
    @get:Schema(description = "项目是否列统 ")
    @ExcelIgnore
    val isLt: Boolean?,
    @get:Schema(description = "统计编码")
    @ExcelProperty("统计编码")
    val ltCode: String?,
    @get:Schema(description = "创建人")
    @ExcelIgnore
    val creator: String?,
    @get:Schema(description = "状态1、草稿2、正文")
    @ExcelIgnore
    val status: Int?,
    @get:Schema(description = "入库状态")
    @ExcelIgnore
    val rkStat: String?,
    @get:Schema(description = "入库意见")
    @ExcelIgnore
    val comments: String?,
    @get:Schema(description = "项目属性列表")
    @ExcelIgnore
    var projectAttributeList: MutableList<String> = mutableListOf()
) : S3Transformable {

    @get:Schema(description = "当前项目进度")
    @get:JsonLabel("project_progress")
    val progressLabel: String?
        get() = progress

    @get:Schema(description = "8_13_x")
    @get:JsonLabel("8_13_x")
    val industryDirectionLabel: String?
        get() = industryDirection

    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "市（区）名称")
    val districtName: String?
        get() = cityDistrict

    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "园区名称")
    val parkName: String
        get() = park ?: "其他"

    @Suppress("unused")
    @get:JsonLabel("rk_stat")
    @get:Schema(description = "入库状态")
    val rkStatName: String?
        get() = rkStat

    constructor(record: ProjectNonInvestmentConfirmation) : this(
        id = record.id,
        projectName = record.projectName,
        projectCode = record.projectCode,
        cityDistrict = record.cityDistrict,
        park = record.park,
        progress = record.progress?.value,
        projectAddress = record.projectAddress,
        approvalDepartment = record.approvalDepartment,
        recordNumber = record.recordNumber,
        approvalDate = record.approvalDate,
        applicationTime = record.applicationTime,
        investmentType = record.investmentType,
        investor = record.investor,
        investmentAmount = record.investmentAmount,
        ifForeignCapital = record.isForeignCapital,
        department = record.department,
        projectType = record.projectType,
        industryDirection = record.industryDirection,
        industryCode = record.industryCode,
        industryClassification = record.industryClassification,
        fixedAssetInvestment = record.fixedAssetInvestment,
        unifiedSocialCreditCode = record.unifiedSocialCreditCode,
        mainProducts = record.mainProducts,
        landUseType = record.landUseType,
        landSupplyProgress = record.landSupplyProgress,
        environmentalAssessment = record.environmentalAssessment,
        safetyAssessment = record.safetyAssessment,
        energyAssessment = record.energyAssessment,
        constructionDrawingReview = record.constructionDrawingReview,
        constructionPermitStatus = record.constructionPermitStatus,
        remarks = record.remarks,
        commencementDate = record.commencementDate,
        kgzzcl = record.kgzzcl?.split(',')?.filter { it.isNotEmpty() } ?: emptyList(),
        progressImages = record.progressImages?.split(',')?.filter { it.isNotEmpty() } ?: emptyList(),
        ifIncludedInDatabase = record.isLt,
        endDate = record.endDate,
        jgzzcl = record.jgzzcl?.split(',')?.filter { it.isNotEmpty() } ?: emptyList(),
        isOnlineApproval = record.isOnlineApproval,
        isFilled = null,
        isLt = record.isLt,
        ltCode = record.ltCode,
        creator = record.creator,
        status = record.status,
        rkStat = record.rkStat.toString(),
        comments = record.comments,
        projectAttributeList = mutableListOf()
    )
    override fun s3transform(transform: (String) -> String) {
        kgzzcl = kgzzcl.map(transform)
        progressImages = progressImages.map(transform)
        jgzzcl = jgzzcl.map(transform)
    }
}
