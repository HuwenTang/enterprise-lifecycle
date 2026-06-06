@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("lhb_new_four_up_enterprises", comment = "四上企业新增数情况表")
class LhbNewFourUpEnterprises() : BaseModel<LhbNewFourUpEnterprises>() {
    constructor(init: LhbNewFourUpEnterprises.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）
     */
    @Column("city_district", comment = "市（区）")
    var cityDistrict: String? = null

    /**
     * ☆总数
     */
    @Column("total_count", comment = "☆总数")
    var totalCount: Int? = null

    /**
     * 工业
     */
    @Column("industry_count", comment = "工业")
    var industryCount: Int? = null

    /**
     * 建筑业
     */
    @Column("construction_count", comment = "建筑业")
    var constructionCount: Int? = null

    /**
     * 批零业
     */
    @Column("wholesale_retail_count", comment = "批零业")
    var wholesaleRetailCount: Int? = null

    /**
     * 住餐业
     */
    @Column("accommodation_catering_count", comment = "住餐业")
    var accommodationCateringCount: Int? = null

    /**
     * 房地产业
     */
    @Column("real_estate_count", comment = "房地产业")
    var realEstateCount: Int? = null

    /**
     * 服务业
     */
    @Column("service_count", comment = "服务业")
    var serviceCount: Int? = null
}
