@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjectsStats
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectFagaiKeyProjectsStatsDTO(
    @param:Schema(description = "开工1、竣工2、在建3")
    val status: Int?,
    @param:Schema(description = "项目类型(市级重点1、亿元2、10亿元3、全部4)")
    val type: Int?,
    @param:Schema(description = "市区")
    val city: String?,
    @param:Schema(description = "园区名称，如：靖江市、高新区等")
    val park: String?,
    @param:Schema(description = "所属产业链群，如：新能源、生物医药等")
    val industrialChainCluster: String?,
    @param:Schema(description = "市级重点项目总数")
    val projectCountTotal: Int?,
    @param:Schema(description = "其中：外资项目数量")
    val projectCountForeignInvestment: Int?,
    @param:Schema(description = "其中：内资项目数量")
    val projectCountDomesticInvestment: Int?,
    @param:Schema(description = "计划总投资总额（亿元）")
    val plannedInvestmentTotal: BigDecimal?,
    @param:Schema(description = "其中：外资项目计划总投资（亿元）")
    val plannedInvestmentForeign: BigDecimal?,
    @param:Schema(description = "其中：内资项目计划总投资（亿元）")
    val plannedInvestmentDomestic: BigDecimal?,
    @param:Schema(description = "其中：入库投资额")
    val inInvest: BigDecimal?,
    @param:Schema(description = "投资完成率")
    val ratio: BigDecimal?,
) {
    fun toProjectFagaiKeyProjectsStats(): ProjectFagaiKeyProjectsStats =
        ProjectFagaiKeyProjectsStats {
            into(this)
        }

    fun into(record: ProjectFagaiKeyProjectsStats): ProjectFagaiKeyProjectsStats {
        record.status = status
        record.type = type
        record.city = city
        record.park = park
        record.industrialChainCluster = industrialChainCluster
        record.projectCountTotal = projectCountTotal
        record.projectCountForeignInvestment = projectCountForeignInvestment
        record.projectCountDomesticInvestment = projectCountDomesticInvestment
        record.plannedInvestmentTotal = plannedInvestmentTotal
        record.plannedInvestmentForeign = plannedInvestmentForeign
        record.plannedInvestmentDomestic = plannedInvestmentDomestic
        record.inInvest = inInvest
        record.ratio = ratio
        return record
    }
}
