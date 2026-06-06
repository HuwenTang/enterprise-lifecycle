@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel

@Table(value = "USERS_QYSMZQ", dataSource = "internet-supervise")
class InternetSupervise() : MapperModel<InternetSupervise> {
    constructor(init: InternetSupervise.() -> Unit) : this() {
        this.init()
    }

    @Column("USER_ID", comment = "用户id")
    var userId: String? = null

    @Column("USER_NAME", comment = "用户名")
    var userName: String? = null

    @Column("ORG_ID", comment = "用户组织")
    var orgId: String? = null
}
