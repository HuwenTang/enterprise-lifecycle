package com.tzdig.framework.mybatis.dao

import com.tzdig.framework.mybatis.bo.*
import org.apache.ibatis.annotations.Delete
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import java.time.LocalDateTime

@Mapper
interface ProjectStatDataDAO {
    @Delete("truncate table `stat_project_stage`")
    fun truncateTableStatProjectStage()

    @Delete("truncate table `stat_project_item_cost_time`")
    fun truncateTableStatProjectItemCostTime()

    @Select(
        """
            	select stage, count(1)  stageCount
		        from stat_project_stage
                where stage_create_time >= #{monthStart} AND stage_create_time <= #{monthEnd}
		        group by stage
             """
    )
    fun stageOverViewByTimeRange(
        @Param("monthStart") monthStart: LocalDateTime,
        @Param("monthEnd") monthEnd: LocalDateTime
    ): List<ProjectStatOverviewStatBo>

    @Select(
        """
            	select stage, count(1)  stageCount
		        from stat_project_stage
                where administrative_division is not null and  park is not null
		        group by stage
             """
    )
    fun stageOverView(): List<ProjectStatOverviewStatBo>

    @Select(
        value = [
            "<script>",
            "select administrative_division administrativeDivision, stage, count(1)  stageCount",
            "from stat_project_stage",
            "where administrative_division is not null and  park is not null",
            "<if test='monthStart != null '> and stage_create_time >= #{monthStart} </if>",
            "<if test='monthEnd != null '> and stage_create_time &lt; #{monthEnd} </if>",
            " group by administrative_division, stage",
            "order by administrative_division,stage",
            "</script>"
        ]
    )
    fun stageOverViewByTimeRangeGroupByDivision(
        @Param("monthStart") monthStart: LocalDateTime?,
        @Param("monthEnd") monthEnd: LocalDateTime?,
    ): List<ProjectStatOverviewStatBo>

    @Select(
        value = [
            "<script>",
            "select administrative_division administrativeDivision, park, stage, count(1) stageCount",
            "from stat_project_stage",
            "where administrative_division is not null and  park is not null",
            "<if test='monthStart != null '> and stage_create_time >= #{monthStart} </if>",
            "<if test='monthEnd != null '> and stage_create_time &lt;= #{monthEnd} </if>",
            "<if test='district != null and district != \"\"'>",
            "    and administrative_division = #{district}",
            "</if>",
            "group by administrative_division, park, stage",
            "order by administrativeDivision",
            "</script>"
        ]
    )
    fun stageOverViewByTimeRangeGroupByPark(
        @Param("monthStart") monthStart: LocalDateTime?,
        @Param("monthEnd") monthEnd: LocalDateTime?,
        @Param("district") district: String,
    ): List<ProjectStatOverviewStatBo>

    @Select(
        """
            <script>
            select administrative_division administrativeDivision, park, stage, count(1) stageCount
            from stat_project_stage
            where administrative_division is not null and  park is not null
            <if test='monthStart != null and monthEnd != null'>
                and stage_create_time between #{monthStart} and #{monthEnd}
            </if>
            group by administrative_division, park, stage
            order by administrativeDivision
            </script>
        """
    )
    fun stageOverViewByTimeRangeGroup(
        @Param("monthStart") monthStart: LocalDateTime?,
        @Param("monthEnd") monthEnd: LocalDateTime?,
    ): List<ProjectStatOverviewStatBo>

    @Select(
        """
            	select park from project_digital_investment_attracting where id=#{investmentId} limit 1
             """
    )
    fun queryParkUseInvestmentId(@Param("investmentId") investmentId: String): String?

    @Select(
        """
            	select district,park from project_digital_investment_attracting where id=#{investmentId} limit 1
             """
    )
    fun queryDistrictParkUseInvestmentId(@Param("investmentId") investmentId: String): InvestDistrictParkBO?


    @Select(
        """
            select id,name from system_area
             """
    )
    fun findAllAreaInfo(): List<AreaInfoBo>

    @Select(
        """
                select item_name itemName, count(1)  itemCount
                from  stat_project_item_cost_time
                where start_time >= #{startTime} AND start_time <= #{endTime}   and administrative_division is not null and   park is not null
                group by  item_name
            """
    )
    fun queryProjectItemInfo(
        @Param("startTime") startTime: LocalDateTime,
        @Param("endTime") endTime: LocalDateTime
    ): List<ProjectItemBo>

    @Select(
        """
            select administrative_division administrativeDivision ,item_name itemName,doc_status docStatus, count(1) itemCount, sum(spend_time) spendTime
            from  stat_project_item_cost_time
            where start_time >= #{startTime} AND start_time <= #{endTime} and administrative_division is not null and   park is not null
            group by  administrative_division,item_name,doc_status
            """
    )
    fun queryProjectIteamNameCostTimeByDateRange(
        @Param("startTime") startTime: LocalDateTime,
        @Param("endTime") endTime: LocalDateTime
    ): List<ProjectIteamNameCostTimeBo>

    @Select(
        value = [
            "<script>",
            "select administrative_division administrativeDivision, park, item_name itemName,doc_status docStatus, count(1) itemCount, sum(spend_time) spendTime",
            "from  stat_project_item_cost_time",
            " where start_time >= #{startTime} AND start_time  &lt;= #{endTime}",
            " and administrative_division is not null and   park is not null ",
            "<if test='district != null and district != \"\"'>",
            "    and administrative_division = #{district}",
            "</if>",
            "group by administrative_division,park,item_name,doc_status",
            "order by administrativeDivision",
            "</script>"
        ]
    )
    fun queryParkItemNameCostTimeByDateRange(
        @Param("startTime") startTime: LocalDateTime,
        @Param("endTime") endTime: LocalDateTime,
        @Param("district") district: String?,
    ): List<ProjectIteamNameCostTimeBo>
}
