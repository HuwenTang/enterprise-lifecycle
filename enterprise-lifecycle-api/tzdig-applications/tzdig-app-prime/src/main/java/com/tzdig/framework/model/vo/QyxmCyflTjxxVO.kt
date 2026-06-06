package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.view.QyxmCyflTjxx
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class QyxmCyflTjxxVO(
    @Schema(description = "年份")
    val year: Long?,
    @Schema(description = "产业分类编码")
    val cybm: String?,
    @Schema(description = "产业分类名称")
    val cymc: String?,
    @Schema(description = "项目数量")
    val xmsl: Long?,
    @Schema(description = "项目金额（亿元）")
    val xmje: Double?,
    @Schema(description = "项目数量占比")
    val slzb: BigDecimal?
    ) {
    constructor(record: QyxmCyflTjxx) : this(
        year = record.year,
        cybm = record.cybm,
        cymc = record.cymc,
        xmsl = record.xmsl,
        xmje = record.xmje,
        slzb = record.slzb
    )
}
