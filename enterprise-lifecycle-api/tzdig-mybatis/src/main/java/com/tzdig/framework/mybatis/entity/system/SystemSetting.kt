@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_setting")
class SystemSetting() : BaseModel<SystemSetting>() {
    constructor(init: SystemSetting.() -> Unit) : this() {
        this.init()
    }

    /**
     * 配置项
     */
    @Column("name", comment = "配置项")
    var name: String? = null

    /**
     * 配置值
     */
    @Column("value", comment = "配置值")
    var value: String? = null

    /**
     * 配置描述
     */
    @Column("description", comment = "配置描述")
    var description: String? = null
}
