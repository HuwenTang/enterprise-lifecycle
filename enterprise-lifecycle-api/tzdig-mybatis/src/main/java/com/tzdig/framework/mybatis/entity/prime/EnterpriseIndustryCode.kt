@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("enterprise_industry_code")
class EnterpriseIndustryCode() : BaseModel<EnterpriseIndustryCode>() {
    constructor(init: EnterpriseIndustryCode.() -> Unit) : this() {
        this.init()
    }

    /**
     * 行业代码
     */
    @Column("industry_code", comment = "行业代码")
    var industryCode: String? = null

    /**
     * 行业名称
     */
    @Column("industry_name", comment = "行业名称")
    var industryName: String? = null
}
