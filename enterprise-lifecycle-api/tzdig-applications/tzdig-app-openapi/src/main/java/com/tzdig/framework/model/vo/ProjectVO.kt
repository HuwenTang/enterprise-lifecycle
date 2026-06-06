package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectVO(
    @get:Schema(description = "项目id")
    val id: String?,
    @get:Schema(description = "项目编号")
    val projectNo: String?,
    @get:Schema(description = "招商ID")
    val zsId: String?,
    @get:Schema(description = "项目名称")
    val projectName: String?,
    @get:Schema(description = "项目进度")
    val projectProgress: String?,
    @get:Schema(description = "项目动态")
    var projectDynamic: String?,
    @get:Schema(description = "更新时间")
    val updateTime: LocalDateTime? = null,
) {

    @get:Schema(description = "当前项目进度")
    @ExcelProperty("当前项目进度")
    @get:JsonLabel("project_progress")
    var projectProgressLabel: String? = null
        get() = projectProgress
        private set

    constructor(record: ProjectDigitalInvestmentAttracting) : this(
        id = record.id!!,
        projectNo = record.projectCode,
        projectName = record.projectName,
        projectProgress = record.currentProjectProgress?.value,
        projectDynamic = null,
        zsId = record.investOnlineId?.toString(),
        updateTime = record.updateTime
    )
}
