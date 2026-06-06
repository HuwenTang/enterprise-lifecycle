package com.tzdig.framework.mybatis.dao

import com.tzdig.framework.mybatis.bo.ProjectFagaiKeyProjectsStatsVO
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface FagaiStatDAO {
    @Select(
        """<script>
        SELECT district as city,
       park,
       innovative_clusters_8_13_x as industrialChainCluster,
       COUNT(0)                               AS projectCountTotal,
       COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
       COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
       SUM(actual_total_investment_all)      AS plannedInvestmentTotal,
       SUM(actual_total_investment_foreign)  AS plannedInvestmentForeign,
       SUM(actual_total_investment_domestic) AS plannedInvestmentDomestic,
       SUM(statistical_actual_total_investment)         AS inInvest,
       CASE
           WHEN SUM(planned_total_investment_all) > 0
               THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
           ELSE 0
           END                                AS ratio
        FROM project_fagai_key_projects
        WHERE project_type = 2
          <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
        <if test='date != null '> and completion_date = #{date} </if>
        <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
        GROUP BY district, park, innovative_clusters_8_13_x
        UNION ALL
        -- 市区合计
        SELECT district as city,
               '全部'                                 AS park,
               '全部'                                 AS industrialChainCluster,
               COUNT(0)                               AS projectCountTotal,
               COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
               COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
            SUM(actual_total_investment_all)      AS plannedInvestmentTotal,
               SUM(actual_total_investment_foreign)  AS plannedInvestmentForeign,
               SUM(actual_total_investment_domestic) AS plannedInvestmentDomestic,
        
               SUM(statistical_actual_total_investment)         AS inInvest,
               CASE
                   WHEN SUM(planned_total_investment_all) > 0
                       THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
                   ELSE 0
                   END                                AS ratio
        FROM project_fagai_key_projects
        WHERE project_type = 2
        <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
        <if test='date != null '> and completion_date = #{date} </if>
        <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
        GROUP BY district
        UNION ALL
        -- 园区合计（带市区前缀）
        SELECT district as city,
               park          AS park,
               '全部'                                 AS industrialChainCluster,
               COUNT(0)                               AS projectCountTotal,
               COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
               COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
              SUM(actual_total_investment_all)      AS plannedInvestmentTotal,
               SUM(actual_total_investment_foreign)  AS plannedInvestmentForeign,
               SUM(actual_total_investment_domestic) AS plannedInvestmentDomestic,
               SUM(statistical_actual_total_investment)         AS inInvest,
               CASE
                   WHEN SUM(planned_total_investment_all) > 0
                       THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
                   ELSE 0
                   END                                AS ratio
        FROM project_fagai_key_projects
        WHERE project_type = 2
        <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
        <if test='date != null '> and completion_date = #{date} </if>
        <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
        GROUP BY district, park -- 注意：这里保留了 district + park 分组
        UNION ALL
        -- 总计
        SELECT '泰州市'                               as city,
               '全部'                                 AS park,
               '全部'                                 AS industrialChainCluster,
               COUNT(0)                               AS projectCountTotal,
               COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
               COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
              SUM(actual_total_investment_all)      AS plannedInvestmentTotal,
               SUM(actual_total_investment_foreign)  AS plannedInvestmentForeign,
               SUM(actual_total_investment_domestic) AS plannedInvestmentDomestic,
        
               SUM(statistical_actual_total_investment)         AS inInvest,
               CASE
                   WHEN SUM(planned_total_investment_all) > 0
                       THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
                   ELSE 0
                   END                                AS ratio
        FROM project_fagai_key_projects
        WHERE project_type = 2
          <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
        <if test='date != null '> and completion_date = #{date} </if>
        <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
           ORDER BY
            -- 排序优先级：先正常明细，再市区合计，再园区合计，最后总计
            CASE
                WHEN city LIKE '靖江%' THEN 2
                WHEN city LIKE '泰兴%' THEN 3
                WHEN city LIKE '兴化%' THEN 4
                WHEN city LIKE '海陵%' THEN 5
                WHEN city LIKE '姜堰%' THEN 6
                WHEN city LIKE '高新%' OR city LIKE '新高%' THEN 7
                WHEN city = '泰州市' THEN 1
                ELSE 8
                END,
            case
                when park = '全部' then 1
                when park like '其他%' then 3
                else 2
                end ,
            park,
            case
                when industrialChainCluster = '全部' then 1
                when industrialChainCluster = '传统产业' then 3
                else 2
                end,
            industrialChainCluster
        </script>"""
    )
    fun getCompletionState(
        @Param("columnName") columnName: String?,
        @Param("date") date: String?,
        @Param("industry") industry: String?,
    ): List<ProjectFagaiKeyProjectsStatsVO>


    @Select(
        """<script>
        SELECT district as city,
       park,
       innovative_clusters_8_13_x as industrialChainCluster,
       COUNT(0)                               AS projectCountTotal,
       COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
       COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
       SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
       SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
       SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
       SUM(annual_planned_investment)         AS inInvest,
       CASE
           WHEN SUM(planned_total_investment_all) > 0
               THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
           ELSE 0
           END                                AS ratio

    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
    GROUP BY district, park, innovative_clusters_8_13_x
    UNION ALL
    -- 市区合计
    SELECT district as city,
           '全部'                                 AS park,
           '全部'                                 AS industrialChainCluster,
           COUNT(0)                               AS projectCountTotal,
           COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
           COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
           SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
           SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
           SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
           SUM(annual_planned_investment)         AS inInvest,
           CASE
               WHEN SUM(planned_total_investment_all) > 0
                   THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
               ELSE 0
               END                                AS ratio
    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
    GROUP BY district
    UNION ALL
    -- 园区合计（带市区前缀）
    SELECT district as city,
           park          AS park,
           '全部'                                 AS industrialChainCluster,
           COUNT(0)                               AS projectCountTotal,
           COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
           COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
           SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
           SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
           SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
           SUM(annual_planned_investment)         AS inInvest,
           CASE
               WHEN SUM(planned_total_investment_all) > 0
                   THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
               ELSE 0
               END                                AS ratio
    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
    GROUP BY district, park -- 注意：这里保留了 district + park 分组
    UNION ALL
    -- 总计
    SELECT '泰州市'                               as city,
           '全部'                                 AS park,
           '全部'                                 AS industrialChainCluster,
           COUNT(0)                               AS projectCountTotal,
           COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
           COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
           SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
           SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
           SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
           SUM(annual_planned_investment)         AS inInvest,
           CASE
               WHEN SUM(planned_total_investment_all) > 0
                   THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
               ELSE 0
               END                                AS ratio
    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
    ORDER BY
        -- 排序优先级：先正常明细，再市区合计，再园区合计，最后总计
        CASE
            WHEN city LIKE '靖江%' THEN 2
            WHEN city LIKE '泰兴%' THEN 3
            WHEN city LIKE '兴化%' THEN 4
            WHEN city LIKE '海陵%' THEN 5
            WHEN city LIKE '姜堰%' THEN 6
            WHEN city LIKE '高新%' OR city LIKE '新高%' THEN 7
            WHEN city = '泰州市' THEN 1
            ELSE 8
            END,
        case
            when park = '全部' then 1
            when park like '其他%' then 3
            else 2
            end ,
        park,
        case
            when industrialChainCluster = '全部' then 1
            when industrialChainCluster = '传统产业' then 3
            else 2
            end,
        industrialChainCluster
            </script>"""
    )
    fun getStartState(
        @Param("columnName") columnName: String?,
        @Param("date") date: String?,
        @Param("industry") industry: String?,
    ): List<ProjectFagaiKeyProjectsStatsVO>

    @Select(
        """<script>
            SELECT district as city,
           park,
           innovative_clusters_8_13_x as industrialChainCluster,
           COUNT(0)                               AS projectCountTotal,
           COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
           COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
           SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
           SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
           SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
           SUM(annual_planned_investment)         AS inInvest,
           CASE
               WHEN SUM(planned_total_investment_all) > 0
                   THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
               ELSE 0
               END                                AS ratio
    
    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
      And is_under_construction = 1
    GROUP BY district, park, innovative_clusters_8_13_x
    UNION ALL
    -- 市区合计
    SELECT district as city,
           '全部'                                 AS park,
           '全部'                                 AS industrialChainCluster,
           COUNT(0)                               AS projectCountTotal,
           COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
           COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
        SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
           SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
           SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
           SUM(annual_planned_investment)         AS inInvest,
           CASE
               WHEN SUM(planned_total_investment_all) > 0
                   THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
               ELSE 0
               END                                AS ratio
    
    
    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
      And is_under_construction = 1
    GROUP BY district
    UNION ALL
    -- 园区合计（带市区前缀）
    SELECT district as city,
           park          AS park,
           '全部'                                 AS industrialChainCluster,
           COUNT(0)                               AS projectCountTotal,
           COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
           COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
          SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
           SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
           SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
           SUM(annual_planned_investment)         AS inInvest,
           CASE
               WHEN SUM(planned_total_investment_all) > 0
                   THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
               ELSE 0
               END                                AS ratio
    
    
    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
      And is_under_construction = 1
    GROUP BY district, park -- 注意：这里保留了 district + park 分组
    UNION ALL
    -- 总计
    SELECT '泰州市'                               as city,
           '全部'                                 AS park,
           '全部'                                 AS industrialChainCluster,
           COUNT(0)                               AS projectCountTotal,
           COUNT(IF(is_out = 1, 1, NULL))         AS projectCountForeignInvestment,
           COUNT(IF(is_out = 0, 1, NULL))         AS projectCountDomesticInvestment,
          SUM(planned_total_investment_all)      AS plannedInvestmentTotal,
           SUM(planned_total_investment_foreign)  AS plannedInvestmentForeign,
           SUM(planned_total_investment_domestic) AS plannedInvestmentDomestic,
           SUM(annual_planned_investment)         AS inInvest,
           CASE
               WHEN SUM(planned_total_investment_all) > 0
                   THEN ROUND(SUM(actual_total_investment_all) / SUM(planned_total_investment_all), 2)
               ELSE 0
               END                                AS ratio
    FROM project_fagai_key_projects
    WHERE project_type = 1
      <if test='columnName != null '> and ${'$'}{columnName} = 1 </if>
      <if test='date != null '> and start_date = #{date} </if>
      <if test='industry != null '> and innovative_clusters_8_13_x =  #{industry} </if>
      And is_under_construction = 1
       ORDER BY
        -- 排序优先级：先正常明细，再市区合计，再园区合计，最后总计
        CASE
            WHEN city LIKE '靖江%' THEN 2
            WHEN city LIKE '泰兴%' THEN 3
            WHEN city LIKE '兴化%' THEN 4
            WHEN city LIKE '海陵%' THEN 5
            WHEN city LIKE '姜堰%' THEN 6
            WHEN city LIKE '高新%' OR city LIKE '新高%' THEN 7
            WHEN city = '泰州市' THEN 1
            ELSE 8
            END,
        case
            when park = '全部' then 1
            when park like '其他%' then 3
            else 2
            end ,
        park,
        case
            when industrialChainCluster = '全部' then 1
            when industrialChainCluster = '传统产业' then 3
            else 2
            end,
        industrialChainCluster
        </script>"""
    )
    fun getOnBuildingState(
        @Param("columnName") columnName: String?,
        @Param("date") date: String?,
        @Param("industry") industry: String?,
    ): List<ProjectFagaiKeyProjectsStatsVO>
}
