@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_workflow", comment = "工作流")
class SystemWorkflow() : BaseModel<SystemWorkflow>() {
    constructor(init: SystemWorkflow.() -> Unit) : this() {
        this.init()
    }

    /**
     * 工作流代码
     */
    @Column("code", comment = "工作流代码")
    var code: String? = null

    /**
     * 工作流名称
     */
    @Column("name", comment = "工作流名称")
    var name: String? = null
}
