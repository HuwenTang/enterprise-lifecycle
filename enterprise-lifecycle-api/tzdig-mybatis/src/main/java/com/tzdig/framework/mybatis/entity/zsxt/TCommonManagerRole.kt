@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Id
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_common_manager_role", comment = "")
class TCommonManagerRole() : BaseModel<TCommonManagerRole>() {
    constructor(init: TCommonManagerRole.() -> Unit) : this() {
        this.init()
    }

    /**
     * role_id
     */        @Id
    @Column("role_id", comment = "role_id")
    var roleId: Int? = null

    /**
     * manager_id
     */        @Id
    @Column("manager_id", comment = "manager_id")
    var managerId: Long? = null
}
