@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("qyxm_gm_tjxx111")
class QyxmGmTjxx111() : MapperModel<QyxmGmTjxx111> {
    constructor(init: QyxmGmTjxx111.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "年份")
    var year: String? = null

    /**
     * nzzsl
     */
    @Schema(description = "全市签约项目内资总数")
    @Column("nzzsl", comment = "全市签约项目内资总数")
    var nzzsl: BigDecimal? = null

    /**
     * nzzje
     */
    @Schema(description = "全市签约项目内资总投资额（亿元）")
    @Column("nzzje", comment = "全市签约项目内资总投资额（亿元）")
    var nzzje: Double? = null

    /**
     * nzsl1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的内资项目数")
    @Column("nzsl1", comment = "投资额在 0 到 1 亿元（1 千万美元）的内资项目数")
    var nzsl1: BigDecimal? = null

    /**
     * nzje1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的内资金额（亿元）")
    @Column("nzje1", comment = "投资额在 0 到 1 亿元（1 千万美元）的内资金额（亿元）")
    var nzje1: Double? = null

    /**
     * nzsl2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资项目数")
    @Column("nzsl2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资项目数")
    var nzsl2: BigDecimal? = null

    /**
     * nzje2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资金额（亿元）")
    @Column("nzje2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资金额（亿元）")
    var nzje2: Double? = null

    /**
     * nzsl3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资项目数")
    @Column("nzsl3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资项目数")
    var nzsl3: BigDecimal? = null

    /**
     * nzje3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资金额（亿元）")
    @Column("nzje3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资金额（亿元）")
    var nzje3: Double? = null

    /**
     * nzsl4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的内资项目数")
    @Column("nzsl4", comment = "投资额在 10 亿元（1 亿美元）以上的内资项目数")
    var nzsl4: BigDecimal? = null

    /**
     * nzje4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的内资金额（亿元）")
    @Column("nzje4", comment = "投资额在 10 亿元（1 亿美元）以上的内资金额（亿元）")
    var nzje4: Double? = null

    /**
     * wzzsl
     */
    @Schema(description = "全市签约项目外资总数")
    @Column("wzzsl", comment = "全市签约项目外资总数")
    var wzzsl: BigDecimal? = null

    /**
     * wzzje
     */
    @Schema(description = "全市签约项目外资总投资额（亿美元）")
    @Column("wzzje", comment = "全市签约项目外资总投资额（亿美元）")
    var wzzje: Double? = null

    /**
     * wzsl1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的外资项目数")
    @Column("wzsl1", comment = "投资额在 0 到 1 亿元（1 千万美元）的外资项目数")
    var wzsl1: BigDecimal? = null

    /**
     * wzje1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的外资金额（亿美元）")
    @Column("wzje1", comment = "投资额在 0 到 1 亿元（1 千万美元）的外资金额（亿美元）")
    var wzje1: Double? = null

    /**
     * wzsl2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资项目数")
    @Column("wzsl2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资项目数")
    var wzsl2: BigDecimal? = null

    /**
     * wzje2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资金额（亿美元）")
    @Column("wzje2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资金额（亿美元）")
    var wzje2: Double? = null

    /**
     * wzsl3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资项目数")
    @Column("wzsl3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资项目数")
    var wzsl3: BigDecimal? = null

    /**
     * wzje3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资金额（亿美元）")
    @Column("wzje3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资金额（亿美元）")
    var wzje3: Double? = null

    /**
     * wzsl4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的外资项目数")
    @Column("wzsl4", comment = "投资额在 10 亿元（1 亿美元）以上的外资项目数")
    var wzsl4: BigDecimal? = null

    /**
     * wzje4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的外资金额（亿美元）")
    @Column("wzje4", comment = "投资额在 10 亿元（1 亿美元）以上的外资金额（亿美元）")
    var wzje4: Double? = null
}
