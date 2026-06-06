@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("t_proj_signed_fz", comment = "")
class ProjectSignedFz() : BaseModel<ProjectSignedFz>() {
    constructor(init: ProjectSignedFz.() -> Unit) : this() {
        this.init()
    }
    /**
     * 项目id
     */
    @Column("signed_id", comment = "项目id")
    var signedId: String? = null

    /**
     * 内容
     */
    @Column("content", comment = "内容")
    var content: String? = null


}
