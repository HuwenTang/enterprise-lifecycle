@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

@Table("qyxm_tjxx")
class QyxmTjxx() : MapperModel<QyxmTjxx> {
    constructor(init: QyxmTjxx.() -> Unit) : this() {
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
    @get:JsonDecimal(2)
    var xmzje: Double? = null

    /**
     * nzsl
     */
    @Schema(description = "内资项目数")
    @Column("nzsl", comment = "内资项目数")
    var nzsl: Long? = null

    /**
     * nzje
     */
    @Schema(description = "内资金额（亿元）")
    @Column("nzje", comment = "内资金额（亿元）")
    @get:JsonDecimal(2)
    var nzje: Double? = null

    /**
     * wzsl
     */
    @Schema(description = "外资项目数")
    @Column("wzsl", comment = "外资项目数")
    var wzsl: Long? = null

    /**
     * wzje
     */
    @Schema(description = "外资金额（亿美元）")
    @Column("wzje", comment = "外资金额（亿美元）")
    @get:JsonDecimal(2)
    var wzje: Double? = null

    /**
     * byxzsl
     */
    @Schema(description = "本月新增项目数")
    @Column("byxzsl", comment = "本月新增项目数")
    var byxzsl: Long? = null

    /**
     * byxzje
     */
    @Schema(description = "本月新增投资额（亿元）")
    @Column("byxzje", comment = "本月新增投资额（亿元）")
    @get:JsonDecimal(2)
    var byxzje: Double? = null
}
