@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentRecommend
import java.time.LocalDateTime

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectInvestmentRecommendExcelRow(
    @field:ExcelProperty("创建人账号")
    var createBy: String? = null,
    @field:ExcelProperty("项目名称")
    var projName: String? = null,
    @field:ExcelProperty("所属部门")
    var dept: String? = null,
    @field:ExcelProperty("区县")
    var district: String? = null,
    @field:ExcelProperty("承载园区")
    var park: String? = null,
    @field:ExcelProperty("项目信息")
    var projInfo: String? = null,
    @field:ExcelProperty("项目环节")
    var projStep: String? = null,
    @field:ExcelProperty("活动时间")
    var activityTime: LocalDateTime? = null,
    @field:ExcelProperty("参与人员")
    var participants: String? = null,
    @field:ExcelProperty("拜访对象")
    var target: String? = null,
    @field:ExcelProperty("活动内容")
    var content: String? = null,
    @field:ExcelProperty("取得成果")
    var achievement: String? = null,
    @field:ExcelProperty("图片")
    var image: String? = null,
    @field:ExcelProperty("招商id")
    var digitalInvestmentId: String? = null,
) : ExcelRow<ProjectInvestmentRecommendExcelRow>() {
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
        record.image = image
        record.digitalInvestmentId = digitalInvestmentId
        return record
    }
}
