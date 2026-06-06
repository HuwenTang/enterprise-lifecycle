@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInnovativeClusters

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class EnterpriseInnovativeClustersExcelRow(
    @field:ExcelProperty("企业名称")
    var enterpriseName: String? = null,
    @field:ExcelProperty("市（区）")
    var cityDistrict: String? = null,
    @field:ExcelProperty("8个创新型集群")
    var innovativeClusters8: String? = null,
    @field:ExcelProperty("13条产业链")
    var industrialChains13: String? = null,
    @field:ExcelProperty("X个未来产业链")
    var futureChainsX: String? = null,
    @field:ExcelProperty("发改-省级")
    var fgProvincialLevel: Boolean? = null,
    @field:ExcelProperty("发改-市级")
    var fgMunicipalLevel: Boolean? = null,
    @field:ExcelProperty("工信-省级")
    var gxProvincialLevel: Boolean? = null,
    @field:ExcelProperty("工信-市级")
    var gxMunicipalLevel: Boolean? = null,
    @field:ExcelProperty("商务-省级")
    var swProvincialLevel: Boolean? = null,
    @field:ExcelProperty("商务-市级")
    var swMunicipalLevel: Boolean? = null,
    @field:ExcelProperty("科技工程-省级")
    var kjEngProvincialLevel: Boolean? = null,
    @field:ExcelProperty("科技工程-市级")
    var kjEngMunicipalLevel: Boolean? = null,
    @field:ExcelProperty("科技实验室-国家级")
    var kjLabNationalLevel: Boolean? = null,
    @field:ExcelProperty("科技实验室-省级")
    var kjLabProvincialLevel: Boolean? = null,
    @field:ExcelProperty("科技实验室-市级")
    var kjLabMunicipalLevel: Boolean? = null,
    @field:ExcelProperty("院士工作站-省级")
    var kjAcademicianProvincialLevel: Boolean? = null,
    @field:ExcelProperty("院士工作站-市级")
    var kjAcademicianMunicipalLevel: Boolean? = null,
) : ExcelRow<EnterpriseInnovativeClustersExcelRow>() {
    fun toEnterpriseInnovativeClusters(): EnterpriseInnovativeClusters =
        EnterpriseInnovativeClusters {
            into(this)
        }

    fun into(record: EnterpriseInnovativeClusters): EnterpriseInnovativeClusters {
        record.enterpriseName = enterpriseName
        record.cityDistrict = cityDistrict
        record.innovativeClusters8 = innovativeClusters8
        record.industrialChains13 = industrialChains13
        record.futureChainsX = futureChainsX
        record.fgProvincialLevel = fgProvincialLevel
        record.fgMunicipalLevel = fgMunicipalLevel
        record.gxProvincialLevel = gxProvincialLevel
        record.gxMunicipalLevel = gxMunicipalLevel
        record.swProvincialLevel = swProvincialLevel
        record.swMunicipalLevel = swMunicipalLevel
        record.kjEngProvincialLevel = kjEngProvincialLevel
        record.kjEngMunicipalLevel = kjEngMunicipalLevel
        record.kjLabNationalLevel = kjLabNationalLevel
        record.kjLabProvincialLevel = kjLabProvincialLevel
        record.kjLabMunicipalLevel = kjLabMunicipalLevel
        record.kjAcademicianProvincialLevel = kjAcademicianProvincialLevel
        record.kjAcademicianMunicipalLevel = kjAcademicianMunicipalLevel
        return record
    }
}
