@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("form_monitor_indicator")
class FormMonitorIndicator() : BaseModel<FormMonitorIndicator>() {
    constructor(init: FormMonitorIndicator.() -> Unit) : this() {
        this.init()
    }

    /**
     * 支撑指标ID
     */
    @Column("support_indicator_id", comment = "支撑指标ID")
    var supportIndicatorId: String? = null

    /**
     * 指标名称
     */
    @Column("indicator_name", comment = "指标名称")
    var indicatorName: String? = null

    /**
     * 收集频次
     */
    @Column("collection_frequency", comment = "收集频次")
    var collectionFrequency: String? = null

    /**
     * 责任部门
     */
    @Column("department", comment = "责任部门")
    var department: String? = null

    /**
     * 指标简介
     */
    @Column("description", comment = "指标简介")
    var description: String? = null
}
