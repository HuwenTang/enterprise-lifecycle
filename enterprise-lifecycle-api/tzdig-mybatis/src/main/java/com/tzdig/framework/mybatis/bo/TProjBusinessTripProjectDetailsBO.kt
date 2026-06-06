package com.tzdig.framework.mybatis.bo

import io.swagger.v3.oas.annotations.media.Schema

/**
 * 因公出访关联项目详情 BO
 */
data class TProjBusinessTripProjectDetailsBO(
    @Schema(description = "项目 ID")
    var id: String? = null,

    @Schema(description = "市区")
    var district: String? = null,

    @Schema(description = "园区")
    var zoneName: String? = null,

    @Schema(description = "镇街")
    var townName: String? = null,

    @Schema(description = "项目编码")
    var code: String? = null,

    @Schema(description = "项目名称")
    var name: String? = null,

    @Schema(description = "投资额")
    var investMoney: Double? = null,

    @Schema(description = "类别 (1-内资, 2-外资)")
    var pType: Short? = null
)
