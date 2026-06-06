@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_tz_team", comment = "招商团队名录表")
class TProjTzTeam() : BaseModel<TProjTzTeam>() {
    constructor(init: TProjTzTeam.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市区
     */
    @Column("district", comment = "市区")
    var district: String? = null

    /**
     * 园区
     */
    @Column("zone", comment = "园区")
    var zone: String? = null

    /**
     * 镇街
     */
    @Column("town", comment = "镇街")
    var town: String? = null

    /**
     * 姓名
     */
    @Column("name", comment = "姓名")
    var name: String? = null

    /**
     * 专攻方向
     */
    @Column("specialization", comment = "专攻方向")
    var specialization: String? = null

    /**
     * 联系方式
     */
    @Column("phone", comment = "联系方式")
    var phone: String? = null

    /**
     * 职务
     */
    @Column("position", comment = "职务")
    var position: String? = null

    /**
     * 市区编码
     */
    @Column("district_code", comment = "市区编码")
    var districtCode: String? = null

    /**
     * 园区编码
     */
    @Column("zone_code", comment = "园区编码")
    var zoneCode: String? = null

    /**
     * 镇街编码
     */
    @Column("town_code", comment = "镇街编码")
    var townCode: String? = null

    /**
     * 镇街编码
     */
    @Column("csrq", comment = "")
    var csrq: String? = null

    /**
     * 学历
     */
    @Column("xl", comment = "学历")
    var xl: String? = null

    /**
     * 职称
     */
    @Column("zc", comment = "职称")
    var zc: String? = null

    /**
     * 招商区域
     */
    @Column("invest_place", comment = "招商区域")
    var investPlace: String? = null

    /**
     * 备注
     */
    @Column("remark", comment = "备注")
    var remark: String? = null
}
