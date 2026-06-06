@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("stat_project_stage", comment = "工改项目阶段统计")
class StatProjectStage() : BaseModel<StatProjectStage>() {
    constructor(init: StatProjectStage.() -> Unit) : this() {
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
     * 项目阶段
     */
    @Column("stage", comment = "项目阶段")
    var stage: String? = null

    /**
     * 进入当前阶段时间
     */
    @Column("stage_create_time", comment = "进入当前阶段时间")
    var stageCreateTime: LocalDateTime? = null
}
