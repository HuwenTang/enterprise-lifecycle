@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("ext_hlw_jg_org")
class ExtHlwJgOrg() : BaseModel<ExtHlwJgOrg>() {
    constructor(init: ExtHlwJgOrg.() -> Unit) : this() {
        this.init()
    }

    /**
     * 机构id
     */
    @Column("organization_id", comment = "机构id")
    var organizationId: String? = null

    /**
     * 机构名称
     */
    @Column("organization_name", comment = "机构名称")
    var organizationName: String? = null

    /**
     * 父机构ID
     */
    @Column("parent_id", comment = "父机构ID")
    var parentId: String? = null

    /**
     * 行政区划
     */
    @Column("origion", comment = "行政区划")
    var origion: String? = null

    /**
     * 泰政通id
     */
    @Column("tgovt_id", comment = "泰政通id")
    var tgovtId: String? = null
}
