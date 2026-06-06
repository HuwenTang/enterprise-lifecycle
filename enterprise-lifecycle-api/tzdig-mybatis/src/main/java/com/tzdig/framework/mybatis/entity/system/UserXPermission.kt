@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_x_permission")
class UserXPermission() : BaseModel<UserXPermission>() {
    constructor(init: UserXPermission.() -> Unit) : this() {
        this.init()
    }

    @Column(ignore = true)
    override var deleted: Boolean = false

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null

    /**
     * 权限代码
     */
    @Column("permission_code", comment = "权限代码")
    var permissionCode: String? = null
}
