@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_common_dept", comment = "指代系统中所有的功能模块或页面 ")
class TCommonDept() : BaseModel<TCommonDept>() {
    constructor(init: TCommonDept.() -> Unit) : this() {
        this.init()
    }

    /**
     * 业务代码
     */
    @Column("_code", comment = "业务代码")
    var code: String? = null

    /**
     * dept_code
     */
    @Column("dept_code", comment = "dept_code")
    var deptCode: String? = null

    /**
     * dept_name
     */
    @Column("dept_name", comment = "dept_name")
    var deptName: String? = null

    /**
     * p_id
     */
    @Column("p_id", comment = "p_id")
    var pId: String? = null

    /**
     * linker
     */
    @Column("linker", comment = "linker")
    var linker: String? = null

    /**
     * link_tel
     */
    @Column("link_tel", comment = "link_tel")
    var linkTel: String? = null

    /**
     * dept_desc
     */
    @Column("dept_desc", comment = "dept_desc")
    var deptDesc: String? = null

    /**
     * order_idx
     */
    @Column("order_idx", comment = "order_idx")
    var orderIdx: Int? = null

    /**
     * 1-正常, 其它--不正常
     */
    @Column("dept_status", comment = "1-正常, 其它--不正常")
    var deptStatus: Short? = null

    /**
     * 单位,市区,园区,其它
     */
    @Column("dept_type", comment = "单位,市区,园区,其它")
    var deptType: String? = null

    /**
     * 级别
     */
    @Column("dept_level", comment = "级别")
    var deptLevel: Short? = null

    /**
     * A档 B档
     */
    @Column("dept_item", comment = "A档 B档")
    var deptItem: String? = null
}
