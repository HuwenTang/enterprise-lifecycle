@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

@Table("qyxm_gm_tjxx")
class QyxmGmTjxx() : MapperModel<QyxmGmTjxx> {
    constructor(init: QyxmGmTjxx.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "年份")
    var year: String? = null

    @Schema(description = "区县编码")
    @Column("dept_code", comment = "区县编码")
    var deptCode: String? = null

    @Schema(description = "区县名称")
    @Column("dept_name", comment = "区县名称")
    var deptName: String? = null

    /**
     * nzzsl
     */
    @Schema(description = "全市签约项目内资总数")
    @Column("nzzsl", comment = "全市签约项目内资总数")
    var nzzsl: Long? = null

    /**
     * nzzje
     */
    @Schema(description = "全市签约项目内资总投资额（亿元）")
    @Column("nzzje", comment = "全市签约项目内资总投资额（亿元）")
    @get:JsonDecimal(2)
    var nzzje: Double? = null

    /**
     * nzsl1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的内资项目数")
    @Column("nzsl1", comment = "投资额在 0 到 1 亿元（1 千万美元）的内资项目数")
    var nzsl1: Long? = null

    /**
     * nzje1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的内资金额（亿元）")
    @Column("nzje1", comment = "投资额在 0 到 1 亿元（1 千万美元）的内资金额（亿元）")
    @get:JsonDecimal(2)
    var nzje1: Double? = null

    /**
     * nzsl2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资项目数")
    @Column("nzsl2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资项目数")
    var nzsl2: Long? = null

    /**
     * nzje2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资金额（亿元）")
    @Column("nzje2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的内资金额（亿元）")
    @get:JsonDecimal(2)
    var nzje2: Double? = null

    /**
     * nzsl3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资项目数")
    @Column("nzsl3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资项目数")
    var nzsl3: Long? = null

    /**
     * nzje3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资金额（亿元）")
    @Column("nzje3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的内资金额（亿元）")
    @get:JsonDecimal(2)
    var nzje3: Double? = null

    /**
     * nzsl4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的内资项目数")
    @Column("nzsl4", comment = "投资额在 10 亿元（1 亿美元）以上的内资项目数")
    var nzsl4: Long? = null

    /**
     * nzje4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的内资金额（亿元）")
    @Column("nzje4", comment = "投资额在 10 亿元（1 亿美元）以上的内资金额（亿元）")
    @get:JsonDecimal(2)
    var nzje4: Double? = null

    /**
     * wzzsl
     */
    @Schema(description = "全市签约项目外资总数")
    @Column("wzzsl", comment = "全市签约项目外资总数")
    var wzzsl: Long? = null

    /**
     * wzzje
     */
    @Schema(description = "全市签约项目外资总投资额（亿美元）")
    @Column("wzzje", comment = "全市签约项目外资总投资额（亿美元）")
    @get:JsonDecimal(2)
    var wzzje: Double? = null

    /**
     * wzsl1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的外资项目数")
    @Column("wzsl1", comment = "投资额在 0 到 1 亿元（1 千万美元）的外资项目数")
    var wzsl1: Long? = null

    /**
     * wzje1
     */
    @Schema(description = "投资额在 0 到 1 亿元（1 千万美元）的外资金额（亿美元）")
    @Column("wzje1", comment = "投资额在 0 到 1 亿元（1 千万美元）的外资金额（亿美元）")
    @get:JsonDecimal(2)
    var wzje1: Double? = null

    /**
     * wzsl2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资项目数")
    @Column("wzsl2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资项目数")
    var wzsl2: Long? = null

    /**
     * wzje2
     */
    @Schema(description = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资金额（亿美元）")
    @Column("wzje2", comment = "投资额在 1 亿元（1 千万美元）到 5 亿元（3 千万美元）的外资金额（亿美元）")
    @get:JsonDecimal(2)
    var wzje2: Double? = null

    /**
     * wzsl3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资项目数")
    @Column("wzsl3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资项目数")
    var wzsl3: Long? = null

    /**
     * wzje3
     */
    @Schema(description = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资金额（亿美元）")
    @Column("wzje3", comment = "投资额在 5 亿元（3 千万美元）到 10 亿元（1 亿美元）的外资金额（亿美元）")
    @get:JsonDecimal(2)
    var wzje3: Double? = null

    /**
     * wzsl4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的外资项目数")
    @Column("wzsl4", comment = "投资额在 10 亿元（1 亿美元）以上的外资项目数")
    var wzsl4: Long? = null

    /**
     * wzje4
     */
    @Schema(description = "投资额在 10 亿元（1 亿美元）以上的外资金额（亿美元）")
    @Column("wzje4", comment = "投资额在 10 亿元（1 亿美元）以上的外资金额（亿美元）")
    @get:JsonDecimal(2)
    var wzje4: Double? = null
}
