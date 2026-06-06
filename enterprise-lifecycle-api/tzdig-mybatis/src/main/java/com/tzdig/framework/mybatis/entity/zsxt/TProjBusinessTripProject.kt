@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_business_trip_project", comment = "因公出访关联项目表")
class TProjBusinessTripProject() : BaseModel<TProjBusinessTripProject>() {
    constructor(init: TProjBusinessTripProject.() -> Unit) : this() {
        this.init()
    }

    /**
     * 因公出访ID
     */
    @Column("trip_id", comment = "因公出访ID")
    var tripId: Long? = null

    /**
     * 项目ID(关联项目签约表)
     */
    @Column("proj_signed_id", comment = "项目ID(关联项目签约表)")
    var projSignedId: Long? = null
}
