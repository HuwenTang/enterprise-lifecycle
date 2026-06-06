@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("form_monitor_indicator_field")
class FormMonitorIndicatorField() : BaseModel<FormMonitorIndicatorField>() {
    constructor(init: FormMonitorIndicatorField.() -> Unit) : this() {
        this.init()
    }

    /**
     * 监测指标ID
     */
    @Column("monitor_indicator_id", comment = "监测指标ID")
    var monitorIndicatorId: String? = null

    /**
     * 字段名称
     */
    @Column("field_name", comment = "字段名称")
    var fieldName: String? = null

    /**
     * 字段类型
     */
    @Column("field_type", comment = "字段类型")
    var fieldType: String? = null

    /**
     * 字段单位
     */
    @Column("field_unit", comment = "字段单位")
    var fieldUnit: String? = null

    /**
     * 是否必填
     */
    @Column("not_null", comment = "是否必填")
    var notNull: Boolean? = null

    /**
     * 排序
     */
    @Column("sort", comment = "排序")
    var sort: Int? = null
}
