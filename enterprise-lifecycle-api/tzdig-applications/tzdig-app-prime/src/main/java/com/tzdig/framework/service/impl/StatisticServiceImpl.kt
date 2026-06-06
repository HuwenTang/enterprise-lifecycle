package com.tzdig.framework.service.impl

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.core.query.RawQueryCondition
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.AreaConstant.DISTRICT_LIST
import com.tzdig.framework.model.vo.LHBProjectInfoVO
import com.tzdig.framework.model.vo.StatisticLHBVO
import com.tzdig.framework.model.vo.StatisticLHBVO.*
import com.tzdig.framework.mybatis.dao.ZzkcDAO
import com.tzdig.framework.mybatis.entity.prime.*
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.service.StatisticService
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.TemporalAdjusters.lastDayOfMonth


@Service
class StatisticServiceImpl(
    private val zzkcDAO: ZzkcDAO
) : StatisticService {
    override fun projectInfo(
        endDate: LocalDateTime,
        progress: ProjectProgress,
        rmb1: Double?,
        rmb2: Double?,
        code: String?
    ) = ProjectCountInfo(
        total = projectInfoTotal(
            endDate, progress, rmb1, rmb2,
            code, null
        ).size.toLong(),
        monthNew = projectInfoMonth(endDate, progress, rmb1, rmb2, code, null).size.toLong()
    )

    override fun projectNoninvest(
        year: Int,
        rmb1: Double?,
        rmb2: Double?,
        month: Int,
        code: String?,
        isZZKC: Boolean?,
        progress: ProjectProgress?,
    ) = ProjectCountInfo(
        total = projectNoninvestTotal(year, progress, rmb1, rmb2, month, code, isZZKC).size.toLong(),
        monthNew = projectNoninvestMonth(year, progress, rmb1, rmb2, month, code, isZZKC).size.toLong(),
    )

    override fun LHBProjectInfo(
        endDate: LocalDateTime,
        code: String,
        column: Int,
    ): List<LHBProjectInfoVO> {
        return when (column) {
            43 -> {
                projectInfoTotal(endDate, ProjectProgress.SIGNING, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }

            44 -> {
                projectInfoMonth(endDate, ProjectProgress.SIGNING, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }

            45 -> {
                projectInfoTotal(endDate, ProjectProgress.SIGNING, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            46 -> {
                projectInfoMonth(endDate, ProjectProgress.SIGNING, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            47 -> {
                projectInfoTotal(endDate, ProjectProgress.SIGNING, 5.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            48 -> {
                projectInfoMonth(endDate, ProjectProgress.SIGNING, 5.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            49 -> {
                projectInfoTotal(endDate, ProjectProgress.SIGNING, 0.05, null, code, true)
                    .map(::LHBProjectInfoVO)
            }

            50 -> {
                projectInfoMonth(endDate, ProjectProgress.SIGNING, 0.05, null, code, true)
                    .map(::LHBProjectInfoVO)
            }

            51 -> {
                projectInfoTotal(endDate, ProjectProgress.RECORD, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }

            52 -> {
                projectInfoMonth(endDate, ProjectProgress.RECORD, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }

            53 -> {
                projectInfoTotal(endDate, ProjectProgress.RECORD, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            54 -> {
                projectInfoMonth(endDate, ProjectProgress.RECORD, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            55 -> {
                projectInfoTotal(endDate, ProjectProgress.RECORD, 5.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            56 -> {
                projectInfoMonth(endDate, ProjectProgress.RECORD, 5.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            //todo 49-53
            62 -> {
                projectInfoTotal(endDate, ProjectProgress.START, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }

            63 -> {
                projectInfoMonth(endDate, ProjectProgress.START, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }

            64 -> {
                projectInfoTotal(endDate, ProjectProgress.START, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            65 -> {
                projectInfoMonth(endDate, ProjectProgress.START, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            66 -> {
                projectInfoTotal(endDate, ProjectProgress.START, 5.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            67 -> {
                projectInfoMonth(endDate, ProjectProgress.START, 5.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            76 -> {
                projectInfoTotal(endDate, ProjectProgress.COMPLETION, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }

            77 -> {
                projectInfoMonth(endDate, ProjectProgress.COMPLETION, 0.05, 1.0, code, null)
                    .map(::LHBProjectInfoVO)
            }


            78 -> {
                projectInfoTotal(endDate, ProjectProgress.COMPLETION, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            79 -> {
                projectInfoMonth(endDate, ProjectProgress.COMPLETION, 1.0, null, code, null)
                    .map(::LHBProjectInfoVO)
            }

            else -> {
                emptyList()
            }
        }

    }

    override fun LHBData(
        endDate: LocalDateTime
    ): List<StatisticLHBVO> {
        // 预计算时间范围
        val startYear = LocalDate.of(endDate.year, 1, 1)
        val startMonth = LocalDate.of(endDate.year, endDate.month, 1)
        val end = endDate

        // 一次性查询所有重点项目数据，按地区分组
        val keyProjectList = query<ProjectKeyProject> {
            where(ProjectKeyProject::digitalInvestmentId.isNotNull)
        }.mapNotNull { it.digitalInvestmentId }.toSet()

        // 批量查询所有地区的重点项目统计数据
        val keyProjectStatsByDistrict = query<ProjectKeyProject> {
            and(ProjectKeyProject::fgName ne "未找到")
            and(ProjectKeyProject::fgName.isNotNull)
        }.groupBy { it.district }

        // 批量查询所有招商项目数据（按进度和金额区间分组）- 签约不包含已同步的非投资项目
        val signingProjects = query<ProjectDigitalInvestmentAttracting> {
            and(
                ProjectDigitalInvestmentAttracting::signingTime between startYear..end.toLocalDate()
            )
            and {
                it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
            }
            and(ProjectDigitalInvestmentAttracting::source ne "增资扩产")
        }

        val recordProjects = query<ProjectDigitalInvestmentAttracting> {
            val list = query<ProjectInvestmentXOnlineApproval> {
                join(ProjectOnlineApproval::class.java)
                    .on(ProjectOnlineApproval::projectCode eq ProjectInvestmentXOnlineApproval::onlineApprovalId)
                and(ProjectOnlineApproval::applicationTime between startYear.atTime(0, 0, 0)..end)
            }.mapNotNull { it.investmentId }
            and { i ->
                i.or(ProjectDigitalInvestmentAttracting::id inList list)
                i.or {
                    it.and(ProjectDigitalInvestmentAttracting::filingInfoStatisticsDate between startYear..end.toLocalDate())
                    it.and(ProjectDigitalInvestmentAttracting::source eq "增资扩产")
                }
            }
            and {
                it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
            }
        }

        // 批量查询开工项目（需要先获取审核通过的ID列表）- 包含已同步的非投资项目
        val startReviewIds = query<ProjectDigitalProjectReviewAll> {
            and(ProjectDigitalProjectReviewAll::updateTime between startYear.atTime(0, 0, 0)..end)
            and(ProjectDigitalProjectReviewAll::status eq "已完成")
            and(ProjectDigitalProjectReviewAll::result eq 1)
            and(ProjectDigitalProjectReviewAll::step eq 4)
        }.mapNotNull { it.digitalInvestmentId }.toSet()

        val startProjects = if (startReviewIds.isNotEmpty()) {
            query<ProjectDigitalInvestmentAttracting> {
                and(ProjectDigitalInvestmentAttracting::id inList startReviewIds)
                and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 2)
                and(ProjectDigitalInvestmentAttracting::startConfirmDate between startYear..end.toLocalDate())
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }
        } else emptyList()

        // 批量查询竣工项目 - 包含已同步的非投资项目
        val completionReviewIds = query<ProjectDigitalProjectReviewAll> {
            and(ProjectDigitalProjectReviewAll::updateTime between startYear.atTime(0, 0, 0)..end)
            and(ProjectDigitalProjectReviewAll::status eq "已完成")
            and(ProjectDigitalProjectReviewAll::result eq 1)
            and(ProjectDigitalProjectReviewAll::step eq 5)
        }.mapNotNull { it.digitalInvestmentId }.toSet()

        val completionProjects = if (completionReviewIds.isNotEmpty()) {
            query<ProjectDigitalInvestmentAttracting> {
                and(ProjectDigitalInvestmentAttracting::id inList completionReviewIds)
                and(ProjectDigitalInvestmentAttracting::endConfirmDate between startYear..end.toLocalDate())
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }
        } else emptyList()

        // 批量查询非投资项目
        query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::status eq 2)
            and(
                ProjectNonInvestmentConfirmation::applicationTime between LocalDateTime.of(
                    endDate.year,
                    1,
                    1,
                    0,
                    0,
                    0
                )..end
            )
        }

        query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::status eq 2)
            and(
                ProjectNonInvestmentConfirmation::commencementDate between startYear..end.toLocalDate()
            )
        }

        query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::status eq 2)
            and(
                ProjectNonInvestmentConfirmation::endDate between startYear..end.toLocalDate()
            )
        }

        // 批量查询本月数据 - 签约不包含包含已同步的非投资项目
        val monthSigningProjects = query<ProjectDigitalInvestmentAttracting> {
            and(
                ProjectDigitalInvestmentAttracting::signingTime between startMonth..end.toLocalDate()
            )
            and {
                it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
            }
            and(ProjectDigitalInvestmentAttracting::source ne "增资扩产")
        }

        val monthRecordProjects = query<ProjectDigitalInvestmentAttracting> {
            val list = query<ProjectInvestmentXOnlineApproval> {
                join(ProjectOnlineApproval::class.java)
                    .on(ProjectOnlineApproval::projectCode eq ProjectInvestmentXOnlineApproval::onlineApprovalId)
                and(ProjectOnlineApproval::applicationTime between startMonth.atTime(0, 0, 0)..end)
            }.mapNotNull { it.investmentId }
            and { i ->
                i.or(ProjectDigitalInvestmentAttracting::id inList list)
                i.or {
                    it.and(ProjectDigitalInvestmentAttracting::filingInfoStatisticsDate between startMonth..end.toLocalDate())
                    it.and(ProjectDigitalInvestmentAttracting::source eq "增资扩产")
                }
            }
            and {
                it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
            }
        }

        val monthStartProjects =
            query<ProjectDigitalInvestmentAttracting> {
                join(ProjectDigitalProjectReviewAll::class.java)
                    .on(
                        ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id
                    )
                select(ProjectDigitalInvestmentAttracting::class.allColumns)
                select(
                    QueryMethods.dateDiff(
                        ProjectDigitalInvestmentAttracting::startConfirmDate,
                        ProjectDigitalProjectReviewAll::updateTime,
                    ).`as`("diff")
                )
                having(
                    RawQueryCondition("(diff<=15 and diff>=0)")
                        .or(ProjectDigitalInvestmentAttracting::startConfirmDate between startMonth..end.toLocalDate())
                )

                and(
                    ProjectDigitalProjectReviewAll::updateTime between startMonth.atTime(0, 0, 0)..end
                )
                and(ProjectDigitalProjectReviewAll::status eq "已完成")
                and(ProjectDigitalProjectReviewAll::result eq 1)
                and(ProjectDigitalProjectReviewAll::step eq 4)
                and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 2)
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }

        val monthCompletionProjects = query<ProjectDigitalInvestmentAttracting> {
            join(ProjectDigitalProjectReviewAll::class.java)
                .on(
                    ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id
                )
            select(ProjectDigitalInvestmentAttracting::class.allColumns)
            select(
                QueryMethods.dateDiff(
                    ProjectDigitalInvestmentAttracting::endConfirmDate,
                    ProjectDigitalProjectReviewAll::updateTime,
                ).`as`("diff")
            )
            having(RawQueryCondition("(diff<=15 and diff>=0)").or(ProjectDigitalInvestmentAttracting::endConfirmDate between startMonth..end.toLocalDate()))

            and(ProjectDigitalProjectReviewAll::updateTime between startMonth.atTime(0, 0, 0)..end)
            and(ProjectDigitalProjectReviewAll::status eq "已完成")
            and(ProjectDigitalProjectReviewAll::result eq 1)
            and(ProjectDigitalProjectReviewAll::step eq 5)
            and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 2)
            and {
                it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
            }
        }

        query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::status eq 2)
            and(
                ProjectNonInvestmentConfirmation::applicationTime between LocalDateTime.of(
                    endDate.year,
                    endDate.month,
                    1,
                    0,
                    0,
                    0
                )..end
            )
        }

        query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::status eq 2)
            and(
                ProjectNonInvestmentConfirmation::commencementDate between startMonth..end.toLocalDate()
            )
        }

        query<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::status eq 2)
            and(
                ProjectNonInvestmentConfirmation::endDate between startMonth..end.toLocalDate()
            )
        }

        // 辅助函数：根据金额和项目类型过滤项目
        fun filterByAmount(
            projects: List<ProjectDigitalInvestmentAttracting>,
            rmb1: Double?,
            rmb2: Double?
        ): List<ProjectDigitalInvestmentAttracting> {
            return projects.filter { project ->
                val amount = project.investmentAmount ?: return@filter false
                val rating = project.projectRating

                val meetsMin = when {
                    rmb1 == null -> true
                    rating == "内资" -> amount >= rmb1
                    rating == "外资" && rmb1 != 5.0 -> amount >= rmb1 * 1000
                    rating == "外资" -> amount >= 3000.0
                    else -> false
                }

                val meetsMax = when {
                    rmb2 == null -> true
                    rating == "内资" -> amount < rmb2
                    rating == "外资" -> amount < rmb2 * 1000
                    else -> false
                }

                meetsMin && meetsMax
            }
        }

        fun filterByAmountYear(
            projects: List<ProjectDigitalInvestmentAttracting>,
        ): List<ProjectDigitalInvestmentAttracting> {
            return projects.filter { project ->
                val amount = if (project.tzgm != null) {
                    project.tzgm!!.toDouble()
                } else {
                    0.0
                }
                val rating = project.projectRating

                val meetsMin = when (rating) {
                    "内资" -> amount >= 10000.0
                    "外资" -> amount >= 3000.0
                    else -> false
                }

                meetsMin
            }
        }

        // 辅助函数：按地区分组并统计
        fun countByDistrict(projects: List<ProjectDigitalInvestmentAttracting>): Map<String?, Long> {
            return projects.groupingBy { it.district }.eachCount().mapValues { it.value.toLong() }
        }

        // 辅助函数：过滤非投资项目并按地区统计
        fun countNonInvestByDistrict(
            projects: List<ProjectNonInvestmentConfirmation>,
            rmb1: Double?,
            rmb2: Double?
        ): Map<String?, Long> {
            return projects.filter { project ->
                val amount = project.investmentAmount ?: return@filter false
                val meetsMin = rmb1?.let { amount >= BigDecimal.valueOf(it * 10000) } ?: true
                val meetsMax = rmb2?.let { amount < BigDecimal.valueOf(it * 10000) } ?: true
                meetsMin && meetsMax
            }.groupingBy { it.cityDistrict }.eachCount().mapValues { it.value.toLong() }
        }

        // 按月统计的辅助函数
        fun countMonthByDistrict(
            projects: List<ProjectDigitalInvestmentAttracting>,
            rmb1: Double?,
            rmb2: Double?
        ): Map<String?, Long> {
            return filterByAmount(projects, rmb1, rmb2).groupingBy { it.district }.eachCount()
                .mapValues { it.value.toLong() }
        }

        fun countMonthNonInvestByDistrict(
            projects: List<ProjectNonInvestmentConfirmation>,
            rmb1: Double?,
            rmb2: Double?
        ): Map<String?, Long> {
            return countNonInvestByDistrict(projects, rmb1, rmb2)
        }

        // 预计算各金额区间的统计数据（总计）- 已包含同步的非投资项目
        val signing50_100ByDistrict = countByDistrict(filterByAmount(signingProjects, 0.0, 1.0))
        val signing100PlusByDistrict = countByDistrict(filterByAmount(signingProjects, 1.0, null))
        val signing30UsdPlusByDistrict = countByDistrict(filterByAmount(signingProjects, 5.0, null))

        val record50_100ByDistrict = countByDistrict(filterByAmount(recordProjects, 0.05, 1.0))
        val record100PlusByDistrict = countByDistrict(filterByAmount(recordProjects, 1.0, null))
        val record30UsdPlusByDistrict = countByDistrict(filterByAmount(recordProjects, 5.0, null))

        val start50_100ByDistrict = countByDistrict(filterByAmount(startProjects, 0.05, 1.0))
        val start100PlusByDistrict = countByDistrict(filterByAmount(startProjects, 1.0, null))
        val start30UsdPlusByDistrict = countByDistrict(filterByAmount(startProjects, 5.0, null))

        val completion50_100ByDistrict = countByDistrict(filterByAmount(completionProjects, 0.05, 1.0))
        val completion100PlusByDistrict = countByDistrict(filterByAmount(completionProjects, 1.0, null))

        // 月度统计数据 - 已包含同步的非投资项目
        val monthSigning50_100ByDistrict = countMonthByDistrict(monthSigningProjects, 0.0, 1.0)
        val monthSigning100PlusByDistrict = countMonthByDistrict(monthSigningProjects, 1.0, null)
        val monthSigning30UsdPlusByDistrict = countMonthByDistrict(monthSigningProjects, 5.0, null)

        val monthRecord50_100ByDistrict = countMonthByDistrict(monthRecordProjects, 0.05, 1.0)
        val monthRecord100PlusByDistrict = countMonthByDistrict(monthRecordProjects, 1.0, null)
        val monthRecord30UsdPlusByDistrict = countMonthByDistrict(monthRecordProjects, 5.0, null)

        val monthStart50_100ByDistrict = countMonthByDistrict(monthStartProjects, 0.05, 1.0)
        val monthStart100PlusByDistrict = countMonthByDistrict(monthStartProjects, 1.0, null)
        val monthStart30UsdPlusByDistrict = countMonthByDistrict(monthStartProjects, 5.0, null)

        val monthCompletion50_100ByDistrict = countMonthByDistrict(monthCompletionProjects, 0.05, 1.0)
        val monthCompletion100PlusByDistrict = countMonthByDistrict(monthCompletionProjects, 1.0, null)

        //年度投资项目统计数据
        val yearSigningByDistrict = countByDistrict(filterByAmountYear(signingProjects))
        val monthYearSigningByDistrict = countByDistrict(filterByAmountYear(monthSigningProjects))

        // 查询增资扩产和外资利润再投资项目数（使用zzkcDAO）
        val expansionByDistrict = DISTRICT_LIST.associate { (code, _) ->
            val year1 = count1(startYear, end.toLocalDate(), code, "增资扩产")
            val month1 = count1(startMonth, end.toLocalDate(), code, "增资扩产")
            val year2 = count2(startYear, end.toLocalDate(), code)
            val month2 = count2(startMonth, end.toLocalDate(), code)
            code to ((year1 + year2) to (month1 + month2))
        }

        val reinvestmentByDistrict = DISTRICT_LIST.associate { (code, _) ->
            code to Pair(
                zzkcDAO.count1(startYear, end.toLocalDate(), code, "外资利润再投资"),
                zzkcDAO.count1(startMonth, end.toLocalDate(), code, "外资利润再投资")
            )
        }

        // 构建结果列表
        val list = DISTRICT_LIST.map { (code, name) ->
            // 从预计算的Map中获取数据
            fun getTotal(districtCode: String?, map: Map<String?, Long>): Long = map[districtCode] ?: 0L
            fun getMonthTotal(districtCode: String?, map: Map<String?, Long>): Long = map[districtCode] ?: 0L

            val newStartProjectCount = queryCount<ProjectKeyProject> {
                and(ProjectKeyProject::district eq code)
                and(ProjectKeyProject::fgName ne "未找到")
                and(ProjectKeyProject::fgName.isNotNull)
                and(ProjectKeyProject::ifNewStart2026 eq true)
            }

            val startedProjectCount = queryCount<ProjectDigitalInvestmentAttracting> {
                where(ProjectDigitalInvestmentAttracting::projectCode inList keyProjectList)
                and(ProjectDigitalInvestmentAttracting::district eq code)
                and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 2)
            } + queryCount<ProjectNonInvestmentConfirmation> {
                where(ProjectNonInvestmentConfirmation::cityDistrict eq code)
                and(ProjectNonInvestmentConfirmation::progress eq 6)
                and(ProjectNonInvestmentConfirmation::status eq 2)
            }

            val districtKeyProjects = keyProjectStatsByDistrict[code] ?: emptyList()
            val actualStoredInvestment = BigDecimal.valueOf(
                districtKeyProjects.mapNotNull { it.inInvest }.sumOf { it } / 10000
            )
            val annualInvestment = districtKeyProjects
                .mapNotNull { it.annualPlanInvestment }
                .sumOf { it }
                .divide(BigDecimal.valueOf(10000.0))

            StatisticLHBVO(
                regionName = name,
                rankings = Rankings(),
                fixedAssetInvestment = FixedAssetInvestment(


                ),
                provincialMajorProjects = ProvincialMajorProject(),
                municipalKeyProjects = MunicipalKeyProject(
                    projectCount = districtKeyProjects.size.toLong(),
                    plannedTotalInvestment = districtKeyProjects
                        .mapNotNull { it.totalInvestmentAmount }
                        .sumOf { it }
                        .divide(BigDecimal.valueOf(10000)),
                    annualInvestment = annualInvestment,
                    listedProjectCount = districtKeyProjects.count { it.ifStorage == true }.toLong(),
                    actualStoredInvestment = actualStoredInvestment,
                    investmentCompletionRate =
                        if (actualStoredInvestment > BigDecimal.ZERO && annualInvestment > BigDecimal.ZERO) {
                            BigDecimal.valueOf(100.0) * actualStoredInvestment / annualInvestment
                        } else {
                            BigDecimal.ZERO
                        },
                    newStartProjectCount = newStartProjectCount,
                    startedProjectCount = startedProjectCount,
                    startRate = if (startedProjectCount > 0 && newStartProjectCount > 0) {
                        100.0 * startedProjectCount / (newStartProjectCount)
                    } else {
                        0.0
                    }
                ),
                signedProjects = SignedProjects(
                    range50mTo100m = ProjectCountInfo(
                        getTotal(code, signing50_100ByDistrict),
                        getMonthTotal(code, monthSigning50_100ByDistrict)
                    ),
                    range100mPlus = ProjectCountInfo(
                        getTotal(code, signing100PlusByDistrict),
                        getMonthTotal(code, monthSigning100PlusByDistrict)
                    ),
                    range30mUsdPlus = ProjectCountInfo(
                        getTotal(code, signing30UsdPlusByDistrict),
                        getMonthTotal(code, monthSigning30UsdPlusByDistrict)
                    ),
                    annualInv100mPlus = ProjectCountInfo(
                        getTotal(code, yearSigningByDistrict),
                        getMonthTotal(code, monthYearSigningByDistrict)
                    )
                ),
                filedProjects = FiledProjects(
                    range50mTo100m = ProjectCountInfo(
                        getTotal(code, record50_100ByDistrict),
                        getMonthTotal(code, monthRecord50_100ByDistrict)
                    ),
                    range100mPlus = ProjectCountInfo(
                        getTotal(code, record100PlusByDistrict),
                        getMonthTotal(code, monthRecord100PlusByDistrict)
                    ),
                    range30mUsdPlus = ProjectCountInfo(
                        getTotal(code, record30UsdPlusByDistrict),
                        getMonthTotal(code, monthRecord30UsdPlusByDistrict)
                    ),
                    expansionProjects = ProjectCountInfo(
                        expansionByDistrict[code]?.first ?: 0,
                        expansionByDistrict[code]?.second ?: 0
                    ),
                    reinvestmentProjects = ProjectCountInfo(
                        reinvestmentByDistrict[code]?.first ?: 0,
                        reinvestmentByDistrict[code]?.second ?: 0
                    ),
                ),
                constructionStartProjects = ConstructionStartProjects(
                    range50mTo100m = ProjectCountInfo(
                        getTotal(code, start50_100ByDistrict),
                        getMonthTotal(code, monthStart50_100ByDistrict)
                    ),
                    range100mPlus = ProjectCountInfo(
                        getTotal(code, start100PlusByDistrict),
                        getMonthTotal(code, monthStart100PlusByDistrict)
                    ),
                    range30mUsdPlus = ProjectCountInfo(
                        getTotal(code, start30UsdPlusByDistrict),
                        getMonthTotal(code, monthStart30UsdPlusByDistrict)
                    ),
                ),
                constructionStartInvestment = ConstructionStartInvestment(),
                completedProjects = CompletedProjects(
                    range50mTo100m = ProjectCountInfo(
                        getTotal(code, completion50_100ByDistrict),
                        getMonthTotal(code, monthCompletion50_100ByDistrict)
                    ),
                    range100mPlus = ProjectCountInfo(
                        getTotal(code, completion100PlusByDistrict),
                        getMonthTotal(code, monthCompletion100PlusByDistrict)
                    ),
                ),
                fourAboveEnterprises = FourAboveEnterprises()
            )
        }

        // 计算全市汇总数据
        val sum = StatisticLHBVO(
            regionName = "全市",
            rankings = Rankings(),
            fixedAssetInvestment = FixedAssetInvestment(),
            provincialMajorProjects = ProvincialMajorProject(),
            municipalKeyProjects = MunicipalKeyProject(
                projectCount = list.sumOf { it.municipalKeyProjects?.projectCount ?: 0 },
                plannedTotalInvestment = list.sumOf {
                    it.municipalKeyProjects?.plannedTotalInvestment ?: BigDecimal.ZERO
                },
                annualInvestment = list.sumOf { it.municipalKeyProjects?.annualInvestment ?: BigDecimal.ZERO },
                newStartProjectCount = list.sumOf { it.municipalKeyProjects?.newStartProjectCount ?: 0 },
                listedProjectCount = list.sumOf { it.municipalKeyProjects?.listedProjectCount ?: 0 },
                actualStoredInvestment = list.sumOf {
                    it.municipalKeyProjects?.actualStoredInvestment ?: BigDecimal.ZERO
                },
                investmentCompletionRate = BigDecimal.valueOf(100) * list.sumOf {
                    it.municipalKeyProjects?.actualStoredInvestment ?: BigDecimal.ZERO
                } / list.sumOf { it.municipalKeyProjects?.annualInvestment ?: BigDecimal.ZERO },
                startedProjectCount = list.sumOf { it.municipalKeyProjects?.startedProjectCount ?: 0 },
                startRate =
                    100.0 * list.sumOf { it.municipalKeyProjects?.startedProjectCount ?: 0 } /
                            list.sumOf { it.municipalKeyProjects?.newStartProjectCount ?: 0 },
            ),
            signedProjects = SignedProjects(
                range50mTo100m = ProjectCountInfo(
                    list.sumOf { it.signedProjects?.range50mTo100m?.total ?: 0 },
                    list.sumOf { it.signedProjects?.range50mTo100m?.monthNew ?: 0 }
                ),
                range100mPlus = ProjectCountInfo(
                    list.sumOf { it.signedProjects?.range100mPlus?.total ?: 0 },
                    list.sumOf { it.signedProjects?.range100mPlus?.monthNew ?: 0 }
                ),
                range30mUsdPlus = ProjectCountInfo(
                    list.sumOf { it.signedProjects?.range30mUsdPlus?.total ?: 0 },
                    list.sumOf { it.signedProjects?.range30mUsdPlus?.monthNew ?: 0 }
                ),
                annualInv100mPlus = ProjectCountInfo(
                    list.sumOf { it.signedProjects?.annualInv100mPlus?.total ?: 0 },
                    list.sumOf { it.signedProjects?.annualInv100mPlus?.monthNew ?: 0 }
                )
            ),
            filedProjects = FiledProjects(
                range50mTo100m = ProjectCountInfo(
                    list.sumOf { it.filedProjects?.range50mTo100m?.total ?: 0 },
                    list.sumOf { it.filedProjects?.range50mTo100m?.monthNew ?: 0 }
                ),
                range100mPlus = ProjectCountInfo(
                    list.sumOf { it.filedProjects?.range100mPlus?.total ?: 0 },
                    list.sumOf { it.filedProjects?.range100mPlus?.monthNew ?: 0 }
                ),
                range30mUsdPlus = ProjectCountInfo(
                    list.sumOf { it.filedProjects?.range30mUsdPlus?.total ?: 0 },
                    list.sumOf { it.filedProjects?.range30mUsdPlus?.monthNew ?: 0 }
                ),
                expansionProjects = ProjectCountInfo(
                    list.sumOf { it.filedProjects?.expansionProjects?.total ?: 0 },
                    list.sumOf { it.filedProjects?.expansionProjects?.monthNew ?: 0 }
                ),
                reinvestmentProjects = ProjectCountInfo(
                    list.sumOf { it.filedProjects?.reinvestmentProjects?.total ?: 0 },
                    list.sumOf { it.filedProjects?.reinvestmentProjects?.monthNew ?: 0 }
                )
            ),
            constructionStartProjects = ConstructionStartProjects(
                range50mTo100m = ProjectCountInfo(
                    list.sumOf { it.constructionStartProjects?.range50mTo100m?.total ?: 0 },
                    list.sumOf { it.constructionStartProjects?.range50mTo100m?.monthNew ?: 0 }
                ),
                range100mPlus = ProjectCountInfo(
                    list.sumOf { it.constructionStartProjects?.range100mPlus?.total ?: 0 },
                    list.sumOf { it.constructionStartProjects?.range100mPlus?.monthNew ?: 0 }
                ),
                range30mUsdPlus = ProjectCountInfo(
                    list.sumOf { it.constructionStartProjects?.range30mUsdPlus?.total ?: 0 },
                    list.sumOf { it.constructionStartProjects?.range30mUsdPlus?.monthNew ?: 0 }
                ),
            ),
            constructionStartInvestment = ConstructionStartInvestment(),
            completedProjects = CompletedProjects(
                range50mTo100m = ProjectCountInfo(
                    list.sumOf { it.completedProjects?.range50mTo100m?.total ?: 0 },
                    list.sumOf { it.completedProjects?.range50mTo100m?.monthNew ?: 0 }
                ),
                range100mPlus = ProjectCountInfo(
                    list.sumOf { it.completedProjects?.range100mPlus?.total ?: 0 },
                    list.sumOf { it.completedProjects?.range100mPlus?.monthNew ?: 0 }
                ),
            ),
            fourAboveEnterprises = FourAboveEnterprises()
        )
        return list + sum
    }

    override fun projectInfoTotal(
        endDate: LocalDateTime,
        progress: ProjectProgress,
        rmb1: Double?,
        rmb2: Double?,
        code: String?,
        isNDTZ: Boolean?,
    ) = query<ProjectDigitalInvestmentAttracting> {
        if (rmb1 != null) {
            and {
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                    i.and(ProjectDigitalInvestmentAttracting::investmentAmount ge rmb1)
                }
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                    if (rmb1 != 5.0) {
                        i.and(ProjectDigitalInvestmentAttracting::investmentAmount ge rmb1 * 1000)
                    } else {
                        i.and(ProjectDigitalInvestmentAttracting::investmentAmount ge 3000.0)
                    }
                }
            }
        }
        if (rmb2 != null) {
            and {
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                    i.and(ProjectDigitalInvestmentAttracting::investmentAmount lt rmb2)
                }
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                    i.and(ProjectDigitalInvestmentAttracting::investmentAmount lt rmb2 * 1000)
                }
            }
        }
        when (progress) {
            ProjectProgress.SIGNING -> {
                and(
                    ProjectDigitalInvestmentAttracting::signingTime between LocalDate.of(
                        endDate.year,
                        1,
                        1
                    )..endDate.toLocalDate()
                )
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
                and(ProjectDigitalInvestmentAttracting::source ne "增资扩产")
            }

            ProjectProgress.RECORD -> {
                val list = query<ProjectInvestmentXOnlineApproval> {
                    join(ProjectOnlineApproval::class.java)
                        .on(ProjectOnlineApproval::projectCode eq ProjectInvestmentXOnlineApproval::onlineApprovalId)
                    and(
                        ProjectOnlineApproval::applicationTime between LocalDate.of(
                            endDate.year,
                            1,
                            1
                        ).atTime(0, 0, 0)..endDate
                    )
                }.mapNotNull { it.investmentId }
                and { i ->
                    i.or(ProjectDigitalInvestmentAttracting::id inList list)
                    i.or {
                        it.and(
                            ProjectDigitalInvestmentAttracting::filingInfoStatisticsDate between LocalDate.of(
                                endDate.year,
                                1,
                                1
                            )..endDate.toLocalDate()
                        )
                        it.and(ProjectDigitalInvestmentAttracting::source eq "增资扩产")
                    }
                }
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }

            ProjectProgress.START -> {
                // 根据园区填报的开工时间和开工认定通过时间共同判断
                // 若都为今年则算入今年总数
                val startReviewIds = query<ProjectDigitalProjectReviewAll> {
                    and(
                        ProjectDigitalProjectReviewAll::updateTime between LocalDate.of(
                            endDate.year,
                            1,
                            1
                        ).atTime(0, 0, 0)..endDate
                    )
                    and(ProjectDigitalProjectReviewAll::status eq "已完成")
                    and(ProjectDigitalProjectReviewAll::result eq 1)
                    and(ProjectDigitalProjectReviewAll::step eq 4)
                }.mapNotNull { it.digitalInvestmentId }.toSet()

                if (startReviewIds.isEmpty()) {
                    and(ProjectDigitalInvestmentAttracting::id.isNull)
                } else {
                    and(ProjectDigitalInvestmentAttracting::id inList startReviewIds)
                    and {
                        // 开工时间和认定通过时间都为今年
                        it.and(
                            ProjectDigitalInvestmentAttracting::startConfirmDate between LocalDate.of(
                                endDate.year,
                                1,
                                1
                            )..endDate.toLocalDate()
                        )
                        it.and(ProjectDigitalInvestmentAttracting::id inList query<ProjectDigitalProjectReviewAll> {
                            and(
                                ProjectDigitalProjectReviewAll::updateTime between LocalDate.of(endDate.year, 1, 1)
                                    .atTime(0, 0, 0)..endDate
                            )
                            and(ProjectDigitalProjectReviewAll::status eq "已完成")
                            and(ProjectDigitalProjectReviewAll::result eq 1)
                            and(ProjectDigitalProjectReviewAll::step eq 4)
                        }.mapNotNull { it.digitalInvestmentId })
                    }
                }
                and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 2)
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }

            ProjectProgress.COMPLETION -> {
                // 根据竣工时间和竣工认定通过时间共同判断
                // 若都为今年则算入今年总数
                val completionReviewIds = query<ProjectDigitalProjectReviewAll> {
                    and(
                        ProjectDigitalProjectReviewAll::updateTime between LocalDate.of(
                            endDate.year,
                            1,
                            1
                        ).atTime(0, 0, 0)..endDate
                    )
                    and(ProjectDigitalProjectReviewAll::status eq "已完成")
                    and(ProjectDigitalProjectReviewAll::result eq 1)
                    and(ProjectDigitalProjectReviewAll::step eq 5)
                }.mapNotNull { it.digitalInvestmentId }.toSet()

                if (completionReviewIds.isEmpty()) {
                    and(ProjectDigitalInvestmentAttracting::id.isNull)
                } else {
                    and(ProjectDigitalInvestmentAttracting::id inList completionReviewIds)
                    and {
                        // 竣工时间和认定通过时间都为今年
                        it.and(
                            ProjectDigitalInvestmentAttracting::endConfirmDate between LocalDate.of(
                                endDate.year,
                                1,
                                1
                            )..endDate.toLocalDate()
                        )
                        it.and(ProjectDigitalInvestmentAttracting::id inList query<ProjectDigitalProjectReviewAll> {
                            and(
                                ProjectDigitalProjectReviewAll::updateTime between LocalDate.of(endDate.year, 1, 1)
                                    .atTime(0, 0, 0)..endDate
                            )
                            and(ProjectDigitalProjectReviewAll::status eq "已完成")
                            and(ProjectDigitalProjectReviewAll::result eq 1)
                            and(ProjectDigitalProjectReviewAll::step eq 5)
                        }.mapNotNull { it.digitalInvestmentId })
                    }
                }
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }

            else -> {}
        }
//            and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq progress)
        if (code != AreaConstant.TAIZHOU_CODE) {
            and(ProjectDigitalInvestmentAttracting::district eq code)
        }
    }

    override fun projectInfoMonth(
        endDate: LocalDateTime,
        progress: ProjectProgress,
        rmb1: Double?,
        rmb2: Double?,
        code: String?,
        isNDTZ: Boolean?,
    ) = query<ProjectDigitalInvestmentAttracting> {

        if (rmb1 != null) {
            and {
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                    i.and(ProjectDigitalInvestmentAttracting::investmentAmount ge rmb1)
                }
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                    if (rmb1 != 5.0) {
                        i.and(ProjectDigitalInvestmentAttracting::investmentAmount ge rmb1 * 1000)
                    } else {
                        i.and(ProjectDigitalInvestmentAttracting::investmentAmount ge 3000.0)
                    }
                }
            }
        }
        if (rmb2 != null) {
            and {
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                    i.and(ProjectDigitalInvestmentAttracting::investmentAmount lt rmb2)
                }
                it.or { i ->
                    i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                    i.and(ProjectDigitalInvestmentAttracting::investmentAmount lt rmb2 * 1000)
                }
            }
        }
        when (progress) {
            ProjectProgress.SIGNING -> {
                and(
                    ProjectDigitalInvestmentAttracting::signingTime between LocalDate.of(
                        endDate.year,
                        endDate.month,
                        1
                    )..endDate.toLocalDate()
                )
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
                and(ProjectDigitalInvestmentAttracting::source ne "增资扩产")
            }

            ProjectProgress.RECORD -> {
                val list = query<ProjectInvestmentXOnlineApproval> {
                    join(ProjectOnlineApproval::class.java)
                        .on(ProjectOnlineApproval::projectCode eq ProjectInvestmentXOnlineApproval::onlineApprovalId)
                    and(
                        ProjectOnlineApproval::applicationTime between LocalDate.of(
                            endDate.year,
                            endDate.month,
                            1
                        ).atTime(0, 0, 0)..endDate
                    )
                }.mapNotNull { it.investmentId }
                and { i ->
                    i.or(ProjectDigitalInvestmentAttracting::id inList list)
                    i.or {
                        it.and(
                            ProjectDigitalInvestmentAttracting::filingInfoStatisticsDate between LocalDate.of(
                                endDate.year,
                                endDate.month,
                                1
                            )..endDate.toLocalDate()
                        )
                        it.and(ProjectDigitalInvestmentAttracting::source eq "增资扩产")
                    }
                }
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }

            ProjectProgress.START -> {
                val startMonth = LocalDate.of(endDate.year, endDate.month, 1)
                val end = endDate.toLocalDate()
                join(ProjectDigitalProjectReviewAll::class.java)
                    .on(
                        ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id
                    )
                select(ProjectDigitalInvestmentAttracting::class.allColumns)
                select(
                    QueryMethods.dateDiff(
                        ProjectDigitalInvestmentAttracting::startConfirmDate,
                        ProjectDigitalProjectReviewAll::updateTime,
                    ).`as`("diff")
                )
                having(RawQueryCondition("(diff<=15 and diff>=0)").or(ProjectDigitalInvestmentAttracting::startConfirmDate between startMonth..end))

                and(
                    ProjectDigitalProjectReviewAll::updateTime between startMonth.atTime(0, 0, 0)..endDate
                )
                and(ProjectDigitalProjectReviewAll::status eq "已完成")
                and(ProjectDigitalProjectReviewAll::result eq 1)
                and(ProjectDigitalProjectReviewAll::step eq 4)
                and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 2)
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }

            ProjectProgress.COMPLETION -> {
                val startMonth = LocalDate.of(endDate.year, endDate.month, 1)
                val end = endDate.toLocalDate()
                join(ProjectDigitalProjectReviewAll::class.java)
                    .on(
                        ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id
                    )
                select(ProjectDigitalInvestmentAttracting::class.allColumns)
                select(
                    QueryMethods.dateDiff(
                        ProjectDigitalInvestmentAttracting::endConfirmDate,
                        ProjectDigitalProjectReviewAll::updateTime,
                    ).`as`("diff")
                )
                having(RawQueryCondition("(diff<=15 and diff>=0)").or(ProjectDigitalInvestmentAttracting::endConfirmDate between startMonth..end))

                and(
                    ProjectDigitalProjectReviewAll::updateTime between startMonth.atTime(0, 0, 0)..endDate
                )
                and(ProjectDigitalProjectReviewAll::status eq "已完成")
                and(ProjectDigitalProjectReviewAll::result eq 1)
                and(ProjectDigitalProjectReviewAll::step eq 5)
                and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq 2)
                and {
                    it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                    it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                }
            }

            else -> {}
        }
//            and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq progress)
        if (code != AreaConstant.TAIZHOU_CODE) {
            and(ProjectDigitalInvestmentAttracting::district eq code)
        }
        if (isNDTZ == true) {
            and(ProjectDigitalInvestmentAttracting::tzgm gt 10000f)
        }
    }

    fun projectNoninvestTotal(
        year: Int,
        progress: ProjectProgress?,
        rmb1: Double?,
        rmb2: Double?,
        month: Int,
        code: String?,
        isZZKC: Boolean?,
    ) = query<ProjectNonInvestmentConfirmation> {
        and(ProjectNonInvestmentConfirmation::status eq 2)
        if (rmb1 != null) {
            and(ProjectNonInvestmentConfirmation::investmentAmount ge BigDecimal.valueOf(rmb1 * 10000))
        }
        if (rmb2 != null) {
            and(ProjectNonInvestmentConfirmation::investmentAmount lt BigDecimal.valueOf(rmb2 * 10000))
        }
        if (code != AreaConstant.TAIZHOU_CODE) {
            and(ProjectNonInvestmentConfirmation::cityDistrict eq code)
        }
        when (progress) {
            ProjectProgress.RECORD -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.RECORD)
                and(
                    ProjectNonInvestmentConfirmation::applicationTime between LocalDateTime.of(
                        year,
                        1,
                        1,
                        0,
                        0,
                        0
                    )..LocalDate.of(
                        year,
                        month,
                        1
                    ).with(lastDayOfMonth()).atTime(
                        23,
                        59,
                        59
                    )
                )
            }

            ProjectProgress.APPROVAL -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.APPROVAL)
            }

            ProjectProgress.START -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.START)
                and(
                    ProjectNonInvestmentConfirmation::commencementDate between LocalDate.of(
                        year,
                        1,
                        1
                    )..LocalDate.of(
                        year,
                        month,
                        1
                    ).with(lastDayOfMonth())
                )
            }

            ProjectProgress.COMPLETION -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.COMPLETION)
                and(
                    ProjectNonInvestmentConfirmation::endDate between LocalDate.of(
                        year,
                        1,
                        1
                    )..LocalDate.of(
                        year,
                        month,
                        1
                    ).with(lastDayOfMonth())
                )
            }

            else -> {}
        }

        if (isZZKC == true) {
            and(ProjectNonInvestmentConfirmation::investmentType eq "增资扩产")
        } else if (isZZKC == false) {
            and(ProjectNonInvestmentConfirmation::investmentType eq "外资利润再投资")
        }
    }

    fun projectNoninvestMonth(
        year: Int,
        progress: ProjectProgress?,
        rmb1: Double?,
        rmb2: Double?,
        month: Int,
        code: String?,
        isZZKC: Boolean?,
    ) = query<ProjectNonInvestmentConfirmation> {
        and(ProjectNonInvestmentConfirmation::status eq 2)
        if (rmb1 != null) {
            and(ProjectNonInvestmentConfirmation::investmentAmount ge BigDecimal.valueOf(rmb1 * 10000))
        }
        if (rmb2 != null) {
            and(ProjectNonInvestmentConfirmation::investmentAmount lt BigDecimal.valueOf(rmb2 * 10000))
        }
        if (code != AreaConstant.TAIZHOU_CODE) {
            and(ProjectNonInvestmentConfirmation::cityDistrict eq code)
        }
        when (progress) {
            ProjectProgress.RECORD -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.RECORD)
                and(
                    ProjectNonInvestmentConfirmation::applicationTime between LocalDateTime.of(
                        year,
                        month,
                        1,
                        0,
                        0,
                        0
                    )..LocalDate.of(
                        year,
                        month,
                        1
                    ).with(lastDayOfMonth()).atTime(
                        23,
                        59,
                        59
                    )
                )
            }

            ProjectProgress.APPROVAL -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.APPROVAL)
            }

            ProjectProgress.START -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.START)
                and(
                    ProjectNonInvestmentConfirmation::commencementDate between LocalDate.of(
                        year,
                        month,
                        1
                    )..LocalDate.of(
                        year,
                        month,
                        1
                    ).with(lastDayOfMonth())
                )
            }

            ProjectProgress.COMPLETION -> {
//                    and(ProjectNonInvestmentConfirmation::progress eq ProjectProgress.COMPLETION)
                and(
                    ProjectNonInvestmentConfirmation::endDate between LocalDate.of(
                        year,
                        month,
                        1
                    )..LocalDate.of(
                        year,
                        month,
                        1
                    ).with(lastDayOfMonth())
                )
            }

            else -> {}
        }
        if (isZZKC == true) {
            and(ProjectNonInvestmentConfirmation::investmentType eq "增资扩产")
        } else if (isZZKC == false) {
            and(ProjectNonInvestmentConfirmation::investmentType eq "外资利润再投资")
        }
    }

    private fun count1(
        start: LocalDate,
        end: LocalDate,
        district: String,
        type: String,
    ): Long {
        val yearMonthStr = mutableListOf<String>()
        var t = start
        while (t <= end) {
            yearMonthStr.add(String.format("%02d%02d-%%", t.year % 100, t.monthValue))
            t = t.plusMonths(1)
        }
        return queryCount<ProjectNonInvestmentConfirmation> {
            and {
                for (t in yearMonthStr) {
                    it.or(ProjectNonInvestmentConfirmation::projectCode likeRaw t)
                }
            }
            and(ProjectNonInvestmentConfirmation::cityDistrict eq district)
            and(ProjectNonInvestmentConfirmation::investmentType eq type)
            and(ProjectNonInvestmentConfirmation::investmentAmount ge BigDecimal.valueOf(500))
            and(ProjectNonInvestmentConfirmation::rkStat eq 1)
        }
    }

    fun count2(
        start: LocalDate,
        end: LocalDate,
        district: String,
    ): Long {
        val yearMonthStr = mutableListOf<String>()
        var t = start
        while (t <= end) {
            yearMonthStr.add(String.format("%02d%02d-%%", t.year % 100, t.monthValue))
            t = t.plusMonths(1)
        }
        return queryCount<ProjectDigitalInvestmentAttracting> {
            join(ProjectInvestmentXOnlineApproval::class.java)
                .on(ProjectInvestmentXOnlineApproval::investmentId eq ProjectDigitalInvestmentAttracting::id)
            join(ProjectOnlineApproval::class.java)
                .on(ProjectInvestmentXOnlineApproval::onlineApprovalId eq ProjectOnlineApproval::id)
            and {
                for (t in yearMonthStr) {
                    it.or(ProjectOnlineApproval::projectCode likeRaw t)
                }
            }
            and(ProjectDigitalInvestmentAttracting::district eq district)
            and(ProjectDigitalInvestmentAttracting::source ne "增资扩产")
            and(ProjectDigitalInvestmentAttracting::isZzkc eq true)
            and(ProjectDigitalInvestmentAttracting::investmentAmount ge 0.05)
            and {
                it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                    .and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
            }
        }
    }
}
