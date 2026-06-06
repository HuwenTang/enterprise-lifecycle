package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema
import lombok.Data

/**
 * 项目认定统计响应VO
 */
@Schema(description = "项目认定统计响应VO")
data class ProjectApprovalStatisticsVO(
    @get:Schema(description = "各审核状态的项目数量")
    val auditStatusStatistics: List<AuditStatusCountVO> = emptyList(),

    @get:Schema(description = "各部门审核情况")
    val deptAuditStatistics: List<DeptAuditStatisticsVO> = emptyList()
)

/**
 * 审核状态统计
 */
@Schema(description = "审核状态统计")
data class AuditStatusCountVO(
    @get:Schema(description = "审核状态码")
    val auditStatus: Int?,

    @get:Schema(description = "审核状态名称")
    val auditStatusName: String?,

    @get:Schema(description = "项目数量")
    val count: Long = 0
)

/**
 * 部门审核情况统计
 */
@Data
@Schema(description = "部门审核情况统计")
class DeptAuditStatisticsVO(
    @get:Schema(description = "部门名称")
    val deptName: String?,

    @get:Schema(description = "审核通过数量")
    val passedCount: Long = 0,

    @get:Schema(description = "审核不通过数量")
    val rejectedCount: Long = 0,

    @get:Schema(description = "未审核数量")
    val pendingCount: Long = 0,

    @get:Schema(description = "其他部门明细（仅当deptName为'其他部门'时有值，逗号分隔）")
    val otherDepts: String? = null
) {
    // MyBatis 使用的4参数构造函数（不包含 otherDepts）
    constructor(
        deptName: String?,
        passedCount: Long,
        rejectedCount: Long,
        pendingCount: Long
    ) : this(deptName, passedCount, rejectedCount, pendingCount, null)
}
