@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_x_organization")
class UserXOrganization() : BaseModel<UserXOrganization>() {
    constructor(init: UserXOrganization.() -> Unit) : this() {
        this.init()
    }

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null

    /**
     * 组织ID
     */
    @Column("organization_id", comment = "组织ID")
    var organizationId: String? = null

    /**
     * 是否为组织管理员
     */
    @Column("is_administrator", comment = "是否为组织管理员")
    var isAdministrator: Boolean? = null
}
