@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_construction_item_info", dataSource = "gong-gai")
class ProjectConstructionItemInfo() : BaseModel<ProjectConstructionItemInfo>() {
    constructor(init: ProjectConstructionItemInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 事项编码
     */
    @Column("item_code", comment = "事项编码")
    var itemCode: String? = null

    /**
     * 事项名称
     */
    @Column("item_name", comment = "事项名称")
    var itemName: String? = null

    /**
     * 承诺时间
     */
    @Column("commitment_time", comment = "承诺时间")
    var commitmentTime: String? = null

    /**
     * 审批部门
     */
    @Column("approval_department", comment = "审批部门")
    var approvalDepartment: String? = null

    /**
     * 办件编号
     */
    @Column("document_number", comment = "办件编号")
    var documentNumber: String? = null
}
