package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.AreaConstant.DISTRICT_LIST
import com.tzdig.framework.enumerate.TopEnterpriseTags
import com.tzdig.framework.model.vo.*
import com.tzdig.framework.mybatis.entity.prime.DigitalEnterprise2025Q1
import com.tzdig.framework.mybatis.entity.prime.EnterpriseEconomicInfo
import com.tzdig.framework.mybatis.entity.prime.EnterpriseExpectedRevenue2025
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInfo
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.EnterpriseRevenueService
import com.tzdig.framework.service.EnterpriseTagService
import com.tzdig.framework.service.InvestOnlineService
import com.tzdig.framework.util.EnterpriseEconomyUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "营收统计")
@RestController
@RequestMapping("revenue")
class EnterpriseRevenueController(
    private val enterpriseTagService: EnterpriseTagService,
    private val enterpriseRevenueService: EnterpriseRevenueService,
    private val investOnlineService: InvestOnlineService
) {
    @Operation(summary = "查询营收")
    @GetMapping("{year}")
    @PageableQuery
    fun getRevenueList(
        @Schema(description = "年份")
        @PathVariable year: Int,
        @Schema(description = "四上-工业")
        @RequestParam(defaultValue = "false") isTopIndustry: Boolean,
        @Schema(description = "四上-建筑业")
        @RequestParam(defaultValue = "false") isTopConstruction: Boolean,
        @Schema(description = "四上-贸易")
        @RequestParam(defaultValue = "false") isTopTrade: Boolean,
        @Schema(description = "四上-服务业")
        @RequestParam(defaultValue = "false") isTopService: Boolean,
        pageable: Pageable,
    ): PageableResult<EnterpriseGdpVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val quarter = EnterpriseEconomyUtils.getLastQuarter(year)
        val tag = when {
            isTopIndustry -> TopEnterpriseTags.TOP_INDUSTRY.tag
            isTopConstruction -> TopEnterpriseTags.TOP_CONSTRUCTION.tag
            isTopTrade -> TopEnterpriseTags.TOP_TRADE.tag
            isTopService -> TopEnterpriseTags.TOP_SERVICE.tag
            else -> null
        }
        val page = paginate<EnterpriseGdpVO>(pageable.pageNumber, pageable.pageSize) {
            and {
                it.or(EnterpriseInfo::district inList grantedAreas)
                it.or(EnterpriseInfo::park inList grantedAreas)
            }
            if (tag != null) {
                val usccList = enterpriseTagService.getUsccListByTags(year, quarter, tag)
                and(EnterpriseInfo::id inList usccList)
            }
            leftJoin(EnterpriseEconomicInfo::class.java)
                .on(EnterpriseInfo::id eq EnterpriseEconomicInfo::id)
            leftJoin(SystemArea::class.java)
                .on(EnterpriseInfo::park eq SystemArea::id)
            select(
                EnterpriseInfo::id.`as`(EnterpriseGdpVO::uscc.name),
                EnterpriseInfo::name.`as`(EnterpriseGdpVO::name.name),
                EnterpriseInfo::park.`as`(EnterpriseGdpVO::park.name),
                SystemArea::name.`as`(EnterpriseGdpVO::parkLabel.name),
            )
            val actualValueField = EnterpriseEconomyUtils.getRevenueField(year, quarter)!!
            val actualValueField4tb = EnterpriseEconomyUtils.getRevenueField(year - 1, quarter)
            select(
                QueryMethods.if_(
                    actualValueField.isNull,
                    QueryMethods.null_(),
                    actualValueField.div(10)
                ).`as`(EnterpriseGdpVO::actualValue.name),
                if (actualValueField4tb == null) QueryMethods.null_() else {
                    QueryMethods.if_(
                        actualValueField4tb.isNull,
                        QueryMethods.null_(),
                        actualValueField4tb.div(10)
                    )
                }.`as`(EnterpriseGdpVO::actualValue4tb.name)
            )
            orderBy(EnterpriseGdpVO::actualValue.name, false)
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "按板块查询营收")
    @GetMapping("{year}/by-park")
    @PageableQuery
    fun getRevenueListByPark(
        @Schema(description = "年份")
        @PathVariable year: Int,
        @Schema(description = "四上-工业")
        @RequestParam(defaultValue = "false") isTopIndustry: Boolean,
        @Schema(description = "四上-建筑业")
        @RequestParam(defaultValue = "false") isTopConstruction: Boolean,
        @Schema(description = "四上-贸易")
        @RequestParam(defaultValue = "false") isTopTrade: Boolean,
        @Schema(description = "四上-服务业")
        @RequestParam(defaultValue = "false") isTopService: Boolean,
        pageable: Pageable,
    ): PageableResult<ParkGdpVO> {
        val quarter = EnterpriseEconomyUtils.getLastQuarter(year)
        val tag = when {
            isTopIndustry -> TopEnterpriseTags.TOP_INDUSTRY.tag
            isTopConstruction -> TopEnterpriseTags.TOP_CONSTRUCTION.tag
            isTopTrade -> TopEnterpriseTags.TOP_TRADE.tag
            isTopService -> TopEnterpriseTags.TOP_SERVICE.tag
            else -> null
        }
        val page = paginate<ParkGdpVO>(pageable.pageNumber, pageable.pageSize) {
            if (tag != null) {
                val usccList = enterpriseTagService.getUsccListByTags(year, quarter, tag)
                where(EnterpriseInfo::id inList usccList)
            }
            leftJoin(EnterpriseEconomicInfo::class.java)
                .on(EnterpriseInfo::id eq EnterpriseEconomicInfo::id)
            leftJoin(SystemArea::class.java)
                .on(EnterpriseInfo::park eq SystemArea::id)
            select(
                EnterpriseInfo::park.`as`(ParkGdpVO::park.name),
                SystemArea::name.`as`(ParkGdpVO::parkLabel.name),
                QueryMethods.count().`as`(ParkGdpVO::groupCount.name),
            )
            val actualValueField = EnterpriseEconomyUtils.getRevenueField(year, quarter)!!
            select(
                QueryMethods.sum(actualValueField.div(10))
                    .`as`(ParkGdpVO::actualValue.name)
            )
            and(actualValueField.isNotNull)
            and(EnterpriseInfo::park.isNotNull)
            groupBy(ParkGdpVO::park.name, ParkGdpVO::parkLabel.name)
            orderBy(ParkGdpVO::actualValue.name, false)
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "规上数字经济核心企业经济收入情况（四上标签）")
    @GetMapping("economy-income")
    fun getEconomyIncome(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "季度")
        @RequestParam quarter: Int,
        @Schema(description = "地区")
        @RequestParam(defaultValue = AreaConstant.TAIZHOU_NAME) region: String,
    ): List<EconomyIncomeVO> {
        val keys = arrayOf(
            "工业" to DigitalEnterprise2025Q1::digitalTopIndustry.getter,
            "建筑业" to DigitalEnterprise2025Q1::digitalTopConstruction.getter,
            "批零住餐业" to DigitalEnterprise2025Q1::digitalTopTrade.getter,
            "服务业" to DigitalEnterprise2025Q1::digitalTopService.getter,
        )
        val data = query<DigitalEnterprise2025Q1> {
            where(DigitalEnterprise2025Q1::area eq region)
            and(DigitalEnterprise2025Q1::quarter eq quarter)
        }
        val current = data.first { it.year == 2025 }
        val last = data.first { it.year == 2024 }
        return keys.map { (name, getter) ->
            val currentRevenue = getter.call(current)!!
            val lastRevenue = getter.call(last)!!
            if (quarter == 1 && year == 2025) {
                EconomyIncomeVO(
                    year = year,
                    quarter = quarter,
                    region = region,
                    name = name,
                    revenue = 0f,
                    totalRevenue = 0f,
                    revenue4tb = 0f,
                    revenue4hb = null,
                )
            } else {
                EconomyIncomeVO(
                    year = year,
                    quarter = quarter,
                    region = region,
                    name = name,
                    revenue = currentRevenue,
                    totalRevenue = current.total!!,
                    revenue4tb = lastRevenue,
                    revenue4hb = null,
                )
            }
        }
//        return arrayOf("top_industry", "top_construction", "top_trade", "top_service")
//            .map { mainTag ->
//                // 当前季度企业
//                val usccList = enterpriseTagService.getUsccListByDistrictAndTags(
//                    year, quarter, region,
//                    mainTag, "digital_economic"
//                )
//                // 当前季度利润
//                val revenue = enterpriseRevenueService.getTotalRevenue(year, quarter, usccList)
//                // 上季度利润
//                val revenue_1 = if (quarter > 1) {
//                    val usccList1 = enterpriseTagService.getUsccListByDistrictAndTags(
//                        year, quarter - 1, region,
//                        mainTag, "digital_economic",
//                    )
//                    enterpriseRevenueService.getTotalRevenue(year, quarter - 1, usccList1)
//                } else {
//                    val usccList1 = enterpriseTagService.getUsccListByDistrictAndTags(
//                        year - 1, 4, region,
//                        mainTag, "digital_economic",
//                    )
//                    val lastYearRevenue = enterpriseRevenueService.getTotalRevenue(year - 1, 4, usccList1)
//                    val usccList2 = enterpriseTagService.getUsccListByDistrictAndTags(
//                        year - 1, 4, region,
//                        mainTag, "digital_economic",
//                    )
//                    lastYearRevenue - enterpriseRevenueService.getTotalRevenue(year - 1, 3, usccList2)
//                }
//                // 去年同季度企业
//                val usccList_12 = enterpriseTagService.getUsccListByDistrictAndTags(
//                    year - 1, quarter, region,
//                    mainTag, "digital_economic",
//                )
//                // 去年同季度利润
//                val revenue_12 = enterpriseRevenueService.getTotalRevenue(year - 1, quarter, usccList_12)
//                //计算利润总和
//                val usccAll = enterpriseTagService.getUsccListByDistrictAndTags(
//                    year, quarter, region, "digital_economic"
//                )
//                val totalRevenue = enterpriseRevenueService.getTotalRevenue(year, quarter, usccAll)
//                EconomyIncomeVO(
//                    region.ifEmpty { "市直" },
//                    when (mainTag) {
//                        "top_industry" -> "工业"
//                        "top_construction" -> "建筑业"
//                        "top_trade" -> "批零住餐业"
//                        "top_service" -> "服务业"
//                        else -> "未知"
//                    },
//                    year,
//                    quarter,
//                    String.format("%.2f", revenue / 100_000),
//                    tb = if (revenue_12 <= 0) null
//                    else String.format("%.2f", 100.0 * (revenue - revenue_12) / revenue_12),
//                    hb = if (revenue_1 <= 0) null
//                    else String.format("%.2f", 100.0 * (revenue - revenue_1) / revenue_1),
//                    if (totalRevenue <= 0) null
//                    else String.format("%.2f", 100.0 * (revenue / totalRevenue)),
//                )
//            }
    }

    @Operation(summary = "规上数字经济核心企业经济收入情况（地区）")
    @GetMapping("economy-income-county")
    fun getEconomyIncomeCounty(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "季度")
        @RequestParam quarter: Int,
    ): List<EconomyIncomeCountyVO> {
        return DISTRICT_LIST.map { (_, region) ->
            val (tb, hb, rank) = getCountyRevenue(year, quarter, region)
            EconomyIncomeCountyVO(region, year, quarter, tb, hb, rank)
        }
    }

    @Operation(summary = "规上数字经济核心企业样本企业情况")
    @GetMapping("sample-enterprise")
    fun getSampleEnterprise(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "季度")
        @RequestParam quarter: Int,
        @Schema(description = "地区")
        @RequestParam(defaultValue = "") region: String,
    ): List<SampleEnterpriseVO> {
        val district = filterOne<SystemArea> { SystemArea::name eq region }?.id
            ?.takeIf { region != AreaConstant.TAIZHOU_NAME }
        return TopEnterpriseTags.entries.map {
            val mainTag = it.tag
            //企业计数
            val count = if (district != null) {
                enterpriseTagService.countTopAndDigitalEconomicByDistrict(mainTag, year, quarter, listOf(district))
            } else {
                enterpriseTagService.countTopAndDigitalEconomic(mainTag, year, quarter)
            }
            //计算上季度企业计数
            val lastQuarterCount = if (quarter == 1) {
                if (district != null) {
                    enterpriseTagService.countTopAndDigitalEconomicByDistrict(mainTag, year - 1, 4, listOf(district))
                } else {
                    enterpriseTagService.countTopAndDigitalEconomic(mainTag, year - 1, 4)
                }
            } else {
                if (district != null) {
                    enterpriseTagService.countTopAndDigitalEconomicByDistrict(
                        mainTag,
                        year,
                        quarter - 1,
                        listOf(district),
                    )
                } else {
                    enterpriseTagService.countTopAndDigitalEconomic(mainTag, year, quarter - 1)
                }
            }
            SampleEnterpriseVO(
                area = region,
                name = mainTag,
                year = year,
                quarter = quarter,
                sampleUnit = count,
                lastQuarterUnitNum = lastQuarterCount,
            )
        }
    }

    @Operation(summary = "规上数字经济核心企业地区营收情况")
    @GetMapping("revenue-ratio")
    fun getRevenueRatio(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "季度")
        @RequestParam quarter: Int,
        @Schema(description = "地区")
        @RequestParam(defaultValue = AreaConstant.TAIZHOU_NAME) county: String
    ): List<RevenueRatioVO> {
        val result = DISTRICT_LIST.map { (_, area) ->
            val revenueDigitalEconomic = query<DigitalEnterprise2025Q1> {
                select(DigitalEnterprise2025Q1::total)
                where(DigitalEnterprise2025Q1::year eq 2025)
                where(DigitalEnterprise2025Q1::quarter eq quarter)
                where(DigitalEnterprise2025Q1::area eq area)
            }.map { it.total }.first()
            val revenueUp = query<DigitalEnterprise2025Q1> {
                select(DigitalEnterprise2025Q1::upTotal)
                where(DigitalEnterprise2025Q1::year eq 2025)
                where(DigitalEnterprise2025Q1::quarter eq quarter)
                where(DigitalEnterprise2025Q1::area eq area)
            }.map { it.upTotal }.first()
            RevenueRatioVO(
                area = area,
                ratio = if (revenueUp == null || revenueDigitalEconomic == null) {
                    null
                } else if (quarter == 1) null
                else {
                    100f * revenueDigitalEconomic / revenueUp
                },
                revenueRatio = if (year != 2025 || revenueUp == null || revenueDigitalEconomic == null) null
//                else if (quarter == 1) {
//                    val areaRevenue = filterOne<EnterpriseExpectedRevenue2025> {
//                        EnterpriseExpectedRevenue2025::county eq area
//                    }?.revenue2025Quarter1
//                    100f * revenueDigitalEconomic / areaRevenue!!
//                }
                else if (quarter == 2) {
                    filterOne<EnterpriseExpectedRevenue2025> {
                        EnterpriseExpectedRevenue2025::county eq area
                    }
                        ?.revenue2025Quarter2
                        ?.let { 100f * revenueDigitalEconomic / it }
                } else null
                //                } else if (quarter == 2){
                //                    val areaRevenue = filterOne<EnterpriseExpectedRevenue2025> { EnterpriseExpectedRevenue2025::county eq area}?.revenue2025Quarter1
                //                    revenueDigitalEconomic.div(areaRevenue!!).times(100)
            )
        }
        return if (county == AreaConstant.TAIZHOU_NAME) result
        else result.filter { it.area == county }
    }

    @Operation(summary = "查询四上企业")
    @GetMapping("up-enterprise")
    fun getUpEnterprise(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "数字经济")
        @RequestParam(defaultValue = "false") isDigital: Boolean,
    ): List<IndexEnterpriseVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (isDigital) {
            return TopEnterpriseTags.entries.flatMap {
                val county = investOnlineService.getCountyName()
                if (county.isEmpty())
                    return@flatMap emptyList()
                val field = when (it.tag) {
                    "top_industry" -> DigitalEnterprise2025Q1::digitalTopIndustry
                    "top_construction" -> DigitalEnterprise2025Q1::digitalTopConstruction
                    "top_trade" -> DigitalEnterprise2025Q1::digitalTopTrade
                    "top_service" -> DigitalEnterprise2025Q1::digitalTopService
                    else -> throw IllegalArgumentException("不支持的标签")
                }
                val areas = investOnlineService.getAllAreaId(grantedAreas)
                (1..4).map { quarter ->
                    when (quarter) {
                        1, 2 -> IndexEnterpriseVO(
                            index = it.digitalTagName,
                            quarter = quarter,
                            count = enterpriseTagService.getUsccListByTagsAndDistrict(
                                year, quarter, areas, it.tag, "digital_economic"
                            ).size,
                            revenue = if (year == 2025) {
                                if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
                                    queryOne<DigitalEnterprise2025Q1> {
                                        select(field)
                                        where(DigitalEnterprise2025Q1::year eq year)
                                        where(DigitalEnterprise2025Q1::quarter eq quarter)
                                        where(DigitalEnterprise2025Q1::area eq "泰州市")
                                    }?.let(field)!!
                                } else {
                                    queryOne<DigitalEnterprise2025Q1> {
                                        select(QueryMethods.sum(field.column).`as`(field.name))
                                        where(DigitalEnterprise2025Q1::year eq year)
                                        where(DigitalEnterprise2025Q1::quarter eq quarter)
                                        where(DigitalEnterprise2025Q1::area inList county)
                                    }?.let(field)!!
                                }
                            } else 0.00f,
                            revenue4tb = if (year == 2025) {
                                if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
                                    queryOne<DigitalEnterprise2025Q1> {
                                        select(field)
                                        where(DigitalEnterprise2025Q1::year eq year - 1)
                                        where(DigitalEnterprise2025Q1::quarter eq quarter)
                                        where(DigitalEnterprise2025Q1::area eq "泰州市")
                                    }?.let(field)!!
                                } else {
                                    queryOne<DigitalEnterprise2025Q1> {
                                        select(QueryMethods.sum(field.column).`as`(field.name))
                                        where(DigitalEnterprise2025Q1::year eq year - 1)
                                        where(DigitalEnterprise2025Q1::quarter eq quarter)
                                        where(DigitalEnterprise2025Q1::area inList county)
                                    }?.let(field)!!
                                }
                            } else 0.00f,
                        )

                        else -> IndexEnterpriseVO(
                            index = it.digitalTagName,
                            quarter = quarter,
                            count = enterpriseTagService.getUsccListByTagsAndDistrict(
                                year, quarter, areas, it.tag, "digital_economic"
                            ).size,
                            revenue = 0.00f,
                            revenue4tb = 0.00f,
                        )
                    }
                }
            }
        }

        return TopEnterpriseTags.entries.flatMap {
            val queryTag = if (isDigital) arrayOf(it.tag, "digital_economic") else arrayOf(it.tag)
            (1..4).map { quarter ->
                val usccList1 = enterpriseTagService.getUsccListByTagsAndDistrict(
                    year, quarter, grantedAreas, *queryTag,
                )
                val revenue = enterpriseRevenueService.getTotalRevenue(year, quarter, usccList1)
                val usccList2 = enterpriseTagService.getUsccListByTagsAndDistrict(
                    year - 1, quarter, grantedAreas, *queryTag,
                )
                val lastYearRevenue = enterpriseRevenueService.getTotalRevenue(year - 1, quarter, usccList2)
                IndexEnterpriseVO(
                    index = if (isDigital) it.digitalTagName else it.tagName,
                    quarter = quarter,
                    count = usccList1.size,
                    revenue = revenue / 100_000,
                    revenue4tb = lastYearRevenue / 100_000,
                )
            }
        }
    }

    private fun getCountyRevenue(year: Int, quarter: Int, region: String): Array<Float?> {
        val revenue = query<DigitalEnterprise2025Q1> {
            select(DigitalEnterprise2025Q1::total)
            where(DigitalEnterprise2025Q1::year eq 2025)
            where(DigitalEnterprise2025Q1::quarter eq quarter)
            where(DigitalEnterprise2025Q1::area eq region)
        }.map { it.total }.first()
//            getRevenueArea(year, quarter, region)
        val tb = query<DigitalEnterprise2025Q1> {
            select(DigitalEnterprise2025Q1::total)
            where(DigitalEnterprise2025Q1::year eq 2024)
            where(DigitalEnterprise2025Q1::area eq region)
        }.map { it.total }.first()
//            getRevenueArea(year - 1, quarter, region)
        //            if (quarter == 1) {
//            if (getRevenueArea(year - 1, 3, region) == null
//            ) {
//                null
//            } else {
//                getRevenueArea(year - 1, 4, region)?.minus(
//                    getRevenueArea(
//                        year - 1,
//                        3,
//                        region
//                    )!!
//                )
//            }
//        } else {
//            if (getRevenueArea(year, quarter - 1, region) == null
//            ) {
//                null
//            } else {
//                getRevenueArea(year, quarter - 1, region)?.minus(
//                    if (quarter == 2) {
//                        0f
//                    } else {
//                        getRevenueArea(year, quarter - 2, region)!!
//                    }
//                )
//            }
//        }
        val totalRevenue = query<DigitalEnterprise2025Q1> {
            select(DigitalEnterprise2025Q1::total)
            where(DigitalEnterprise2025Q1::year eq 2025)
            where(DigitalEnterprise2025Q1::quarter eq quarter)
            where(DigitalEnterprise2025Q1::area eq "泰州市")
        }.map { it.total }.first()
        return arrayOf(
            // index=0
            if (tb == null || revenue == null) {
                null
            } else {
                100f * (revenue - tb) / tb
            },
            // index=1
            0f,
            // index=2
            if (totalRevenue == null || revenue == null) {
                null
            } else {
                100f * revenue / totalRevenue
            }
        )
    }
}
