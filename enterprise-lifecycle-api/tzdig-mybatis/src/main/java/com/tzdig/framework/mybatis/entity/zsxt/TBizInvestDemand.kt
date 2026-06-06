@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

/**
 * 招商需求留言板
 * 业务流程: 园区录入(0) -> 市商务局审核(1) -> 驻外机构答复(2)
 */
@Table("t_biz_invest_demand", comment = "招商需求留言板")
open class TBizInvestDemand() : BaseModel<TBizInvestDemand>() {
    constructor(init: TBizInvestDemand.() -> Unit) : this() {
        this.init()
    }

    // ========== 地理区域字段 ==========

    @Column("district_code", comment = "市区编码")
    var districtCode: String? = null

    @Column("district_name", comment = "市区名称")
    var districtName: String? = null

    @Column("zone_code", comment = "园区编码")
    var zoneCode: String? = null

    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    @Column("town_code", comment = "镇街编码")
    var townCode: String? = null

    @Column("town_name", comment = "镇街名称")
    var townName: String? = null

    @Column("place", comment = "关联战区")
    var place: String? = null

    // ========== 需求内容字段 ==========

    @Column("title", comment = "需求标题")
    @Schema(description = "需求标题")
    var title: String? = null

    @Column("content", comment = "需求内容")
    @Schema(description = "需求内容")
    var content: String? = null

    @Column("expect_time", comment = "期望解决时间")
    @Schema(description = "期望解决时间")
    var expectTime: String? = null

    // ========== 联系人字段 ==========

    @Column("linker_name", comment = "联系人")
    @Schema(description = "联系人")
    var linkerName: String? = null

    @Column("linker_tel", comment = "联系方式")
    @Schema(description = "联系方式")
    var linkerTel: String? = null

    @Column("file_path", comment = "附件信息JSON")
    var filePath: String? = null

    // ========== 状态与审核字段 ==========

    @Column("status", comment = "状态: 0-待审核 1-已审核 2-已答复")
    @Schema(description = "状态: 0-待审核 1-已审核 2-已答复")
    var status: Int? = 0

    @Column("audit_id", comment = "审核人ID")
    var auditId: String? = null

    @Column("audit_name", comment = "审核人姓名")
    var auditName: String? = null

    @Column("audit_time", comment = "审核时间")
    var auditTime: LocalDateTime? = null

    @Column("audit_remark", comment = "审核意见")
    var auditRemark: String? = null

    // ========== 答复字段 ==========

    @Column("reply_id", comment = "答复人ID")
    var replyId: String? = null

    @Column("reply_name", comment = "答复人姓名")
    var replyName: String? = null

    @Column("reply_time", comment = "答复时间")
    var replyTime: LocalDateTime? = null

    @Column("reply_content", comment = "答复内容")
    var replyContent: String? = null

    // ========== 系统字段 ==========

    @Column("creator_id", comment = "创建人ID")
    var creatorId: String? = null

    @Column("creator_name", comment = "创建人姓名")
    var creatorName: String? = null
}