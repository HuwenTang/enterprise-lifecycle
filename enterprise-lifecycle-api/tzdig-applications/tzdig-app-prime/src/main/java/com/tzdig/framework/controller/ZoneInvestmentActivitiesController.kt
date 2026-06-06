package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.tzdig.framework.mybatis.dto.InvestActivitiesQueryDTO
import com.tzdig.framework.mybatis.dto.InvestDemandQueryDTO
import com.tzdig.framework.mybatis.dto.TzTeamQueryDTO
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestDemand
import com.tzdig.framework.mybatis.entity.zsxt.TProjInvestActivities
import com.tzdig.framework.mybatis.entity.zsxt.TProjTzTeam
import com.tzdig.framework.mybatis.extension.toPageableResult
import com.tzdig.framework.mybatis.mapper.zsxt.InvestmentActivitiesMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * 招商活动Controller（合并）
 * 包含：招商活动登记列表、招商团队名录列表
 * 用于免登录/未授权访问的招商活动相关接口
 */
@Tag(name = "公开接口")
@RestController
@RequestMapping("/public/investment-activities")
class ZoneInvestmentActivitiesController(
    private val investmentActivitiesMapper: InvestmentActivitiesMapper
) {

    /**
     * 招商活动登记列表接口（免登录）
     * 支持以下筛选条件：
     * - activityContent: 活动内容（模糊搜索）
     * - leaders: 主要领导（模糊搜索）
     * - industryName: 所属产业链（模糊搜索）
     * - districtCode: 市区编码（前缀匹配）
     * - district: 市区名称（模糊搜索）
     * - zoneCode: 园区code（前缀匹配）
     * - zoneName: 园区名称（模糊搜索）
     * - townCode: 街镇code（前缀匹配）
     * - townName: 街镇名称（模糊搜索）
     * - countryRegionStandard: 所属战区（精确匹配），支持两种输入方式：
     *   1. 旧版5个固定分类：北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区
     *   2. 新版字典编码：101-北京、200-上海、300-南京、400-深圳、500-其他地区、81-其他（境内）
     * - startTime: 开始时间
     * - endTime: 结束时间
     *
     * 数据源：t_proj_invest_activities 表（市（区）活动记录表）
     * 排序方式：按 create_time 降序排列
     */
    @SaIgnore
    @Operation(summary = "招商活动登记列表-PC端（免登录）")
    @GetMapping("/activities/list")
    @PageableQuery
    fun getInvestActivitiesList(
        pageable: Pageable,
        query: InvestActivitiesQueryDTO,
    ): ApiResponse<PageableResult<TProjInvestActivities>> {
        // 转换战区参数：将战区名称转换为编码
        query.countryRegionStandard = convertCountryRegionStandard(query.countryRegionStandard)

        // 计算偏移量
        val offset = (pageable.pageNumber - 1) * pageable.pageSize

        // 查询数据列表
        val records = investmentActivitiesMapper.selectInvestActivitiesList(
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
        val total = investmentActivitiesMapper.countInvestActivities(query = query)

        // 使用扩展函数构建分页结果
        val result = records.toPageableResult(pageable, total)
        return ApiResponse.success(result)
    }

    /**
     * 招商团队名录列表接口（免登录）
     * 支持以下筛选条件：
     * - name: 姓名（模糊搜索）
     * - specialization: 专攻方向（模糊搜索）
     * - position: 职务（模糊搜索）
     * - investPlace: 招商区域（模糊搜索）
     * - districtCode: 市区编码（前缀匹配）
     * - district: 市区名称（模糊搜索）
     * - zoneCode: 园区code（前缀匹配）
     * - zone: 园区名称（模糊搜索）
     * - townCode: 街镇code（前缀匹配）
     * - town: 街镇名称（模糊搜索）
     * - xl: 学历（精确匹配）
     * - phone: 联系方式
     * - countryRegionStandard: 所属战区（精确匹配），支持两种输入方式：
     *   1. 旧版5个固定分类：北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区
     *   2. 新版字典编码：101-北京、200-上海、300-南京、400-深圳、500-其他地区、81-其他（境内）
     *
     * 数据源：t_proj_tz_team 表（招商团队名录表）
     * 排序方式：按 create_time 降序排列
     */
    @SaIgnore
    @Operation(summary = "招商人员列表-PC端（免登录）")
    @GetMapping("/team/list")
    @PageableQuery
    fun getTzTeamList(
        pageable: Pageable,
        query: TzTeamQueryDTO,
    ): ApiResponse<PageableResult<TProjTzTeam>> {
        // 转换战区参数：将战区名称转换为编码
        query.countryRegionStandard = convertCountryRegionStandard(query.countryRegionStandard)

        // 计算偏移量
        val offset = (pageable.pageNumber - 1) * pageable.pageSize

        // 查询数据列表
        val records = investmentActivitiesMapper.selectTzTeamList(
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
        val total = investmentActivitiesMapper.countTzTeam(query = query)

        // 使用扩展函数构建分页结果
        val result = records.toPageableResult(pageable, total)
        return ApiResponse.success(result)
    }

    /**
     * 招商需求列表接口（免登录）
     * 支持以下筛选条件：
     * - districtCode: 市区编码（前缀匹配）
     * - districtName: 市区名称（模糊搜索）
     * - zoneCode: 园区code（前缀匹配）
     * - zoneName: 园区名称（模糊搜索）
     * - townCode: 街镇code（前缀匹配）
     * - townName: 街镇名称（模糊搜索）
     * - title: 需求标题（模糊搜索）
     * - linkerName: 联系人（模糊搜索）
     * - linkerTel: 联系方式
     * - status: 审核状态（0-待审核 1-已审核 2-已答复）
     * - countryRegionStandard: 所属战区（精确匹配），支持两种输入方式：
     *   1. 旧版5个固定分类：北京(京津冀)、上海(长三角)、深圳(珠三角)、南京(南京、合肥)、其他地区
     *   2. 新版字典编码：101-北京、200-上海、300-南京、400-深圳、500-其他地区、81-其他（境内）
     *
     * 数据源：t_biz_invest_demand 表（招商需求留言板表）
     * 排序方式：按 create_time 降序排列
     */
    @SaIgnore
    @Operation(summary = "招商需求列表-PC端（免登录）")
    @GetMapping("/demand/list")
    @PageableQuery
    fun getInvestDemandList(
        pageable: Pageable,
        query: InvestDemandQueryDTO,
    ): ApiResponse<PageableResult<TBizInvestDemand>> {
        // 转换战区参数：将战区名称转换为编码
        query.countryRegionStandard = convertCountryRegionStandard(query.countryRegionStandard)

        // 计算偏移量
        val offset = (pageable.pageNumber - 1) * pageable.pageSize

        // 查询数据列表
        val records = investmentActivitiesMapper.selectInvestDemandList(
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
        val total = investmentActivitiesMapper.countInvestDemand(query = query)

        // 使用扩展函数构建分页结果
        val result = records.toPageableResult(pageable, total)
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
