@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentRecommend
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectInvestmentRecommendDTO(
    @param:Schema(description = "创建人账号")
    var createBy: String?,
    @param:Schema(description = "项目名称")
    val projName: String?,
    @param:Schema(description = "所属部门")
    val dept: String?,
    @param:Schema(description = "区县")
    val district: String?,
    @param:Schema(description = "承载园区")
    val park: String?,
    @param:Schema(description = "项目信息")
    val projInfo: String?,
    @param:Schema(description = "项目环节")
    val projStep: String?,
    @param:Schema(description = "活动时间")
    val activityTime: LocalDateTime?,
    @param:Schema(description = "参与人员")
    val participants: String?,
    @param:Schema(description = "拜访对象")
    val target: String?,
    @param:Schema(description = "活动内容")
    val content: String?,
    @param:Schema(description = "取得成果")
    val achievement: String?,
    @param:Schema(description = "图片")
    val image: List<String>?,
    @param:Schema(description = "招商id")
    val digitalInvestmentId: String?,
) {
    fun toProjectInvestmentRecommend(): ProjectInvestmentRecommend =
        ProjectInvestmentRecommend {
            into(this)
        }

    fun into(record: ProjectInvestmentRecommend): ProjectInvestmentRecommend {
        record.createBy = createBy
        record.projName = projName
        record.dept = dept
        record.district = district
        record.park = park
        record.projInfo = projInfo
        record.projStep = projStep
        record.activityTime = activityTime
        record.participants = participants
        record.target = target
        record.content = content
        record.achievement = achievement
        record.image = image?.joinToString(",")
        record.digitalInvestmentId = digitalInvestmentId
        return record
    }
}
