@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_source", comment = "")
class TProjSource() : BaseModel<TProjSource>() {
    constructor(init: TProjSource.() -> Unit) : this() {
        this.init()
    }

    /**
     * name
     */
    @Column("name", comment = "name")
    var name: String? = null
}
