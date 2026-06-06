package com.tzdig.framework.mybatis.mapper.prime

import com.tzdig.framework.mybatis.dto.PreEvaluationQueryReqDTO
import com.tzdig.framework.mybatis.dto.PreEvaluationStatisticsQueryDTO
import com.tzdig.framework.mybatis.vo.DeptTimeoutVO
import com.tzdig.framework.mybatis.vo.PreEvaluationStatisticsVO
import com.tzdig.framework.mybatis.vo.ProjectPreEvaluationVO
import org.apache.ibatis.annotations.*

/**
 * 项目预评估 Mapper
 * 
 * 业务说明：
 * - 质态评估（step='1'）：招商项目的质量评估流程
 * - is_quality_evaluation=1：标识该项目需要进行质态评估
 * - 评估状态：根据 project_digital_project_review_all 表中 step='1' 的记录判断
 *   - 已完成：存在 status='已完成' 的记录
 *   - 未完成：不存在或 status!='已完成'
 */
@Mapper
interface ProjectPreEvaluationMapper {

    /**
     * 查询项目预评估列表（分页）
     * 
     * @param query 查询条件（项目名称、年度、产业类型、评估状态）
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 项目预评估列表
     * 
     * - 统计范围：只统计需要质态评估的项目（is_quality_evaluation = 1）
     * - 关联表：
     *   - project_digital_investment_attracting: 招商项目表（主表）
     *   - system_area: 区域表（LEFT JOIN 获取园区名称）
     *   - project_digital_project_review_all: 项目审核记录表（子查询判断评估状态）
     *   - user_organization: 部门组织表（子查询获取部门名称）
     * 
     * 查询字段说明：
     * - park: 园区ID（原始值）
     * - parkName: 园区名称（通过 LEFT JOIN system_area 关联获取）
     * - evaluationStatus: 通过子查询判断是否存在已完成的质态评估记录
     * - deptName: 通过 cob_id 关联 user_organization 表获取部门名称，使用 GROUP_CONCAT 合并（逗号分隔）
     * 
     * 注意：
     * - projectType = '其他' 时查询 project_type 为 NULL 或空字符串的记录
     */
    @Select("""
        <script>
        SELECT 
            p.id,
            -- 项目名称
            p.project_name AS projectName,
            -- 所属板块（园区名称）：通过 LEFT JOIN system_area 关联获取
            COALESCE(area_park.name, CAST(p.park AS CHAR)) AS parkName,
            -- 国民经济分类
            p.national_economic_classification AS industryClassification,
            -- 投资方
            p.investor,
            -- 投资总额（亿元）
            p.total_investment_cny AS totalInvestmentCny,
            p.park,
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r 
                    WHERE r.digital_investment_id = p.id 
                    AND r.step = '1'
                    AND r.status = '已完成'
                ) THEN '已完成'
                ELSE '未完成'
            END AS evaluationStatus,
            YEAR(p.signing_time) AS year,
            p.project_type AS projectType,
            (
                SELECT GROUP_CONCAT(DISTINCT uo.name SEPARATOR ', ') 
                FROM project_digital_project_review_all r 
                LEFT JOIN user_organization uo ON r.cob_id = uo.cob AND uo.deleted = 0
                WHERE r.digital_investment_id = p.id 
                AND r.step = '1'
            ) AS deptName
        FROM project_digital_investment_attracting p
        LEFT JOIN system_area area_park ON p.park = area_park.id
        WHERE p.deleted = 0
        AND p.is_quality_evaluation = 1
        AND EXISTS (
            SELECT 1 FROM project_digital_project_review_all r 
            WHERE r.digital_investment_id = p.id 
            AND r.step = '1'
        )
        <if test="query.projectName != null and query.projectName != ''">
            AND p.project_name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        <if test="query.year != null">
            AND YEAR(p.signing_time) = #{query.year}
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
        <if test="query.evaluationStatus != null and query.evaluationStatus != ''">
            AND CASE 
                WHEN EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r 
                    WHERE r.digital_investment_id = p.id 
                    AND r.step = '1'
                    AND r.status = '已完成'
                ) THEN '已完成'
                ELSE '未完成'
            END = #{query.evaluationStatus}
        </if>
        ORDER BY p.signing_time DESC
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectPreEvaluationList(
        @Param("query") query: PreEvaluationQueryReqDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<ProjectPreEvaluationVO>

    /**
     * 统计项目预评估总数
     * 
     * @param query 查询条件（项目名称、年度、产业类型、评估状态）
     * @return 符合条件的项目总数
     * 
     * 注意：与列表查询使用相同的过滤条件，确保总数准确
     * 
     * 关联表说明：
     * - project_digital_investment_attracting: 招商项目表（主表）
     * - project_digital_project_review_all: 项目审核记录表（子查询判断评估状态）
     */
    @Select("""
        <script>
        SELECT COUNT(1)
        FROM project_digital_investment_attracting p
        WHERE p.deleted = 0
        AND p.is_quality_evaluation = 1
        AND EXISTS (
            SELECT 1 FROM project_digital_project_review_all r 
            WHERE r.digital_investment_id = p.id 
            AND r.step = '1'
        )
        <if test="query.projectName != null and query.projectName != ''">
            AND p.project_name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        <if test="query.year != null">
            AND YEAR(p.signing_time) = #{query.year}
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
        <if test="query.evaluationStatus != null and query.evaluationStatus != ''">
            AND CASE 
                WHEN EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r 
                    WHERE r.digital_investment_id = p.id 
                    AND r.step = '1'
                    AND r.status = '已完成'
                ) THEN '已完成'
                ELSE '未完成'
            END = #{query.evaluationStatus}
        </if>
        </script>
    """)
    fun countPreEvaluation(
        @Param("query") query: PreEvaluationQueryReqDTO
    ): Int

    /**
     * 查询项目预评估统计数据
     * 
     * @param query 查询条件（年度、产业类型）
     * @return 统计结果（总数、未完成数、已完成数）
     * 
     * 统计逻辑：
     * - 统计范围：只统计需要质态评估的项目（is_quality_evaluation = 1）
     * - totalCount: 需要质态评估的项目总数
     * - unfinishedCount: 不存在已完成评估记录的项目数
     * - finishedCount: 存在已完成评估记录的项目数
     * 
     * 关联表说明：
     * - project_digital_investment_attracting: 招商项目表（主表）
     * - project_digital_project_review_all: 项目审核记录表（子查询判断评估状态，step='1'）
     */
    @Select("""
        <script>
        SELECT 
            COUNT(DISTINCT p.id) AS totalCount,
            COUNT(DISTINCT CASE 
                WHEN NOT EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r 
                    WHERE r.digital_investment_id = p.id 
                    AND r.step = '1'
                    AND r.status = '已完成'
                ) THEN p.id 
            END) AS unfinishedCount,
            COUNT(DISTINCT CASE 
                WHEN EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r 
                    WHERE r.digital_investment_id = p.id 
                    AND r.step = '1'
                    AND r.status = '已完成'
                ) THEN p.id 
            END) AS finishedCount
        FROM project_digital_investment_attracting p
        WHERE p.deleted = 0
        AND p.is_quality_evaluation = 1
        AND EXISTS (
            SELECT 1 FROM project_digital_project_review_all r 
            WHERE r.digital_investment_id = p.id 
            AND r.step = '1'
        )
        <if test="query.year != null">
            AND YEAR(p.signing_time) = #{query.year}
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
        <if test="query.evaluationStatus != null and query.evaluationStatus != ''">
            AND CASE 
                WHEN EXISTS (
                    SELECT 1 FROM project_digital_project_review_all r 
                    WHERE r.digital_investment_id = p.id 
                    AND r.step = '1'
                    AND r.status = '已完成'
                ) THEN '已完成'
                ELSE '未完成'
            END = #{query.evaluationStatus}
        </if>
        </script>
    """)
    fun selectPreEvaluationStatistics(
        @Param("query") query: PreEvaluationStatisticsQueryDTO
    ): PreEvaluationStatisticsVO

    /**
     * 查询各部门超时项目统计
     * 
     * @param query 查询条件（年度、产业类型）
     * @return 部门超时列表（部门名称、超时项目数、未超时项目数、项目总数、占比百分比）
     * 
     * 统计逻辑：
     * - 通过 cob_id 关联 user_organization 表获取部门名称
     * - 过滤范围：只统计7个指定部门（发改委、科技局、工信局、生态环境局、应急局、商务局、税务局）
     * - 按项目和部门维度判断超时状态：只要该项目在该部门有任何一条超时记录，就算超时项目
     * - percentage = 该部门超时项目数 / 该部门项目总数 * 100%
     * - 按超时项目数量降序排列
     * 
     * 关联表说明：
     * - project_digital_investment_attracting: 招商项目表（主表）
     * - project_digital_project_review_all: 项目审核记录表（step='1' 表示质态评估）
     * - user_organization: 部门组织表（通过 cob 字段关联部门信息）
     */
    @Select("""
        <script>
        SELECT 
            dept_stats.deptName,
            COUNT(*) AS totalProjectCount,
            SUM(dept_stats.isTimeout) AS timeoutCount,
            SUM(1 - dept_stats.isTimeout) AS nonTimeoutCount,
            ROUND(
                SUM(dept_stats.isTimeout) * 100.0 / COUNT(*), 1
            ) AS percentage
        FROM (
            SELECT 
                CASE 
                    WHEN r.cob_id = 'kWu55tEqKE89f2Eg2i0by6aEC9zd' THEN '发改委'
                    WHEN r.cob_id = 'yvuAzt2JA2GOt91X9HlK6aGPc1bB' THEN '科技局'
                    WHEN r.cob_id = 'jzuAxHPyePp3fG13GFPva6AGHW7y' THEN '工信局'
                    WHEN r.cob_id = 'XauYjFbLJbx9CL5GLUgkX3RYcj87' THEN '生态环境局'
                    WHEN r.cob_id = 'rYu13cmwomzRFLxqLUKeADPYUowW' THEN '应急局'
                    WHEN r.cob_id = 'qru1oF23k2GOtadgaIMxknGJtV6G' THEN '商务局'
                    WHEN r.cob_id = 'nYux8Ir3yVVBHmpwmIaabMHXawXl' THEN '税务局'
                    ELSE '未知部门'
                END AS deptName,
                p.id AS projectId,
                MAX(CASE WHEN r.status IN ('未完成', '超时自动完成') THEN 1 ELSE 0 END) AS isTimeout
            FROM project_digital_investment_attracting p
            INNER JOIN project_digital_project_review_all r ON r.digital_investment_id = p.id AND r.step = '1'
            LEFT JOIN user_organization uo ON r.cob_id = uo.cob AND uo.deleted = 0
            WHERE p.deleted = 0
            AND p.is_quality_evaluation = 1
            AND r.cob_id IN ('kWu55tEqKE89f2Eg2i0by6aEC9zd', 'yvuAzt2JA2GOt91X9HlK6aGPc1bB', 'jzuAxHPyePp3fG13GFPva6AGHW7y', 'XauYjFbLJbx9CL5GLUgkX3RYcj87', 'rYu13cmwomzRFLxqLUKeADPYUowW', 'qru1oF23k2GOtadgaIMxknGJtV6G', 'nYux8Ir3yVVBHmpwmIaabMHXawXl')
            <if test="query.year != null">
                AND YEAR(p.signing_time) = #{query.year}
            </if>
            <if test="query.projectType != null and query.projectType != ''">
                <choose>
                    <when test="query.projectType == 'null'">
                        AND p.project_type IS NULL
                    </when>
                    <otherwise>
                        AND p.project_type = #{query.projectType}
                    </otherwise>
                </choose>
            </if>
            GROUP BY 
                CASE 
                    WHEN r.cob_id = 'kWu55tEqKE89f2Eg2i0by6aEC9zd' THEN '发改委'
                    WHEN r.cob_id = 'yvuAzt2JA2GOt91X9HlK6aGPc1bB' THEN '科技局'
                    WHEN r.cob_id = 'jzuAxHPyePp3fG13GFPva6AGHW7y' THEN '工信局'
                    WHEN r.cob_id = 'XauYjFbLJbx9CL5GLUgkX3RYcj87' THEN '生态环境局'
                    WHEN r.cob_id = 'rYu13cmwomzRFLxqLUKeADPYUowW' THEN '应急局'
                    WHEN r.cob_id = 'qru1oF23k2GOtadgaIMxknGJtV6G' THEN '商务局'
                    WHEN r.cob_id = 'nYux8Ir3yVVBHmpwmIaabMHXawXl' THEN '税务局'
                    ELSE '未知部门'
                END,
                p.id
        ) dept_stats
        GROUP BY dept_stats.deptName
        ORDER BY timeoutCount DESC
        </script>
    """)
    fun selectDeptTimeoutStatistics(
        @Param("query") query: PreEvaluationStatisticsQueryDTO
    ): List<DeptTimeoutVO>
}
