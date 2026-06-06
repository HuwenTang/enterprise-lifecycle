@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_signed_qr_code", comment = "签约项目二维码")
class TProjSignedQrCode() : BaseModel<TProjSignedQrCode>() {
    constructor(init: TProjSignedQrCode.() -> Unit) : this() {
        this.init()
    }

    @Column("signed_id", comment = "项目id")
    var signedId: String? = null

    @Column("code", comment = "二维码code")
    var code: String? = null
}
