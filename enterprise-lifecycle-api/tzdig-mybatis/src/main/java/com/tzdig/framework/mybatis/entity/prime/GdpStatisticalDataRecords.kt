@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("gdp_statistical_data_records", comment = "分市区基础数据记录")
class GdpStatisticalDataRecords() : BaseModel<GdpStatisticalDataRecords>() {
    constructor(init: GdpStatisticalDataRecords.() -> Unit) : this() {
        this.init()
    }

    /**
     * 统计名称
     */
    @Column("statistics_name", comment = "统计名称")
    var statisticsName: String? = null

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: Int? = null

    /**
     * 数据来源
     */
    @Column("data_source", comment = "数据来源")
    var dataSource: String? = null
}
