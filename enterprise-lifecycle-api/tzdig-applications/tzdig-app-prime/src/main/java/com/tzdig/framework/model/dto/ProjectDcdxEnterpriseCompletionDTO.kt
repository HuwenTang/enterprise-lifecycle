@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletion
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectDcdxEnterpriseCompletionDTO(
    @param:Schema(description = "市（区）名称，如：泰州市、海陵区等")
    val district: String?,
    @param:Schema(description = "年份")
    val year: Int?,
    @param:Schema(description = "企业名称")
    val name: String?,
    @param:Schema(description = "进规纳统企业")
    val isJgEnterprise: Boolean?,
    @param:Schema(description = "预估进规纳统企业")
    val isYgjgEnterprise: Boolean?,
) {
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
