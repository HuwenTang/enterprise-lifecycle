@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

@Table("t_biz_invest", comment = "")
class TBizInvest() : BaseModel<TBizInvest>() {
    constructor(init: TBizInvest.() -> Unit) : this() {
        this.init()
    }

    /**
     * 投资公司
     */
    @Column("company_name", comment = "投资公司")
    var companyName: String? = null

    /**
     * 园区id
     */
    @Column("zone_id", comment = "园区id")
    var zoneId: Long? = null

    /**
     * zone_code
     */
    @Column("zone_code", comment = "zone_code")
    var zoneCode: String? = null

    /**
     * 园区名称
     */
    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    /**
     * 行业编码
     */
    @Column("industry_code", comment = "行业编码")
    var industryCode: String? = null

    /**
     * 行业名称
     */
    @Column("industry_name", comment = "行业名称")
    var industryName: String? = null

    /**
     * 联系人
     */
    @Column("linker", comment = "联系人")
    @Schema(description = "联系人")
    var linker: String? = null

    /**
     * 联系电话
     */
    @Column("linker_tel", comment = "联系电话")
    var linkerTel: String? = null

    /**
     * 填表时间
     */
    @Column("ct", comment = "填表时间")
    var ct: LocalDateTime? = null

    /**
     * 用户IP地址
     */
    @Column("ip", comment = "用户IP地址")
    var ip: String? = null

    /**
     * 投资说明
     */
    @Column("invest_desc", comment = "投资说明")
    var investDesc: String? = null

    /**
     * 园区电话
     */
    @Column("zone_tel", comment = "园区电话")
    var zoneTel: String? = null

    /**
     * 0-待审核  1-审核通过  2-不通过
     */
    @Column("status", comment = "0-待审核  1-审核通过  2-不通过")
    var status: Int? = null

    /**
     * is_feeback
     */
    @Column("feeback_is", comment = "feeback_is")
    var feebackIs: Int? = null

    /**
     * 1 PC 2 APP
     */
    @Column("ly", comment = "1 PC 2 APP")
    var ly: Int? = null
}
