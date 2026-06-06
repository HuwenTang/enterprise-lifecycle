package com.tzdig.framework.mybatis.dao

import com.tzdig.framework.mybatis.bo.CheckRankBO
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import java.sql.Timestamp

@Mapper
interface InternetSuperviseDAO {
    @Select(
        """<script>
    SELECT
        QYQSMZQ_ORGS.ORG_NAME as depart,
        COUNT(*) as checkTimes,
        ROUND(COUNT(*)/ (SELECT COUNT(*) FROM QYQSMZQ_DXJCJL WHERE FKSJ BETWEEN #{time1,jdbcType=TIMESTAMP} AND #{time2,jdbcType=TIMESTAMP}), 4)*100 as proportion
    FROM QYQSMZQ_DXJCJL
    join QYQSMZQ_ORGS
    on QYQSMZQ_DXJCJL.FQBM = QYQSMZQ_ORGS.ORG_ID
    WHERE QYQSMZQ_ORGS.ORG_ID IN
    <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    AND FKSJ BETWEEN #{time1,jdbcType=TIMESTAMP} AND #{time2,jdbcType=TIMESTAMP}
    GROUP BY depart
    ORDER BY checkTimes DESC
    limit 10
    </script>"""
    )
    fun getDeptRanking(
        @Param("time1") time1: Timestamp,
        @Param("time2") time2: Timestamp,
        @Param("deptCode") deptCode: List<String>,
    ): List<CheckRankBO>

    @Select(
        """<script>
    SELECT
        QYQSMZQ_DXJCJL.ZTMC as company,
        COUNT(*) as checkTimes,
        ROUND(COUNT(*)/ (SELECT COUNT(*) FROM QYQSMZQ_DXJCJL WHERE FKSJ BETWEEN #{time1,jdbcType=TIMESTAMP} AND #{time2,jdbcType=TIMESTAMP}), 4)*100 as proportion
    FROM QYQSMZQ_DXJCJL
    join QYQSMZQ_ORGS
    on QYQSMZQ_DXJCJL.FQBM = QYQSMZQ_ORGS.ORG_ID
    WHERE FKSJ BETWEEN #{time1,jdbcType=TIMESTAMP} AND #{time2,jdbcType=TIMESTAMP}
    AND QYQSMZQ_DXJCJL.ZTMC != '****'
    AND QYQSMZQ_ORGS.ORG_ID IN
    <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    GROUP BY company
    ORDER BY checkTimes DESC
    limit 10
    </script>"""
    )
    fun getCompanyRanking(
        @Param("time1") time1: Timestamp,
        @Param("time2") time2: Timestamp,
        @Param("deptCode") deptCode: List<String>,
    ): List<CheckRankBO>

    @Select(
        """
    SELECT
        QYQSMZQ_DXJCJL.ZTMC as company,
        COUNT(*) as checkTimes
    FROM QYQSMZQ_DXJCJL
    join QYQSMZQ_ORGS
    on QYQSMZQ_DXJCJL.FQBM = QYQSMZQ_ORGS.ORG_ID
    WHERE FKSJ BETWEEN #{time1,jdbcType=TIMESTAMP} AND #{time2,jdbcType=TIMESTAMP}
    AND QYQSMZQ_DXJCJL.ZTMC <> '****'
    AND QYQSMZQ_ORGS.ORG_NAME = #{depart}
    GROUP BY company
    ORDER BY checkTimes DESC
    limit 10
   """
    )
    fun getDeptCompanyRanking(
        @Param("time1") time1: Timestamp,
        @Param("time2") time2: Timestamp,
        @Param("depart") depart: String,
    ): List<CheckRankBO>

    @Select(
        """
    SELECT
        QYQSMZQ_ORGS.ORG_NAME as depart,
        COUNT(*) as checkTimes
    FROM QYQSMZQ_DXJCJL
    join QYQSMZQ_ORGS
    on QYQSMZQ_DXJCJL.FQBM = QYQSMZQ_ORGS.ORG_ID
    WHERE FKSJ BETWEEN #{time1,jdbcType=TIMESTAMP} AND #{time2,jdbcType=TIMESTAMP}
    AND QYQSMZQ_DXJCJL.ZTMC = #{company}
    GROUP BY depart
    ORDER BY checkTimes DESC
    limit 10"""
    )
    fun getCompanyDeptRanking(
        @Param("time1") time1: Timestamp,
        @Param("time2") time2: Timestamp,
        @Param("company") company: String,
    ): List<CheckRankBO>
}
