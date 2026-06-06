package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.mybatis.dto.PreEvaluationQueryReqDTO
import com.tzdig.framework.mybatis.dto.PreEvaluationStatisticsQueryDTO
import com.tzdig.framework.mybatis.dto.ProjectApprovalQueryDTO
import com.tzdig.framework.mybatis.dto.ProjectApprovalStatisticsQueryDTO
import com.tzdig.framework.mybatis.extension.toPageableResult
import com.tzdig.framework.mybatis.mapper.prime.ProjectApprovalMapper
import com.tzdig.framework.mybatis.mapper.prime.ProjectPreEvaluationMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.mybatis.vo.DeptAuditStatisticsVO
import com.tzdig.framework.mybatis.vo.PreEvaluationStatisticsResponseVO
import com.tzdig.framework.mybatis.vo.ProjectApprovalStatisticsVO
import com.tzdig.framework.mybatis.vo.ProjectApprovalVO
import com.tzdig.framework.mybatis.vo.ProjectPreEvaluationVO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.cache.annotation.Cacheable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * 公开接口Controller
 * 用于免登录/未授权访问的接口
 */
@Tag(name = "公开接口")
@RestController
@RequestMapping("/public")
class PublicTestController(
    private val preEvaluationMapper: ProjectPreEvaluationMapper,
    private val projectApprovalMapper: ProjectApprovalMapper
) {
    /**
     * 项目预评估列表接口（免登录）
     * 支持按项目名称搜索、年度、产业类型、评估状态、部门名称筛选
     */
    @SaIgnore
    @Operation(summary = "项目预评估列表-移动端（免登录）")
    @GetMapping("/pre-evaluation/list")
    @PageableQuery
    fun getPreEvaluationList(
        pageable: Pageable,
        query: PreEvaluationQueryReqDTO,
    ): ApiResponse<PageableResult<ProjectPreEvaluationVO>> {
        // 计算偏移量
        val offset = (pageable.pageNumber - 1) * pageable.pageSize

        // 查询数据列表
        val records = preEvaluationMapper.selectPreEvaluationList(
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
        val total = preEvaluationMapper.countPreEvaluation(query = query)

        // 使用扩展函数构建分页结果
        val result = records.toPageableResult(pageable, total)
        return ApiResponse.success(result)
    }

    /**
     * 项目预评估统计接口（免登录）
     * 返回统计数据：合计数量、未完成数量、已完成数量
     * 以及各部门超时项目占比
     */
    @SaIgnore
    @Operation(summary = "项目预评估统计-移动端（免登录）")
    @GetMapping("/pre-evaluation/statistics")
    @Cacheable(CacheConstants.PRIME_PRE_EVALUATION_STATISTICS, key = "#year + ':' + #projectType + ':' + #evaluationStatus")
    fun getPreEvaluationStatistics(
        @Schema(description = "年度") @RequestParam(required = false) year: Int?,
        @Schema(description = "产业类型：工业/服务业/其他（其他表示查询空值）") @RequestParam(defaultValue = "") projectType: String,
        @Schema(description = "评估状态：未完成/已完成") @RequestParam(required = false) evaluationStatus: String?,
    ): ApiResponse<PreEvaluationStatisticsResponseVO> {
        val query = PreEvaluationStatisticsQueryDTO().apply {
            this.year = year
            this.projectType = projectType.takeIf { it.isNotEmpty() }
            this.evaluationStatus = evaluationStatus
        }

        val statistics = preEvaluationMapper.selectPreEvaluationStatistics(query = query)
        val deptTimeoutList = preEvaluationMapper.selectDeptTimeoutStatistics(query = query)

        val result = PreEvaluationStatisticsResponseVO(
            statistics = statistics,
            deptTimeoutList = deptTimeoutList
        )
        return ApiResponse.success(result)
    }



    /**
     * 项目认定列表统一接口（免登录）
     * 支持签约核定、开工认定、竣工认定三种项目阶段
     *
     * 筛选条件：
     * - projectStage: 项目阶段（signed-签约核定, start-开工认定, complete-竣工认定）
     * - projectName: 项目名称（模糊搜索）
     * - zoneCode: 园区编码
     * - industryClassification: 国民经济分类/所属行业（模糊搜索）
     * - investor: 投资方名称（模糊搜索）
     * - minInvestment: 最小投资额（亿元）
     * - maxInvestment: 最大投资额（亿元）
     * - year: 年度
     * - projectType: 项目类型（工业/服务业）
     * - auditStatus: 审核状态（0-无审核，1-部门审核中，2-部门审核通过，3-部门审核退回，4-专班审核中，5-专班审核通过，6-专班审核退回，7-审核不通过，8-通过不计分）
     *
     * 不同项目阶段的日期字段说明：
     * - signed（签约核定）：使用 signedDate（签约日期）
     * - start（开工认定）：使用 startDate（开工日期）
     * - complete（竣工认定）：使用 completeDate（竣工日期）
     */
    @SaIgnore
    @Operation(summary = "项目认定列表-统一接口-移动端（免登录）")
    @GetMapping("/project-approval/list")
    @PageableQuery
    fun getProjectApprovalList(
        pageable: Pageable,
        query: ProjectApprovalQueryDTO,
    ): ApiResponse<PageableResult<ProjectApprovalVO>> {
        // 计算偏移量
        val offset = (pageable.pageNumber - 1) * pageable.pageSize

        // 查询数据列表（基于主表 current_project_progress 字段）
        val records = projectApprovalMapper.selectProjectApprovalListByProgress(
            query = query,
            offset = offset.toInt(),
            limit = pageable.pageSize.toInt()
        )

        // 如果没有数据，直接返回空结果（避免不必要的count查询）
        if (records.isEmpty()) {
            val emptyResult = records.toPageableResult(pageable, 0)
            return ApiResponse.success(emptyResult)
        }

        // 查询总数（基于主表 current_project_progress 字段）
        val total = projectApprovalMapper.countProjectApprovalByProgress(query = query)

        // 使用扩展函数构建分页结果
        val result = records.toPageableResult(pageable, total)
        return ApiResponse.success(result)
    }

    /**
     * 项目认定统计接口（免登录）
     * 支持三种认定类型：签约核定、开工认定、竣工认定
     *
     * 返回数据：
     * 1. 各审核状态的项目数量（无审核、部门审核中、部门审核通过、部门审核退回、专班审核中、专班审核通过、专班审核退回、审核不通过、通过不计分）
     * 2. 各部门审核情况（7个部门：发改委、科技局、工信局、生态环境局、应急局、商务局、税务局）
     *    - 审核通过数量
     *    - 审核不通过数量
     *    - 未审核数量
     *
     * 筛选条件：
     * - projectStage: 项目阶段（signed-签约核定, start-开工认定, complete-竣工认定）
     * - year: 年度
     * - projectType: 项目类型（工业/服务业）
     * - auditStatus: 审核状态（0-无审核，1-部门审核中，2-部门审核通过，3-部门审核退回，4-专班审核中，5-专班审核通过，6-专班审核退回，7-审核不通过，8-通过不计分）
     */
    @SaIgnore
    @Operation(summary = "项目认定统计-统计接口-移动端（免登录）")
    @GetMapping("/project-approval/statistics")
    fun getProjectApprovalStatistics(
        @Schema(description = "项目阶段：signed-签约核定, start-开工认定, complete-竣工认定")
        @RequestParam(required = false) projectStage: String?,
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "所属行业（工业/服务业/其他，其他表示查询空值）")
        @RequestParam(required = false) projectType: String?,
        @Schema(description = "审核状态（0-无审核，1-部门审核中，2-部门审核通过，3-部门审核退回，4-专班审核中，5-专班审核通过，6-专班审核退回，7-审核不通过，8-通过不计分）")
        @RequestParam(required = false) auditStatus: Int?,
    ): ApiResponse<ProjectApprovalStatisticsVO> {
        val query = ProjectApprovalStatisticsQueryDTO().apply {
            this.projectStage = projectStage
            this.year = year
            this.projectType = projectType
            this.auditStatus = auditStatus
        }

        // 查询各审核状态的项目数量（基于主表 current_project_progress 字段）
        val auditStatusStatistics = projectApprovalMapper.selectAuditStatusStatisticsByProgress(query = query)

        // 查询各部门审核情况（基于主表 current_project_progress 字段）
        val deptAuditStatistics = projectApprovalMapper.selectDeptAuditStatisticsByProgress(query = query)

        // 如果存在“其他部门”，查询其具体部门列表
        val otherDeptRecord = deptAuditStatistics.find { it.deptName == "其他部门" }
        if (otherDeptRecord != null) {
            val otherDepts = projectApprovalMapper.selectOtherDeptNames(query = query)
            // 创建新的列表，将 otherDepts 填充到“其他部门”记录中
            val updatedDeptStats = deptAuditStatistics.map { stat ->
                if (stat.deptName == "其他部门") {
                    DeptAuditStatisticsVO(
                        deptName = stat.deptName,
                        passedCount = stat.passedCount,
                        rejectedCount = stat.rejectedCount,
                        pendingCount = stat.pendingCount,
                        otherDepts = otherDepts
                    )
                } else {
                    stat
                }
            }

            val result = ProjectApprovalStatisticsVO(
                auditStatusStatistics = auditStatusStatistics,
                deptAuditStatistics = updatedDeptStats
            )
            return ApiResponse.success(result)
        }

        val result = ProjectApprovalStatisticsVO(
            auditStatusStatistics = auditStatusStatistics,
            deptAuditStatistics = deptAuditStatistics
        )
        return ApiResponse.success(result)
    }

}

/**
 * 统一响应结果封装
 */
data class ApiResponse<T>(
    val success: Boolean = true,
    val data: T? = null,
    val errorCode: Int? = null,
    val errorMessage: String? = null
) {
    companion object {
        fun <T> success(data: T): ApiResponse<T> {
            return ApiResponse(success = true, data = data)
        }

        fun <T> error(errorCode: Int, errorMessage: String): ApiResponse<T> {
            return ApiResponse(success = false, errorCode = errorCode, errorMessage = errorMessage)
        }
    }
}
