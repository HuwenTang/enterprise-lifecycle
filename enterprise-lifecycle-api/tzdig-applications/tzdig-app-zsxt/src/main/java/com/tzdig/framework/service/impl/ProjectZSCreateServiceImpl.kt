package com.tzdig.framework.service.impl

import com.alibaba.fastjson2.JSON
import com.mybatisflex.core.logicdelete.LogicDeleteManager
import com.mybatisflex.kotlin.extensions.db.all
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.entity.view.SysDept
import com.tzdig.framework.mybatis.entity.view.XmJbxx
import com.tzdig.framework.service.ProjectZSCreateService
import lombok.extern.slf4j.Slf4j
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Slf4j
@Service
class ProjectZSCreateServiceImpl : ProjectZSCreateService {

    private val logger = LoggerFactory.getLogger(javaClass)

    //同步创建更新招商项目
    override fun createZS(xmJbxx: XmJbxx) {
        logger.info("招商传值" + JSON.toJSONString(xmJbxx))
        val sysDeptList = all<SysDept>().associate { it.deptName to it.deptCode }
        val areas = all<SystemArea>().groupBy { it.level }
        val dictList = filter<SystemDict> {
            SystemDict::catalog inList listOf("domestic_foreign_investment", "project_progress")
        }.groupBy { it.catalog }
        val record = if (xmJbxx.xmid == null) null
        else LogicDeleteManager.execWithoutLogicDelete<ProjectDigitalInvestmentAttracting> {
            queryOne {
                select(ProjectDigitalInvestmentAttracting::id)
                where(ProjectDigitalInvestmentAttracting::investOnlineId eq xmJbxx.xmid)
            }
        }
        val zs = ProjectDigitalInvestmentAttracting {
            id = record?.id ?: xmJbxx.xmid
            investOnlineId = xmJbxx.xmid
            projectCode = xmJbxx.xmbm
            projectName = xmJbxx.projectName
            // 三市三区
            district = areas[3]?.find { it.name == xmJbxx.district }?.id ?: xmJbxx.district
            if (district?.contains("高港") == true) district = "321203000000" //医药高新区（高港区）
            // 镇街园区
            val ssbk = xmJbxx.ssbk.takeUnless { it.isNullOrEmpty() } ?: xmJbxx.park
            park = areas[4]?.find { it.zsDept == sysDeptList[ssbk] && it.zsDept != null }?.id ?: xmJbxx.ssbk
            nationalEconomicClassification = xmJbxx.industryName
            //企业信息
            uscc = xmJbxx.uCode
            companyName = xmJbxx.companyName
            companyRegistrationFunds = xmJbxx.regMoney
            companyRegistrationDate = xmJbxx.regDate
            //
            projectCategory = xmJbxx.projTypeName
            projectAttribute = xmJbxx.xmsx
            projectContent = xmJbxx.xmnr
            investmentFlag = dictList["domestic_foreign_investment"]
                ?.find { xmJbxx.tzbs == it.label }?.code
                ?: xmJbxx.tzbs
            countryRegion = xmJbxx.investorPlace
            specificCountryRegion = xmJbxx.jtPlace
            investor = xmJbxx.investor ?: ""
            investmentAmount = xmJbxx.investMoney
            registeredCapital = xmJbxx.zhuceMoney
            // 洽谈字段
            negotiationProgress = ""
            //
            currentProjectProgress = ProjectProgress.entries.firstOrNull {
                xmJbxx.dqjd?.endsWith(it.label) ?: false
            }
            entryTime = xmJbxx.rksj
            registrationInfoStatisticsDate = xmJbxx.regStatDate
            certificateDataBusinessLicense = xmJbxx.regZzzl
            filingApprovalProjectName = xmJbxx.checkName
            filingApprovalInvestmentTotal = xmJbxx.checkMoney
            filingApprovalDate = xmJbxx.checkDate
            filingInfoStatisticsDate = xmJbxx.checkStatDate
            certificateDataProjectFilingApprovalFile = xmJbxx.checkZzzl
            yesFixedAssetInvestment = xmJbxx.isFixedAsset == "是"
            isConstructionLand = xmJbxx.isUseLand == "是"
            constructionLandPlanningPermitNumber = xmJbxx.landLicence
            permitObtainDate = xmJbxx.licenceDate
            completionReportStatisticsDate = xmJbxx.finishCheckDate
            certificateData = xmJbxx.bpZzzl
            startConfirmDate = xmJbxx.startDateCommit
            endConfirmDate = xmJbxx.completeDate
            isNewIntroducedEnterprise = xmJbxx.isNew == "是"
            projectRating = xmJbxx.xmpj
            //投资人名称
            mainInvestorName = ""
            plannedTotalInvestment = xmJbxx.planTotal1
            projectLocation = xmJbxx.xmxzwz
            isRecruitmentFairProject = xmJbxx.isZs == "是"
            recruitmentFairName = xmJbxx.zshmc
            signingTime = xmJbxx.signedStatDate
            actualSigningTime = xmJbxx.signedDate
            signingContract = xmJbxx.qyht
            totalInvestmentUsd = xmJbxx.wzzje
            totalInvestmentCny = xmJbxx.nzzje
            factoryType = xmJbxx.buildingType
            plannedLandArea = xmJbxx.useArea?.toFloatOrNull()
            plannedRentalFactoryArea = xmJbxx.rentArea?.toFloatOrNull()
            plannedPurchaseFactoryArea = xmJbxx.buyArea?.toFloatOrNull()
            expectedAnnualSales = xmJbxx.yearXl?.toFloatOrNull()
            expectedAnnualTax = xmJbxx.yearSs?.toFloatOrNull()
            projectType = when (xmJbxx.bIndustry?.toInt()) {
                1 -> "服务业"
                2 -> "工业"
                else -> null
            }
            belongingIndustry = xmJbxx.industryName
            industryMajorClassName = xmJbxx.industryCode
            investorNature = xmJbxx.investorType
            projectProfile = null
            isPubliclyTradedOrPreIPOCompany = xmJbxx.isListed?.toInt() == 1
            fixedAssetInvestment = xmJbxx.fixedInvest?.toFloatOrNull()
            plannedStartTime = xmJbxx.planStartDate
            plannedEndTime = xmJbxx.planEndDate
            appliedLandArea = xmJbxx.sqLandArea?.toFloatOrNull()
            expectedInvoiceSales = xmJbxx.yqKpxs1?.toFloatOrNull()
            expectedTax = xmJbxx.yqSs1?.toFloatOrNull()
            investmentIntensity = if (xmJbxx.investLevel == "infinity") null else xmJbxx.investLevel
            wastewaterBy1 = xmJbxx.isWuran
            totalEnergyConsumption = xmJbxx.totalUse
            agreementForeignDirectInvestment = xmJbxx.wzzje?.toFloat()
            source = when (xmJbxx.bResource) {
                1 -> "自行接洽"
                2 -> "市级机关推荐"
                else -> null
            }
            sjjgName = xmJbxx.sjjgName
            deleted = xmJbxx.status == 2.toShort()
            checkStatus = xmJbxx.checkStatus
            buildingType = xmJbxx.buildingType
            useArea = xmJbxx.useArea
            rentArea = xmJbxx.rentArea
            buyArea = xmJbxx.buyArea
            yearXl = xmJbxx.yearXl
            yearSs = xmJbxx.yearSs
            pgStatus = xmJbxx.pgStatus
            isKcProj = xmJbxx.isKcProj
            kcProjTj = xmJbxx.kcProjTj
            isQflp = xmJbxx.isQflp
            cgRemark = xmJbxx.cgRemark
            tshy = xmJbxx.tshy
            zrxz = xmJbxx.zrxz
            lgxm = xmJbxx.lgxm
            zjspf = xmJbxx.zjspf
            cpscxz = xmJbxx.cpscxz
            gysp = xmJbxx.gysp
            scxl = xmJbxx.scxl
            lpl = xmJbxx.lpl
            ifGxjs = xmJbxx.isGxjs
            ifBuildYfzx = xmJbxx.ifBuildYfzx
            buildYfzx = xmJbxx.buildYfzx
            yqCz = xmJbxx.yqCz1
            yqKpxs = xmJbxx.yqKpxs1
            yqSs = xmJbxx.yqSs1
            yqMjtax = xmJbxx.yqMjtax1
            rProgress = xmJbxx.rProgress
            qyje = xmJbxx.qyje
            cyGl = xmJbxx.cyGl
            industryClassification = xmJbxx.industryFirstName
            isRzxq = if (xmJbxx.isRzxq != null) xmJbxx.isRzxq else "否"
            rzMoney = xmJbxx.rzMoney
            firstTime = xmJbxx.firstTime
            zlLandArea = xmJbxx.zlLandArea
            zlLandAreaZs = xmJbxx.zlLandAreaZs
        }
        logger.info("企业全生命周期同步值：" + JSON.toJSONString(zs))
        try {
            if (record == null) {
                // 在谈
                zs.save()
            } else {
                // 已签约
                LogicDeleteManager.execWithoutLogicDelete { zs.updateById() }
            }
        } catch (e: Exception) {
            logger.error("异常：{}", e.message, e)
        }
    }

    //同步删除更新招商项目
    fun deleteZS(id: String) {
        deleteById<ProjectDigitalInvestmentAttracting>(id)
    }
}
