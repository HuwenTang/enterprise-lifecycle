@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("form_file_report")
class FormFileReport() : BaseModel<FormFileReport>() {
    constructor(init: FormFileReport.() -> Unit) : this() {
        this.init()
    }

    /**
     * 任务名称
     */
    @Column("task_name", comment = "任务名称")
    var taskName: String? = null

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
     * 任务简介
     */
    @Column("description", comment = "任务简介")
    var description: String? = null

    /**
     * 文件模板
     */
    @Column("file_template", comment = "文件模板")
    var fileTemplate: String? = null
}
