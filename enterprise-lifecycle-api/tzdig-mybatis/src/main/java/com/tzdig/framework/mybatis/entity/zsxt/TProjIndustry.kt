@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_industry", comment = "指代系统中所有的功能模块或页面 ")
class TProjIndustry() : BaseModel<TProjIndustry>() {
    constructor(init: TProjIndustry.() -> Unit) : this() {
        this.init()
    }

    /**
     * _code
     */
    @Column("_code", comment = "_code")
    var code: String? = null

    /**
     * _name
     */
    @Column("_name", comment = "_name")
    var name: String? = null

    /**
     * order_idx
     */
    @Column("order_idx", comment = "order_idx")
    var orderIdx: Int? = null

    /**
     * p_id
     */
    @Column("p_id", comment = "p_id")
    var pId: String? = null

    /**
     * 1-正常, 其它--不正常
     */
    @Column("_status", comment = "1-正常, 其它--不正常")
    var status: Short? = null

    /**
     * 原来的code
     */
    @Column("o_code", comment = "原来的code")
    var oCode: String? = null
}
