@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate

@Table("t_biz_invest_feedback", comment = "")
class TBizInvestFeedback() : BaseModel<TBizInvestFeedback>() {
    constructor(init: TBizInvestFeedback.() -> Unit) : this() {
        this.init()
    }

    /**
     *  园区联系人
     */
    @Column("zone_linker", comment = " 园区联系人")
    var zoneLinker: String? = null

    /**
     * 园区联系人电话
     */
    @Column("zone_linker_tel", comment = "园区联系人电话")
    var zoneLinkerTel: String? = null

    /**
     * 企业联系人
     */
    @Column("company_linker", comment = "企业联系人")
    var companyLinker: String? = null

    /**
     * 企业联系人电话
     */
    @Column("company_tel", comment = "企业联系人电话")
    var companyTel: String? = null

    /**
     * 反馈内容
     */
    @Column("feedback", comment = "反馈内容")
    var feedback: String? = null

    /**
     * 反馈日期
     */
    @Column("fb_date", comment = "反馈日期")
    var fbDate: String? = null

    /**
     * 创建人的id,前端界面不管理,插入时用登录人帐号赋值
     */
    @Column("creator_id", comment = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    var creatorId: String? = null

    /**
     * 创建人姓名
     */
    @Column("creator_name", comment = "创建人姓名")
    var creatorName: String? = null

    /**
     * 投资信息表ID
     */
    @Column("invest_id", comment = "投资信息表ID")
    var investId: Long? = null
}
