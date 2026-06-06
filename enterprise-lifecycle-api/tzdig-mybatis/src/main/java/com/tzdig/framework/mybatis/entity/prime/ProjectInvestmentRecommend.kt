@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("project_investment_recommend", comment = "招商活动项目推荐")
class ProjectInvestmentRecommend() : BaseModel<ProjectInvestmentRecommend>() {
    constructor(init: ProjectInvestmentRecommend.() -> Unit) : this() {
        this.init()
    }

    /**
     * 创建人账号
     */
    @Column("create_by", comment = "创建人账号")
    var createBy: String? = null

    /**
     * 项目名称
     */
    @Column("proj_name", comment = "项目名称")
    var projName: String? = null

    /**
     * 所属部门
     */
    @Column("dept", comment = "所属部门")
    var dept: String? = null

    /**
     * 区县
     */
    @Column("district", comment = "区县")
    var district: String? = null

    /**
     * 承载园区
     */
    @Column("park", comment = "承载园区")
    var park: String? = null

    /**
     * 项目信息
     */
    @Column("proj_info", comment = "项目信息")
    var projInfo: String? = null

    /**
     * 项目环节
     */
    @Column("proj_step", comment = "项目环节")
    var projStep: String? = null

    /**
     * 活动时间
     */
    @Column("activity_time", comment = "活动时间")
    var activityTime: LocalDateTime? = null

    /**
     * 参与人员
     */
    @Column("participants", comment = "参与人员")
    var participants: String? = null

    /**
     * 拜访对象
     */
    @Column("target", comment = "拜访对象")
    var target: String? = null

    /**
     * 活动内容
     */
    @Column("content", comment = "活动内容")
    var content: String? = null

    /**
     * 取得成果
     */
    @Column("achievement", comment = "取得成果")
    var achievement: String? = null

    /**
     * 图片
     */
    @Column("image", comment = "图片")
    var image: String? = null

    /**
     * 招商id
     */
    @Column("digital_investment_id", comment = "招商id")
    var digitalInvestmentId: String? = null
}
