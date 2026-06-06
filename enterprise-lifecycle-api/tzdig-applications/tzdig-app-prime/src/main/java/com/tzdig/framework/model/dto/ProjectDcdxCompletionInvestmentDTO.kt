@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxCompletionInvestment
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxCompletionInvestmentDTO(
    @param:Schema(description = "市区名称")
    val district: String?,
    @param:Schema(description = "园区名称")
    val park: String?,
    @param:Schema(description = "年份")
    val year: Int?,
    @param:Schema(description = "竣工项目数")
    val completedProjectCount: Int?,
    @param:Schema(description = "签约投资额（万元）")
    val signedInvestment: BigDecimal?,
    @param:Schema(description = "完成投资额（万元）")
    val completedInvestment: BigDecimal?,
    @param:Schema(description = "其中：固定资产投资（万元）")
    val fixedAssetInvestment: BigDecimal?,
    @param:Schema(description = "设备投资（万元）")
    val equipmentInvestment: BigDecimal?,
    @param:Schema(description = "投资完成比重（完成/签约，小数形式）")
    val investmentCompletionRatio: BigDecimal?,
    @param:Schema(description = "所属产业链群")
    val industrialChainCluster: String?,
    @param:Schema(description = "是否产业链群")
    val isLq: Boolean?,
) {
    fun toProjectDcdxCompletionInvestment(): ProjectDcdxCompletionInvestment =
        ProjectDcdxCompletionInvestment {
            into(this)
        }

    fun into(record: ProjectDcdxCompletionInvestment): ProjectDcdxCompletionInvestment {
        record.district = district
        record.park = park
        record.year = year
        record.completedProjectCount = completedProjectCount
        record.signedInvestment = signedInvestment
        record.completedInvestment = completedInvestment
        record.fixedAssetInvestment = fixedAssetInvestment
        record.equipmentInvestment = equipmentInvestment
        record.investmentCompletionRatio = investmentCompletionRatio
        record.industrialChainCluster = industrialChainCluster
        record.isLq = isLq
        return record
    }
}
