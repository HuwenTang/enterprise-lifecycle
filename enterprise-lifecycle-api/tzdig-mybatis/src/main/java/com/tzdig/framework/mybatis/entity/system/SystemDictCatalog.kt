@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_dict_catalog")
class SystemDictCatalog() : BaseModel<SystemDictCatalog>() {
    constructor(init: SystemDictCatalog.() -> Unit) : this() {
        this.init()
    }

    /**
     * 父目录
     */
    @Column("parent_code", comment = "父目录")
    var parentCode: String? = null

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
}
