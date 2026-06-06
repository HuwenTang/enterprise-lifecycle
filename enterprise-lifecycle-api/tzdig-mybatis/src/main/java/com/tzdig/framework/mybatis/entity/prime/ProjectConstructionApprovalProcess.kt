@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("project_construction_approval_process", dataSource = "gong-gai")
class ProjectConstructionApprovalProcess() : BaseModel<ProjectConstructionApprovalProcess>() {
    constructor(init: ProjectConstructionApprovalProcess.() -> Unit) : this() {
        this.init()
    }

    /**
     * 事项编码
     */
    @Column("item_code", comment = "事项编码")
    var itemCode: String? = null

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     * 流程实例ID（可选）
     */
    @Column("process_instance_id", comment = "流程实例ID（可选）")
    var processInstanceId: String? = null

    /**
     * 任务名称
     */
    @Column("task_name", comment = "任务名称")
    var taskName: String? = null

    /**
     * 发送人
     */
    @Column("sender", comment = "发送人")
    var sender: String? = null

    /**
     * 发送时间
     */
    @Column("send_time", comment = "发送时间")
    var sendTime: LocalDateTime? = null

    /**
     * 待接手人
     */
    @Column("pending_user", comment = "待接手人")
    var pendingUser: String? = null

    /**
     * 接手人
     */
    @Column("acceptor", comment = "接手人")
    var acceptor: String? = null

    /**
     * 接手时间
     */
    @Column("accept_time", comment = "接手时间")
    var acceptTime: LocalDateTime? = null

    /**
     * 完成时间
     */
    @Column("finish_time", comment = "完成时间")
    var finishTime: LocalDateTime? = null

    /**
     * 办理状态
     */
    @Column("status", comment = "办理状态")
    var status: String? = null

    /**
     * 办理意见
     */
    @Column("opinion", comment = "办理意见")
    var opinion: String? = null

    /**
     * 办件编号
     */
    @Column("document_number", comment = "办件编号")
    var documentNumber: String? = null
}
