package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.deleteWith
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.dto.ProjectNonInvestmentConfirmationDTO
import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import com.tzdig.framework.mybatis.entity.prime.ProjectNonInvestmentConfirmation
import com.tzdig.framework.service.ProjectFilingService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProjectFilingServiceImpl : ProjectFilingService {
    //在修改和新建‘project_non_investment_confirmation’表时同步更新‘project_filing_info’表

    @Transactional
    fun updateProject(projectId: String) {
        //TODO:
    }

    @Transactional
    override fun createProject(dto: ProjectNonInvestmentConfirmationDTO) {
        val projectFilingInfo = queryOne<ProjectFilingInfo> {
            where(ProjectFilingInfo::projectCode eq dto.projectCode)
        }
        if (projectFilingInfo == null) {
            ProjectFilingInfo {
                projectCode = dto.projectCode
                projectName = dto.projectName
                district = dto.cityDistrict
                park = dto.park
                filingDepartment = dto.approvalDepartment
                filingCertificateNo = dto.recordNumber
                applyFilingTime = dto.applicationTime
                investmentAmount = dto.investmentAmount
                projectType = dto.projectType
                industryDirection = dto.industryDirection
                landUseType = dto.landUseType
                landSupplyProgress = dto.landSupplyProgress
                energyAssessmentStatus = dto.environmentalAssessment
                safetyAssessmentStatus = dto.safetyAssessment
                energyAssessmentStatus = dto.energyAssessment
                constructionDrawingReviewStatus = dto.constructionDrawingReview
                constructionPermitStatus = dto.constructionPermitStatus
            }.save()
        }
    }


    @Transactional
    override fun deleteProjectByCode(projectCode: String) {
        // 逻辑删除（设置 deleted = true）
        deleteWith<ProjectFilingInfo> {
            (ProjectFilingInfo::projectCode eq projectCode)
        }
        deleteWith<ProjectNonInvestmentConfirmation> {
            (ProjectNonInvestmentConfirmation::projectCode eq projectCode)
        }
    }
}
