package com.tzdig.framework.mybatis.bo

import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

class ProjectStageStatBo {

    @Schema(description = "项目类型")
    val projectType: String? = null

    @Schema(description = "项目类型文本")
    val zhProjectType: String? = null

    @Schema(description = "项目编号")
    val projectCode: String? = null

    @Schema(description = "办件编号")
    val documentNumber: String? = null

    @Schema(description = "项目名称")
    val itemName: String? = null

    @Schema(description = "项目阶段")
    val stage: String? = null

    @Schema(description = "进入阶段时间")
    val createTime: LocalDateTime? = null
}
