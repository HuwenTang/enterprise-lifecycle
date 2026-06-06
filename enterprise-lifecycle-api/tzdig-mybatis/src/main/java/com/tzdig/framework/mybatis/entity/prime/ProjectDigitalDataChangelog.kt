@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("project_digital_data_changelog", comment = "招商表字段变更记录")
class ProjectDigitalDataChangelog() : BaseModel<ProjectDigitalDataChangelog>() {
    constructor(init: ProjectDigitalDataChangelog.() -> Unit) : this() {
        this.init()
    }

    /**
     * 表名
     */
    @Column("table_name", comment = "表名")
    var tableName: String? = null

    /**
     * 表Id
     */
    @Column("table_id", comment = "表Id")
    var tableId: String? = null

    /**
     * 字段名称
     */
    @Column("field_name", comment = "字段名称")
    var fieldName: String? = null

    /**
     * 旧值
     */
    @Column("old_value", comment = "旧值")
    var oldValue: String? = null

    /**
     * 新值
     */
    @Column("new_value", comment = "新值")
    var newValue: String? = null

    /**
     * 变更人
     */
    @Column("author", comment = "变更人")
    var author: String? = null

    /**
     * 变更时间
     */
    @Column("changed_at", comment = "变更时间")
    var changedAt: LocalDateTime? = null
}
