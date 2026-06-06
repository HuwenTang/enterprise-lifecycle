@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("gdp_statistical_data", comment = "分市区基础数据明细")
class GdpStatisticalData() : BaseModel<GdpStatisticalData>() {
    constructor(init: GdpStatisticalData.() -> Unit) : this() {
        this.init()
    }

    /**
     * 年
     */
    @Column("year", comment = "年")
    var year: Int? = null

    /**
     * 地区
     */
    @Column("area", comment = "地区")
    var area: String? = null

    /**
     * 行业
     */
    @Column("industry", comment = "行业")
    var industry: String? = null

    /**
     * 行业增速数据
     */
    @Column("industrial_growth_statistics", comment = "行业增速数据")
    var industrialGrowthStatistics: Float? = null

    /**
     * 数据记录关联ID
     */
    @Column("record_id", comment = "数据记录关联ID")
    var recordId: String? = null
}
