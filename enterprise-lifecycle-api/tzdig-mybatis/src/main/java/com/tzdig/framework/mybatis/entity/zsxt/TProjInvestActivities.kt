@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("t_proj_invest_activities", comment = "市（区）活动记录表")
open class TProjInvestActivities() : BaseModel<TProjInvestActivities>() {
    constructor(init: TProjInvestActivities.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）
     */
    @Column("code", comment = "市（区）")
    var code: String? = null

    /**
     * 市（区）
     */
    @Column("name", comment = "市（区）")
    var name: String? = null

    /**
     * 时间
     */
    @Column("start_time", comment = "时间")
    var startTime: String? = null

    /**
     * end_time
     */
    @Column("end_time", comment = "end_time")
    var endTime: String? = null

    /**
     * 活动内容
     */
    @Column("activity_content", comment = "活动内容")
    var activityContent: String? = null

    /**
     * 联络人姓名
     */
    @Column("lxrxm", comment = "联络人姓名")
    var lxrxm: String? = null

    /**
     * 职务
     */
    @Column("zw", comment = "职务")
    var zw: String? = null

    /**
     * 联系电话
     */
    @Column("lxdh", comment = "联系电话")
    var lxdh: String? = null

    /**
     * 市（区）参加活动主要领导
     */
    @Column("leaders", comment = "市（区）参加活动主要领导")
    var leaders: String? = null

    /**
     * 所属产业链代码
     */
    @Column("industry_code", comment = "所属产业链代码")
    var industryCode: String? = null

    /**
     * 所属产业链代码
     */
    @Column("industry_name", comment = "所属产业链代码")
    var industryName: String? = null

    /**
     * 园区 code
     */
    @Column("zone_code", comment = "园区 code")
    var zoneCode: String? = null

    /**
     * 园区名称
     */
    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    /**
     * 街镇
     */
    @Column("town_code", comment = "街镇")
    var townCode: String? = null

    /**
     * 街镇名
     */
    @Column("town_name", comment = "街镇名")
    var townName: String? = null

    /**
     * 驻京办名称
     */
    @Column("zjb_address", comment = "驻京办名称")
    var zjbAddress: String? = null

    /**
     * 驻京办 code
     */
    @Column("zjb_code", comment = "驻京办 code")
    var zjbCode: String? = null

    /**
     * 附件信息
     */
    @Column("images", comment = "附件信息")
    var images: String? = null

    /**
     * 审核人id
     */
    @Column("audit_id", comment = "审核人id")
    var auditId: String? = null

    /**
     * 0 待审核 1 审核通过 2 审核不通过
     */
    @Column("audit_status", comment = "0 待审核 1 审核通过 2 审核不通过")
    var auditStatus: Int? = null

    /**
     * 审核时间
     */
    @Column("audit_time", comment = "审核时间")
    var auditTime: LocalDateTime? = null

    /**
     * 审核意见
     */
    @Column("audit_remark", comment = "审核意见")
    var auditRemark: String? = null

   /**
    * 审核意见
    */
   @Transient
   var ids: List<String>? = null
}
