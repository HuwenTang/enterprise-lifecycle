package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "项目预评估列表VO")
data class ProjectPreEvaluationVO(
    @get:Schema(description = "项目ID")
    val id: String?,
    
    @get:Schema(description = "项目名称")
    val projectName: String?,
    
    @get:Schema(description = "所属板块（园区名称）")
    val parkName: String? = null,
    
    @get:Schema(description = "国民经济分类")
    val industryClassification: String?,
    
    @get:Schema(description = "投资方")
    val investor: String?,
    
    @get:Schema(description = "投资总额（亿元）")
    val totalInvestmentCny: Double?,
    
    @get:Schema(description = "园区ID")
    val park: String?,
    
    @get:Schema(description = "评估状态：未完成/已完成")
    val evaluationStatus: String?,
    
    @get:Schema(description = "年度（查询条件）")
    val year: Int? = null,
    
    @get:Schema(description = "产业类型（查询条件）")
    val projectType: String? = null,
    
    @get:Schema(description = "部门名称（查询条件）")
    val deptName: String? = null
)
