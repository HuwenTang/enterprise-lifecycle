@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_business_trip", comment = "因公出访招商项目情况表")
class TProjBusinessTrip() : BaseModel<TProjBusinessTrip>() {
    constructor(init: TProjBusinessTrip.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）
     */
    @Column("code", comment = "市（区）")
    var code: String? = null

    /**
     * 市（区）
     */
    @Column("name", comment = "市（区）")
    var name: String? = null


    /**
     * 园区 code
     */
    @Column("zone_code", comment = "园区 code")
    var zoneCode: String? = null

    /**
     * 园区名称
     */
    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    /**
     * 街镇
     */
    @Column("town_code", comment = "街镇")
    var townCode: String? = null

    /**
     * 街镇名
     */
    @Column("town_name", comment = "街镇名")
    var townName: String? = null

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: String? = null

    /**
     * 团组名称
     */
    @Column("group_name", comment = "团组名称")
    var groupName: String? = null

    /**
     * 主要成员
     */
    @Column("main_members", comment = "主要成员")
    var mainMembers: String? = null

    /**
     * 出访地（国家、地区）
     */
    @Column("visit_destination", comment = "出访地（国家、地区）")
    var visitDestination: String? = null

    /**
     * 主要开展活动和拜访企业
     */
    @Column("activities_and_visits", comment = "主要开展活动和拜访企业")
    var activitiesAndVisits: String? = null

    /**
     * 取得成果
     */
    @Column("achievements", comment = "取得成果")
    var achievements: String? = null

    /**
     * 下一步打算
     */
    @Column("next_plan", comment = "下一步打算")
    var nextPlan: String? = null
}
