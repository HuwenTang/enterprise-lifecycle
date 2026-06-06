@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_pgyj", comment = "项目评估意见")
class TProjPgyj() : BaseModel<TProjPgyj>() {
    constructor(init: TProjPgyj.() -> Unit) : this() {
        this.init()
    }

    @Column("signed_id", comment = "项目id")
    var signedId: String? = null

    @Column("pgbm", comment = "评估部门")
    var pgbm: String? = null

    @Column("name", comment = "填报人")
    var name: String? = null

    @Column("pgyj", comment = "评估意见")
    var pgyj: String? = null

    @Column("status", comment = "状态")
    var status: String? = null
}
