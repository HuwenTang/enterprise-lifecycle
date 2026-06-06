package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema

data class OnlineApprovalProgressCountVO(
    @Schema(description = "总数量")
    val total: Long,
    @Schema(description = "完成数量")
    val completed: Long,
)
