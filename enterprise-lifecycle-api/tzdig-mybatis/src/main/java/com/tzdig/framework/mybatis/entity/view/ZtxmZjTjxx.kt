@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("ztxm_zj_tjxx")
class ZtxmZjTjxx() : MapperModel<ZtxmZjTjxx> {
    constructor(init: ZtxmZjTjxx.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "年份")
    var year: Long? = null

    /**
     * dept_code
     */
    @Schema(description = "镇街编码")
    @Column("dept_code", comment = "镇街编码")
    var deptCode: String? = null

    /**
     * dept_name
     */
    @Schema(description = "镇街名称")
    @Column("dept_name", comment = "镇街名称")
    var deptName: String? = null

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
    var nzzje: BigDecimal? = null

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
    var nzje1: BigDecimal? = null

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
    var nzje2: BigDecimal? = null

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
    var nzje3: BigDecimal? = null

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
    var nzje4: BigDecimal? = null

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
    var wzzje: BigDecimal? = null

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
    var wzje1: BigDecimal? = null

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
    var wzje2: BigDecimal? = null

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
    var wzje3: BigDecimal? = null

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
    var wzje4: BigDecimal? = null

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
    var xmzje: BigDecimal? = null

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
