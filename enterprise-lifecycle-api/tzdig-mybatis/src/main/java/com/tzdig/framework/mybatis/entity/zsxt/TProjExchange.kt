@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("t_proj_exchange", comment = "")
class TProjExchange() : BaseModel<TProjExchange>() {
    constructor(init: TProjExchange.() -> Unit) : this() {
        this.init()
    }

    /**
     * 年份
     */
    @Column("b_year", comment = "年份")
    var bYear: String? = null

    /**
     * 美元汇率
     */
    @Column("exchange_rate", comment = "美元汇率")
    var exchangeRate: BigDecimal? = null

    /**
     * 创建人的id,前端界面不管理,插入时用登录人帐号赋值
     */
    @Column("creator_id", comment = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    var creatorId: Int? = null

    /**
     * 创建人姓名
     */
    @Column("creator_name", comment = "创建人姓名")
    var creatorName: String? = null
}
