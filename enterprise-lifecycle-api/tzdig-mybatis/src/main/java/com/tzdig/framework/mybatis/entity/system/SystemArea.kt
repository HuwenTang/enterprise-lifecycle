@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_area")
class SystemArea() : BaseModel<SystemArea>() {
    constructor(init: SystemArea.() -> Unit) : this() {
        this.init()
    }

    /**
     * 名称
     */
    @Column("name", comment = "名称")
    var name: String? = null

    /**
     * 区划级别
     */
    @Column("level", comment = "区划级别")
    var level: Short? = null

    /**
     * 上级区划
     */
    @Column("parent_code", comment = "上级区划")
    var parentCode: String? = null

    @Column("zs_dept", comment = "部门编号")
    var zsDept: String? = null

    @Column("sort", comment = "排序")
    var sort: Int? = null
}
