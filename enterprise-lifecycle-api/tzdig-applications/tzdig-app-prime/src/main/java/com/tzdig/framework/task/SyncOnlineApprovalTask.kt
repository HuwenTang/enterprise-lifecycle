package com.tzdig.framework.task

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.tzdig.framework.core.annotation.CustomJob
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.mybatis.entity.prime.DsProject
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import com.tzdig.framework.mybatis.mapper.prime.DsProjectMapper
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class SyncOnlineApprovalTask(
    private val dsProjectMapper: DsProjectMapper,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Transactional
    @Scheduled(cron = "0 20 * * * ?")
    @Operation(summary = "同步在线审批")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        val cursor = dsProjectMapper.selectCursorByQuery(QueryWrapper())
        val records = mutableListOf<ProjectOnlineApproval>()
        for (dsProject in cursor) {
            val record = dsProject.toOnlineApproval()
            if (!record.updateById())
                records.add(record)
            if (records.size >= 1000) {
                records.batchInsert()
                records.clear()
            }
        }
        if (records.isNotEmpty())
            records.batchInsert()
    }

    @CustomJob
    @Suppress("unused")
    @Operation(summary = "同步在线审批ByProjectCode")
    fun syncOnlineApproval(projectCode: String) {
        val dsProject = queryOneById<DsProject>(projectCode)
        if (dsProject == null) {
            logger.warn("在线审批项目不存在:{}", projectCode)
            return
        }
        val record = dsProject.toOnlineApproval()
        if (!record.updateById())
            record.save()
    }

    fun DsProject.toOnlineApproval() = ProjectOnlineApproval {
        val dsProject = this@toOnlineApproval
        id = dsProject.dealCode
        approvalType = when (dsProject.auditType) {
            "A00001" -> "审批"
            "A00002" -> "核准"
            "A00003" -> "备案"
            else -> null
        }
        projectCode = dsProject.dealCode
        projectName = dsProject.applyProjectName
        applicationTime = dsProject.applyTime
        constructionNature = when (dsProject.projectType) {
            "0" -> "新建"
            "1" -> "扩建"
            "2" -> "迁建"
            "3" -> "改建"
            "4" -> "其他"
            else -> null
        }
        run {
            val projectProperty = dsProject.projectProperty?.split(',') ?: emptyList()
            val propertyB = "B00001" in projectProperty
            projectAttributes = when {
                "A00001" in projectProperty -> "民间投资"
                "A00002" in projectProperty -> "国有控股"
                "A00003" in projectProperty -> "其他"
                else -> null
            }
            if (propertyB) {
                if (projectAttributes.isNullOrEmpty()) {
                    projectAttributes = "B00001"
                } else {
                    projectAttributes += ",B00001"
                }
            }
        }
        plannedStartYear = dsProject.projectStarttime?.toShort()
        plannedEndYear = dsProject.projectEndtime?.toShort()
        constructionLocation = dsProject.addressDetail
        constructionScaleAndContent = dsProject.scaleContent
        totalInvestment = dsProject.totalMoney?.toFloat()
        landArea = dsProject.ydmj?.toFloat()
        newLandArea = dsProject.xzydmj?.toFloat()
        agriculturalLandArea = dsProject.nydmj?.toFloat()
        projectCapital = dsProject.xmzbj?.toFloat()
        fundingSource = when (dsProject.zjly) {
            "0" -> "政府"
            "1" -> "企业"
            "2" -> "混合"
            else -> null
        }
        isTechnicalReformProject = when (dsProject.isjgxm) {
            "0" -> "是"
            "1" -> "否"
            else -> null
        }
        legalCompany = dsProject.projectDept
        legalCompanyRegistrationType = when (dsProject.frxz) {
            "0" -> "国家机关"
            "1" -> "事业法人"
            "2" -> "国有企业法人"
            "3" -> "民营企业法人"
            "4" -> "外资企业法人"
            "5" -> "社团法人"
            else -> null
        }
        legalCompanyDocumentType = when (dsProject.personCerttype) {
            "0" -> "企业法人"
            "1" -> "国家机关法人"
            "2" -> "事业单位法人"
            "3" -> "社会团体法人"
            "4" -> "其他"
            "5" -> "企业营业执照"
            "6" -> "统一社会信用代码"
            else -> null
        }
        legalCompanyDocumentNumber = dsProject.personCertno
        legalCompanyContactName = dsProject.contact
        legalCompanyContactPhone = dsProject.contactTel
        legalCompanyContactEmail = dsProject.contactEmail
        legalCompanyLegalRepresentative = dsProject.legalPersonName
        applicationCompany = dsProject.projectDept
    }
}
