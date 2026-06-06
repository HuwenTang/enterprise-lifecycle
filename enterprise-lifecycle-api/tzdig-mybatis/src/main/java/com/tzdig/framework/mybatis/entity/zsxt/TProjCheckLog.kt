@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("t_proj_check_log", comment = "")
class TProjCheckLog() : BaseModel<TProjCheckLog>() {
    constructor(init: TProjCheckLog.() -> Unit) : this() {
        this.init()
    }

    /**
     * manager_id
     */
    @Column("manager_id", comment = "manager_id")
    var managerId: Long? = null

    /**
     * manager_name
     */
    @Column("manager_name", comment = "manager_name")
    var managerName: String? = null

    /**
     * 项目id
     */
    @Column("proj_id", comment = "项目id")
    var projId: Long? = null

    /**
     * 项目名称
     */
    @Column("proj_name", comment = "项目名称")
    var projName: String? = null

    /**
     * progress
     */
    @Column("progress", comment = "progress")
    var progress: Short? = null

    /**
     * 审核时间
     */
    @Column("check_time", comment = "审核时间")
    var checkTime: LocalDateTime? = null

    /**
     * 1-通过 2-不通过
     */
    @Column("check_result", comment = "1-通过 2-不通过")
    var checkResult: Boolean? = null

    /**
     * 审核描述(不通过原因)
     */
    @Column("_desc", comment = "审核描述(不通过原因)")
    var desc: String? = null
}
