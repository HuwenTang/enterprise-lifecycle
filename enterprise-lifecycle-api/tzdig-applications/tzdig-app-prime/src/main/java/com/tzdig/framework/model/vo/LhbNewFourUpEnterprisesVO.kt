package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.LhbNewFourUpEnterprises
import io.swagger.v3.oas.annotations.media.Schema

data class LhbNewFourUpEnterprisesVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市（区）")
    @ExcelProperty("市（区）")
    val cityDistrict: String?,
    @get:Schema(description = "☆总数")
    @ExcelProperty("☆总数")
    val totalCount: Int?,
    @get:Schema(description = "工业")
    @ExcelProperty("工业")
    val industryCount: Int?,
    @get:Schema(description = "建筑业")
    @ExcelProperty("建筑业")
    val constructionCount: Int?,
    @get:Schema(description = "批零业")
    @ExcelProperty("批零业")
    val wholesaleRetailCount: Int?,
    @get:Schema(description = "住餐业")
    @ExcelProperty("住餐业")
    val accommodationCateringCount: Int?,
    @get:Schema(description = "房地产业")
    @ExcelProperty("房地产业")
    val realEstateCount: Int?,
    @get:Schema(description = "服务业")
    @ExcelProperty("服务业")
    val serviceCount: Int?,
) {
    constructor(record: LhbNewFourUpEnterprises) : this(
        id = record.id,
        cityDistrict = record.cityDistrict,
        totalCount = record.totalCount,
        industryCount = record.industryCount,
        constructionCount = record.constructionCount,
        wholesaleRetailCount = record.wholesaleRetailCount,
        accommodationCateringCount = record.accommodationCateringCount,
        realEstateCount = record.realEstateCount,
        serviceCount = record.serviceCount,
    )
}
