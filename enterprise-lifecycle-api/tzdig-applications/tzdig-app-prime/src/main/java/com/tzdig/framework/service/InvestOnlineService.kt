package com.tzdig.framework.service

interface InvestOnlineService {
    fun getAreaCode(): List<String>
    fun getAreaCode(grantedAreas: Collection<String>): List<String>
    fun getAllAreaCode(grantedAreas: Collection<String>): List<String>

    fun getCountyCode(): List<String>

    fun getCountyName(): List<String>

    fun getAllAreaName(): List<String>
    fun getAllAreaId(grantedAreas: Collection<String>): List<String>
}
