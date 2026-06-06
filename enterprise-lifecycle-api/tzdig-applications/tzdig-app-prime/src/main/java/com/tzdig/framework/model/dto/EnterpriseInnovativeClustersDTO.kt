@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.EnterpriseInnovativeClusters
import io.swagger.v3.oas.annotations.media.Schema

data class EnterpriseInnovativeClustersDTO(
    @param:Schema(description = "企业名称")
    val enterpriseName: String?,
    @param:Schema(description = "市（区）")
    val cityDistrict: String?,
    @param:Schema(description = "8个创新型集群")
    val innovativeClusters8: String?,
    @param:Schema(description = "13条产业链")
    val industrialChains13: String?,
    @param:Schema(description = "X个未来产业链")
    val futureChainsX: String?,
    @param:Schema(description = "发改-省级")
    val fgProvincialLevel: Boolean?,
    @param:Schema(description = "发改-市级")
    val fgMunicipalLevel: Boolean?,
    @param:Schema(description = "工信-省级")
    val gxProvincialLevel: Boolean?,
    @param:Schema(description = "工信-市级")
    val gxMunicipalLevel: Boolean?,
    @param:Schema(description = "商务-省级")
    val swProvincialLevel: Boolean?,
    @param:Schema(description = "商务-市级")
    val swMunicipalLevel: Boolean?,
    @param:Schema(description = "科技工程-省级")
    val kjEngProvincialLevel: Boolean?,
    @param:Schema(description = "科技工程-市级")
    val kjEngMunicipalLevel: Boolean?,
    @param:Schema(description = "科技实验室-国家级")
    val kjLabNationalLevel: Boolean?,
    @param:Schema(description = "科技实验室-省级")
    val kjLabProvincialLevel: Boolean?,
    @param:Schema(description = "科技实验室-市级")
    val kjLabMunicipalLevel: Boolean?,
    @param:Schema(description = "院士工作站-省级")
    val kjAcademicianProvincialLevel: Boolean?,
    @param:Schema(description = "院士工作站-市级")
    val kjAcademicianMunicipalLevel: Boolean?,
) {
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
