package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.vo.LHBProjectInfoVO
import com.tzdig.framework.model.vo.Statistic4KuVO
import com.tzdig.framework.model.vo.StatisticVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.InternetSuperviseService
import com.tzdig.framework.service.StatisticService
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import java.time.LocalDate
import java.time.LocalDateTime


@Tag(name = "首页统计数据管理")
@RestController
@RequestMapping("statistic")
class StatisticController(
    private val statisticService: StatisticService,
    private val internetSuperviseService: InternetSuperviseService
) {


    @Operation(summary = "首页数据")
    @GetMapping
    fun getStatistic(): StatisticVO? {
        val signData = queryCount<ProjectDigitalInvestmentAttracting> {
            and(ProjectDigitalInvestmentAttracting::currentProjectProgress ne "1")
            and(ProjectDigitalInvestmentAttracting::currentProjectProgress.isNotNull)
        }
        val buildData = queryCount<ProjectDigitalInvestmentAttracting> {
            and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq "6")
        }
        return StatisticVO(
            data = internetSuperviseService.getStatistic(),
            signData = signData,
            buildData = buildData
        )
    }

    @Operation(summary = "四库数据")
    @GetMapping("four-library")
    fun getFourLibrary(
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "金额范图")
        @RequestParam(defaultValue = "") range: String
    ): Statistic4KuVO? {
        return Statistic4KuVO(
            signData = queryCount<ProjectDigitalInvestmentAttracting> {
                and(ProjectDigitalInvestmentAttracting::currentProjectProgress ne "1")
                and(ProjectDigitalInvestmentAttracting::currentProjectProgress.isNotNull)
                if (year != null) {
                    val startTime = LocalDate.of(year, 1, 1)
                    val endTime = LocalDate.of(year, 12, 31)
                    and(ProjectDigitalInvestmentAttracting::signingTime between startTime..endTime)
                    and {
                        it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                        it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                        it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                    }
                }
                if (range == "亿元以上") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny ge 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd ge 1.0 / 7)
                        }
                    }
                } else if (range == "亿元以下") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny lt 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd lt 1.0 / 7)
                        }
                    }
                }
            },
            recordData = queryCount<ProjectDigitalInvestmentAttracting> {
                and(
                    ProjectDigitalInvestmentAttracting::currentProjectProgress notIn listOf(
                        ProjectProgress.NEGOTIATION,
                        ProjectProgress.SIGNING,
                        ProjectProgress.REGISTRATION,
                    )
                )
                and(ProjectDigitalInvestmentAttracting::currentProjectProgress.isNotNull)
                if (year != null) {
                    val startTime = LocalDate.of(year, 1, 1)
                    val endTime = LocalDate.of(year, 12, 31)
                    and(ProjectDigitalInvestmentAttracting::signingTime between startTime..endTime)
                    and {
                        it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                        it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                        it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                    }
                }
                if (range == "亿元以上") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny ge 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd ge 1.0 / 7)
                        }
                    }
                } else if (range == "亿元以下") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny lt 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd lt 1.0 / 7)
                        }
                    }
                }
            },
            buildData = queryCount<ProjectDigitalInvestmentAttracting> {
                and(
                    ProjectDigitalInvestmentAttracting::currentProjectProgress inList listOf(
                        ProjectProgress.START,
                        ProjectProgress.COMPLETION
                    )
                )
                if (year != null) {
                    val startTime = LocalDate.of(year, 1, 1)
                    val endTime = LocalDate.of(year, 12, 31)
                    and(ProjectDigitalInvestmentAttracting::signingTime between startTime..endTime)
                    and {
                        it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                        it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                        it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                    }
                }
                if (range == "亿元以上") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny ge 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd ge 1.0 / 7)
                        }
                    }
                } else if (range == "亿元以下") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny lt 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd lt 1.0 / 7)
                        }
                    }
                }
            },
            productData = queryCount<ProjectDigitalInvestmentAttracting> {
                and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq "7")
                if (year != null) {
                    val startTime = LocalDate.of(year, 1, 1)
                    val endTime = LocalDate.of(year, 12, 31)
                    and(ProjectDigitalInvestmentAttracting::signingTime between startTime..endTime)
                    and {
                        it.and(ProjectDigitalInvestmentAttracting::checkStatus eq 1)
                        it.and(ProjectDigitalInvestmentAttracting::currentProjectProgress eq ProjectProgress.SIGNING)
                        it.or(ProjectDigitalInvestmentAttracting::currentProjectProgress ne ProjectProgress.SIGNING)
                    }
                }
                if (range == "亿元以上") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny ge 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd ge 1.0 / 7)
                        }
                    }
                } else if (range == "亿元以下") {
                    and {
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "内资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentCny lt 1.0)
                        }
                        it.or { i ->
                            i.and(ProjectDigitalInvestmentAttracting::projectRating eq "外资")
                            i.and(ProjectDigitalInvestmentAttracting::totalInvestmentUsd lt 1.0 / 7)
                        }
                    }
                }
            }
        )
    }

    @Operation(summary = "龙虎榜")
    @GetMapping("long-hu-bang")
    fun getLongHuBang(
        @Schema(description = "结束时间")
        @RequestParam endDate: LocalDateTime,
    ) = statisticService.LHBData(
        endDate
    )

    @Operation(summary = "龙虎榜列表授权")
    @GetMapping("long-hu-bang-auth")
    fun getLongHuBangAuth(): List<String> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        // 检查用户是否有泰州市下辖的市区权限（DISTRICT_LIST中的6个市区）
        val districtCodes = AreaConstant.DISTRICT_LIST.map { it.first }.toSet()
        val userDistricts = grantedAreas.filter { it in districtCodes }

        // 如果用户有所有市区的权限，则视为全市权限，返回泰州市的code
        return if (userDistricts.containsAll(districtCodes)) {
            listOf(AreaConstant.TAIZHOU_CODE)
        } else {
            userDistricts.toList()
        }
    }
    @Operation(summary = "龙虎榜项目列表")
    @GetMapping("long-hu-bang-list")
    fun getLongHuBangProjectInfo(
        @Schema(description = "结束时间")
        @RequestParam endDate: LocalDateTime,
        @Schema(description = "市区代码")
        @RequestParam code: String,
        @Schema(description = "列")
        @RequestParam columns: Int,
    ) = statisticService.LHBProjectInfo(
        endDate,
        code,
        columns,
    )

    @Operation(summary = "龙虎榜项目列表导出")
    @GetMapping("long-hu-bang-list-export.xlsx")
    fun exportProjectJG(
        @Schema(description = "结束时间")
        @RequestParam endDate: LocalDateTime,
        @Schema(description = "市区代码")
        @RequestParam code: String,
        @Schema(description = "列")
        @RequestParam columns: Int,
    ): FileDownloadVO {
        val records = statisticService.LHBProjectInfo(
            endDate,
            code,
            columns,
        )
        val file = ExcelWriteUtils(LHBProjectInfoVO::class)
            .writeWith(createNewTempFile("xlsx")) {
                Flux.fromIterable(records)
            }
        return file.downloadVO("项目招引建设情况通报表.xlsx")
    }

}
