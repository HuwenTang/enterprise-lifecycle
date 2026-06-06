package com.tzdig.framework.mybatis.mapper.prime

import com.tzdig.framework.mybatis.dto.ProjectApprovalQueryDTO
import com.tzdig.framework.mybatis.dto.ProjectApprovalStatisticsQueryDTO
import com.tzdig.framework.mybatis.vo.AuditStatusCountVO
import com.tzdig.framework.mybatis.vo.DeptAuditStatisticsVO
import com.tzdig.framework.mybatis.vo.ProjectApprovalVO
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

/**
 * 项目认定 Mapper
 * 
 * 业务说明：
 * - 签约核定：current_project_progress = '2'（签约阶段）
 * - 开工认定：current_project_progress = '6'（开工阶段）
 * - 竣工认定：current_project_progress = '7'（竣工阶段）
 * 
 * 注意：
 * 1. 所有认定状态都基于主表 project_digital_investment_attracting 的 current_project_progress 字段判断
 * 2. 审核状态统计使用主表的 audit_status 字段
 * 3. 部门审核情况统计需要关联审核记录表确定主要审核部门
 */
@Mapper
interface ProjectApprovalMapper {

    /**
     * 查询项目认定列表（分页）
     * 
     * @param query 查询条件（项目阶段、项目名称、园区、行业、投资方、投资额、年度、项目类型、审核状态）
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 项目认定列表
     * 
     * - 数据来源：ext_zs_proj_project_signed 表（签约项目扩展表）
     * - 关联表：
     *   - project_digital_investment_attracting: 招商项目主表
     *   - system_area: 区域表（获取园区名称）
     *   - project_digital_project_review_all: 项目审核记录表（判断认定状态）
     *
     * 查询字段说明：
     * - projectStage: signed-签约核定, start-开工认定, complete-竣工认定
     * - 签约核定：存在 step='2' 或 step='3' 的审核记录（不限审核状态）
     * - 开工认定：存在 step='4' 或 step='6' 的审核记录（不限审核状态）
     * - 竣工认定：存在 step='5' 的审核记录（不限审核状态）
     */
    @Select("""
        <script>
        SELECT 
            ext.id,
            -- 项目名称
            COALESCE(ext._name, p.project_name) AS projectName,
            -- 所属板块（园区名称）：优先取扩展表的zone_name，其次联查主表park关联system_area
            COALESCE(ext.zone_name, area_park.name) AS zoneName,
            -- 国民经济分类：优先取主表national_economic_classification，其次取扩展表industry_name
            COALESCE(p.national_economic_classification, ext.industry_name) AS industryClassification,
            -- 投资方
            ext.investor,
            -- 投资总额（亿元）
            ext.invest_money AS investmentAmount,
            -- 签约日期
            DATE_FORMAT(ext.signed_stat_date, '%Y-%m-%d') AS signedDate,
            -- 开工日期（使用主表字段）
            DATE_FORMAT(p.start_confirm_date, '%Y-%m-%d') AS startDate,
            -- 竣工日期（使用主表字段）
            DATE_FORMAT(p.end_confirm_date, '%Y-%m-%d') AS completeDate,
            -- 签约金额（万元）
            ext.qyje AS signedAmount,
            -- 项目类别（内资/外资）
            CASE ext.p_type
                WHEN 1 THEN '内资'
                WHEN 2 THEN '外资'
                ELSE ''
            END AS projectCategory,
            -- 项目类型
            p.project_type AS projectType,
            -- 年度（用于前端展示）
            <choose>
                <when test="query.projectStage == 'start'">
                    YEAR(p.start_confirm_date) AS year,
                </when>
                <when test="query.projectStage == 'complete'">
                    YEAR(p.end_confirm_date) AS year,
                </when>
                <otherwise>
                    YEAR(ext.signed_stat_date) AS year,
                </otherwise>
            </choose>
            -- 所属行业（用于前端展示）
            COALESCE(p.national_economic_classification, ext.industry_name) AS industry,
            -- 审核状态
            p.audit_status AS auditStatus,
            -- 审核状态名称
            CASE p.audit_status
                WHEN 0 THEN '无审核'
                WHEN 1 THEN '部门审核中'
                WHEN 2 THEN '部门审核通过'
                WHEN 3 THEN '部门审核退回'
                WHEN 4 THEN '专班审核中'
                WHEN 5 THEN '专班审核通过'
                WHEN 6 THEN '专班审核退回'
                WHEN 7 THEN '审核不通过'
                WHEN 8 THEN '通过不计分'
                ELSE '未知状态'
            END AS auditStatusName
        FROM ext_zs_proj_project_signed ext
        -- 关联招商项目主表
        LEFT JOIN project_digital_investment_attracting p ON ext.id = p.invest_online_id
        -- 关联园区字典表
        LEFT JOIN system_area area_park ON p.park = area_park.id
        WHERE ext.deleted = 0
        <if test="query.projectStage == 'signed'">
            -- 签约核定：存在 step=2 或 step=3 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('2', '3')
            )
        </if>
        <if test="query.projectStage == 'start'">
            -- 开工认定：存在 step=4 或 step=6 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('4', '6')
            )
        </if>
        <if test="query.projectStage == 'complete'">
            -- 竣工认定：存在 step=5 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step = '5'
            )
        </if>
        <if test="query.projectName != null and query.projectName != ''">
            AND ext._name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND ext.zone_code = #{query.zoneCode}
        </if>
        <if test="query.industryClassification != null and query.industryClassification != ''">
            AND (p.national_economic_classification LIKE CONCAT('%', #{query.industryClassification}, '%') 
                 OR ext.industry_name LIKE CONCAT('%', #{query.industryClassification}, '%'))
        </if>
        <if test="query.investor != null and query.investor != ''">
            AND ext.investor LIKE CONCAT('%', #{query.investor}, '%')
        </if>
        <if test="query.minInvestment != null">
            AND ext.invest_money &gt;= #{query.minInvestment}
        </if>
        <if test="query.maxInvestment != null">
            AND ext.invest_money &lt;= #{query.maxInvestment}
        </if>
        <if test="query.year != null">
            <choose>
                <when test="query.projectStage == 'start'">
                    AND YEAR(p.start_confirm_date) = #{query.year}
                </when>
                <when test="query.projectStage == 'complete'">
                    AND YEAR(p.end_confirm_date) = #{query.year}
                </when>
                <otherwise>
                    AND YEAR(ext.signed_stat_date) = #{query.year}
                </otherwise>
            </choose>
        </if>
        <if test="query.projectType != null and query.projectType != ''">
            <choose>
                <when test="query.projectType == '其他'">
                    AND (p.project_type IS NULL OR p.project_type = '')
                </when>
                <otherwise>
                    AND p.project_type = #{query.projectType}
                </otherwise>
            </choose>
        </if>
        <if test="query.auditStatus != null">
            AND p.audit_status = #{query.auditStatus}
        </if>
        ORDER BY 
        <choose>
            <when test="query.projectStage == 'start'">
                p.start_confirm_date DESC
            </when>
            <when test="query.projectStage == 'complete'">
                p.end_confirm_date DESC
            </when>
            <otherwise>
                ext.signed_stat_date DESC
            </otherwise>
        </choose>
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectProjectApprovalList(
        @Param("query") query: ProjectApprovalQueryDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<ProjectApprovalVO>

    /**
     * 统计项目认定总数
     *
     * @param query 查询条件
     * @return 符合条件的项目总数
     * 
     * 注意：与列表查询使用相同的过滤条件，确保总数准确
     */
    @Select("""
        <script>
        SELECT COUNT(1)
        FROM ext_zs_proj_project_signed ext
        -- 关联招商项目主表
        LEFT JOIN project_digital_investment_attracting p ON ext.id = p.invest_online_id
        WHERE ext.deleted = 0
        <if test="query.projectStage == 'signed'">
            -- 签约核定：存在 step=2 或 step=3 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('2', '3')
            )
        </if>
        <if test="query.projectStage == 'start'">
            -- 开工认定：存在 step=4 或 step=6 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('4', '6')
            )
        </if>
        <if test="query.projectStage == 'complete'">
            -- 竣工认定：存在 step=5 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step = '5'
            )
        </if>
        <if test="query.projectName != null and query.projectName != ''">
            AND ext._name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND ext.zone_code = #{query.zoneCode}
        </if>
        <if test="query.industryClassification != null and query.industryClassification != ''">
            AND (p.national_economic_classification LIKE CONCAT('%', #{query.industryClassification}, '%') 
                 OR ext.industry_name LIKE CONCAT('%', #{query.industryClassification}, '%'))
        </if>
        <if test="query.investor != null and query.investor != ''">
            AND ext.investor LIKE CONCAT('%', #{query.investor}, '%')
        </if>
        <if test="query.minInvestment != null">
            AND ext.invest_money &gt;= #{query.minInvestment}
        </if>
        <if test="query.maxInvestment != null">
            AND ext.invest_money &lt;= #{query.maxInvestment}
        </if>
        <if test="query.year != null">
            <choose>
                <when test="query.projectStage == 'start'">
                    AND YEAR(p.start_confirm_date) = #{query.year}
                </when>
                <when test="query.projectStage == 'complete'">
                    AND YEAR(p.end_confirm_date) = #{query.year}
                </when>
                <otherwise>
                    AND YEAR(ext.signed_stat_date) = #{query.year}
                </otherwise>
            </choose>
        </if>
        <if test="query.projectType != null and query.projectType != ''">
            <choose>
                <when test="query.projectType == '其他'">
                    AND (p.project_type IS NULL OR p.project_type = '')
                </when>
                <otherwise>
                    AND p.project_type = #{query.projectType}
                </otherwise>
            </choose>
        </if>
        <if test="query.auditStatus != null">
            AND p.audit_status = #{query.auditStatus}
        </if>
        </script>
    """)
    fun countProjectApproval(
        @Param("query") query: ProjectApprovalQueryDTO
    ): Int

    /**
     * 统计各审核状态的项目数量
     * 
     * @param query 查询条件（项目阶段、年度、项目类型）
     * @return 各审核状态的项目数量列表
     * 
     * 统计逻辑：
     * - 按审核状态（audit_status）分组统计项目数量
     * - 支持按项目阶段、年度、项目类型筛选
     * - 返回所有存在的审核状态及其对应的项目数量
     */
    @Select("""
        <script>
        SELECT 
            p.audit_status AS auditStatus,
            CASE p.audit_status
                WHEN 0 THEN '无审核'
                WHEN 1 THEN '部门审核中'
                WHEN 2 THEN '部门审核通过'
                WHEN 3 THEN '部门审核退回'
                WHEN 4 THEN '专班审核中'
                WHEN 5 THEN '专班审核通过'
                WHEN 6 THEN '专班审核退回'
                WHEN 7 THEN '审核不通过'
                WHEN 8 THEN '通过不计分'
                ELSE '未知状态'
            END AS auditStatusName,
            COUNT(DISTINCT p.id) AS count
        FROM ext_zs_proj_project_signed ext
        -- 关联招商项目主表
        LEFT JOIN project_digital_investment_attracting p ON ext.id = p.invest_online_id
        WHERE ext.deleted = 0
        <if test="query.projectStage == 'signed'">
            -- 签约核定：存在 step=2 或 step=3 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('2', '3')
            )
        </if>
        <if test="query.projectStage == 'start'">
            -- 开工认定：存在 step=4 或 step=6 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('4', '6')
            )
        </if>
        <if test="query.projectStage == 'complete'">
            -- 竣工认定：存在 step=5 的审核记录（不限审核状态）
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step = '5'
            )
        </if>
        <if test="query.year != null">
            <choose>
                <when test="query.projectStage == 'start'">
                    AND YEAR(p.start_confirm_date) = #{query.year}
                </when>
                <when test="query.projectStage == 'complete'">
                    AND YEAR(p.end_confirm_date) = #{query.year}
                </when>
                <otherwise>
                    AND YEAR(ext.signed_stat_date) = #{query.year}
                </otherwise>
            </choose>
        </if>
        <if test="query.projectType != null and query.projectType != ''">
            <choose>
                <when test="query.projectType == '其他'">
                    AND (p.project_type IS NULL OR p.project_type = '')
                </when>
                <otherwise>
                    AND p.project_type = #{query.projectType}
                </otherwise>
            </choose>
        </if>
        <if test="query.auditStatus != null">
            AND p.audit_status = #{query.auditStatus}
        </if>
        GROUP BY p.audit_status
        ORDER BY p.audit_status
        </script>
    """)
    fun selectAuditStatusStatistics(
        @Param("query") query: ProjectApprovalStatisticsQueryDTO
    ): List<AuditStatusCountVO>

    /**
     * 统计各部门审核情况
     * 
     * @param query 查询条件（项目阶段、年度、项目类型）
     * @return 各部门审核情况列表（审核通过、审核不通过、未审核数量）
     * 
     * 统计逻辑：
     * - 基于项目的最终审核状态（audit_status）进行统计
     * - 每个项目只统计一次，归属于其主要审核部门
     * - 主要审核部门：取该项目最新的审核记录对应的部门（按 id 最大值）
     * - 审核通过：audit_status IN (2, 5, 8) - 部门审核通过、专班审核通过、通过不计分
     * - 审核不通过：audit_status IN (3, 6, 7) - 部门审核退回、专班审核退回、审核不通过
     * - 未审核/审核中：audit_status IN (0, 1, 4) - 无审核、部门审核中、专班审核中
     * 
     * 关联表说明：
     * - project_digital_investment_attracting: 招商项目主表（包含 audit_status）
     * - project_digital_project_review_all: 项目审核记录表（用于确定项目的主要审核部门）
     * - step 值说明：
     *   - signed（签约核定）: step='2' 或 step='3'
     *   - start（开工认定）: step='4' 或 step='6'
     *   - complete（竣工认定）: step='5'
     */
    @Select("""
        <script>
        SELECT * FROM (
            SELECT 
                CASE main_dept.cob_id
                    WHEN 'kWu55tEqKE89f2Eg2i0by6aEC9zd' THEN '发改委'
                    WHEN 'yvuAzt2JA2GOt91X9HlK6aGPc1bB' THEN '科技局'
                    WHEN 'jzuAxHPyePp3fG13GFPva6AGHW7y' THEN '工信局'
                    WHEN 'XauYjFbLJbx9CL5GLUgkX3RYcj87' THEN '生态环境局'
                    WHEN 'rYu13cmwomzRFLxqLUKeADPYUowW' THEN '应急局'
                    WHEN 'qru1oF23k2GOtadgaIMxknGJtV6G' THEN '商务局'
                    WHEN 'nYux8Ir3yVVBHmpwmIaabMHXawXl' THEN '税务局'
                    ELSE '其他部门'
                END AS deptName,
                -- 审核通过数量（audit_status IN (2, 5, 8)）
                COUNT(CASE WHEN p.audit_status IN (2, 5, 8) THEN 1 END) AS passedCount,
                -- 审核不通过数量（audit_status IN (3, 6, 7)）
                COUNT(CASE WHEN p.audit_status IN (3, 6, 7) THEN 1 END) AS rejectedCount,
                -- 未审核/审核中数量（audit_status IN (0, 1, 4)）
                COUNT(CASE WHEN p.audit_status IN (0, 1, 4) THEN 1 END) AS pendingCount
            FROM ext_zs_proj_project_signed ext
            -- 关联招商项目主表
            LEFT JOIN project_digital_investment_attracting p ON ext.id = p.invest_online_id
            -- 关联每个项目的主要审核部门（取符合项目阶段step条件的最新审核记录的部门）
            LEFT JOIN (
                SELECT 
                    r1.digital_investment_id,
                    r1.cob_id
                FROM project_digital_project_review_all r1
                INNER JOIN (
                    -- 找出每个项目符合项目阶段step条件的最新审核记录ID
                    SELECT 
                        digital_investment_id,
                        MAX(id) as max_id
                    FROM project_digital_project_review_all
                    <if test="query.projectStage == 'signed'">
                        WHERE step IN ('2', '3')
                    </if>
                    <if test="query.projectStage == 'start'">
                        WHERE step IN ('4', '6')
                    </if>
                    <if test="query.projectStage == 'complete'">
                        WHERE step = '5'
                    </if>
                    GROUP BY digital_investment_id
                ) r2 ON r1.id = r2.max_id
            ) main_dept ON p.id = main_dept.digital_investment_id
            WHERE ext.deleted = 0
            <if test="query.year != null">
                <choose>
                    <when test="query.projectStage == 'start'">
                        AND YEAR(p.start_confirm_date) = #{query.year}
                    </when>
                    <when test="query.projectStage == 'complete'">
                        AND YEAR(p.end_confirm_date) = #{query.year}
                    </when>
                    <otherwise>
                        AND YEAR(ext.signed_stat_date) = #{query.year}
                    </otherwise>
                </choose>
            </if>
            <if test="query.projectType != null and query.projectType != ''">
                <choose>
                    <when test="query.projectType == '其他'">
                        AND (p.project_type IS NULL OR p.project_type = '')
                    </when>
                    <otherwise>
                        AND p.project_type = #{query.projectType}
                    </otherwise>
                </choose>
            </if>
            <if test="query.auditStatus != null">
                AND p.audit_status = #{query.auditStatus}
            </if>
            GROUP BY 
                CASE main_dept.cob_id
                    WHEN 'kWu55tEqKE89f2Eg2i0by6aEC9zd' THEN '发改委'
                    WHEN 'yvuAzt2JA2GOt91X9HlK6aGPc1bB' THEN '科技局'
                    WHEN 'jzuAxHPyePp3fG13GFPva6AGHW7y' THEN '工信局'
                    WHEN 'XauYjFbLJbx9CL5GLUgkX3RYcj87' THEN '生态环境局'
                    WHEN 'rYu13cmwomzRFLxqLUKeADPYUowW' THEN '应急局'
                    WHEN 'qru1oF23k2GOtadgaIMxknGJtV6G' THEN '商务局'
                    WHEN 'nYux8Ir3yVVBHmpwmIaabMHXawXl' THEN '税务局'
                    ELSE '其他部门'
                END
        ) AS grouped_result
        ORDER BY 
            CASE deptName
                WHEN '发改委' THEN 1
                WHEN '科技局' THEN 2
                WHEN '工信局' THEN 3
                WHEN '生态环境局' THEN 4
                WHEN '应急局' THEN 5
                WHEN '商务局' THEN 6
                WHEN '税务局' THEN 7
                ELSE 8
            END
        </script>
    """)
    fun selectDeptAuditStatistics(
        @Param("query") query: ProjectApprovalStatisticsQueryDTO
    ): List<DeptAuditStatisticsVO>

    /**
     * 查询项目认定列表（分页）- 基于主表 current_project_progress 字段
     * 
     * @param query 查询条件（项目阶段、项目名称、园区、行业、投资方、投资额、年度、项目类型、审核状态）
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 项目认定列表
     * 
     * - 数据来源：ext_zs_proj_project_signed 表（签约项目扩展表）
     * - 关联表：
     *   - project_digital_investment_attracting: 招商项目主表
     *   - system_area: 区域表（获取园区名称）
     *   - project_digital_project_review_all: 项目审核记录表（验证审核流程存在性）
     *
     * 查询字段说明：
     * - projectStage: signed-签约核定, start-开工认定, complete-竣工认定
     * - 签约核定：current_project_progress = '2' 且 is_project_review = 1，且存在 step='2' 或 step='3' 的审核记录
     * - 开工认定：current_project_progress = '6' 且 is_start_approval = 1，且存在 step='4' 或 step='6' 的审核记录
     * - 竣工认定：current_project_progress = '7' 且 is_completion_approval = 1，且存在 step='5' 的审核记录
     */
    @Select("""
        <script>
        SELECT DISTINCT
            p.id,
            p.project_name AS projectName,
            area_park.name AS zoneName,
            p.national_economic_classification AS industryClassification,
            p.investor,
            p.investment_amount AS investmentAmount,
            DATE_FORMAT(p.signing_time, '%Y-%m-%d') AS signedDate,
            DATE_FORMAT(p.start_confirm_date, '%Y-%m-%d') AS startDate,
            DATE_FORMAT(p.end_confirm_date, '%Y-%m-%d') AS completeDate,
            NULL AS signedAmount,
            p.project_rating AS projectCategory,
            p.project_type AS projectType,
            <choose>
                <when test="query.projectStage == 'start'">
                    YEAR(p.start_confirm_date) AS year,
                </when>
                <when test="query.projectStage == 'complete'">
                    YEAR(p.end_confirm_date) AS year,
                </when>
                <otherwise>
                    YEAR(p.signing_time) AS year,
                </otherwise>
            </choose>
            p.national_economic_classification AS industry,
            p.audit_status AS auditStatus,
            CASE p.audit_status
                WHEN 0 THEN '无审核'
                WHEN 1 THEN '部门审核中'
                WHEN 2 THEN '部门审核通过'
                WHEN 3 THEN '部门审核退回'
                WHEN 4 THEN '专班审核中'
                WHEN 5 THEN '专班审核通过'
                WHEN 6 THEN '专班审核退回'
                WHEN 7 THEN '审核不通过'
                WHEN 8 THEN '通过不计分'
                ELSE '未知状态'
            END AS auditStatusName
        FROM project_digital_investment_attracting p
        LEFT JOIN system_area area_park ON p.park = area_park.id
        INNER JOIN project_digital_project_review_all r ON r.digital_investment_id = p.id
        WHERE p.deleted = 0
        <if test="query.projectStage == 'signed'">
            AND p.is_project_review = 1
            AND r.step IN ('2', '3')
        </if>
        <if test="query.projectStage == 'start'">
            AND p.is_start_approval = 1
            AND r.step IN ('4', '6')
        </if>
        <if test="query.projectStage == 'complete'">
            AND p.is_completion_approval = 1
            AND r.step = '5'
        </if>
        <if test="query.projectName != null and query.projectName != ''">
            AND p.project_name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND p.park = #{query.zoneCode}
        </if>
        <if test="query.industryClassification != null and query.industryClassification != ''">
            AND p.national_economic_classification LIKE CONCAT('%', #{query.industryClassification}, '%')
        </if>
        <if test="query.investor != null and query.investor != ''">
            AND p.investor LIKE CONCAT('%', #{query.investor}, '%')
        </if>
        <if test="query.minInvestment != null">
            AND p.investment_amount &gt;= #{query.minInvestment}
        </if>
        <if test="query.maxInvestment != null">
            AND p.investment_amount &lt;= #{query.maxInvestment}
        </if>
        <if test="query.year != null">
            <choose>
                <when test="query.projectStage == 'start'">
                    AND YEAR(p.start_confirm_date) = #{query.year}
                </when>
                <when test="query.projectStage == 'complete'">
                    AND YEAR(p.end_confirm_date) = #{query.year}
                </when>
                <otherwise>
                    AND YEAR(p.signing_time) = #{query.year}
                </otherwise>
            </choose>
        </if>
        <if test="query.projectType != null and query.projectType != ''">
            <choose>
                <when test="query.projectType == '其他'">
                    AND (p.project_type IS NULL OR p.project_type = '')
                </when>
                <otherwise>
                    AND p.project_type = #{query.projectType}
                </otherwise>
            </choose>
        </if>
        <if test="query.auditStatus != null">
            AND p.audit_status = #{query.auditStatus}
        </if>
        GROUP BY p.id
        ORDER BY 
        <choose>
            <when test="query.projectStage == 'start'">
                p.start_confirm_date DESC
            </when>
            <when test="query.projectStage == 'complete'">
                p.end_confirm_date DESC
            </when>
            <otherwise>
                p.signing_time DESC
            </otherwise>
        </choose>
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectProjectApprovalListByProgress(
        @Param("query") query: ProjectApprovalQueryDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<ProjectApprovalVO>

    /**
     * 统计项目认定总数 - 基于主表 current_project_progress 字段
     *
     * @param query 查询条件
     * @return 符合条件的项目总数
     * 
     * 注意：与列表查询使用相同的过滤条件，确保总数准确
     */
    @Select("""
        <script>
        SELECT COUNT(DISTINCT p.id)
        FROM project_digital_investment_attracting p
        INNER JOIN project_digital_project_review_all r ON r.digital_investment_id = p.id
        WHERE p.deleted = 0
        <if test="query.projectStage == 'signed'">
            AND p.is_project_review = 1
            AND r.step IN ('2', '3')
        </if>
        <if test="query.projectStage == 'start'">
            AND p.is_start_approval = 1
            AND r.step IN ('4', '6')
        </if>
        <if test="query.projectStage == 'complete'">
            AND p.is_completion_approval = 1
            AND r.step = '5'
        </if>
        <if test="query.projectName != null and query.projectName != ''">
            AND p.project_name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND p.park = #{query.zoneCode}
        </if>
        <if test="query.industryClassification != null and query.industryClassification != ''">
            AND p.national_economic_classification LIKE CONCAT('%', #{query.industryClassification}, '%')
        </if>
        <if test="query.investor != null and query.investor != ''">
            AND p.investor LIKE CONCAT('%', #{query.investor}, '%')
        </if>
        <if test="query.minInvestment != null">
            AND p.investment_amount &gt;= #{query.minInvestment}
        </if>
        <if test="query.maxInvestment != null">
            AND p.investment_amount &lt;= #{query.maxInvestment}
        </if>
        <if test="query.year != null">
            <choose>
                <when test="query.projectStage == 'start'">
                    AND YEAR(p.start_confirm_date) = #{query.year}
                </when>
                <when test="query.projectStage == 'complete'">
                    AND YEAR(p.end_confirm_date) = #{query.year}
                </when>
                <otherwise>
                    AND YEAR(p.signing_time) = #{query.year}
                </otherwise>
            </choose>
        </if>
        <if test="query.projectType != null and query.projectType != ''">
            <choose>
                <when test="query.projectType == '其他'">
                    AND (p.project_type IS NULL OR p.project_type = '')
                </when>
                <otherwise>
                    AND p.project_type = #{query.projectType}
                </otherwise>
            </choose>
        </if>
        <if test="query.auditStatus != null">
            AND p.audit_status = #{query.auditStatus}
        </if>
        </script>
    """)
    fun countProjectApprovalByProgress(
        @Param("query") query: ProjectApprovalQueryDTO
    ): Int

    /**
     * 统计各审核状态的项目数量 - 基于主表 current_project_progress 字段
     * 
     * @param query 查询条件（项目阶段、年度、项目类型）
     * @return 各审核状态的项目数量列表
     * 
     * 统计逻辑：
     * - 按审核状态（audit_status）分组统计项目数量
     * - 支持按项目阶段、年度、项目类型筛选
     * - 返回所有存在的审核状态及其对应的项目数量
     * - 基于主表 current_project_progress 字段判断项目阶段
     * - 需要验证业务标识和审核记录存在性
     */
    @Select("""
        <script>
        SELECT 
            p.audit_status AS auditStatus,
            CASE p.audit_status
                WHEN 0 THEN '无审核'
                WHEN 1 THEN '部门审核中'
                WHEN 2 THEN '部门审核通过'
                WHEN 3 THEN '部门审核退回'
                WHEN 4 THEN '专班审核中'
                WHEN 5 THEN '专班审核通过'
                WHEN 6 THEN '专班审核退回'
                WHEN 7 THEN '审核不通过'
                WHEN 8 THEN '通过不计分'
                ELSE '未知状态'
            END AS auditStatusName,
            COUNT(DISTINCT p.id) AS count
        FROM project_digital_investment_attracting p
        INNER JOIN project_digital_project_review_all r ON r.digital_investment_id = p.id
        WHERE p.deleted = 0
        <if test="query.projectStage == 'signed'">
            AND p.is_project_review = 1
            AND r.step IN ('2', '3')
        </if>
        <if test="query.projectStage == 'start'">
            AND p.is_start_approval = 1
            AND r.step IN ('4', '6')
        </if>
        <if test="query.projectStage == 'complete'">
            AND p.is_completion_approval = 1
            AND r.step = '5'
        </if>
        <if test="query.year != null">
            <choose>
                <when test="query.projectStage == 'start'">
                    AND YEAR(p.start_confirm_date) = #{query.year}
                </when>
                <when test="query.projectStage == 'complete'">
                    AND YEAR(p.end_confirm_date) = #{query.year}
                </when>
                <otherwise>
                    AND YEAR(p.signing_time) = #{query.year}
                </otherwise>
            </choose>
        </if>
        <if test="query.projectType != null and query.projectType != ''">
            <choose>
                <when test="query.projectType == '其他'">
                    AND (p.project_type IS NULL OR p.project_type = '')
                </when>
                <otherwise>
                    AND p.project_type = #{query.projectType}
                </otherwise>
            </choose>
        </if>
        <if test="query.auditStatus != null">
            AND p.audit_status = #{query.auditStatus}
        </if>
        GROUP BY p.audit_status
        ORDER BY p.audit_status
        </script>
    """)
    fun selectAuditStatusStatisticsByProgress(
        @Param("query") query: ProjectApprovalStatisticsQueryDTO
    ): List<AuditStatusCountVO>

    /**
     * 统计各部门审核情况 - 基于主表 current_project_progress 字段
     * 
     * @param query 查询条件（项目阶段、年度、项目类型）
     * @return 各部门审核情况列表（审核通过、审核不通过、未审核数量）
     * 
     * 统计逻辑：
     * - 基于项目的最终审核状态（audit_status）进行统计
     * - 每个项目只统计一次，归属于其主要审核部门
     * - 主要审核部门：取该项目符合当前阶段step条件的最新审核记录对应的部门
     *   - 签约核定：step IN ('2', '3')
     *   - 开工认定：step IN ('4', '6')
     *   - 竣工认定：step = '5'
     * - 审核通过：audit_status IN (2, 5, 8) - 部门审核通过、专班审核通过、通过不计分
     * - 审核不通过：audit_status IN (3, 6, 7) - 部门审核退回、专班审核退回、审核不通过
     * - 未审核/审核中：audit_status IN (0, 1, 4) - 无审核、部门审核中、专班审核中
     * - 基于主表 current_project_progress 字段判断项目阶段
     * - 需要验证业务标识和审核记录存在性
     * 
     * 关联表说明：
     * - project_digital_investment_attracting: 招商项目主表（包含 audit_status 和 current_project_progress）
     * - project_digital_project_review_all: 项目审核记录表（用于确定项目的主要审核部门）
     */
    @Select("""
        <script>
        SELECT * FROM (
            SELECT 
                CASE main_dept.cob_id
                    WHEN 'kWu55tEqKE89f2Eg2i0by6aEC9zd' THEN '发改委'
                    WHEN 'yvuAzt2JA2GOt91X9HlK6aGPc1bB' THEN '科技局'
                    WHEN 'jzuAxHPyePp3fG13GFPva6AGHW7y' THEN '工信局'
                    WHEN 'XauYjFbLJbx9CL5GLUgkX3RYcj87' THEN '生态环境局'
                    WHEN 'rYu13cmwomzRFLxqLUKeADPYUowW' THEN '应急局'
                    WHEN 'qru1oF23k2GOtadgaIMxknGJtV6G' THEN '商务局'
                    WHEN 'nYux8Ir3yVVBHmpwmIaabMHXawXl' THEN '税务局'
                    ELSE '其他部门'
                END AS deptName,
                -- 审核通过数量（audit_status IN (2, 5, 8)）
                COUNT(CASE WHEN p.audit_status IN (2, 5, 8) THEN 1 END) AS passedCount,
                -- 审核不通过数量（audit_status IN (3, 6, 7)）
                COUNT(CASE WHEN p.audit_status IN (3, 6, 7) THEN 1 END) AS rejectedCount,
                -- 未审核/审核中数量（audit_status IN (0, 1, 4)）
                COUNT(CASE WHEN p.audit_status IN (0, 1, 4) THEN 1 END) AS pendingCount
            FROM project_digital_investment_attracting p
            -- 关联每个项目的主要审核部门（取符合项目阶段step条件的最新审核记录的部门）
            INNER JOIN (
                SELECT 
                    r1.digital_investment_id,
                    r1.cob_id,
                    r1.dept_name
                FROM project_digital_project_review_all r1
                INNER JOIN (
                    -- 找出每个项目符合项目阶段step条件的最新审核记录ID
                    SELECT 
                        digital_investment_id,
                        MAX(id) as max_id
                    FROM project_digital_project_review_all
                    <if test="query.projectStage == 'signed'">
                        WHERE step IN ('2', '3')
                    </if>
                    <if test="query.projectStage == 'start'">
                        WHERE step IN ('4', '6')
                    </if>
                    <if test="query.projectStage == 'complete'">
                        WHERE step = '5'
                    </if>
                    GROUP BY digital_investment_id
                ) r2 ON r1.id = r2.max_id
            ) main_dept ON p.id = main_dept.digital_investment_id
            WHERE p.deleted = 0
            <if test="query.projectStage == 'signed'">
                AND p.is_project_review = 1
                AND EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r
                    WHERE r.digital_investment_id = p.id
                    AND r.step IN ('2', '3')
                )
            </if>
            <if test="query.projectStage == 'start'">
                AND p.is_start_approval = 1
                AND EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r
                    WHERE r.digital_investment_id = p.id
                    AND r.step IN ('4', '6')
                )
            </if>
            <if test="query.projectStage == 'complete'">
                AND p.is_completion_approval = 1
                AND EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r
                    WHERE r.digital_investment_id = p.id
                    AND r.step = '5'
                )
            </if>
            <if test="query.year != null">
                <choose>
                    <when test="query.projectStage == 'start'">
                        AND YEAR(p.start_confirm_date) = #{query.year}
                    </when>
                    <when test="query.projectStage == 'complete'">
                        AND YEAR(p.end_confirm_date) = #{query.year}
                    </when>
                    <otherwise>
                        AND YEAR(p.signing_time) = #{query.year}
                    </otherwise>
                </choose>
            </if>
            <if test="query.projectType != null and query.projectType != ''">
                <choose>
                    <when test="query.projectType == '其他'">
                        AND (p.project_type IS NULL OR p.project_type = '')
                    </when>
                    <otherwise>
                        AND p.project_type = #{query.projectType}
                    </otherwise>
                </choose>
            </if>
            <if test="query.auditStatus != null">
                AND p.audit_status = #{query.auditStatus}
            </if>
            GROUP BY 
                CASE main_dept.cob_id
                    WHEN 'kWu55tEqKE89f2Eg2i0by6aEC9zd' THEN '发改委'
                    WHEN 'yvuAzt2JA2GOt91X9HlK6aGPc1bB' THEN '科技局'
                    WHEN 'jzuAxHPyePp3fG13GFPva6AGHW7y' THEN '工信局'
                    WHEN 'XauYjFbLJbx9CL5GLUgkX3RYcj87' THEN '生态环境局'
                    WHEN 'rYu13cmwomzRFLxqLUKeADPYUowW' THEN '应急局'
                    WHEN 'qru1oF23k2GOtadgaIMxknGJtV6G' THEN '商务局'
                    WHEN 'nYux8Ir3yVVBHmpwmIaabMHXawXl' THEN '税务局'
                    ELSE '其他部门'
                END
        ) AS grouped_result
        ORDER BY 
            CASE deptName
                WHEN '发改委' THEN 1
                WHEN '科技局' THEN 2
                WHEN '工信局' THEN 3
                WHEN '生态环境局' THEN 4
                WHEN '应急局' THEN 5
                WHEN '商务局' THEN 6
                WHEN '税务局' THEN 7
                ELSE 8
            END
        </script>
    """)
    fun selectDeptAuditStatisticsByProgress(
        @Param("query") query: ProjectApprovalStatisticsQueryDTO
    ): List<DeptAuditStatisticsVO>

    /**
     * 查询"其他部门"的具体部门列表（逗号分隔）
     * 
     * @param query 查询条件
     * @return 其他部门的部门名称列表，逗号分隔
     */
    @Select("""
        <script>
        SELECT GROUP_CONCAT(DISTINCT main_dept.dept_name ORDER BY main_dept.dept_name SEPARATOR ',') AS otherDepts
        FROM project_digital_investment_attracting p
        INNER JOIN (
            SELECT 
                r1.digital_investment_id,
                r1.cob_id,
                r1.dept_name
            FROM project_digital_project_review_all r1
            INNER JOIN (
                SELECT 
                    digital_investment_id,
                    MAX(id) as max_id
                FROM project_digital_project_review_all
                <if test="query.projectStage == 'signed'">
                    WHERE step IN ('2', '3')
                </if>
                <if test="query.projectStage == 'start'">
                    WHERE step IN ('4', '6')
                </if>
                <if test="query.projectStage == 'complete'">
                    WHERE step = '5'
                </if>
                GROUP BY digital_investment_id
            ) r2 ON r1.id = r2.max_id
        ) main_dept ON p.id = main_dept.digital_investment_id
        WHERE p.deleted = 0
        AND main_dept.cob_id NOT IN (
            'kWu55tEqKE89f2Eg2i0by6aEC9zd',
            'yvuAzt2JA2GOt91X9HlK6aGPc1bB',
            'jzuAxHPyePp3fG13GFPva6AGHW7y',
            'XauYjFbLJbx9CL5GLUgkX3RYcj87',
            'rYu13cmwomzRFLxqLUKeADPYUowW',
            'qru1oF23k2GOtadgaIMxknGJtV6G',
            'nYux8Ir3yVVBHmpwmIaabMHXawXl'
        )
        <if test="query.projectStage == 'signed'">
            AND p.is_project_review = 1
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('2', '3')
            )
        </if>
        <if test="query.projectStage == 'start'">
            AND p.is_start_approval = 1
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step IN ('4', '6')
            )
        </if>
        <if test="query.projectStage == 'complete'">
            AND p.is_completion_approval = 1
            AND EXISTS (
                SELECT 1 FROM project_digital_project_review_all r
                WHERE r.digital_investment_id = p.id
                AND r.step = '5'
            )
        </if>
        <if test="query.year != null">
            <choose>
                <when test="query.projectStage == 'start'">
                    AND YEAR(p.start_confirm_date) = #{query.year}
                </when>
                <when test="query.projectStage == 'complete'">
                    AND YEAR(p.end_confirm_date) = #{query.year}
                </when>
                <otherwise>
                    AND YEAR(p.signing_time) = #{query.year}
                </otherwise>
            </choose>
        </if>
        <if test="query.projectType != null and query.projectType != ''">
            <choose>
                <when test="query.projectType == '其他'">
                    AND (p.project_type IS NULL OR p.project_type = '')
                </when>
                <otherwise>
                    AND p.project_type = #{query.projectType}
                </otherwise>
            </choose>
        </if>
        <if test="query.auditStatus != null">
            AND p.audit_status = #{query.auditStatus}
        </if>
        </script>
    """)
    fun selectOtherDeptNames(@Param("query") query: ProjectApprovalStatisticsQueryDTO): String?
}
