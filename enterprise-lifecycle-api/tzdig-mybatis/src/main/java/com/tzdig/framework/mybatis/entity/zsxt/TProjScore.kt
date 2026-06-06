@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_score", comment = "项目加分")
class TProjScore() : BaseModel<TProjScore>() {
    constructor(init: TProjScore.() -> Unit) : this() {
        this.init()
    }

    @Column("zone_code", comment = "园区编码")
    var zoneCode: String? = null

    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    @Column("year", comment = "年份")
    var year: Int? = null

    @Column("month", comment = "月份")
    var month: Int? = null

    @Column("score", comment = "加分")
    var score: Double? = null

    @Column("remark", comment = "备注")
    var remark: String? = null

    @Column("district", comment = "区县")
    var district: String? = null

    @Column("district_code", comment = "区县编码")
    var districtCode: String? = null
}
