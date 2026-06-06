package com.tzdig.framework.service

interface EnterpriseTagService {
    fun getUsccListByTags(year: Int, quarter: Int, vararg tags: String): Set<String>
    fun getUsccListByTagsAndDistrict(
        year: Int,
        quarter: Int,
        district: Collection<String>,
        vararg tags: String,
    ): Set<String>

    fun countTopAndDigitalEconomic(tag: String, year: Int, quarter: Int): Int
    fun countTopAndDigitalEconomicByDistrict(
        tag: String,
        year: Int,
        quarter: Int,
        district: Collection<String>,
    ): Int
}
