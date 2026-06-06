package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.LhbNewFourUpEnterprises
import io.swagger.v3.oas.annotations.media.Schema

data class LhbNewFourUpEnterprisesDTO(
    @param:Schema(description = "市（区）")
    val cityDistrict: String?,
    @param:Schema(description = "☆总数")
    val totalCount: Int?,
    @param:Schema(description = "工业")
    val industryCount: Int?,
    @param:Schema(description = "建筑业")
    val constructionCount: Int?,
    @param:Schema(description = "批零业")
    val wholesaleRetailCount: Int?,
    @param:Schema(description = "住餐业")
    val accommodationCateringCount: Int?,
    @param:Schema(description = "房地产业")
    val realEstateCount: Int?,
    @param:Schema(description = "服务业")
    val serviceCount: Int?,
) {
    fun toLhbNewFourUpEnterprises(): LhbNewFourUpEnterprises =
        LhbNewFourUpEnterprises {
            into(this)
        }

    fun into(record: LhbNewFourUpEnterprises): LhbNewFourUpEnterprises {
        record.cityDistrict = cityDistrict
        record.totalCount = totalCount
        record.industryCount = industryCount
        record.constructionCount = constructionCount
        record.wholesaleRetailCount = wholesaleRetailCount
        record.accommodationCateringCount = accommodationCateringCount
        record.realEstateCount = realEstateCount
        record.serviceCount = serviceCount
        return record
    }
}
