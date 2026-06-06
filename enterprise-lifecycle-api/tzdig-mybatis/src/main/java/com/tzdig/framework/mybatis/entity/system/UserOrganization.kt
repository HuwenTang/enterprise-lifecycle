@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_organization")
class UserOrganization() : BaseModel<UserOrganization>() {
    constructor(init: UserOrganization.() -> Unit) : this() {
        this.init()
    }

    /**
     * 组织名称
     */
    @Column("name", comment = "组织名称")
    var name: String? = null

    /**
     * 父级组织ID
     */
    @Column("parent_id", comment = "父级组织ID")
    var parentId: String? = null

    /**
     * 分支路径
     */
    @Column("path", comment = "分支路径", ignore = true)
    var path: String? = null

    /**
     * 排序
     */
    @Column("sort", comment = "排序")
    var sort: Int? = null

    /**
     * 所属委办局
     */
    @Column("cob", comment = "所属委办局")
    var cob: String? = null
}
