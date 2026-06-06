@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_type", comment = "")
class TProjType() : BaseModel<TProjType>() {
    constructor(init: TProjType.() -> Unit) : this() {
        this.init()
    }

    /**
     * _code
     */
    @Column("_code", comment = "_code")
    var code: String? = null

    /**
     * _name
     */
    @Column("_name", comment = "_name")
    var name: String? = null

    /**
     * p_id
     */
    @Column("p_id", comment = "p_id")
    var pId: String? = null

    /**
     * _status
     */
    @Column("_status", comment = "_status")
    var status: Short? = null

    /**
     * level
     */
    @Column("level", comment = "level")
    var level: Int? = null

    /**
     * order_flag
     */
    @Column("order_flag", comment = "order_flag")
    var orderFlag: Int? = null
}
