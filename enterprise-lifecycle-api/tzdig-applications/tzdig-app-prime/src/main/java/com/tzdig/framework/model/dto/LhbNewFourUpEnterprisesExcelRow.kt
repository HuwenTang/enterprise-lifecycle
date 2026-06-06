package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.LhbNewFourUpEnterprises

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class LhbNewFourUpEnterprisesExcelRow(
    @field:ExcelProperty("市（区）")
    var cityDistrict: String? = null,
    @field:ExcelProperty("☆总数")
    var totalCount: Int? = null,
    @field:ExcelProperty("工业")
    var industryCount: Int? = null,
    @field:ExcelProperty("建筑业")
    var constructionCount: Int? = null,
    @field:ExcelProperty("批零业")
    var wholesaleRetailCount: Int? = null,
    @field:ExcelProperty("住餐业")
    var accommodationCateringCount: Int? = null,
    @field:ExcelProperty("房地产业")
    var realEstateCount: Int? = null,
    @field:ExcelProperty("服务业")
    var serviceCount: Int? = null,
) : ExcelRow<LhbNewFourUpEnterprisesExcelRow>() {
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
