@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("qyxm_zj_tjxx_view")
class QyxmZjTjxx() : MapperModel<QyxmZjTjxx> {
    constructor(init: QyxmZjTjxx.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "year")
    var year: Long? = null

    /**
     * dept_code
     */
    @Schema(description = "部门编码")
    @Column("dept_code", comment = "dept_code")
    var deptCode: String? = null

    /**
     * dept_name
     */
    @Schema(description = "部门名称")
    @Column("dept_name", comment = "dept_name")
    var deptName: String? = null

    /**
     * nzzsl
     */
    @Schema(description = "全市签约项目内资总数")
    @Column("nzzsl", comment = "nzzsl")
    var nzzsl: BigDecimal? = null

    /**
     * nzzje
     */
    @Schema(description = "全市签约项目内资总投资额（亿元）")
    @Column("nzzje", comment = "nzzje")
    var nzzje: Double? = null

    /**
     * nzsl1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的内资项目数")
    @Column("nzsl1", comment = "nzsl1")
    var nzsl1: BigDecimal? = null

    /**
     * nzje1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的内资金额（亿元）")
    @Column("nzje1", comment = "nzje1")
    var nzje1: Double? = null

    /**
     * nzsl2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资项目数")
    @Column("nzsl2", comment = "nzsl2")
    var nzsl2: BigDecimal? = null

    /**
     * nzje2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资金额（亿元）")
    @Column("nzje2", comment = "nzje2")
    var nzje2: Double? = null

    /**
     * nzsl3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资项目数")
    @Column("nzsl3", comment = "nzsl3")
    var nzsl3: BigDecimal? = null

    /**
     * nzje3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资金额（亿元）")
    @Column("nzje3", comment = "nzje3")
    var nzje3: Double? = null

    /**
     * nzsl4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的内资项目数")
    @Column("nzsl4", comment = "nzsl4")
    var nzsl4: BigDecimal? = null

    /**
     * nzje4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的内资金额（亿元）")
    @Column("nzje4", comment = "nzje4")
    var nzje4: Double? = null

    /**
     * wzzsl
     */
    @Schema(description = "全市签约项目外资总数")
    @Column("wzzsl", comment = "wzzsl")
    var wzzsl: BigDecimal? = null

    /**
     * wzzje
     */
    @Schema(description = "全市签约项目外资总投资额（亿美元）")
    @Column("wzzje", comment = "wzzje")
    var wzzje: Double? = null

    /**
     * wzsl1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的外资项目数")
    @Column("wzsl1", comment = "wzsl1")
    var wzsl1: BigDecimal? = null

    /**
     * wzje1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的外资金额（亿美元）")
    @Column("wzje1", comment = "wzje1")
    var wzje1: Double? = null

    /**
     * wzsl2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资项目数")
    @Column("wzsl2", comment = "wzsl2")
    var wzsl2: BigDecimal? = null

    /**
     * wzje2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资金额（亿美元）")
    @Column("wzje2", comment = "wzje2")
    var wzje2: Double? = null

    /**
     * wzsl3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资项目数")
    @Column("wzsl3", comment = "wzsl3")
    var wzsl3: BigDecimal? = null

    /**
     * wzje3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资金额（亿美元）")
    @Column("wzje3", comment = "wzje3")
    var wzje3: Double? = null

    /**
     * wzsl4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的外资项目数")
    @Column("wzsl4", comment = "wzsl4")
    var wzsl4: BigDecimal? = null

    /**
     * wzje4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的外资金额（亿美元）")
    @Column("wzje4", comment = "wzje4")
    var wzje4: Double? = null

    /**
     * xmzsl
     */
    @Schema(description = "项目总数量")
    @Column("xmzsl", comment = "xmzsl")
    var xmzsl: Long? = null

    /**
     * xmzje
     */
    @Schema(description = "全市在谈项目总投资额（亿元）")
    @Column("xmzje", comment = "xmzje")
    var xmzje: Double? = null

    /**
     * byxzsl
     */
    @Schema(description = "本月新增项目数")
    @Column("byxzsl", comment = "byxzsl")
    var byxzsl: BigDecimal? = null

    /**
     * byxzje
     */
    @Schema(description = "本月新增投资额（亿元）")
    @Column("byxzje", comment = "byxzje")
    var byxzje: Double? = null
}
