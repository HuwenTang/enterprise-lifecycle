package com.tzdig.framework.model.pojo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.core.annotation.JsonDecimal
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.web.annotation.ExcelAreaName
import com.tzdig.framework.web.annotation.ExcelLabel
import io.swagger.v3.oas.annotations.media.Schema

class ProjectSGDZ(
    @get:Schema(description = "id")
    @ExcelIgnore
    val id: String? = null,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String? = null,
    @get:Schema(description = "项目状态")
    @ExcelProperty("项目状态")
    @ExcelLabel("project_progress")
    val currentProjectProgress: String?,
    @get:Schema(description = "市区")
    @ExcelProperty("市区")
    @ExcelAreaName
    val district: String? = null,
    @get:Schema(description = "园区")
    @ExcelProperty("园区")
    @ExcelAreaName
    val park: String? = null,
    @get:Schema(description = "项目简介")
    @ExcelProperty("项目简介")
    val projectContent: String? = null,
    @get:Schema(description = "招引部门")
    @ExcelProperty("招引部门")
    val sjjgName: String? = null,
    @get:Schema(description = "项目得分")
    @ExcelProperty("项目得分")
    @get:JsonDecimal(4)
    var projectScore: Float?,
) {
    constructor(record: ProjectDigitalInvestmentAttracting) : this(
        id = record.id,
        projectName = record.projectName,
        currentProjectProgress = record.currentProjectProgress?.value,
        district = record.district,
        park = record.park,
        projectContent = record.projectContent,
        sjjgName = record.sjjgName,
        projectScore = null
    )
}
