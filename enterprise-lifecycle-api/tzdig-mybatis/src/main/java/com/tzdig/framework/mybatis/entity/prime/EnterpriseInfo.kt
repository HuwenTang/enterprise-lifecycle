@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("enterprise_info")
class EnterpriseInfo() : BaseModel<EnterpriseInfo>() {
    constructor(init: EnterpriseInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 单位名称
     */
    @Column("name", comment = "单位名称")
    var name: String? = null

    /**
     * 行业代码
     */
    @Column("industry_code", comment = "行业代码")
    var industryCode: String? = null

    /**
     * 所属区县
     */
    @Column("district", comment = "所属区县")
    var district: String? = null

    /**
     * 园区
     */
    @Column("park", comment = "园区")
    var park: String? = null

    /**
     * 是否为战新企业
     */
    @Column("is_strategic_emerging_enterprise", comment = "是否为战新企业")
    var isStrategicEmergingEnterprise: Boolean? = null

    /**
     * 主要业务活动
     */
    @Column("primary_business_activity", comment = "主要业务活动")
    var primaryBusinessActivity: String? = null

    /**
     * 4个产业体系
     */
    @Column("industrial_system", comment = "4个产业体系")
    var industrialSystem: String? = null

    /**
     * 8个创新集群
     */
    @Column("innovative_cluster", comment = "8个创新集群")
    var innovativeCluster: String? = null

    /**
     * 13个产业链
     */
    @Column("industry_chain", comment = "13个产业链")
    var industryChain: String? = null

    /**
     * X个未来产业链
     */
    @Column("future_industry", comment = "X个未来产业链")
    var futureIndustry: String? = null

    /**
     * 细分领域
     */
    @Column("segmented_fields", comment = "细分领域")
    var segmentedFields: String? = null
}
