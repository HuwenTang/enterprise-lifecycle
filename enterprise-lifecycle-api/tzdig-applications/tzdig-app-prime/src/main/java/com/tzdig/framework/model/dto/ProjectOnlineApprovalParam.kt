package com.tzdig.framework.model.dto

import io.swagger.v3.oas.annotations.media.Schema

data class ProjectOnlineApprovalParam(
    @get:Schema(description = "项目代码")
    val projectCode: String? = null,
    @get:Schema(description = "项目名称")
    val projectName: String? = null,
    @get:Schema(description = "项目审批类型")
    val approvalType: String? = null,
    @get:Schema(description = "建设性质")
    val constructionNature: String? = null,
    @get:Schema(description = "项目类型")
    val projectType: String? = null,
    @get:Schema(description = "是否技改项目")
    val isTechnicalReformProject: String? = null,
    @get:Schema(description = "产业政策类型")
    val industrialPolicyType: String? = null,
    @get:Schema(description = "法人单位是否为该项目的控股单位")
    val isLegalCompanyControllingForProject: String? = null,
)
