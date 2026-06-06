@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletion
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectDcdxEnterpriseCompletionVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市（区）名称，如：泰州市、海陵区等")
    @ExcelProperty("市（区）名称，如：泰州市、海陵区等")
    val district: String?,
    @get:Schema(description = "年份")
    @ExcelProperty("年份")
    val year: Int?,
    @get:Schema(description = "企业名称")
    @ExcelProperty("企业名称")
    val name: String?,
    @get:Schema(description = "进规纳统企业")
    @ExcelProperty("进规纳统企业")
    val isJgEnterprise: Boolean?,
    @get:Schema(description = "预估进规纳统企业")
    @ExcelProperty("预估进规纳统企业")
    val isYgjgEnterprise: Boolean?,
) {
    constructor(record: ProjectDcdxEnterpriseCompletion) : this(
        id = record.id,
        district = record.district,
        year = record.year,
        name = record.name,
        isJgEnterprise = record.isJgEnterprise,
        isYgjgEnterprise = record.isYgjgEnterprise,
    )
}
