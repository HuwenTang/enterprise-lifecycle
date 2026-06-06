@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("enterprise_tag_info")
class EnterpriseTagInfo() : BaseModel<EnterpriseTagInfo>() {
    constructor(init: EnterpriseTagInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 上市情况
     */
    @Column("listing_situation", comment = "上市情况")
    var listingSituation: String? = null

    /**
     * 国家级绿色工厂
     */
    @Column("national_green_factory", comment = "国家级绿色工厂")
    var nationalGreenFactory: String? = null

    /**
     * 省级绿色工厂
     */
    @Column("provincial_green_factory", comment = "省级绿色工厂")
    var provincialGreenFactory: String? = null

    /**
     * 国家级专精特新
     */
    @Column("national_zjtx", comment = "国家级专精特新")
    var nationalZjtx: String? = null

    /**
     * 省级级专精特新
     */
    @Column("provincial_zjtx", comment = "省级级专精特新")
    var provincialZjtx: String? = null

    /**
     * 市级专精特新
     */
    @Column("municipal_zjtx", comment = "市级专精特新")
    var municipalZjtx: String? = null

    /**
     * 省工业互联网平台
     */
    @Column("provincial_industrial_internet_platform", comment = "省工业互联网平台")
    var provincialIndustrialInternetPlatform: String? = null

    /**
     * 省标杆工厂
     */
    @Column("provincial_benchmark_factory", comment = "省标杆工厂")
    var provincialBenchmarkFactory: String? = null

    /**
     * 省智能车间
     */
    @Column("provincial_intelligent_workshop", comment = "省智能车间")
    var provincialIntelligentWorkshop: String? = null

    /**
     * 省智能工厂
     */
    @Column("provincial_intelligent_factory", comment = "省智能工厂")
    var provincialIntelligentFactory: String? = null

    /**
     * 筑峰强链
     */
    @Column("strengthening_peaks_enhancing_chains", comment = "筑峰强链")
    var strengtheningPeaksEnhancingChains: String? = null

    /**
     * 高企
     */
    @Column("high_tech", comment = "高企")
    var highTech: String? = null

    /**
     * 瞪羚企业
     */
    @Column("gazelle", comment = "瞪羚企业")
    var gazelle: String? = null

    /**
     * 独角兽企业
     */
    @Column("unicorn", comment = "独角兽企业")
    var unicorn: String? = null
}
