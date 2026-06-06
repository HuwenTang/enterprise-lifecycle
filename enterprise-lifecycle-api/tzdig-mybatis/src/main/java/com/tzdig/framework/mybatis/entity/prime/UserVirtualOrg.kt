@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_virtual_org", comment = "用户虚拟组织")
class UserVirtualOrg() : BaseModel<UserVirtualOrg>() {
    constructor(init: UserVirtualOrg.() -> Unit) : this() {
        this.init()
    }

    /**
     * 虚拟组织编码
     */
    @Column("org_code", comment = "虚拟组织编码")
    var orgCode: String? = null

    /**
     * 虚拟组织名称
     */
    @Column("org_name", comment = "虚拟组织名称")
    var orgName: String? = null

    /**
     * 虚拟组织排序
     */
    @Column("org_sort", comment = "虚拟组织排序")
    var orgSort: Int? = null

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null
}
