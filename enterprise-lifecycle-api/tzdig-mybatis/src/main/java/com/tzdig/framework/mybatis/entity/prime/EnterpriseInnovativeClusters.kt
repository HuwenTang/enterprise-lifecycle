@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("enterprise_innovative_clusters", comment = "企业创新平台统计表")
class EnterpriseInnovativeClusters() : BaseModel<EnterpriseInnovativeClusters>() {
    constructor(init: EnterpriseInnovativeClusters.() -> Unit) : this() {
        this.init()
    }

    /**
     * 企业名称
     */
    @Column("enterprise_name", comment = "企业名称")
    var enterpriseName: String? = null

    /**
     * 市（区）
     */
    @Column("city_district", comment = "市（区）")
    var cityDistrict: String? = null

    /**
     * 8个创新型集群
     */
    @Column("innovative_clusters_8", comment = "8个创新型集群")
    var innovativeClusters8: String? = null

    /**
     * 13条产业链
     */
    @Column("industrial_chains_13", comment = "13条产业链")
    var industrialChains13: String? = null

    /**
     * X个未来产业链
     */
    @Column("future_chains_x", comment = "X个未来产业链")
    var futureChainsX: String? = null

    /**
     * 发改-省级
     */
    @Column("fg_provincial_level", comment = "发改-省级")
    var fgProvincialLevel: Boolean? = null

    /**
     * 发改-市级
     */
    @Column("fg_municipal_level", comment = "发改-市级")
    var fgMunicipalLevel: Boolean? = null

    /**
     * 工信-省级
     */
    @Column("gx_provincial_level", comment = "工信-省级")
    var gxProvincialLevel: Boolean? = null

    /**
     * 工信-市级
     */
    @Column("gx_municipal_level", comment = "工信-市级")
    var gxMunicipalLevel: Boolean? = null

    /**
     * 商务-省级
     */
    @Column("sw_provincial_level", comment = "商务-省级")
    var swProvincialLevel: Boolean? = null

    /**
     * 商务-市级
     */
    @Column("sw_municipal_level", comment = "商务-市级")
    var swMunicipalLevel: Boolean? = null

    /**
     * 科技工程-省级
     */
    @Column("kj_eng_provincial_level", comment = "科技工程-省级")
    var kjEngProvincialLevel: Boolean? = null

    /**
     * 科技工程-市级
     */
    @Column("kj_eng_municipal_level", comment = "科技工程-市级")
    var kjEngMunicipalLevel: Boolean? = null

    /**
     * 科技实验室-国家级
     */
    @Column("kj_lab_national_level", comment = "科技实验室-国家级")
    var kjLabNationalLevel: Boolean? = null

    /**
     * 科技实验室-省级
     */
    @Column("kj_lab_provincial_level", comment = "科技实验室-省级")
    var kjLabProvincialLevel: Boolean? = null

    /**
     * 科技实验室-市级
     */
    @Column("kj_lab_municipal_level", comment = "科技实验室-市级")
    var kjLabMunicipalLevel: Boolean? = null

    /**
     * 院士工作站-省级
     */
    @Column("kj_academician_provincial_level", comment = "院士工作站-省级")
    var kjAcademicianProvincialLevel: Boolean? = null

    /**
     * 院士工作站-市级
     */
    @Column("kj_academician_municipal_level", comment = "院士工作站-市级")
    var kjAcademicianMunicipalLevel: Boolean? = null
}
