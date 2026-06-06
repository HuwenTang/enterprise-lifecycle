package com.tzdig.framework.mybatis.dao

import com.mybatisflex.core.paginate.Page
import com.tzdig.framework.mybatis.bo.TProjBusinessTripProjectDetailsBO
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

/**
 * 因公出访关联项目数据访问对象 (直写 SQL 版)
 */
@Mapper
interface TProjBusinessTripProjectDAO {

    /**
     * 关联查询出访记录对应的项目详情分页列表
     */
    @Select(
        """
        SELECT
            t2.id,
            t2.district,
            t2.zone_name as zoneName,
            t2.town_name as townName,
            t2.code,
            t2.name,
            t2.invest_money as investMoney,
            t2.p_type as pType
        FROM
            t_proj_business_trip_project t1
        JOIN
            t_proj_project_signed t2 ON t1.proj_signed_id = t2.id
        WHERE
            t1.trip_id = #{tripId}
            AND t1.deleted = 0
            AND t2.deleted = 0
        ORDER BY t1.id ASC
        LIMIT #{size} OFFSET #{offset}
        """
    )
    fun listProjectDetails(
        @Param("offset") offset: Long,
        @Param("size") size: Long,
        @Param("tripId") tripId: Long
    ): MutableList<TProjBusinessTripProjectDetailsBO>

    /**
     * 获取详情列表的总条数
     */
    @Select(
        """
        SELECT count(*)
        FROM t_proj_business_trip_project t1
        JOIN t_proj_project_signed t2 ON t1.proj_signed_id = t2.id
        WHERE t1.trip_id = #{tripId} AND t1.deleted = 0 AND t2.deleted = 0
        """
    )
    fun listProjectDetailsCount(@Param("tripId") tripId: Long): Long

    /**
     * 查询未绑定的项目分页列表 (根据 tripId 排除已绑定的项目, 并支持按项目名称搜索)
     */
    @Select(
        """
        <script>
        SELECT
            id, district, zone_name as zoneName, town_name as townName,
            code, name, invest_money as investMoney, p_type as pType
        FROM
            t_proj_project_signed
        WHERE
            deleted = 0
            <if test="projectName != null and projectName != ''">
                AND name LIKE CONCAT('%', #{projectName}, '%')
            </if>
            AND id NOT IN (
                SELECT proj_signed_id
                FROM t_proj_business_trip_project
                WHERE trip_id = #{tripId}
                AND deleted = 0
            )
        ORDER BY create_time DESC
        LIMIT #{size} OFFSET #{offset}
        </script>
        """
    )
    fun listUnboundProjects(
        @Param("offset") offset: Long,
        @Param("size") size: Long,
        @Param("tripId") tripId: Long,
        @Param("projectName") projectName: String?
    ): MutableList<TProjBusinessTripProjectDetailsBO>

    /**
     * 获取未绑定项目列表的总条数
     */
    @Select(
        """
        <script>
        SELECT count(*)
        FROM t_proj_project_signed
        WHERE deleted = 0
            <if test="projectName != null and projectName != ''">
                AND name LIKE CONCAT('%', #{projectName}, '%')
            </if>
            AND id NOT IN (
                SELECT proj_signed_id
                FROM t_proj_business_trip_project
                WHERE trip_id = #{tripId} AND deleted = 0
            )
        </script>
        """
    )
    fun listUnboundProjectsCount(@Param("tripId") tripId: Long, @Param("projectName") projectName: String?): Long
}
