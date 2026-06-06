package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema

data class LhbNewFourUpEnterprisesQO(
    @param:Schema(description = "市（区）")
    val cityDistrict: String? = null,
    @param:Schema(description = "☆总数")
    val totalCount: Int? = null,
    @param:Schema(description = "工业")
    val industryCount: Int? = null,
    @param:Schema(description = "建筑业")
    val constructionCount: Int? = null,
    @param:Schema(description = "批零业")
    val wholesaleRetailCount: Int? = null,
    @param:Schema(description = "住餐业")
    val accommodationCateringCount: Int? = null,
    @param:Schema(description = "房地产业")
    val realEstateCount: Int? = null,
    @param:Schema(description = "服务业")
    val serviceCount: Int? = null,
)
