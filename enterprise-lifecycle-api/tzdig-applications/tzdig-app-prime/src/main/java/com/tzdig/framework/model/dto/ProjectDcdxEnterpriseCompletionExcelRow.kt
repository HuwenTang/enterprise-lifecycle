@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletion

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectDcdxEnterpriseCompletionExcelRow(
    @field:ExcelProperty("市（区）名称，如：泰州市、海陵区等")
    var district: String? = null,
    @field:ExcelProperty("年份")
    var year: Int? = null,
    @field:ExcelProperty("企业名称")
    var name: String? = null,
    @field:ExcelProperty("进规纳统企业")
    var isJgEnterprise: Boolean? = null,
    @field:ExcelProperty("预估进规纳统企业")
    var isYgjgEnterprise: Boolean? = null,
) : ExcelRow<ProjectDcdxEnterpriseCompletionExcelRow>() {
    fun toProjectDcdxEnterpriseCompletion(): ProjectDcdxEnterpriseCompletion =
        ProjectDcdxEnterpriseCompletion {
            into(this)
        }

    fun into(record: ProjectDcdxEnterpriseCompletion): ProjectDcdxEnterpriseCompletion {
        record.district = district
        record.year = year
        record.name = name
        record.isJgEnterprise = isJgEnterprise
        record.isYgjgEnterprise = isYgjgEnterprise
        return record
    }
}
