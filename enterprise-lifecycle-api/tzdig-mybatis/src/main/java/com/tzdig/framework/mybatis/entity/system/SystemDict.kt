@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_dict")
class SystemDict() : BaseModel<SystemDict>() {
    constructor(init: SystemDict.() -> Unit) : this() {
        this.init()
    }

    /**
     * 所属目录
     */
    @Column("catalog", comment = "所属目录")
    var catalog: String? = null

    /**
     * 代码
     */
    @Column("code", comment = "代码")
    var code: String? = null

    /**
     * 名称
     */
    @Column("label", comment = "名称")
    var label: String? = null

    /**
     * 状态
     */
    @Column("enabled", comment = "状态")
    var enabled: Boolean? = null

    /**
     * 排序
     */
    @Column("sort", comment = "排序")
    var sort: Int? = null
}
