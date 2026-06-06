@file:Suppress("unused")

package com.tzdig.framework.mybatis.mapper.zsxt

import com.tzdig.framework.mybatis.base.BaseMapper
import com.tzdig.framework.mybatis.dto.OverseasBusinessTripQueryDTO
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTrip
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface TProjBusinessTripMapper : BaseMapper<TProjBusinessTrip> {

    /**
     * 查询境外战区因公出访列表（分页）
     *
     * @param query 查询条件
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 因公出访列表
     */
    @Select("""
        <script>
        SELECT 
            id,
            code,
            name,
            zone_code AS zoneCode,
            zone_name AS zoneName,
            town_code AS townCode,
            town_name AS townName,
            year,
            group_name AS groupName,
            main_members AS mainMembers,
            visit_destination AS visitDestination,
            activities_and_visits AS activitiesAndVisits,
            achievements,
            next_plan AS nextPlan,
            create_time AS createTime,
            update_time AS updateTime
        FROM t_proj_business_trip
        WHERE 1=1
        AND deleted = false
        -- 出访地（国家、地区）模糊搜索
        <if test="query.visitDestination != null and query.visitDestination != ''">
            AND visit_destination LIKE CONCAT('%', #{query.visitDestination}, '%')
        </if>
        -- 团组名称模糊搜索
        <if test="query.groupName != null and query.groupName != ''">
            AND group_name LIKE CONCAT('%', #{query.groupName}, '%')
        </if>
        -- 主要成员模糊搜索
        <if test="query.mainMembers != null and query.mainMembers != ''">
            AND main_members LIKE CONCAT('%', #{query.mainMembers}, '%')
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
        -- 年份筛选
        <if test="query.year != null and query.year != ''">
            AND year = #{query.year}
        </if>
        -- 按创建时间降序排列
        ORDER BY create_time DESC
        LIMIT #{limit} OFFSET #{offset}
        </script>
    """)
    fun selectOverseasBusinessTripList(
        @Param("query") query: OverseasBusinessTripQueryDTO,
        @Param("offset") offset: Int,
        @Param("limit") limit: Int
    ): List<TProjBusinessTrip>

    /**
     * 统计境外战区因公出访总数
     *
     * @param query 查询条件
     * @return 符合条件的总数
     */
    @Select("""
        <script>
        SELECT COUNT(1)
        FROM t_proj_business_trip
        WHERE 1=1
        AND deleted = false
        -- 出访地（国家、地区）模糊搜索
        <if test="query.visitDestination != null and query.visitDestination != ''">
            AND visit_destination LIKE CONCAT('%', #{query.visitDestination}, '%')
        </if>
        -- 团组名称模糊搜索
        <if test="query.groupName != null and query.groupName != ''">
            AND group_name LIKE CONCAT('%', #{query.groupName}, '%')
        </if>
        -- 主要成员模糊搜索
        <if test="query.mainMembers != null and query.mainMembers != ''">
            AND main_members LIKE CONCAT('%', #{query.mainMembers}, '%')
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
        -- 年份筛选
        <if test="query.year != null and query.year != ''">
            AND year = #{query.year}
        </if>
        </script>
    """)
    fun countOverseasBusinessTrip(
        @Param("query") query: OverseasBusinessTripQueryDTO
    ): Int
}
