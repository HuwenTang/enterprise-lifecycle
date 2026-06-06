@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import java.sql.Timestamp

@Table(value = "QYQSMZQ_DXJCJL")
class InternetSuperviseCheck() : MapperModel<InternetSuperviseCheck> {
    constructor(init: InternetSuperviseCheck.() -> Unit) : this() {
        this.init()
    }

    @Column("tyshxydm", comment = "统一社会信用代码")
    var tyshxydm: String? = null

    @Column("ztmc", comment = "主体名称")
    var ztmc: String? = null

    @Column("fqbm", comment = "发起部门")
    var fqbm: String? = null
    @Column("fksj", comment = "反馈时间")
    var fksj: Timestamp? = null
}
