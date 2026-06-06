@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_industry_first", comment = "指代系统中所有的功能模块或页面 ")
class TProjIndustryFirst() : BaseModel<TProjIndustryFirst>() {
    constructor(init: TProjIndustryFirst.() -> Unit) : this() {
        this.init()
    }

    /**
     * 注意,不能重复
     */
    @Column("_code", comment = "注意,不能重复")
    var code: String? = null

    /**
     * _name
     */
    @Column("_name", comment = "_name")
    var name: String? = null

    /**
     * 1-正常, 其它--不正常
     */
    @Column("_status", comment = "1-正常, 其它--不正常")
    var status: Short? = null

    /**
     * 排序
     */
    @Column("order_idx", comment = "排序")
    var orderIdx: Int? = null

    /**
     * 原来的id
     */
    @Column("o_id", comment = "原来的id")
    var oId: String? = null
}
