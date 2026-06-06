@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_sms_log", comment = "短信记录")
class SystemSmsLog() : BaseModel<SystemSmsLog>() {
    constructor(init: SystemSmsLog.() -> Unit) : this() {
        this.init()
    }

    /**
     * uuid
     */
    @Column("uuid", comment = "uuid")
    var uuid: String? = null

    /**
     * 手机号
     */
    @Column("mobile", comment = "手机号")
    var mobile: String? = null

    /**
     * 内容
     */
    @Column("content", comment = "内容")
    var content: String? = null
}
