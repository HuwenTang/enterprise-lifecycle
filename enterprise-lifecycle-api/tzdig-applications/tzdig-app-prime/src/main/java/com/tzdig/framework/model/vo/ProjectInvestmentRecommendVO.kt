@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentRecommend
import com.tzdig.framework.web.annotation.JsonAreaName
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectInvestmentRecommendVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "创建人账号")
    @ExcelProperty("创建人账号")
    val createBy: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projName: String?,
    @get:Schema(description = "所属部门")
    @ExcelProperty("所属部门")
    val dept: String?,
    @get:Schema(description = "区县")
    @ExcelProperty("区县")
    val district: String?,
    @get:Schema(description = "承载园区")
    @ExcelProperty("承载园区")
    val park: String?,
    @get:Schema(description = "项目信息")
    @ExcelProperty("项目信息")
    val projInfo: String?,
    @get:Schema(description = "项目环节")
    @ExcelProperty("项目环节")
    val projStep: String?,
    @get:Schema(description = "活动时间")
    @ExcelProperty("活动时间")
    val activityTime: LocalDateTime?,
    @get:Schema(description = "参与人员")
    @ExcelProperty("参与人员")
    val participants: String?,
    @get:Schema(description = "拜访对象")
    @ExcelProperty("拜访对象")
    val target: String?,
    @get:Schema(description = "活动内容")
    @ExcelProperty("活动内容")
    val content: String?,
    @get:Schema(description = "取得成果")
    @ExcelProperty("取得成果")
    val achievement: String?,
    @get:Schema(description = "图片")
    @ExcelProperty("图片")
    var image: List<String>,
    @get:Schema(description = "招商id")
    @ExcelProperty("招商id")
    val digitalInvestmentId: String?,
) : S3Transformable {
    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "市（区）名称")
    val districtName: String?
        get() = district

    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "园区名称")
    val parkName: String?
        get() = park

    @get:Schema(description = "所属部门")
    @ExcelProperty("所属部门")
    @get:JsonLabel("collection_dept")
    var departmentLabel: String? = null
        get() = dept
        private set

    constructor(record: ProjectInvestmentRecommend) : this(
        id = record.id,
        createBy = record.createBy,
        projName = record.projName,
        dept = record.dept,
        district = record.district,
        park = record.park,
        projInfo = record.projInfo,
        projStep = record.projStep,
        activityTime = record.activityTime,
        participants = record.participants,
        target = record.target,
        content = record.content,
        achievement = record.achievement,
        image = record.image?.split(',') ?: emptyList(),
        digitalInvestmentId = record.digitalInvestmentId,
    )


    override fun s3transform(transform: (String) -> String) {
        image = image.map(transform)
    }

}
