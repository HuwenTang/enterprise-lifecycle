@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate

@Table("t_proj_money", comment = "")
class TProjMoney() : BaseModel<TProjMoney>() {
    constructor(init: TProjMoney.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目的id
     */
    @Column("proj_id", comment = "项目的id")
    var projId: Long? = null

    /**
     * b_date
     */
    @Column("b_date", comment = "b_date")
    var bDate: LocalDate? = null

    /**
     * 到账金额
     */
    @Column("received_money", comment = "到账金额")
    var receivedMoney: Double? = null

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
     * 项目名称
     */
    @Column("pro_name", comment = "项目名称")
    var proName: String? = null
}
