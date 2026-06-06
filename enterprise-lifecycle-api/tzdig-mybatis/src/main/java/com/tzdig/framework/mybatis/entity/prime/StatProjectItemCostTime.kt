@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("stat_project_item_cost_time", comment = "工改项目事项时间")
class StatProjectItemCostTime() : BaseModel<StatProjectItemCostTime>() {
    constructor(init: StatProjectItemCostTime.() -> Unit) : this() {
        this.init()
    }

    /**
     * 工改ID
     */
    @Column("construction_approval_id", comment = "工改ID")
    var constructionApprovalId: String? = null

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     * 市（区）
     */
    @Column("administrative_division", comment = "市（区）")
    var district: String? = null

    /**
     * 园区
     */
    @Column("park", comment = "园区")
    var park: String? = null

    /**
     * 办件编号
     */
    @Column("document_number", comment = "办件编号")
    var documentNumber: String? = null

    /**
     * 事项名称
     */
    @Column("item_name", comment = "事项名称")
    var itemName: String? = null

    /**
     * 办件状态
     */
    @Column("doc_status", comment = "办件状态")
    var docStatus: String? = null

    /**
     * 花费时间（小时）
     */
    @Column("spend_time", comment = "花费时间（小时）")
    var spendTime: Long? = null


    @Column("start_time", comment = "开始时间")
    var startTime: LocalDateTime? = null
}
