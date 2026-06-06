package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_x_role", comment = "用户关联角色")
class UserXRole() : BaseModel<UserXRole>() {
    constructor(init: UserXRole.() -> Unit) : this() {
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
     * 角色ID
     */
    @Column("role_id", comment = "角色ID")
    var roleId: String? = null
}
