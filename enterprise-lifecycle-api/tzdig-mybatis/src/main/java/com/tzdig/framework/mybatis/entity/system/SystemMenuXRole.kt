@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_menu_x_role")
class SystemMenuXRole() : BaseModel<SystemMenuXRole>() {
    constructor(init: SystemMenuXRole.() -> Unit) : this() {
        this.init()
    }

    @Column(ignore = true)
    override var deleted: Boolean = false

    /**
     * 目录ID
     */
    @Column("menu_id", comment = "目录ID")
    var menuId: String? = null

    /**
     * 角色ID
     */
    @Column("role_id", comment = "角色ID")
    var roleId: String? = null
}
