@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Table("qyxm_cyfl_tjxx_view")
class QyxmCyflTjxx() : MapperModel<QyxmCyflTjxx> {
    constructor(init: QyxmCyflTjxx.() -> Unit) : this() {
        this.init()
    }

    /**
     * year
     */
    @Schema(description = "年份")
    @Column("year", comment = "年份")
    var year: Long? = null

    /**
     * cybm
     */
    @Schema(description = "产业分类编码")
    @Column("cybm", comment = "产业分类编码")
    var cybm: String? = null

    /**
     * cymc
     */
    @Schema(description = "产业分类名称")
    @Column("cymc", comment = "产业分类名称")
    var cymc: String? = null

    @Schema(description = "部门代码")
    @Column("dept_code", comment = "部门代码")
    var deptCode: String? = null
    /**
     * dept_name
     */
    @Schema(description = "部门名称")
    @Column("dept_name", comment = "部门名称")
    var deptName: String? = null
    /**
     * xmsl
     */
    @Schema(description = "项目数量")
    @Column("xmsl", comment = "项目数量")
    var xmsl: Long? = null

    /**
     * xmje
     */
    @Schema(description = "项目金额（亿元）")
    @Column("xmje", comment = "项目金额（亿元）")
    var xmje: Double? = null

    /**
     * slzb
     */
    @Schema(description = "项目数量占比")
    @Column("slzb", comment = "项目数量占比")
    var slzb: BigDecimal? = null
}
