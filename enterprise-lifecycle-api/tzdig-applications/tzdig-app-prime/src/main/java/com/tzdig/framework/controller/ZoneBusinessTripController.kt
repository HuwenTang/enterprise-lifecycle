package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.tzdig.framework.mybatis.dto.OverseasBusinessTripQueryDTO
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTrip
import com.tzdig.framework.mybatis.extension.toPageableResult
import com.tzdig.framework.mybatis.mapper.zsxt.TProjBusinessTripMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * 境外战区因公出访Controller
 * 用于免登录/未授权访问的境外战区因公出访相关接口
 */
@Tag(name = "公开接口")
@RestController
@RequestMapping("/public/overseas-business-trip")
class ZoneBusinessTripController(
    private val tProjBusinessTripMapper: TProjBusinessTripMapper
) {

    /**
     * 境外战区因公出访列表接口（免登录）
     * 支持以下筛选条件：
     * - visitDestination: 出访地（国家、地区）（模糊搜索）
     * - groupName: 团组名称（模糊搜索）
     * - mainMembers: 主要成员（模糊搜索）
     * - districtCode: 市区编码（前缀匹配）
     * - district: 市区名称（模糊搜索）
     * - zoneCode: 园区code（前缀匹配）
     * - zoneName: 园区名称（模糊搜索）
     * - townCode: 街镇code（前缀匹配）
     * - townName: 街镇名称（模糊搜索）
     * - year: 年份筛选
     *
     * 数据源：t_proj_business_trip 表（因公出访招商项目情况表）
     * 排序方式：按 create_time 降序排列
     */
    @SaIgnore
    @Operation(summary = "战区招商-因公出访列表-PC端（免登录）")
    @GetMapping("/list")
    @PageableQuery
    fun getOverseasBusinessTripList(
        pageable: Pageable,
        query: OverseasBusinessTripQueryDTO,
    ): ApiResponse<PageableResult<TProjBusinessTrip>> {
        // 计算偏移量
        val offset = (pageable.pageNumber - 1) * pageable.pageSize

        // 查询数据列表
        val records = tProjBusinessTripMapper.selectOverseasBusinessTripList(
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
        val total = tProjBusinessTripMapper.countOverseasBusinessTrip(query = query)

        // 使用扩展函数构建分页结果
        val result = records.toPageableResult(pageable, total)
        return ApiResponse.success(result)
    }
}
