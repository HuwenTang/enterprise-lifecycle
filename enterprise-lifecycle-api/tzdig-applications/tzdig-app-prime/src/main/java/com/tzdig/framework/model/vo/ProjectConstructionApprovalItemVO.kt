package com.tzdig.framework.model.vo

import com.mybatisflex.annotation.Table
import io.swagger.v3.oas.annotations.media.Schema

@Table("project_construction_approval_process", dataSource = "gong-gai")
data class ProjectConstructionApprovalItemVO(
    @Schema(description = "项目类型")
    val type: String? = null,
    @Schema(description = "事项名称")
    val name: String? = null,
    @Schema(description = "审批部门")
    val department: String? = null,
    @Schema(description = "审批结果")
    val result: String? = null,
    @Schema(description = "审批时间")
    val time: String? = null,
    @Schema(description = "所属步骤")
    var stage:String? = null,
    @Schema(description = "是否基本事项")
    val isBasic: String? = null,
    @Schema(description = "办件时限")
    val limitTime: String? = null,
    @Schema(description = "事项id")
    val itemCode: String? = null,
)
