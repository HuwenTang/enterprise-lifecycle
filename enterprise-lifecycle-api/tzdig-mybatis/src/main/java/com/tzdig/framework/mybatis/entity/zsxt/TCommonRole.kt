@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Id
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_common_role", comment = "")
class TCommonRole() : BaseModel<TCommonRole>() {
    constructor(init: TCommonRole.() -> Unit) : this() {
        this.init()
    }

    /**
     * role_name
     */
    @Column("role_name", comment = "role_name")
    var roleName: String? = null

    /**
     * role_desc
     */
    @Column("role_desc", comment = "role_desc")
    var roleDesc: String? = null

    /**
     * 签约项目审核通过后是否可以编辑 1：是 0：否
     */
    @Column("sfbj", comment = "签约项目审核通过后是否可以编辑 1：是 0：否")
    var sfbj: String? = null
}
