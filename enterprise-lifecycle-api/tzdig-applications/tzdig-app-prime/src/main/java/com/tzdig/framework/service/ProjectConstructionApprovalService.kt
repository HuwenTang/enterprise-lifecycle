package com.tzdig.framework.service

import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval

interface ProjectConstructionApprovalService {
    fun getProjectConstructionApprovalStage(code: String): Int
    fun getProjectConstructionApprovalById(approvalId: String): ProjectConstructionApproval?
}
