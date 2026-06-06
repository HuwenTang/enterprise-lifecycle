package com.tzdig.framework.mybatis.mapper.prime

import com.tzdig.framework.mybatis.dto.ZoneInvestmentHomeStatisticsQueryDTO
import com.tzdig.framework.mybatis.dto.ZoneInvestmentProjectQueryDTO
import com.tzdig.framework.mybatis.vo.ZoneInvestmentProjectVO
import com.tzdig.framework.mybatis.vo.ZoneInvestmentRegionCardVO
import com.tzdig.framework.mybatis.vo.ZoneInvestmentRegionDetailVO
import com.tzdig.framework.mybatis.vo.ZoneInvestmentStatisticsVO
import org.apache.ibatis.annotations.*

/**
 * 战区招商投资项目 Mapper - 基于 t_proj_project 表（在谈项目表）
 */
@Mapper
interface ZoneInvestmentProjectMapper {

    /**
     * 查询战区招商投资项目列表（分页）- 基于 t_proj_project 表（在谈项目）
     *
     * @param query 查询条件（项目名称、投资方名称、项目类别、市区、园区、街镇、战区）
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 投资项目列表
     */
    @Select("""
        <script>
        SELECT 
            CAST(id AS CHAR) AS id,
            -- 投资方名称
            investor,
            -- 项目名称
            name AS projectName,
            -- 项目类别：1-内资, 2-外资
            CASE p_type
                WHEN 1 THEN '内资'
                WHEN 2 THEN '外资'
                ELSE CAST(p_type AS CHAR)
            END AS projectCategory,
            -- 投资金额
            CAST(invest_money AS DECIMAL(10,2)) AS investmentAmount,
            -- 项目内容
            `desc` AS projectContent,
            -- 区县编码
            district_code AS districtCode,
            -- 区县名称
            district,
            -- 园区code
            zone_code AS zoneCode,
            -- 园区名称
            zone_name AS zoneName,
            -- 街镇code
            town_code AS townCode,
            -- 街镇名称
            town_name AS townName,
            -- 初次对接时间（报送日期/入库时间）
            DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') AS entryTime,
            -- 完成报批日期（t_proj_project表无此字段，返回null）
            NULL AS finishCheckDate,
            -- 洽谈进度
            progress AS negotiationProgress,
            -- 洽谈进度名称
            CASE progress
                WHEN '1' THEN '接洽中'
                WHEN '2' THEN '已本地考察'
                WHEN '3' THEN '签约前谈判'
                WHEN '4' THEN '意向达成'
                WHEN '5' THEN '签约'
                ELSE progress
            END AS negotiationProgressName,
            -- 数据状态
            CAST(sj_status AS CHAR) AS dataStatus,
            -- 数据状态名称（只有1和2有对应名称，其他为空字符串）
            CASE sj_status
                WHEN 1 THEN '流转至签约项目'
                WHEN 2 THEN '流转至共享项目'
                ELSE ''
            END AS dataStatusName,
            -- 投资方注册地（字典编码）
            investor_place AS countryRegionOriginal,
            -- 所属战区（根据字典编码转换为中文名称）
            CASE investor_place
                WHEN '101' THEN '北京（京津冀区域）'
                WHEN '200' THEN '上海（长三角区域）'
                WHEN '300' THEN '南京（南京、合肥区域）'
                WHEN '400' THEN '深圳（珠三角区域）'
                WHEN '500' THEN '其他地区'
                WHEN '81' THEN '其他地区'
                ELSE COALESCE(investor_place, '其他')
            END AS countryRegionStandard
        FROM t_proj_project
        WHERE 1=1
        AND deleted = false
        -- 项目名称模糊搜索
        <if test="query.projectName != null and query.projectName != ''">
            AND name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        -- 投资方名称模糊搜索
        <if test="query.investorName != null and query.investorName != ''">
            AND investor LIKE CONCAT('%', #{query.investorName}, '%')
        </if>
        -- 项目类别精确匹配（内资/外资）
        <if test="query.projectCategory != null and query.projectCategory != ''">
            AND CASE p_type WHEN 1 THEN '内资' WHEN 2 THEN '外资' ELSE CAST(p_type AS CHAR) END = #{query.projectCategory}
        </if>
        -- 洽谈进度模糊匹配（progress字段）
        <if test="query.dataStatus != null and query.dataStatus != ''">
            AND progress LIKE CONCAT('%', #{query.dataStatus}, '%')
        </if>
        -- 市区编码前缀匹配
        <if test="query.districtCode != null and query.districtCode != ''">
            AND district_code LIKE CONCAT(#{query.districtCode}, '%')
        </if>
        -- 市区名称模糊搜索
        <if test="query.district != null and query.district != ''">
            AND district LIKE CONCAT('%', #{query.district}, '%')
        </if>
        -- 园区code前缀匹配
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
        </if>
        -- 园区名称模糊搜索
        <if test="query.zoneName != null and query.zoneName != ''">
            AND zone_name LIKE CONCAT('%', #{query.zoneName}, '%')
        </if>
        -- 街镇code前缀匹配
        <if test="query.townCode != null and query.townCode != ''">
            AND town_code LIKE CONCAT(#{query.townCode}, '%')
        </if>
        -- 街镇名称模糊搜索
        <if test="query.townName != null and query.townName != ''">
            AND town_name LIKE CONCAT('%', #{query.townName}, '%')
        </if>
        -- 原始数据国别/地区模糊搜索（投资方注册地）
        <if test="query.countryRegionOriginal != null and query.countryRegionOriginal != ''">
            AND investor_place LIKE CONCAT('%', #{query.countryRegionOriginal}, '%')
        </if>
        -- 所属战区精确匹配（支持单个编码或多个编码逗号分隔）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(investor_place, #{query.countryRegionStandard}) > 0
        </if>
        -- 按创建时间降序排列
        ORDER BY create_time DESC
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectZoneInvestmentList(
        @Param("query") query: ZoneInvestmentProjectQueryDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<ZoneInvestmentProjectVO>

    /**
     * 统计战区招商投资项目总数 - 基于 t_proj_project 表
     *
     * @param query 查询条件
     * @return 符合条件的项目总数
     */
    @Select("""
        <script>
        SELECT COUNT(1)
        FROM t_proj_project
        WHERE 1=1
        AND deleted = false
        -- 项目名称模糊搜索
        <if test="query.projectName != null and query.projectName != ''">
            AND name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        -- 投资方名称模糊搜索
        <if test="query.investorName != null and query.investorName != ''">
            AND investor LIKE CONCAT('%', #{query.investorName}, '%')
        </if>
        -- 项目类别精确匹配（内资/外资）
        <if test="query.projectCategory != null and query.projectCategory != ''">
            AND CASE p_type WHEN 1 THEN '内资' WHEN 2 THEN '外资' ELSE CAST(p_type AS CHAR) END = #{query.projectCategory}
        </if>
        -- 洽谈进度模糊匹配（progress字段）
        <if test="query.dataStatus != null and query.dataStatus != ''">
            AND progress LIKE CONCAT('%', #{query.dataStatus}, '%')
        </if>
        -- 市区编码前缀匹配
        <if test="query.districtCode != null and query.districtCode != ''">
            AND district_code LIKE CONCAT(#{query.districtCode}, '%')
        </if>
        -- 市区名称模糊搜索
        <if test="query.district != null and query.district != ''">
            AND district LIKE CONCAT('%', #{query.district}, '%')
        </if>
        -- 园区code前缀匹配
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
        </if>
        -- 园区名称模糊搜索
        <if test="query.zoneName != null and query.zoneName != ''">
            AND zone_name LIKE CONCAT('%', #{query.zoneName}, '%')
        </if>
        -- 街镇code前缀匹配
        <if test="query.townCode != null and query.townCode != ''">
            AND town_code LIKE CONCAT(#{query.townCode}, '%')
        </if>
        -- 街镇名称模糊搜索
        <if test="query.townName != null and query.townName != ''">
            AND town_name LIKE CONCAT('%', #{query.townName}, '%')
        </if>
        -- 原始数据国别/地区模糊搜索（投资方注册地）
        <if test="query.countryRegionOriginal != null and query.countryRegionOriginal != ''">
            AND investor_place LIKE CONCAT('%', #{query.countryRegionOriginal}, '%')
        </if>
        -- 所属战区精确匹配（支持单个编码或多个编码逗号分隔）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(investor_place, #{query.countryRegionStandard}) > 0
        </if>
        </script>
    """)
    fun countZoneInvestment(
        @Param("query") query: ZoneInvestmentProjectQueryDTO
    ): Int

    /**
     * 统计战区招商投资项目数据 - 基于 t_proj_project 表
     *
     * @param query 查询条件
     * @return 统计数据
     */
    @Select("""
        <script>
        SELECT 
            -- 在谈项目数（统计所有项目，参考在谈项目列表）
            COUNT(id) AS talkingCount,
            -- 招商活动数(从 t_proj_invest_activities 表统计)
            -- 注意:该表无战区字段,暂不按战区筛选
            (
                SELECT COUNT(1)
                FROM t_proj_invest_activities
                WHERE 1=1
                AND deleted = false
                -- 活动内容模糊搜索
                <if test="query.activityContent != null and query.activityContent != ''">
                    AND activity_content LIKE CONCAT('%', #{query.activityContent}, '%')
                </if>
                -- 市区编码前缀匹配
                <if test="query.districtCode != null and query.districtCode != ''">
                    AND code LIKE CONCAT(#{query.districtCode}, '%')
                </if>
                -- 市区名称模糊搜索
                <if test="query.district != null and query.district != ''">
                    AND name LIKE CONCAT('%', #{query.district}, '%')
                </if>
                -- 园区code前缀匹配
                <if test="query.zoneCode != null and query.zoneCode != ''">
                    AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
                </if>
                -- 园区名称模糊搜索
                <if test="query.zoneName != null and query.zoneName != ''">
                    AND zone_name LIKE CONCAT('%', #{query.zoneName}, '%')
                </if>
                -- 街镇code前缀匹配
                <if test="query.townCode != null and query.townCode != ''">
                    AND town_code LIKE CONCAT(#{query.townCode}, '%')
                </if>
                -- 街镇名称模糊搜索
                <if test="query.townName != null and query.townName != ''">
                    AND town_name LIKE CONCAT('%', #{query.townName}, '%')
                </if>
                -- 所属产业链模糊搜索
                <if test="query.industryName != null and query.industryName != ''">
                    AND industry_name LIKE CONCAT('%', #{query.industryName}, '%')
                </if>
                -- 战区筛选：根据 zjb_code 字段匹配（驻京办编码）
                <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
                    AND FIND_IN_SET(zjb_code, #{query.countryRegionStandard}) > 0
                </if>
            ) AS investmentActivityCount,
            -- 招商人员数量（从 t_proj_tz_team 表统计，根据战区筛选）
            (
                SELECT COUNT(1)
                FROM t_proj_tz_team
                WHERE 1=1
                AND deleted = false
                -- 姓名模糊搜索
                <if test="query.name != null and query.name != ''">
                    AND name LIKE CONCAT('%', #{query.name}, '%')
                </if>
                -- 专攻方向模糊搜索
                <if test="query.specialization != null and query.specialization != ''">
                    AND specialization LIKE CONCAT('%', #{query.specialization}, '%')
                </if>
                -- 职务模糊搜索
                <if test="query.position != null and query.position != ''">
                    AND position LIKE CONCAT('%', #{query.position}, '%')
                </if>
                -- 招商区域模糊搜索
                <if test="query.investPlace != null and query.investPlace != ''">
                    AND invest_place LIKE CONCAT('%', #{query.investPlace}, '%')
                </if>
                -- 市区编码前缀匹配
                <if test="query.districtCode != null and query.districtCode != ''">
                    AND district_code LIKE CONCAT(#{query.districtCode}, '%')
                </if>
                -- 市区名称模糊搜索
                <if test="query.district != null and query.district != ''">
                    AND district LIKE CONCAT('%', #{query.district}, '%')
                </if>
                -- 园区code前缀匹配
                <if test="query.zoneCode != null and query.zoneCode != ''">
                    AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
                </if>
                -- 园区名称模糊搜索
                <if test="query.zone != null and query.zone != ''">
                    AND zone LIKE CONCAT('%', #{query.zone}, '%')
                </if>
                -- 街镇code前缀匹配
                <if test="query.townCode != null and query.townCode != ''">
                    AND town_code LIKE CONCAT(#{query.townCode}, '%')
                </if>
                -- 街镇名称模糊搜索
                <if test="query.town != null and query.town != ''">
                    AND town LIKE CONCAT('%', #{query.town}, '%')
                </if>
                -- 学历精确匹配
                <if test="query.xl != null and query.xl != ''">
                    AND xl = #{query.xl}
                </if>
                -- 联系方式
                <if test="query.phone != null and query.phone != ''">
                    AND phone = #{query.phone}
                </if>
                -- 战区筛选：根据 invest_place 字段匹配
                <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
                    AND FIND_IN_SET(invest_place, #{query.countryRegionStandard}) > 0
                </if>
            ) AS investmentPersonnelCount,
            -- 累计投资额(亿元)
            SUM(CAST(COALESCE(invest_money, '0') AS DECIMAL(10,2))) AS totalInvestmentAmount,
            -- 本月新增项目数
            SUM(CASE WHEN DATE_FORMAT(create_time, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') THEN 1 ELSE 0 END) AS monthNewCount,
            -- 累计新增项目数（全部项目）
            COUNT(id) AS totalNewCount,
            -- 因公出访数量(从 t_proj_business_trip 表统计)
            (
                SELECT COUNT(1)
                FROM t_proj_business_trip
                WHERE 1=1
                AND deleted = false
                -- 市区编码前缀匹配
                <if test="query.districtCode != null and query.districtCode != ''">
                    AND code LIKE CONCAT(#{query.districtCode}, '%')
                </if>
                -- 市区名称模糊搜索
                <if test="query.district != null and query.district != ''">
                    AND name LIKE CONCAT('%', #{query.district}, '%')
                </if>
                -- 园区code前缀匹配
                <if test="query.zoneCode != null and query.zoneCode != ''">
                    AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
                </if>
                -- 园区名称模糊搜索
                <if test="query.zoneName != null and query.zoneName != ''">
                    AND zone_name LIKE CONCAT('%', #{query.zoneName}, '%')
                </if>
                -- 街镇code前缀匹配
                <if test="query.townCode != null and query.townCode != ''">
                    AND town_code LIKE CONCAT(#{query.townCode}, '%')
                </if>
                -- 街镇名称模糊搜索
                <if test="query.townName != null and query.townName != ''">
                    AND town_name LIKE CONCAT('%', #{query.townName}, '%')
                </if>
            ) AS officialVisitCount
        FROM t_proj_project
        WHERE 1=1
        AND deleted = false
        -- 项目名称模糊搜索
        <if test="query.projectName != null and query.projectName != ''">
            AND name LIKE CONCAT('%', #{query.projectName}, '%')
        </if>
        -- 投资方名称模糊搜索
        <if test="query.investorName != null and query.investorName != ''">
            AND investor LIKE CONCAT('%', #{query.investorName}, '%')
        </if>
        -- 项目类别精确匹配（内资/外资）
        <if test="query.projectCategory != null and query.projectCategory != ''">
            AND CASE p_type WHEN 1 THEN '内资' WHEN 2 THEN '外资' ELSE CAST(p_type AS CHAR) END = #{query.projectCategory}
        </if>
        -- 洽谈进度模糊匹配（progress字段）
        <if test="query.dataStatus != null and query.dataStatus != ''">
            AND progress LIKE CONCAT('%', #{query.dataStatus}, '%')
        </if>
        -- 市区编码前缀匹配
        <if test="query.districtCode != null and query.districtCode != ''">
            AND district_code LIKE CONCAT(#{query.districtCode}, '%')
        </if>
        -- 市区名称模糊搜索
        <if test="query.district != null and query.district != ''">
            AND district LIKE CONCAT('%', #{query.district}, '%')
        </if>
        -- 园区code前缀匹配
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
        </if>
        -- 园区名称模糊搜索
        <if test="query.zoneName != null and query.zoneName != ''">
            AND zone_name LIKE CONCAT('%', #{query.zoneName}, '%')
        </if>
        -- 街镇code前缀匹配
        <if test="query.townCode != null and query.townCode != ''">
            AND town_code LIKE CONCAT(#{query.townCode}, '%')
        </if>
        -- 街镇名称模糊搜索
        <if test="query.townName != null and query.townName != ''">
            AND town_name LIKE CONCAT('%', #{query.townName}, '%')
        </if>
        -- 原始数据国别/地区模糊搜索（投资方注册地）
        <if test="query.countryRegionOriginal != null and query.countryRegionOriginal != ''">
            AND investor_place LIKE CONCAT('%', #{query.countryRegionOriginal}, '%')
        </if>
        -- 所属战区精确匹配（支持单个编码或多个编码逗号分隔）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(investor_place, #{query.countryRegionStandard}) > 0
        </if>
        </script>
    """)
    fun selectZoneInvestmentStatistics(
        @Param("query") query: ZoneInvestmentProjectQueryDTO
    ): ZoneInvestmentStatisticsVO

    /**
     * 查询战区招商首页统计-战区卡片数据（按战区统计项目数量）- 基于 t_proj_project 表
     *
     * @param query 查询条件
     * @return 战区卡片统计列表
     */
    @Select("""
        <script>
        SELECT 
            CASE 
                -- 北京战区(内资编码: 101)
                WHEN investor_place = '101' OR investor_place LIKE '%101%' THEN '北京(京津冀)'
                -- 上海战区(内资编码: 200)
                WHEN investor_place = '200' OR investor_place LIKE '%200%' THEN '上海(长三角)'
                -- 深圳战区(内资编码: 400)
                WHEN investor_place = '400' OR investor_place LIKE '%400%' THEN '深圳(珠三角)'
                -- 南京战区(内资编码: 300)
                WHEN investor_place = '300' OR investor_place LIKE '%300%' THEN '南京(南京、合肥)'
                -- 其他地区(内资编码: 500, 其他(境内): 81)
                WHEN investor_place IN ('500', '81') OR investor_place LIKE '%500%' OR investor_place LIKE '%81%' THEN '其他地区'
                ELSE '其他地区'
            END AS regionName,
            COUNT(id) AS projectCount,
            SUM(CAST(COALESCE(invest_money, '0') AS DECIMAL(10,2))) AS projectAmount
        FROM t_proj_project
        WHERE 1=1
        AND deleted = false
        
        -- 年度筛选(基于 create_time 字段)
        <if test="query.year != null">
            AND YEAR(create_time) = #{query.year}
        </if>
        
        -- 金额范围筛选(基于 invest_money 字段,单位:亿元)
        <if test="query.amountRange != null and query.amountRange == 'above'">
            AND CAST(COALESCE(invest_money, '0') AS DECIMAL(10,2)) >= 1
        </if>
        <if test="query.amountRange != null and query.amountRange == 'below'">
            AND CAST(COALESCE(invest_money, '0') AS DECIMAL(10,2)) &lt; 1
        </if>

        
        GROUP BY 
            CASE 
                -- 北京战区(内资编码: 101)
                WHEN investor_place = '101' OR investor_place LIKE '%101%' THEN '北京(京津冀)'
                -- 上海战区(内资编码: 200)
                WHEN investor_place = '200' OR investor_place LIKE '%200%' THEN '上海(长三角)'
                -- 深圳战区(内资编码: 400)
                WHEN investor_place = '400' OR investor_place LIKE '%400%' THEN '深圳(珠三角)'
                -- 南京战区(内资编码: 300)
                WHEN investor_place = '300' OR investor_place LIKE '%300%' THEN '南京(南京、合肥)'
                -- 其他地区(内资编码: 500, 其他(境内): 81)
                WHEN investor_place IN ('500', '81') OR investor_place LIKE '%500%' OR investor_place LIKE '%81%' THEN '其他地区'
                ELSE '其他地区'
            END
        ORDER BY projectCount DESC
        </script>
    """)
    fun selectZoneInvestmentHomeRegionCards(
        @Param("query") query: ZoneInvestmentHomeStatisticsQueryDTO
    ): List<ZoneInvestmentRegionCardVO>

    /**
     * 查询战区招商首页统计-详细表格数据（按战区统计各项指标）- 基于 project_digital_investment_attracting 表
     *
     * @param query 查询条件
     * @return 战区详细统计列表
     */
    @Select("""
        <script>
        SELECT 
            CASE 
                -- 北京战区(标签名: 北京(京津冀))
                WHEN p.investor_place LIKE '%北京%' OR p.investor_place LIKE '%京津冀%' THEN '北京(京津冀)'
                -- 上海战区(标签名: 上海(长三角))
                WHEN p.investor_place LIKE '%上海%' OR p.investor_place LIKE '%长三角%' OR p.investor_place LIKE '%苏州%' THEN '上海(长三角)'
                -- 深圳战区(标签名: 深圳(珠三角))
                WHEN p.investor_place LIKE '%深圳%' OR p.investor_place LIKE '%珠三角%' OR p.investor_place LIKE '%广州%' THEN '深圳(珠三角)'
                -- 南京战区(标签名: 南京(南京、合肥))
                WHEN p.investor_place LIKE '%南京%' OR p.investor_place LIKE '%合肥%' THEN '南京(南京、合肥)'
                -- 其他地区/其他(境内) (编码: 500, 81)
                WHEN p.investor_place LIKE '%其他地区%' OR p.investor_place LIKE '%其他(境内)%' OR p.investor_place LIKE '%其他（境内）%' THEN '其他地区'
                -- 其他(兜底)
                ELSE '其他地区'
            END AS regionName,
            
            -- 累计签约数(个)：current_project_progress = '2' 且 check_status = 1
            SUM(CASE WHEN p.current_project_progress = '2' AND p.check_status = 1 THEN 1 ELSE 0 END) AS signedCount,
            
            -- 累计投资额(亿元)：签约项目的总投资额，内资用 total_investment_cny，外资用 total_investment_usd * 7 转换
            SUM(CASE WHEN p.current_project_progress = '2' AND p.check_status = 1 
                THEN CASE 
                    WHEN p.project_rating = '内资' THEN COALESCE(p.total_investment_cny, 0)
                    WHEN p.project_rating = '外资' THEN COALESCE(p.total_investment_usd, 0) * 7
                    ELSE COALESCE(p.total_investment_cny, 0)
                END
                ELSE 0 END) AS signedInvestmentAmount,
            
            -- 当月新增数(个)：按 signing_time 统计当月新增签约项目
            SUM(CASE WHEN DATE_FORMAT(p.signing_time, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') 
                AND p.current_project_progress = '2' AND p.check_status = 1 
                THEN 1 ELSE 0 END) AS monthNewCount,
            
            -- 当月投资额(亿元)：当月新增签约项目的投资额，内资用 total_investment_cny，外资用 total_investment_usd * 7 转换
            SUM(CASE WHEN DATE_FORMAT(p.signing_time, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') 
                AND p.current_project_progress = '2' AND p.check_status = 1 
                THEN CASE 
                    WHEN p.project_rating = '内资' THEN COALESCE(p.total_investment_cny, 0)
                    WHEN p.project_rating = '外资' THEN COALESCE(p.total_investment_usd, 0) * 7
                    ELSE COALESCE(p.total_investment_cny, 0)
                END
                ELSE 0 END) AS monthInvestmentAmount,
            
            -- 开工项目数(个)：current_project_progress >= '6' 且 check_status = 1
            SUM(CASE WHEN p.current_project_progress >= '6' AND p.check_status = 1 THEN 1 ELSE 0 END) AS startProjectCount,
            
            -- 开工当月新增数(个)：按 start_confirm_date 统计当月开工项目
            SUM(CASE WHEN DATE_FORMAT(p.start_confirm_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') 
                AND p.current_project_progress >= '6' AND p.check_status = 1 
                THEN 1 ELSE 0 END) AS startMonthNewCount,
            
            -- 开工率(%)：开工项目数 / 签约项目数 * 100
            CASE 
                WHEN SUM(CASE WHEN p.current_project_progress = '2' AND p.check_status = 1 THEN 1 ELSE 0 END) > 0 
                THEN ROUND(
                    SUM(CASE WHEN p.current_project_progress >= '6' AND p.check_status = 1 THEN 1 ELSE 0 END) * 100.0 / 
                    SUM(CASE WHEN p.current_project_progress = '2' AND p.check_status = 1 THEN 1 ELSE 0 END), 
                    2
                )
                ELSE 0 
            END AS startRate,
            
            -- 市重点数量(个)：关联 project_key_project 表，is_city_key = true 且 status = 2
            SUM(CASE WHEN pkp.is_city_key = 1 AND pkp.status = 2 THEN 1 ELSE 0 END) AS cityKeyCount,
            
            -- 省重大数量(个)：关联 project_key_project 表，is_province_key = true 且 status = 2
            SUM(CASE WHEN pkp.is_province_key = 1 AND pkp.status = 2 THEN 1 ELSE 0 END) AS provinceKeyCount,
            
            -- 在谈项目数(个)：占位符，后续在Controller中填充
            0 AS talkingCount,
            
            -- 招商活动数(个)：占位符，后续在Controller中填充
            0 AS investmentActivityCount
            
        FROM project_digital_investment_attracting p
        LEFT JOIN project_key_project pkp ON p.id = pkp.digital_investment_id
        WHERE p.deleted = 0
        
        -- 年度筛选
        <if test="query.year != null">
            AND YEAR(p.signing_time) = #{query.year}
        </if>
        
        -- 金额范围筛选
        <if test="query.amountRange != null and query.amountRange == 'above'">
            AND (
                (p.project_rating = '内资' AND p.total_investment_cny >= 1)
                OR (p.project_rating = '外资' AND p.total_investment_usd >= 1/7)
            )
        </if>
        <if test="query.amountRange != null and query.amountRange == 'below'">
            AND (
                (p.project_rating = '内资' AND p.total_investment_cny &lt; 1)
                OR (p.project_rating = '外资' AND p.total_investment_usd &lt; 1/7)
            )
        </if>
        
        GROUP BY 
            CASE 
                -- 北京战区(标签名: 北京(京津冀))
                WHEN p.investor_place LIKE '%北京%' OR p.investor_place LIKE '%京津冀%' THEN '北京(京津冀)'
                -- 上海战区(标签名: 上海(长三角))
                WHEN p.investor_place LIKE '%上海%' OR p.investor_place LIKE '%长三角%' OR p.investor_place LIKE '%苏州%' THEN '上海(长三角)'
                -- 深圳战区(标签名: 深圳(珠三角))
                WHEN p.investor_place LIKE '%深圳%' OR p.investor_place LIKE '%珠三角%' OR p.investor_place LIKE '%广州%' THEN '深圳(珠三角)'
                -- 南京战区(标签名: 南京(南京、合肥))
                WHEN p.investor_place LIKE '%南京%' OR p.investor_place LIKE '%合肥%' THEN '南京(南京、合肥)'
                -- 其他地区/其他(境内) (编码: 500, 81)
                WHEN p.investor_place LIKE '%其他地区%' OR p.investor_place LIKE '%其他(境内)%' OR p.investor_place LIKE '%其他（境内）%' THEN '其他地区'
                ELSE '其他地区'
            END
        ORDER BY signedCount DESC
        </script>
    """)
    fun selectZoneInvestmentHomeRegionDetails(
        @Param("query") query: ZoneInvestmentHomeStatisticsQueryDTO
    ): List<ZoneInvestmentRegionDetailVO>

    /**
     * 根据战区编码获取在谈项目数
     * 使用与 countZoneInvestment 相同的逻辑，但按战区分组统计
     */
    @Select("""
        <script>
        SELECT 
            CASE investor_place
                WHEN '101' THEN '北京(京津冀)'
                WHEN '200' THEN '上海(长三角)'
                WHEN '300' THEN '南京(南京、合肥)'
                WHEN '400' THEN '深圳(珠三角)'
                WHEN '500' THEN '其他地区'
                WHEN '81' THEN '其他地区'
                ELSE '其他地区'
            END AS regionName,
            COUNT(id) AS talkingCount
        FROM t_proj_project
        WHERE deleted = false
        
        -- 年度筛选（使用 create_time）
        <if test="query.year != null">
            AND YEAR(create_time) = #{query.year}
        </if>
        
        -- 所属战区筛选
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(investor_place, #{query.countryRegionStandard}) > 0
        </if>
        
        GROUP BY investor_place
        </script>
    """)
    fun countTalkingProjectsByRegion(
        @Param("query") query: ZoneInvestmentHomeStatisticsQueryDTO
    ): List<Map<String, Any>>

    /**
     * 根据战区编码获取招商活动数
     * 从 t_proj_invest_activities 表统计，根据 zjb_code 字段匹配战区
     */
    @Select("""
        <script>
        SELECT 
            CASE zjb_code
                WHEN '101' THEN '北京(京津冀)'
                WHEN '200' THEN '上海(长三角)'
                WHEN '300' THEN '南京(南京、合肥)'
                WHEN '400' THEN '深圳(珠三角)'
                WHEN '500' THEN '其他地区'
                WHEN '81' THEN '其他地区'
                ELSE '其他地区'
            END AS regionName,
            COUNT(1) AS investmentActivityCount
        FROM t_proj_invest_activities
        WHERE deleted = false
        
        -- 所属战区筛选
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(zjb_code, #{query.countryRegionStandard}) > 0
        </if>
        
        GROUP BY zjb_code
        </script>
    """)
    fun countInvestmentActivitiesByRegion(
        @Param("query") query: ZoneInvestmentHomeStatisticsQueryDTO
    ): List<Map<String, Any>>


}
