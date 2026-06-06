@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.util.Date

@Table("t_biz_invest_check_log", comment = "")
class TBizInvestCheckLog() : BaseModel<TBizInvestCheckLog>() {
    constructor(init: TBizInvestCheckLog.() -> Unit) : this() {
        this.init()
    }

    /**
     * t_biz_invest表的主键
     */
    @Column("invest_id", comment = "t_biz_invest表的主键")
    var investId: Long? = null

    /**
     * 审核时间
     */
    @Column("ct", comment = "审核时间")
    var ct: Date? = null

    /**
     * 审核人id
     */
    @Column("manager_id", comment = "审核人id")
    var managerId: Long? = null

    /**
     * 审核人姓名
     */
    @Column("manager_name", comment = "审核人姓名")
    var managerName: String? = null

    /**
     * 审核描述
     */
    @Column("desc", comment = "审核描述")
    var desc: String? = null

    /**
     * 审核前状态
     */
    @Column("b_status", comment = "审核前状态")
    var bStatus: Int? = null

    /**
     * 审核后状态
     */
    @Column("a_status", comment = "审核后状态")
    var aStatus: Int? = null
}
