package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.mybatis.dao.PreliminaryInvestmentPromotionDAO
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProject
import com.tzdig.framework.service.PreliminaryInvestmentPromotionService
import org.springframework.stereotype.Service


@Service
class PreliminaryInvestmentPromotionServiceImpl(
    private val dao: PreliminaryInvestmentPromotionDAO,
) : PreliminaryInvestmentPromotionService {
    override fun getStatisticsSignedProjectInfo(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        currDate: String,
        year: String,
        investor: String?,
        investorType: String?,
        investorPlace: String?,
        isListed: String?,
        industry: String?,
        isKcProj: String?,
        isMainProj: String?,
    ): List<Map<String, Any>> {
        val list = when (isMainProj) {
            "市重点" -> {
                val cityKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifCityKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 如果有市重点项目，用它们的ID；如果没有，传入一个不存在的ID，确保IN条件不匹配
                cityKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_CITY") }
            }

            "省重大" -> {
                val provinceKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifProvinceKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 同理，省重大项目不存在时，用不存在的ID
                provinceKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_PROVINCE") }
            }

            else -> emptyList()
        }
        return dao.getStatisticsSignedProjectInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            currDate = currDate,
            year = year,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            projectList = list
        )
    }

    override fun getStatisticsSignedProjectZoneInfo(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        currDate: String,
        year: String,
        zoneCode: String,
        investor: String?,
        investorType: String?,
        investorPlace: String?,
        isListed: String?,
        industry: String?,
        isKcProj: String?,
        isMainProj: String?
    ): List<Map<String, Any>> {
        val list = when (isMainProj) {
            "市重点" -> {
                val cityKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifCityKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 如果有市重点项目，用它们的ID；如果没有，传入一个不存在的ID，确保IN条件不匹配
                cityKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_CITY") }
            }

            "省重大" -> {
                val provinceKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifProvinceKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 同理，省重大项目不存在时，用不存在的ID
                provinceKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_PROVINCE") }
            }

            else -> emptyList()
        }
        return dao.getStatisticsSignedProjectZoneInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            currDate = currDate,
            year = year,
            zoneCode = zoneCode,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            projectList = list
        )
    }

    override fun getStatisticsProjectStatusInfo(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        investor: String?,
        investorType: String?,
        investorPlace: String?,
        isListed: String?,
        industry: String?,
        isKcProj: String?,
        isMainProj: String?
    ): List<Map<String, Any>> {
        val list = when (isMainProj) {
            "市重点" -> {
                val cityKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifCityKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 如果有市重点项目，用它们的ID；如果没有，传入一个不存在的ID，确保IN条件不匹配
                cityKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_CITY") }
            }

            "省重大" -> {
                val provinceKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifProvinceKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 同理，省重大项目不存在时，用不存在的ID
                provinceKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_PROVINCE") }
            }

            else -> emptyList()
        }
        return dao.getStatisticsProjectStatusInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            projectList = list
        )
    }

    override fun getStatisticsProjectStatusZoneInfo(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        zoneCode : String,
        investor: String?,
        investorType: String?,
        investorPlace: String?,
        isListed: String?,
        industry: String?,
        isKcProj: String?,
        isMainProj: String?
    ): List<Map<String, Any>> {
        val list = when (isMainProj) {
            "市重点" -> {
                val cityKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifCityKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 如果有市重点项目，用它们的ID；如果没有，传入一个不存在的ID，确保IN条件不匹配
                cityKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_CITY") }
            }

            "省重大" -> {
                val provinceKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifProvinceKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 同理，省重大项目不存在时，用不存在的ID
                provinceKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_PROVINCE") }
            }

            else -> emptyList()
        }
        return dao.getStatisticsProjectStatusZoneInfo(
            rmb = rmb,
            rmb1 = rmb1,
            rmb2 = rmb2,
            currStartDate = currStartDate,
            currEndDate = currEndDate,
            zoneCode = zoneCode,
            investor = investor,
            investorType = investorType,
            investorPlace = investorPlace,
            isListed = isListed,
            industry = industry,
            isKcProj = isKcProj,
            projectList = list
        )
    }

    override fun getCountSignedProjTypeByLevel(
        rmb: Int?,
        rmb1: Double?,
        rmb2: Double?,
        currStartDate: String,
        currEndDate: String,
        currDate: String,
        level: Int,
        code: String?,
        isMainProj: String?
    ): List<Map<String, Any>> {
        val list = when (isMainProj) {
            "市重点" -> {
                val cityKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifCityKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 如果有市重点项目，用它们的ID；如果没有，传入一个不存在的ID，确保IN条件不匹配
                cityKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_CITY") }
            }

            "省重大" -> {
                val provinceKeyIds = query<ProjectKeyProject> {
                    where(ProjectKeyProject::ifProvinceKey eq true)
                }.mapNotNull { it.digitalInvestmentId }
                // 同理，省重大项目不存在时，用不存在的ID
                provinceKeyIds.ifEmpty { listOf("NO_MATCH_PROJECT_PROVINCE") }
            }

            else -> emptyList()
        }
        if(level == 2){
            return dao.getCountSignedProjTypeByLevel2(
                rmb = rmb,
                rmb1 = rmb1,
                rmb2 = rmb2,
                currStartDate = currStartDate,
                currEndDate = currEndDate,
                currDate = currDate,
                level = level,
                code = code,
                projectList = list
            )
        }else{
            return dao.getCountSignedProjTypeByLevel3(
                rmb = rmb,
                rmb1 = rmb1,
                rmb2 = rmb2,
                currStartDate = currStartDate,
                currEndDate = currEndDate,
                currDate = currDate,
                level = level,
                code = code,
                projectList = list
            )
        }

    }
}
