@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_area_grants")
open class UserAreaGrants() : BaseModel<UserAreaGrants>() {
    constructor(init: UserAreaGrants.() -> Unit) : this() {
        this.init()
    }

    @Column(ignore = true)
    override var deleted: Boolean = false

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null

    /**
     * 区划ID
     */
    @Column("area_id", comment = "区划ID")
    var areaId: String? = null

    /**
     * 是否激活
     */
    @Column("active", comment = "是否激活")
    var active: Boolean? = null
}
