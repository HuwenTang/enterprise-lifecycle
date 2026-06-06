@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("enterprise_tag_by_year")
class EnterpriseTagByYear() : BaseModel<EnterpriseTagByYear>() {
    constructor(init: EnterpriseTagByYear.() -> Unit) : this() {
        this.init()
    }

    /**
     * 统一社会信用代码
     */
    @Column("uscc", comment = "统一社会信用代码")
    var uscc: String? = null

    /**
     * 标签
     */
    @Column("tag", comment = "标签")
    var tag: String? = null

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: Short? = null

    /**
     * 季度
     */
    @Column("quarter", comment = "季度")
    var quarter: Short? = null
}
