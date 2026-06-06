@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.EnumValue
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_menu", comment = "系统菜单")
class SystemMenu() : BaseModel<SystemMenu>() {
    constructor(init: SystemMenu.() -> Unit) : this() {
        this.init()
    }

    /**
     * 页面路径
     */
    @Column("path", comment = "页面路径")
    var path: String? = null

    /**
     * 目录名称
     */
    @Column("name", comment = "目录名称")
    var name: String? = null

    /**
     * 图标
     */
    @Column("icon", comment = "图标")
    var icon: String? = null

    /**
     * 上级目录
     */
    @Column("parent_id", comment = "上级目录")
    var parentId: String? = null

    /**
     * 客户端
     */
    @Column("endpoint", comment = "客户端")
    var endpoint: Endpoint? = null

    enum class Endpoint(@EnumValue val value: String) {
        PC("PC"),
        H5("H5"),
    }

    /**
     * 是否为菜单项
     */
    @Column("is_menu", comment = "是否为菜单项")
    var isMenu: Boolean? = null

    /**
     * 排序
     */
    @Column("sort", comment = "排序")
    var sort: Int? = null
}
