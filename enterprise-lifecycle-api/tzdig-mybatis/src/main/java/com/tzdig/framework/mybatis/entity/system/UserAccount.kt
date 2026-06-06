@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("user_account")
class UserAccount() : BaseModel<UserAccount>() {
    constructor(init: UserAccount.() -> Unit) : this() {
        this.init()
    }

    /**
     * 手机号
     */
    @Column("mobile", comment = "手机号")
    var mobile: String? = null

    /**
     * sha1(id+sha1(密码))
     */
    @Column("password", comment = "sha1(id+sha1(密码))")
    var password: String? = null

    /**
     * 真实姓名
     */
    @Column("real_name", comment = "真实姓名")
    var realName: String? = null

    /**
     * 泰政通授权
     */
    @Column("grant_for_taizhengtong", comment = "泰政通授权")
    var grantForTaizhengtong: Boolean? = null

    /**
     * 上次登录时间
     */
    @Column("last_login_time", comment = "上次登录时间")
    var lastLoginTime: LocalDateTime? = null

    @Transient
    var userLevel: String? = null
}
