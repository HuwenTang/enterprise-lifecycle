@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjectsStats
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectFagaiKeyProjectsStatsExcelRow(
    @field:ExcelProperty("开工1、竣工2、在建3")
    var status: Int? = null,
    @field:ExcelProperty("项目类型(市级重点1、亿元2、10亿元3、全部4)")
    var type: Int? = null,
    @field:ExcelProperty("市区")
    var city: String? = null,
    @field:ExcelProperty("园区名称，如：靖江市、高新区等")
    var park: String? = null,
    @field:ExcelProperty("所属产业链群，如：新能源、生物医药等")
    var industrialChainCluster: String? = null,
    @field:ExcelProperty("市级重点项目总数")
    var projectCountTotal: Int? = null,
    @field:ExcelProperty("其中：外资项目数量")
    var projectCountForeignInvestment: Int? = null,
    @field:ExcelProperty("其中：内资项目数量")
    var projectCountDomesticInvestment: Int? = null,
    @field:ExcelProperty("计划总投资总额（亿元）")
    var plannedInvestmentTotal: BigDecimal? = null,
    @field:ExcelProperty("其中：外资项目计划总投资（亿元）")
    var plannedInvestmentForeign: BigDecimal? = null,
    @field:ExcelProperty("其中：内资项目计划总投资（亿元）")
    var plannedInvestmentDomestic: BigDecimal? = null,
    @field:ExcelProperty("其中：入库投资额")
    var inInvest: BigDecimal? = null,
    @field:ExcelProperty("投资完成率")
    var ratio: BigDecimal? = null,
) : ExcelRow<ProjectFagaiKeyProjectsStatsExcelRow>() {
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
