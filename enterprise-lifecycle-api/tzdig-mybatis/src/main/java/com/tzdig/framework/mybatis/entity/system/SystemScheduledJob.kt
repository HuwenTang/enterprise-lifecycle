@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_scheduled_job", comment = "定时任务")
open class SystemScheduledJob() : BaseModel<SystemScheduledJob>() {
    constructor(init: SystemScheduledJob.() -> Unit) : this() {
        this.init()
    }

    @Column(ignore = true)
    override var deleted: Boolean = false

    /**
     * 实例IP
     */
    @Column("ip", comment = "实例IP")
    var ip: String? = null

    /**
     * 实例端口
     */
    @Column("port", comment = "实例端口")
    var port: Int? = null

    /**
     * 实例PID
     */
    @Column("pid", comment = "实例PID")
    var pid: Long? = null

    /**
     * 路径
     */
    @Column("context_path", comment = "路径")
    var contextPath: String? = null

    /**
     * 任务名称
     */
    @Column("summary", comment = "任务名称")
    var summary: String? = null

    /**
     * bean名称
     */
    @Column("bean_name", comment = "bean名称")
    var beanName: String? = null

    /**
     * bean类名
     */
    @Column("bean_class", comment = "bean类名")
    var beanClass: String? = null

    /**
     * 方法名称
     */
    @Column("method_name", comment = "方法名称")
    var methodName: String? = null

    /**
     * 定时任务属性
     */
    @Column("scheduled_props", comment = "定时任务属性")
    var scheduledProps: String? = null

    /**
     * 参数类型
     */
    @Column("parameter_types", comment = "参数类型")
    var parameterTypes: String? = null
}
