@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("ztxm_ydqs_tjxx")
class ZtxmYdqsTjxx() : MapperModel<ZtxmYdqsTjxx> {
    constructor(init: ZtxmYdqsTjxx.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "年份")
    var year: Long? = null

    /**
     * month
     */
    @Schema(description = "月份")
    @Column("month", comment = "月份")
    var month: Long? = null

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
     * qnxmzsl
     */
    @Schema(description = "去年项目总数量")
    @Column("qnxmzsl", comment = "去年项目总数量")
    var qnxmzsl: Long? = null

    /**
     * qnxmzje
     */
    @Schema(description = "去年全市在谈项目总投资额（亿元）")
    @Column("qnxmzje", comment = "去年全市在谈项目总投资额（亿元）")
    var qnxmzje: BigDecimal? = null

    /**
     * sltb
     */
    @Schema(description = "项目数同比")
    @Column("sltb", comment = "项目数同比")
    var sltb: BigDecimal? = null

    /**
     * jetb
     */
    @Schema(description = "项目投资总额同比")
    @Column("jetb", comment = "项目投资总额同比")
    var jetb: BigDecimal? = null
}
