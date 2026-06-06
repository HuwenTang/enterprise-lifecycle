@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel

@Table("t_common_dept")
//@Table("sys_dept")
class SysDept() : MapperModel<SysDept> {
    constructor(init: SysDept.() -> Unit) : this() {
        this.init()
    }

    /**
     * _id
     */
    @Column("id", comment = "_id")
    var id: Int? = null

    /**
     * _code
     */
    @Column("_code", comment = "_code")
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
     * dept_status
     */
    @Column("dept_status", comment = "dept_status")
    var deptStatus: Short? = null

    /**
     * dept_type
     */
    @Column("dept_type", comment = "dept_type")
    var deptType: String? = null

    /**
     * dept_level
     */
    @Column("dept_level", comment = "dept_level")
    var deptLevel: Short? = null

    /**
     * dept_item
     */
    @Column("dept_item", comment = "dept_item")
    var deptItem: String? = null
}
