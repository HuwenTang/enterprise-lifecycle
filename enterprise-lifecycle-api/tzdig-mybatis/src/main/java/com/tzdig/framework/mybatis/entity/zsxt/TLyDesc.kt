@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("t_ly_desc", comment = "")
class TLyDesc() : BaseModel<TLyDesc>() {
    constructor(init: TLyDesc.() -> Unit) : this() {
        this.init()
    }

    /**
     * ly_id
     */
    @Column("ly_id", comment = "ly_id")
    var lyId: Long? = null

    /**
     * 处理结果
     */
    @Column("desc_content", comment = "处理结果")
    var descContent: String? = null

    /**
     * ct
     */
    @Column("ct", comment = "ct")
    var ct: LocalDateTime? = null

    /**
     * 处理人
     */
    @Column("cl_er", comment = "处理人")
    var clEr: String? = null
}
