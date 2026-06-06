@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInnovativeClusters
import io.swagger.v3.oas.annotations.media.Schema

data class EnterpriseInnovativeClustersVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "企业名称")
    @ExcelProperty("企业名称")
    val enterpriseName: String?,
    @get:Schema(description = "市（区）")
    @ExcelProperty("市（区）")
    val cityDistrict: String?,
    @get:Schema(description = "8个创新型集群")
    @ExcelProperty("8个创新型集群")
    val innovativeClusters8: String?,
    @get:Schema(description = "13条产业链")
    @ExcelProperty("13条产业链")
    val industrialChains13: String?,
    @get:Schema(description = "X个未来产业链")
    @ExcelProperty("X个未来产业链")
    val futureChainsX: String?,
    @get:Schema(description = "发改-省级")
    @ExcelProperty("发改-省级")
    val fgProvincialLevel: Boolean?,
    @get:Schema(description = "发改-市级")
    @ExcelProperty("发改-市级")
    val fgMunicipalLevel: Boolean?,
    @get:Schema(description = "工信-省级")
    @ExcelProperty("工信-省级")
    val gxProvincialLevel: Boolean?,
    @get:Schema(description = "工信-市级")
    @ExcelProperty("工信-市级")
    val gxMunicipalLevel: Boolean?,
    @get:Schema(description = "商务-省级")
    @ExcelProperty("商务-省级")
    val swProvincialLevel: Boolean?,
    @get:Schema(description = "商务-市级")
    @ExcelProperty("商务-市级")
    val swMunicipalLevel: Boolean?,
    @get:Schema(description = "科技工程-省级")
    @ExcelProperty("科技工程-省级")
    val kjEngProvincialLevel: Boolean?,
    @get:Schema(description = "科技工程-市级")
    @ExcelProperty("科技工程-市级")
    val kjEngMunicipalLevel: Boolean?,
    @get:Schema(description = "科技实验室-国家级")
    @ExcelProperty("科技实验室-国家级")
    val kjLabNationalLevel: Boolean?,
    @get:Schema(description = "科技实验室-省级")
    @ExcelProperty("科技实验室-省级")
    val kjLabProvincialLevel: Boolean?,
    @get:Schema(description = "科技实验室-市级")
    @ExcelProperty("科技实验室-市级")
    val kjLabMunicipalLevel: Boolean?,
    @get:Schema(description = "院士工作站-省级")
    @ExcelProperty("院士工作站-省级")
    val kjAcademicianProvincialLevel: Boolean?,
    @get:Schema(description = "院士工作站-市级")
    @ExcelProperty("院士工作站-市级")
    val kjAcademicianMunicipalLevel: Boolean?,
) {
    constructor(record: EnterpriseInnovativeClusters) : this(
        id = record.id,
        enterpriseName = record.enterpriseName,
        cityDistrict = record.cityDistrict,
        innovativeClusters8 = record.innovativeClusters8,
        industrialChains13 = record.industrialChains13,
        futureChainsX = record.futureChainsX,
        fgProvincialLevel = record.fgProvincialLevel,
        fgMunicipalLevel = record.fgMunicipalLevel,
        gxProvincialLevel = record.gxProvincialLevel,
        gxMunicipalLevel = record.gxMunicipalLevel,
        swProvincialLevel = record.swProvincialLevel,
        swMunicipalLevel = record.swMunicipalLevel,
        kjEngProvincialLevel = record.kjEngProvincialLevel,
        kjEngMunicipalLevel = record.kjEngMunicipalLevel,
        kjLabNationalLevel = record.kjLabNationalLevel,
        kjLabProvincialLevel = record.kjLabProvincialLevel,
        kjLabMunicipalLevel = record.kjLabMunicipalLevel,
        kjAcademicianProvincialLevel = record.kjAcademicianProvincialLevel,
        kjAcademicianMunicipalLevel = record.kjAcademicianMunicipalLevel,
    )
}
