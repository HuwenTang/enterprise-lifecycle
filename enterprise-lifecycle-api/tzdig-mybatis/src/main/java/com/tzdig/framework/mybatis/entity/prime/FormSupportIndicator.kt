@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("form_support_indicator")
class FormSupportIndicator() : BaseModel<FormSupportIndicator>() {
    constructor(init: FormSupportIndicator.() -> Unit) : this() {
        this.init()
    }

    /**
     * 指标名称
     */
    @Column("indicator_name", comment = "指标名称")
    var indicatorName: String? = null

    /**
     * 牵头部门ID
     */
    @Column("department", comment = "牵头部门ID")
    var department: String? = null

    /**
     * 指标简介
     */
    @Column("description", comment = "指标简介")
    var description: String? = null
}
