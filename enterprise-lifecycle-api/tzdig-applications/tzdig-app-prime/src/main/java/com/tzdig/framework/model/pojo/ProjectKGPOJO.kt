package com.tzdig.framework.model.pojo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.web.annotation.ExcelAreaName
import com.tzdig.framework.web.annotation.ExcelLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

class ProjectKGPOJO(
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
    @get:Schema(description = "投资方")
    @ExcelProperty("投资方")
    val investor: String? = null,
    @get:Schema(description = "项目类别（内资、外资）")
    @ExcelProperty("项目类别（内资、外资）")
    val projectRating: String? = null,
    @get:Schema(description = "总投资额")
    @ExcelProperty("总投资额，内资时单位是亿元，外资时单位是万美元")
    val investmentAmount: Double? = null,
    @get:Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    val projectType: String? = null,
    @get:Schema(description = "是否科创")
    @ExcelProperty("是否科创")
    val ifKcProj: String? = null,
    @get:Schema(description = "是否qflp")
    @ExcelProperty("是否qflp")
    val ifQflp: String? = null,
    @get:Schema(description = "‘8+13+x’")
    @ExcelProperty("‘8+13+x’")
    val projectCategory: String? = null,
    @get:Schema(description = "计划总投资（万元）")
    @ExcelProperty("计划总投资（万元）")
    val plannedTotalInvestment: String? = null,
    @get:Schema(description = "开工时间")
    @ExcelProperty("开工时间")
    val startDate: LocalDate? = null,
    @get:Schema(description = "年度投资额(万元)")
    @ExcelProperty("年度投资额(万元)")
    var tzgm: Float? = null,
    @get:Schema(description = "是否增资扩产")
    @ExcelProperty("是否增资扩产")
    @ExcelLabel("boolean")
    val ifZzkc: Boolean? = null,
) {
    constructor(record: ProjectDigitalInvestmentAttracting) : this(
        projectName = record.projectName,
        currentProjectProgress = record.currentProjectProgress?.value,
        district = record.district,
        park = record.park,
        projectContent = record.projectContent,
        sjjgName = record.sjjgName,
        investor = record.investor,
        projectRating = record.projectRating,
        investmentAmount = record.investmentAmount,
        projectType = record.projectType,
        ifKcProj = record.isKcProj,
        ifQflp = record.isQflp,
        projectCategory = record.projectCategory,
        plannedTotalInvestment = record.plannedTotalInvestment,
        startDate = record.startConfirmDate,
        tzgm = record.tzgm,
        ifZzkc = record.isZzkc
    )
}

