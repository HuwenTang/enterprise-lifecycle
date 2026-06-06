@file:Suppress("unused")

package com.tzdig.framework.mybatis.mapper.zsxt

import com.tzdig.framework.mybatis.dto.InvestActivitiesQueryDTO
import com.tzdig.framework.mybatis.dto.InvestDemandQueryDTO
import com.tzdig.framework.mybatis.dto.TzTeamQueryDTO
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestDemand
import com.tzdig.framework.mybatis.entity.zsxt.TProjInvestActivities
import com.tzdig.framework.mybatis.entity.zsxt.TProjTzTeam
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

/**
 * 招商活动Mapper（合并）
 * 包含：招商活动登记、招商团队名录
 */
@Mapper
interface InvestmentActivitiesMapper {

    /**
     * 查询招商活动登记列表（分页）
     *
     * @param query 查询条件
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 活动登记列表
     */
    @Select("""
        <script>
        SELECT 
            id,
            code,
            name,
            start_time AS startTime,
            end_time AS endTime,
            activity_content AS activityContent,
            lxrxm,
            zw,
            lxdh,
            leaders,
            industry_code AS industryCode,
            industry_name AS industryName,
            zone_code AS zoneCode,
            zone_name AS zoneName,
            town_code AS townCode,
            town_name AS townName,
            zjb_address AS zjbAddress,
            zjb_code AS zjbCode,
            images,
            audit_id AS auditId,
            audit_status AS auditStatus,
            audit_time AS auditTime,
            audit_remark AS auditRemark,
            create_time AS createTime,
            update_time AS updateTime
        FROM t_proj_invest_activities
        WHERE 1=1
        AND deleted = false
        -- 活动内容模糊搜索
        <if test="query.activityContent != null and query.activityContent != ''">
            AND activity_content LIKE CONCAT('%', #{query.activityContent}, '%')
        </if>
        -- 主要领导模糊搜索
        <if test="query.leaders != null and query.leaders != ''">
            AND leaders LIKE CONCAT('%', #{query.leaders}, '%')
        </if>
        -- 所属产业链模糊搜索
        <if test="query.industryName != null and query.industryName != ''">
            AND industry_name LIKE CONCAT('%', #{query.industryName}, '%')
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
        -- 开始时间
        <if test="query.startTime != null and query.startTime != ''">
            AND start_time >= #{query.startTime}
        </if>
        -- 结束时间
        <if test="query.endTime != null and query.endTime != ''">
            AND end_time &lt;= #{query.endTime}
        </if>
        -- 审核状态精确匹配
        <if test="query.auditStatus != null">
            AND audit_status = #{query.auditStatus}
        </if>
        -- 战区筛选：根据 zjb_code 字段匹配（驻京办编码）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(zjb_code, #{query.countryRegionStandard}) > 0
        </if>
        -- 按创建时间降序排列
        ORDER BY create_time DESC
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectInvestActivitiesList(
        @Param("query") query: InvestActivitiesQueryDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<TProjInvestActivities>

    /**
     * 统计招商活动登记总数
     *
     * @param query 查询条件
     * @return 符合条件的总数
     */
    @Select("""
        <script>
        SELECT COUNT(1)
        FROM t_proj_invest_activities
        WHERE 1=1
        AND deleted = false
        -- 活动内容模糊搜索
        <if test="query.activityContent != null and query.activityContent != ''">
            AND activity_content LIKE CONCAT('%', #{query.activityContent}, '%')
        </if>
        -- 主要领导模糊搜索
        <if test="query.leaders != null and query.leaders != ''">
            AND leaders LIKE CONCAT('%', #{query.leaders}, '%')
        </if>
        -- 所属产业链模糊搜索
        <if test="query.industryName != null and query.industryName != ''">
            AND industry_name LIKE CONCAT('%', #{query.industryName}, '%')
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
        -- 开始时间
        <if test="query.startTime != null and query.startTime != ''">
            AND start_time >= #{query.startTime}
        </if>
        -- 结束时间
        <if test="query.endTime != null and query.endTime != ''">
            AND end_time &lt;= #{query.endTime}
        </if>
        -- 审核状态精确匹配
        <if test="query.auditStatus != null">
            AND audit_status = #{query.auditStatus}
        </if>
        -- 战区筛选：根据 zjb_code 字段匹配（驻京办编码）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(zjb_code, #{query.countryRegionStandard}) > 0
        </if>
        </script>
    """)
    fun countInvestActivities(
        @Param("query") query: InvestActivitiesQueryDTO
    ): Int

    /**
     * 查询招商团队名录列表（分页）
     *
     * @param query 查询条件
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 招商团队名录列表
     */
    @Select("""
        <script>
        SELECT 
            id,
            district,
            zone,
            town,
            name,
            specialization,
            phone,
            position,
            district_code AS districtCode,
            zone_code AS zoneCode,
            town_code AS townCode,
            csrq,
            xl,
            zc,
            invest_place AS investPlace,
            remark,
            create_time AS createTime,
            update_time AS updateTime
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
        -- 战区筛选：根据 invest_place 字段匹配（招商区域编码）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(invest_place, #{query.countryRegionStandard}) > 0
        </if>
        -- 按创建时间降序排列
        ORDER BY create_time DESC
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectTzTeamList(
        @Param("query") query: TzTeamQueryDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<TProjTzTeam>

    /**
     * 统计招商团队名录总数
     *
     * @param query 查询条件
     * @return 符合条件的总数
     */
    @Select("""
        <script>
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
        -- 战区筛选：根据 invest_place 字段匹配（招商区域编码）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(invest_place, #{query.countryRegionStandard}) > 0
        </if>
        </script>
    """)
    fun countTzTeam(
        @Param("query") query: TzTeamQueryDTO
    ): Int

    /**
     * 查询招商需求留言板列表（分页）
     *
     * @param query 查询条件
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 招商需求留言板列表
     */
    @Select("""
        <script>
        SELECT 
            id,
            district_code AS districtCode,
            district_name AS districtName,
            zone_code AS zoneCode,
            zone_name AS zoneName,
            town_code AS townCode,
            town_name AS townName,
            place,
            title,
            content,
            expect_time AS expectTime,
            linker_name AS linkerName,
            linker_tel AS linkerTel,
            file_path AS filePath,
            status,
            audit_id AS auditId,
            audit_name AS auditName,
            audit_time AS auditTime,
            audit_remark AS auditRemark,
            reply_id AS replyId,
            reply_name AS replyName,
            reply_time AS replyTime,
            reply_content AS replyContent,
            creator_id AS creatorId,
            creator_name AS creatorName,
            create_time AS createTime,
            update_time AS updateTime
        FROM t_biz_invest_demand
        WHERE 1=1
        AND deleted = false
        -- 市区编码前缀匹配
        <if test="query.districtCode != null and query.districtCode != ''">
            AND district_code LIKE CONCAT(#{query.districtCode}, '%')
        </if>
        -- 市区名称模糊搜索
        <if test="query.districtName != null and query.districtName != ''">
            AND district_name LIKE CONCAT('%', #{query.districtName}, '%')
        </if>
        -- 园区编码前缀匹配
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
        </if>
        -- 园区名称模糊搜索
        <if test="query.zoneName != null and query.zoneName != ''">
            AND zone_name LIKE CONCAT('%', #{query.zoneName}, '%')
        </if>
        -- 街镇编码前缀匹配
        <if test="query.townCode != null and query.townCode != ''">
            AND town_code LIKE CONCAT(#{query.townCode}, '%')
        </if>
        -- 街镇名称模糊搜索
        <if test="query.townName != null and query.townName != ''">
            AND town_name LIKE CONCAT('%', #{query.townName}, '%')
        </if>
        -- 需求标题模糊搜索
        <if test="query.title != null and query.title != ''">
            AND title LIKE CONCAT('%', #{query.title}, '%')
        </if>
        -- 联系人模糊搜索
        <if test="query.linkerName != null and query.linkerName != ''">
            AND linker_name LIKE CONCAT('%', #{query.linkerName}, '%')
        </if>
        -- 联系方式
        <if test="query.linkerTel != null and query.linkerTel != ''">
            AND linker_tel = #{query.linkerTel}
        </if>
        -- 审核状态精确匹配
        <if test="query.status != null">
            AND status = #{query.status}
        </if>
        -- 战区筛选：根据 place 字段匹配（关联战区）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(place, #{query.countryRegionStandard}) > 0
        </if>
        -- 按创建时间降序排列
        ORDER BY create_time DESC
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectInvestDemandList(
        @Param("query") query: InvestDemandQueryDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<TBizInvestDemand>

    /**
     * 统计招商需求留言板总数
     *
     * @param query 查询条件
     * @return 符合条件的总数
     */
    @Select("""
        <script>
        SELECT COUNT(1)
        FROM t_biz_invest_demand
        WHERE 1=1
        AND deleted = false
        -- 市区编码前缀匹配
        <if test="query.districtCode != null and query.districtCode != ''">
            AND district_code LIKE CONCAT(#{query.districtCode}, '%')
        </if>
        -- 市区名称模糊搜索
        <if test="query.districtName != null and query.districtName != ''">
            AND district_name LIKE CONCAT('%', #{query.districtName}, '%')
        </if>
        -- 园区编码前缀匹配
        <if test="query.zoneCode != null and query.zoneCode != ''">
            AND zone_code LIKE CONCAT(#{query.zoneCode}, '%')
        </if>
        -- 园区名称模糊搜索
        <if test="query.zoneName != null and query.zoneName != ''">
            AND zone_name LIKE CONCAT('%', #{query.zoneName}, '%')
        </if>
        -- 街镇编码前缀匹配
        <if test="query.townCode != null and query.townCode != ''">
            AND town_code LIKE CONCAT(#{query.townCode}, '%')
        </if>
        -- 街镇名称模糊搜索
        <if test="query.townName != null and query.townName != ''">
            AND town_name LIKE CONCAT('%', #{query.townName}, '%')
        </if>
        -- 需求标题模糊搜索
        <if test="query.title != null and query.title != ''">
            AND title LIKE CONCAT('%', #{query.title}, '%')
        </if>
        -- 联系人模糊搜索
        <if test="query.linkerName != null and query.linkerName != ''">
            AND linker_name LIKE CONCAT('%', #{query.linkerName}, '%')
        </if>
        -- 联系方式
        <if test="query.linkerTel != null and query.linkerTel != ''">
            AND linker_tel = #{query.linkerTel}
        </if>
        -- 审核状态精确匹配
        <if test="query.status != null">
            AND status = #{query.status}
        </if>
        -- 战区筛选：根据 place 字段匹配（关联战区）
        <if test="query.countryRegionStandard != null and query.countryRegionStandard != ''">
            AND FIND_IN_SET(place, #{query.countryRegionStandard}) > 0
        </if>
        </script>
    """)
    fun countInvestDemand(
        @Param("query") query: InvestDemandQueryDTO
    ): Int
}
