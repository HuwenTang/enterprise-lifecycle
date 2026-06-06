@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("qyxm_tjxx111")
class QyxmTjxx111() : MapperModel<QyxmTjxx111> {
    constructor(init: QyxmTjxx111.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "年份")
    var year: String? = null

    /**
     * xmzsl
     */
    @Schema(description = "全市签约项目总数")
    @Column("xmzsl", comment = "全市签约项目总数")
    var xmzsl: Long? = null

    /**
     * xmzje
     */
    @Schema(description = "全市签约项目总投资额（亿元）")
    @Column("xmzje", comment = "全市签约项目总投资额（亿元）")
    var xmzje: Double? = null

    /**
     * nzsl
     */
    @Schema(description = "内资项目数")
    @Column("nzsl", comment = "内资项目数")
    var nzsl: BigDecimal? = null

    /**
     * nzje
     */
    @Schema(description = "内资金额（亿元）")
    @Column("nzje", comment = "内资金额（亿元）")
    var nzje: Double? = null

    /**
     * wzsl
     */
    @Schema(description = "外资项目数")
    @Column("wzsl", comment = "外资项目数")
    var wzsl: BigDecimal? = null

    /**
     * wzje
     */
    @Schema(description = "外资金额（亿美元）")
    @Column("wzje", comment = "外资金额（亿美元）")
    var wzje: Double? = null

    /**
     * byxzsl
     */
    @Schema(description = "本月新增项目数")
    @Column("byxzsl", comment = "本月新增项目数")
    var byxzsl: BigDecimal? = null

    /**
     * byxzje
     */
    @Schema(description = "本月新增投资额（亿元）")
    @Column("byxzje", comment = "本月新增投资额（亿元）")
    var byxzje: Double? = null
}
