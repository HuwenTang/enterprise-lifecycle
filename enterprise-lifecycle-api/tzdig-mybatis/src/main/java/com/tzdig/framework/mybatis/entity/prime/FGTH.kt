@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel

@Table(value = "QYQSMZQ_JJHK_FGTH", dataSource = "internet-supervise")
class FGTH() : MapperModel<FGTH> {
    constructor(init: FGTH.() -> Unit) : this() {
        this.init()
    }

    @Column("RQ", comment = "日期")
    var rq: String? = null

    @Column("FGTHZTS", comment = "非个体户主体数")
    var fgthzts: String? = null
}
