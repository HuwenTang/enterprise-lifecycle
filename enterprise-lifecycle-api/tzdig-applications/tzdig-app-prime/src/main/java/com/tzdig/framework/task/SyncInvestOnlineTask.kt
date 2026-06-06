package com.tzdig.framework.task

import com.mybatisflex.core.logicdelete.LogicDeleteManager
import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNotNull
import com.mybatisflex.kotlin.extensions.kproperty.isNull
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.mybatis.entity.prime.ProjectNonInvestmentConfirmation
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.entity.view.SysDept
import com.tzdig.framework.mybatis.entity.view.XmJbxx
import com.tzdig.framework.mybatis.mapper.prime.ProjectNonInvestmentConfirmationMapper
import com.tzdig.framework.mybatis.mapper.view.XmJbxxMapper
import com.tzdig.framework.mybatis.service.prime.IProjectDigitalInvestmentAttracting
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class SyncInvestOnlineTask(
    private val iProjectDigitalInvestmentAttracting: IProjectDigitalInvestmentAttracting,
    private val xmJbxxMapper: XmJbxxMapper,
    private val projectNonInvestmentConfirmationMapper: ProjectNonInvestmentConfirmationMapper,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Transactional
    @Scheduled(cron = "0 10 * * * ?")
    @Operation(summary = "同步数字化招商")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        val sysDeptList = all<SysDept>().associate { it.deptName to it.deptCode }
        val areas = all<SystemArea>().groupBy { it.level }
        val dictList = filter<SystemDict> {
            SystemDict::catalog inList listOf("domestic_foreign_investment", "project_progress")
        }.groupBy { it.catalog }
        query<XmJbxx> {
            select(XmJbxx::xmid)
            where(XmJbxx::xmid.isNotNull)
        }.mapNotNull { it.xmid }
        LogicDeleteManager.execWithoutLogicDelete {
            deleteWith<ProjectDigitalInvestmentAttracting> {
                (ProjectDigitalInvestmentAttracting::investOnlineId.isNull)
//                    .or(ProjectDigitalInvestmentAttracting::investOnlineId notIn investOnlineList)
//                    .and(ProjectDigitalInvestmentAttracting::isZzkc ne true)
            }
        }
        val targetList = xmJbxxMapper.selectCursorByQuery(QueryWrapper())
            .mapNotNull { xmJbxx ->
                val record = if (xmJbxx.xmid == null) null
                else LogicDeleteManager.execWithoutLogicDelete<ProjectDigitalInvestmentAttracting> {
                    queryOne {
                        select(ProjectDigitalInvestmentAttracting::id)
                        where(ProjectDigitalInvestmentAttracting::investOnlineId eq xmJbxx.xmid)
                    }
                }
                ProjectDigitalInvestmentAttracting {
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
                    //todo 企业信息
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
                    //todo 洽谈字段
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
                    //todo 投资人名称
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
                    investorPlace = xmJbxx.investorPlace
                    cityName = xmJbxx.placeInfo
                    ifOutCity = xmJbxx.isSwzjtr == "是"
                    shareRatio = xmJbxx.gqbl
                    ygmj = xmJbxx.ygmj
                    phmj = xmJbxx.phmj
                    tzgm = xmJbxx.tzgm?.toFloatOrNull()
                    isZzkc = xmJbxx.zjkc == "是"
                    if (record != null) {
                        try {
                            LogicDeleteManager.execWithoutLogicDelete { updateById() }
                        } catch (e: Exception) {
                            logger.error("异常：{}", e.message, e)
                        }
                    }
                }.takeIf { record == null }
            }
        if (targetList.isNotEmpty()) {
            try {
                iProjectDigitalInvestmentAttracting.saveBatch(targetList, 1000)
            } catch (e: Exception) {
                logger.error("批量保存异常：{}", e.message, e)
            }
        }
    }

    /**
     * 同步非投资确认项目到招商项目
     */
    private fun syncNonInvestmentProjects(
    ) {
        val nonInvestList = query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::status eq 2)
            and(ProjectNonInvestmentConfirmation::rkStat eq 1)
        }
        val targetList = nonInvestList.map { nonInvest ->
            val record = LogicDeleteManager.execWithoutLogicDelete<ProjectDigitalInvestmentAttracting> {
                queryOne {
                    select(ProjectDigitalInvestmentAttracting::id)
                    where(ProjectDigitalInvestmentAttracting::projectCode eq nonInvest.projectCode)
                }
            }

            ProjectDigitalInvestmentAttracting {
                // 如果记录已存在，设置ID以执行更新；否则不设置ID，由数据库自动生成
                if (record != null) {
                    id = record.id
                }
                projectCode = nonInvest.projectCode
                projectName = nonInvest.projectName
                // 市（区）
                district = nonInvest.cityDistrict
                // 园区（镇街）
                park = nonInvest.park
                // 项目状态
                currentProjectProgress = nonInvest.progress
                // 项目地址
                projectLocation = nonInvest.projectAddress
                // 备案信息
                filingApprovalProjectName = nonInvest.projectName
                filingInfoStatisticsDate = nonInvest.applicationTime?.toLocalDate()
                filingApprovalInvestmentTotal = nonInvest.investmentAmount?.toDouble()
                // 投资类型
                investmentFlag =
                    if (nonInvest.isForeignCapital == true) ("2") else if (nonInvest.isForeignCapital == false) ("1") else null
                // 投资方名称
                investor = nonInvest.investor
                // 项目投资额
                investmentAmount = if (nonInvest.isForeignCapital == true) {
                    nonInvest.investmentAmount?.toDouble()
                } else {
                    nonInvest.investmentAmount?.toDouble()?.div(10000)
                }
                // 是否外资项目
                totalInvestmentUsd =
                    if (nonInvest.isForeignCapital == true) nonInvest.investmentAmount?.toDouble()?.div(10000)
                        ?.div(7) else null
                totalInvestmentCny =
                    if (nonInvest.isForeignCapital != true) nonInvest.investmentAmount?.toDouble()?.div(10000) else null
                // 项目类型
                projectType = when (nonInvest.projectType) {
                    "1" -> "服务业"
                    "2" -> "工业"
                    else -> null
                }

                // 产业方向
                belongingIndustry = nonInvest.industryDirection
                // 行业代码
                industryMajorClassName = nonInvest.industryCode
                // 行业分类
                industryClassification = nonInvest.industryClassification
                // 固定资产投资
                fixedAssetInvestment = nonInvest.fixedAssetInvestment?.toFloat()
                // 统一社会信用代码
                uscc = nonInvest.unifiedSocialCreditCode
                // 主要产品、产能及主要建设内容
                projectContent = nonInvest.mainProducts
                // 备注
                remarks = nonInvest.remarks
                // 开工日期
                startConfirmDate = nonInvest.commencementDate
                // 竣工日期
                endConfirmDate = nonInvest.endDate
                // 项目是否列统
                isLt = nonInvest.isLt
                // 统计编码
                ltCode = nonInvest.ltCode
                // 标记为增资扩产项目
                isZzkc = true
                investOnlineId = nonInvest.id
                source = "增资扩产"
                projectRating =
                    if (nonInvest.isForeignCapital == true) ("外资") else if (nonInvest.isForeignCapital == false) ("内资") else null
            }
        }

        if (targetList.isNotEmpty()) {
            try {
                iProjectDigitalInvestmentAttracting.saveOrUpdateBatch(targetList, 1000)
                logger.info("成功同步 {} 个非投资确认项目到招商项目", targetList.size)
            } catch (e: Exception) {
                logger.error("批量保存非投资确认项目异常：{}", e.message, e)
            }
        }
    }

    @Transactional
    @Scheduled(cron = "0 10 * * * ?")
    @Operation(summary = "同步增资扩产")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun executeZZKC() {
        val nonInvestList = query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::projectCode.isNotNull)
        }.mapNotNull { it.id }
        // 删除之前同步的增资扩产项目（investOnlineId 不为空且 isZzkc 为 true 的项目）
        LogicDeleteManager.execWithoutLogicDelete {
            deleteWith<ProjectDigitalInvestmentAttracting> {
                (ProjectDigitalInvestmentAttracting::investOnlineId inList nonInvestList)
                    .and(ProjectDigitalInvestmentAttracting::isZzkc eq true)
                    .and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 0)
            }
        }
        logger.info("已删除之前同步的增资扩产项目")

        // 同步非投资确认项目到招商项目
        syncNonInvestmentProjects()
    }
}
