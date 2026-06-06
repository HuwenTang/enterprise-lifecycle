@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("qyxm_jz_tjxx111")
class QyxmJzTjxx111() : MapperModel<QyxmJzTjxx111> {
    constructor(init: QyxmJzTjxx111.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "年份")
    var year: String? = null

    /**
     * yqysl
     */
    @Schema(description = "已签约项目数")
    @Column("yqysl", comment = "已签约项目数")
    var yqysl: BigDecimal? = null

    /**
     * yqyje
     */
    @Schema(description = "已签约项目投资金额（亿元）")
    @Column("yqyje", comment = "已签约项目投资金额（亿元）")
    var yqyje: Double? = null

    /**
     * yzcsl
     */
    @Schema(description = "已注册项目数")
    @Column("yzcsl", comment = "已注册项目数")
    var yzcsl: BigDecimal? = null

    /**
     * yzcje
     */
    @Schema(description = "已注册项目投资金额（亿元）")
    @Column("yzcje", comment = "已注册项目投资金额（亿元）")
    var yzcje: Double? = null

    /**
     * ybasl
     */
    @Schema(description = "已备案项目数")
    @Column("ybasl", comment = "已备案项目数")
    var ybasl: BigDecimal? = null

    /**
     * ybaje
     */
    @Schema(description = "已备案项目投资金额（亿元）")
    @Column("ybaje", comment = "已备案项目投资金额（亿元）")
    var ybaje: Double? = null

    /**
     * wcbpsl
     */
    @Schema(description = "完成报批项目数")
    @Column("wcbpsl", comment = "完成报批项目数")
    var wcbpsl: BigDecimal? = null

    /**
     * wcbpje
     */
    @Schema(description = "完成报批项目投资金额（亿元）")
    @Column("wcbpje", comment = "完成报批项目投资金额（亿元）")
    var wcbpje: Double? = null

    /**
     * ykgsl
     */
    @Schema(description = "已开工项目数")
    @Column("ykgsl", comment = "已开工项目数")
    var ykgsl: BigDecimal? = null

    /**
     * ykgje
     */
    @Schema(description = "已开工项目投资金额（亿元）")
    @Column("ykgje", comment = "已开工项目投资金额（亿元）")
    var ykgje: Double? = null

    /**
     * yjgsl
     */
    @Schema(description = "已竣工项目数")
    @Column("yjgsl", comment = "已竣工项目数")
    var yjgsl: BigDecimal? = null

    /**
     * yjgje
     */
    @Schema(description = "已竣工项目投资金额（亿元）")
    @Column("yjgje", comment = "已竣工项目投资金额（亿元）")
    var yjgje: Double? = null
}
