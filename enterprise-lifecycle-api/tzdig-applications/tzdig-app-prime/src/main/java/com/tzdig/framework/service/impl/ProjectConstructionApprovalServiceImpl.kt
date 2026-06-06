package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNotNull
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApprovalProcess
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionItemInfo
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionRelation
import com.tzdig.framework.service.ProjectConstructionApprovalService
import org.springframework.stereotype.Service

@Service
class ProjectConstructionApprovalServiceImpl : ProjectConstructionApprovalService {

    override fun getProjectConstructionApprovalStage(code: String): Int {
        var projectType = queryOne<ProjectConstructionApproval> {
            select(ProjectConstructionApproval::projectType)
            where(ProjectConstructionApproval::projectCode eq code)
            and(ProjectConstructionApproval::projectType.isNotNull)}?.projectType
        projectType = when (projectType) {
            "ZFTZFWJZLXM1" -> "政府投资房屋建筑类项目"
            "ZFTZJCSSXXGCL2" -> "政府投资基础设施线性工程类"
            "YBSHTZLXM3" -> "一般社会投资类项目"
            "SHTZZXXGCXM4" -> "社会投资中小型工程项目"
            "SHTZDFACRYD5" -> "社会投资带方案出让用地"
            else -> "其他"
        }
        val documentNumbers = query<ProjectConstructionApprovalProcess> {
            select(ProjectConstructionApprovalProcess::documentNumber)
            where(ProjectConstructionApprovalProcess::projectCode eq code)
            and(ProjectConstructionApprovalProcess::documentNumber.isNotNull)
        }.map { it.documentNumber!! }
        if (documentNumbers.isEmpty()) return 0

        val itemNames = query<ProjectConstructionItemInfo> {
            select(ProjectConstructionItemInfo::itemName)
            where(ProjectConstructionItemInfo::documentNumber inList documentNumbers)
            and(ProjectConstructionItemInfo::itemName.isNotNull)
        }.map { it.itemName!! }
        if (itemNames.isEmpty()) return 0
        val stages = query<ProjectConstructionRelation> {
            select(ProjectConstructionRelation::stage)
            where(ProjectConstructionRelation::itemName inList itemNames)
            and(ProjectConstructionRelation::isBasicProcess eq "是")
            and(ProjectConstructionRelation::type eq projectType)
        }.map { it.stage }
        if (stages.isEmpty()) return 0
        return when {
            stages.contains("竣工验收阶段") -> 4
            stages.contains("施工许可阶段") -> 3
            stages.contains("工程建设许可阶段") -> 2
            stages.contains("立项用地规划许可阶段") -> 1
            else -> 0
        }
    }

    override fun getProjectConstructionApprovalById(approvalId: String): ProjectConstructionApproval? {
        return queryOneById<ProjectConstructionApproval>(approvalId)
    }

}
