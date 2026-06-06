@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletionStats
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxEnterpriseCompletionStatsDTO(
    @param:Schema(description = "市（区）名称，如：泰州市、海陵区等")
    val cityDistrict: String?,
    @param:Schema(description = "年份")
    val year: Int?,
    @param:Schema(description = "新建竣工项目企业（家）")
    val newCompletedEnterprises: Int?,
    @param:Schema(description = "年度可进规企业 - 预估（家）")
    val annualEligibleEstimated: Int?,
    @param:Schema(description = "年度可进规企业 - 预估占比（小数形式）")
    val annualEligibleRatioEstimated: BigDecimal?,
    @param:Schema(description = "已进规企业（实际）（家）")
    val actualInRegulated: Int?,
    @param:Schema(description = "已进规企业 - 占比（小数形式）")
    val actualInRegulatedRatio: BigDecimal?,
) {
    fun toProjectDcdxEnterpriseCompletionStats(): ProjectDcdxEnterpriseCompletionStats =
        ProjectDcdxEnterpriseCompletionStats {
            into(this)
        }

    fun into(record: ProjectDcdxEnterpriseCompletionStats): ProjectDcdxEnterpriseCompletionStats {
        record.cityDistrict = cityDistrict
        record.year = year
        record.newCompletedEnterprises = newCompletedEnterprises
        record.annualEligibleEstimated = annualEligibleEstimated
        record.annualEligibleRatioEstimated = annualEligibleRatioEstimated
        record.actualInRegulated = actualInRegulated
        record.actualInRegulatedRatio = actualInRegulatedRatio
        return record
    }
}
