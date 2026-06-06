@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_business_trip_dynamic", comment = "因公出访进展动态表")
class TProjBusinessTripDynamic() : BaseModel<TProjBusinessTripDynamic>() {
    constructor(init: TProjBusinessTripDynamic.() -> Unit) : this() {
        this.init()
    }

    /**
     * 关联出访记录ID
     */
    @Column("trip_id", comment = "关联出访记录ID")
    var tripId: Long? = null

    /**
     * 进展动态内容
     */
    @Column("content", comment = "进展动态内容")
    var content: String? = null

    /**
     * 填写时间(格式: yyyy-MM-dd)
     */
    @Column("fill_time", comment = "填写时间(格式: yyyy-MM-dd)")
    var fillTime: String? = null
}
