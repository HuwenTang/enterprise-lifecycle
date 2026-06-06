@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("ztxm_tjxx111")
class ZtxmTjxx111() : MapperModel<ZtxmTjxx111> {
    constructor(init: ZtxmTjxx111.() -> Unit) : this() {
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
    @Schema(description = "项目总数量")
    @Column("xmzsl", comment = "项目总数量")
    var xmzsl: Long? = null

    /**
     * xmzje
     */
    @Schema(description = "全市在谈项目总投资额（亿元）")
    @Column("xmzje", comment = "全市在谈项目总投资额（亿元）")
    var xmzje: BigDecimal? = null

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
    var nzje: BigDecimal? = null

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
    var wzje: BigDecimal? = null

    /**
     * byzqysl
     */
    @Schema(description = "本月在谈转签约项目数")
    @Column("byzqysl", comment = "本月在谈转签约项目数")
    var byzqysl: BigDecimal? = null

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
    var byxzje: BigDecimal? = null
}
