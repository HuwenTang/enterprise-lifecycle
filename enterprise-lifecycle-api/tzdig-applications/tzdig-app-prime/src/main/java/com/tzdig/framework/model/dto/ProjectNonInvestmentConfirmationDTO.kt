@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import com.tzdig.framework.mybatis.entity.prime.ProjectNonInvestmentConfirmation
import com.tzdig.framework.mybatis.entity.system.SystemArea
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectNonInvestmentConfirmationDTO(
    @param:Schema(description = "项目ID")
    val id: String?,
    @param:Schema(description = "项目名称")
    val projectName: String?,
    @param:Schema(description = "项目代码")
    val projectCode: String?,
    @param:Schema(description = " 市（区）")
    val cityDistrict: String?,
    @param:Schema(description = "园区（镇街）")
    val park: String?,
    @param:Schema(description = "项目地址")
    val projectAddress: String?,
    @param:Schema(description = "批准部门")
    val approvalDepartment: String?,
    @param:Schema(description = "备案证号")
    val recordNumber: String?,
    @param:Schema(description = "批准日期")
    val approvalDate: LocalDate?,
    @param:Schema(description = "申请备案时间")
    val applicationTime: LocalDateTime?,
    @param:Schema(description = "投资类型")
    val investmentType: String?,
    @param:Schema(description = "投资方名称")
    val investor: String?,
    @param:Schema(description = "项目投资额(万元)")
    val investmentAmount: BigDecimal?,
    @param:Schema(description = "是否外资项目")
    val isForeignCapital: Boolean?,
    @param:Schema(description = "申报单位")
    val department: String?,
    @param:Schema(description = "项目类型")
    val projectType: String?,
    @param:Schema(description = "产业方向")
    val industryDirection: String?,
    @param:Schema(description = "行业代码")
    val industryCode: String?,
    @param:Schema(description = "行业分类")
    var industryClassification: String?,
    @param:Schema(description = "固定资产投资（万元）")
    val fixedAssetInvestment: BigDecimal?,
    @param:Schema(description = "统一社会信用代码")
    val unifiedSocialCreditCode: String?,
    @param:Schema(description = "主要产品、产能及主要建设内容")
    val mainProducts: String?,
    @param:Schema(description = "用地类型")
    val landUseType: String?,
    @param:Schema(description = "供地进度")
    val landSupplyProgress: String?,
    @param:Schema(description = "环评进展")
    val environmentalAssessment: String?,
    @param:Schema(description = "安评情况")
    val safetyAssessment: String?,
    @param:Schema(description = "能评情况")
    val energyAssessment: String?,
    @param:Schema(description = "施工图审查情况")
    val constructionDrawingReview: String?,
    @param:Schema(description = "施工许可情况")
    val constructionPermitStatus: String?,
    @param:Schema(description = "备注")
    val remarks: String?,
    @param:Schema(description = "开工日期")
    val commencementDate: LocalDate?,
    @param:Schema(description = "项目开工相关佐证资料")
    val kgzzcl: List<String>?,
    @param:Schema(description = "项目进展图片")
    val progressImages: List<String>?,
    @param:Schema(description = "是否已入库纳统")
    var isIncludedInDatabase: Boolean?,
    @param:Schema(description = "竣工日期")
    val endDate: LocalDate?,
    @param:Schema(description = "项目竣工相关佐证资料")
    val jgzzcl: List<String>?,
    @param:Schema(description = "是否存在关联在线审批")
    val isExistInOnlineApproval: Boolean?,
    @param:Schema(description = "是否开工")
    val isStarted: Boolean?,
    @param:Schema(description = "是否竣工")
    val isEnd: Boolean?,
    @param:Schema(description = "是否在线审批项目")
    var isOnlineApproval: Boolean?,
    @param:Schema(description = "项目是否列统 ")
    val isLt: Boolean?,
    @param:Schema(description = "统计编码")
    val ltCode: String?,
    @param:Schema(description = "创建人")
    var creator: String?,
    @param:Schema(description = "状态1、草稿2、正文")
    val status: Int?,
    @param:Schema(description = "入库状态")
    var rkStat: Int?,
    @param:Schema(description = "审核意见")
    val comments: String?,
) {
    fun toProjectNonInvestmentConfirmation(): ProjectNonInvestmentConfirmation =
        ProjectNonInvestmentConfirmation {
            into(this)
        }

    fun into(record: ProjectNonInvestmentConfirmation): ProjectNonInvestmentConfirmation {
        record.projectName = projectName
        record.projectCode = projectCode
        record.cityDistrict = cityDistrict
        record.park = park
        record.projectAddress = projectAddress
        record.approvalDepartment = approvalDepartment
        record.recordNumber = recordNumber
        record.approvalDate = approvalDate
        record.applicationTime = applicationTime
        record.investmentType = investmentType
        record.investor = investor
        record.investmentAmount = investmentAmount
        record.isForeignCapital = isForeignCapital
        record.department = department
        record.projectType = projectType
        record.industryDirection = industryDirection
        record.industryCode = industryCode
        record.industryClassification = industryClassification
        record.fixedAssetInvestment = fixedAssetInvestment
        record.unifiedSocialCreditCode = unifiedSocialCreditCode
        record.mainProducts = mainProducts
        record.landUseType = landUseType
        record.landSupplyProgress = landSupplyProgress
        record.environmentalAssessment = environmentalAssessment
        record.safetyAssessment = safetyAssessment
        record.energyAssessment = energyAssessment
        record.constructionDrawingReview = constructionDrawingReview
        record.constructionPermitStatus = constructionPermitStatus
        record.remarks = remarks
        record.commencementDate = commencementDate
        record.kgzzcl = kgzzcl?.joinToString(",")
        record.progressImages = progressImages?.joinToString(",")
        record.isIncludedInDatabase = isIncludedInDatabase
        record.endDate = endDate
        record.jgzzcl = jgzzcl?.joinToString(",")
        record.isOnlineApproval = isOnlineApproval
        record.isLt = isLt
        record.ltCode = ltCode
        record.creator = creator
        record.status = status
        record.rkStat = rkStat
        return record
    }

    fun toExtZsProjectOperation(): ExtZsProjectOperation =
        ExtZsProjectOperation {
            intoExtZsProjectOperation(this)
        }

    fun intoExtZsProjectOperation(record: ExtZsProjectOperation): ExtZsProjectOperation {
        record.id = id
        record.name = projectName
        record.zoneName = query<SystemArea> { and(SystemArea::id eq park) }.first().name
        record.investor = investor
        record.projectAddress = projectAddress
        record.uCode = unifiedSocialCreditCode
        record.desc = mainProducts
        record.industryCode = industryCode
        record.industryName = industryClassification
        record.projType = industryDirection
        record.investMoney = (investmentAmount?.divide(BigDecimal.valueOf(10000)) ?: 0).toString()
        record.fixedInvest = (fixedAssetInvestment ?: 0).toString()
        record.pzwh = approvalDepartment
        record.checkStatDate = approvalDate
        record.kgzzcl = kgzzcl?.joinToString(",")
        record.jgzzcl = jgzzcl?.joinToString(",")
        record.startDateCommit = commencementDate?.atStartOfDay()
        record.completeDate = endDate?.atStartOfDay()
        return record
    }

}
