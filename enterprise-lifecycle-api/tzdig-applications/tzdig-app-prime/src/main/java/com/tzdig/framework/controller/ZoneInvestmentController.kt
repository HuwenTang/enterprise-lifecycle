package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.mybatis.dto.ZoneInvestmentHomeStatisticsQueryDTO
import com.tzdig.framework.mybatis.dto.ZoneInvestmentProjectQueryDTO
import com.tzdig.framework.mybatis.extension.toPageableResult
import com.tzdig.framework.mybatis.mapper.prime.ZoneInvestmentProjectMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.mybatis.vo.ZoneInvestmentHomeStatisticsVO
import com.tzdig.framework.mybatis.vo.ZoneInvestmentProjectVO
import com.tzdig.framework.mybatis.vo.ZoneInvestmentStatisticsVO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.cache.annotation.Cacheable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * 战区招商投资项目Controller
 * 用于免登录/未授权访问的战区相关接口
 */
@Tag(name = "公开接口")
@RestController
@RequestMapping("/public/zone-investment")
class ZoneInvestmentController(
    private val zoneInvestmentProjectMapper: ZoneInvestmentProjectMapper
) {

    /**
     * 战区招商投资项目详情列表接口（免登录）
     * 战区映射关系（根据字典编码）：
     * - 内资：101-北京（京津冀区域）、200-上海（长三角区域）、300-南京（南京、合肥区域）、400-深圳（珠三角区域）、500-其他地区、81-其他（境内）
     *
     * 数据源：t_proj_project 表（在谈项目原始表）
     * 排序方式：按 create_time 降序排列
     */
    @SaIgnore
    @Operation(summary = "战区招商-在谈项目列表-PC端（免登录）")
    @GetMapping("/list")
    @PageableQuery
    fun getZoneInvestmentList(
        pageable: Pageable,
        query: ZoneInvestmentProjectQueryDTO,
    ): ApiResponse<PageableResult<ZoneInvestmentProjectVO>> {
        // 转换countryRegionStandard参数：兼容旧的5个固定分类
        query.countryRegionStandard = convertCountryRegionStandard(query.countryRegionStandard)

        // 计算偏移量
        val offset = (pageable.pageNumber - 1) * pageable.pageSize

        // 查询数据列表
        val records = zoneInvestmentProjectMapper.selectZoneInvestmentList(
            query = query,
            offset = offset.toInt(),
            limit = pageable.pageSize.toInt()
        )

        // 如果没有数据，直接返回空结果（避免不必要的count查询）
        if (records.isEmpty()) {
            val emptyResult = records.toPageableResult(pageable, 0)
            return ApiResponse.success(emptyResult)
        }

        // 查询总数
        val total = zoneInvestmentProjectMapper.countZoneInvestment(query = query)

        // 使用扩展函数构建分页结果
        val result = records.toPageableResult(pageable, total)
        return ApiResponse.success(result)
    }

    /**
     * 战区招商投资项目统计接口（免登录）
     * 返回统计数据：在谈项目、招商活动、累计投资额、本月新增、累计新增
     */
    @SaIgnore
    @Operation(summary = "战区招商-在谈项目统计-PC端（免登录）")
    @GetMapping("/statistics")
    fun getZoneInvestmentStatistics(
        @Schema(description = "所属战区,5个固定分类:北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区")
        @RequestParam(required = false) countryRegionStandard: String?,
        @Schema(description = "洽谈进度（模糊匹配），对应 t_proj_project 表的 progress 字段，示例：接洽中、签约等")
        @RequestParam(required = false) dataStatus: String?
    ): ApiResponse<ZoneInvestmentStatisticsVO> {
        val query = ZoneInvestmentProjectQueryDTO().apply {
            this.countryRegionStandard = convertCountryRegionStandard(countryRegionStandard)
            this.dataStatus = dataStatus
        }

        val statistics = zoneInvestmentProjectMapper.selectZoneInvestmentStatistics(query = query)
        return ApiResponse.success(statistics)
    }

    /**
     * 战区招商首页统计接口（免登录）
     * 返回两部分数据：
     * 1. 顶部战区卡片：战区招商的项目数量统计
     * 2. 详细表格：各战区的签约情况、开工情况、重点项目等统计数据
     *
     * 筛选条件：
     * - year: 年度筛选（全部、2023年、2024年、2025年、2026年）
     * - amountRange: 金额范围筛选（all-全部、above-亿元以上、below-亿元以下）
     * - sortBy: 排名依据（all-全部、count-项目数、amount-投资额）
     */
    @SaIgnore
    @Operation(summary = "战区招商-首页统计-PC端（免登录）")
    @GetMapping("/home-statistics")
//    @Cacheable(CacheConstants.PRIME_ZONE_INVESTMENT_HOME_STATISTICS, key = "#year + ':' + #amountRange + ':' + #sortBy")
    fun getZoneInvestmentHomeStatistics(
        @Schema(description = "年度筛选")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "金额范围筛选：all-全部, above-亿元以上, below-亿元以下")
        @RequestParam(defaultValue = "all") amountRange: String,
        @Schema(description = "排名依据：all-全部, count-项目数, amount-投资额")
        @RequestParam(defaultValue = "all") sortBy: String
    ): ApiResponse<ZoneInvestmentHomeStatisticsVO> {
        val query = ZoneInvestmentHomeStatisticsQueryDTO().apply {
            this.year = year
            this.amountRange = amountRange
            this.sortBy = sortBy
        }

        // 查询战区卡片统计数据
        val regionCards = zoneInvestmentProjectMapper.selectZoneInvestmentHomeRegionCards(query = query)

        // 查询战区详细统计数据（基础数据）
        val regionDetails = zoneInvestmentProjectMapper.selectZoneInvestmentHomeRegionDetails(query = query)

        // 获取每个战区的在谈项目数
        val talkingProjectsMap = zoneInvestmentProjectMapper.countTalkingProjectsByRegion(query = query)
            .associate { (it["regionName"] as String) to (it["talkingCount"] as Long) }

        // 获取每个战区的招商活动数
        val investmentActivitiesMap = zoneInvestmentProjectMapper.countInvestmentActivitiesByRegion(query = query)
            .associate { (it["regionName"] as String) to (it["investmentActivityCount"] as Long) }

        // 循环组装，为每个战区详情添加在谈项目数和招商活动数
        val enrichedRegionDetails = regionDetails.map { detail ->
            detail.copy(
                talkingCount = talkingProjectsMap[detail.regionName] ?: 0L,
                investmentActivityCount = investmentActivitiesMap[detail.regionName] ?: 0L
            )
        }

        val result = ZoneInvestmentHomeStatisticsVO(
            regionCards = regionCards,
            regionDetails = enrichedRegionDetails
        )
        return ApiResponse.success(result)
    }

    /**
     * 转换countryRegionStandard参数：兼容旧的5个固定分类
     * 将旧的战区名称转换为对应的字典编码列表（逗号分隔）
     *
     * 映射关系：
     * - 北京(京津冀) -> 101
     * - 上海(长三角) -> 200
     * - 深圳(珠三角) -> 400
     * - 南京(南京、合肥) -> 300
     * - 其他地区 -> 500,81
     *
     * 如果输入的是字典编码或其他值，则保持不变
     */
    private fun convertCountryRegionStandard(countryRegionStandard: String?): String? {
        if (countryRegionStandard.isNullOrEmpty()) {
            return countryRegionStandard
        }

        return when (countryRegionStandard.trim()) {
            "北京(京津冀)", "北京", "京津冀", "北京（京津冀区域）" -> "101"
            "上海(长三角)", "上海", "长三角", "上海（长三角区域）" -> "200"
            "深圳(珠三角)", "深圳", "珠三角", "深圳（珠三角区域）" -> "400"
            "南京(南京、合肥)", "南京", "南京、合肥", "合肥", "南京（南京、合肥区域）" -> "300"
            "其他地区", "其他（境内）" -> "500,81"
            else -> countryRegionStandard
        }
    }
}
