@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_task", comment = "")
class TProjTask() : BaseModel<TProjTask>() {
    constructor(init: TProjTask.() -> Unit) : this() {
        this.init()
    }

    /**
     * b_year
     */
    @Column("b_year", comment = "b_year")
    var Byear: String? = null

    /**
     * district_code
     */
    @Column("district_code", comment = "district_code")
    var districtCode: String? = null

    /**
     * task_count
     */
    @Column("task_count", comment = "task_count")
    var taskCount: Int? = null

    /**
     * district
     */
    @Column("district", comment = "district")
    var district: String? = null

    /**
     * task_count_f
     */
    @Column("task_count_f", comment = "task_count_f")
    var taskCountF: Int? = null

    /**
     * five_count
     */
    @Column("five_count", comment = "five_count")
    var fiveCount: Int? = null

    /**
     * ten_count
     */
    @Column("ten_count", comment = "ten_count")
    var tenCount: Int? = null

    /**
     * zone_code
     */
    @Column("zone_code", comment = "zone_code")
    var zoneCode: String? = null

    /**
     * zone_name
     */
    @Column("zone_name", comment = "zone_name")
    var zoneName: String? = null

    /**
     * sfqx
     */
    @Column("sfqx", comment = "sfqx")
    var sfqx: Boolean? = null

    /**
     * town_name
     */
    @Column("town_name", comment = "town_name")
    var townName: String? = null

    /**
     * town_code
     */
    @Column("town_code", comment = "town_code")
    var townCode: String? = null

    /**
     * one_count
     */
    @Column("one_count", comment = "one_count")
    var oneCount: Int? = null
}
