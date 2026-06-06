@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_permission")
class UserPermission() : BaseModel<UserPermission>() {
    constructor(init: UserPermission.() -> Unit) : this() {
        this.init()
    }

    /**
     * 权限代码
     */
    @Column("code", comment = "权限代码")
    var code: String? = null

    /**
     * 权限说明
     */
    @Column("description", comment = "权限说明")
    var description: String? = null
}
