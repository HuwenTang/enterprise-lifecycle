@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_role")
class UserRole() : BaseModel<UserRole>() {
    constructor(init: UserRole.() -> Unit) : this() {
        this.init()
    }

    /**
     * 名称
     */
    @Column("name", comment = "名称")
    var name: String? = null

    /**
     * 是否为系统角色
     */
    @Column("system_role", comment = "是否为系统角色")
    var systemRole: Boolean? = null

    /**
     * 关联组织
     */
    @Column("organization_id", comment = "关联组织")
    var organizationId: String? = null
}
