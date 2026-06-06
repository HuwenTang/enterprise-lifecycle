package com.tzdig.framework.mybatis.dao

import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface PreliminaryInvestmentPromotionDAO {
    @Select(
        """<script>
       select a.`name` as district,a.id as districtCode, 
        IFNULL(b.projNums,0) projNums,IFNULL(b.ztz,0) ztz,IFNULL(b.monthNum,0) monthNum,IFNULL(b.monthQyje,0) monthQyje,
        IFNULL(b.nzProjNum,0) nzProjNum,IFNULL(b.nzTz,0) nzTz,IFNULL(b.wzProjNum,0) wzProjNum,IFNULL(b.wzTz,0) wzTz,
        h.ndmbrws,if(h.ndmbrws=0,"-",ROUND((b.projNums/h.ndmbrws * 100),2)) as ndmbwcl  from 
        (SELECT id,name,zs_dept FROM `system_area` 
        where deleted = 0 and `level`=3 )a
        left join (SELECT district ,count(1) projNums, 
        round(sum(qyje),2) as ztz,
        SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} then 1 else 0 end) AS monthNum,
        round(SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} THEN CASE WHEN project_rating ='内资' THEN investment_amount ELSE investment_amount *7/10000 END ELSE 0 END),2) AS monthQyje,
        SUM(CASE WHEN project_rating ='内资' then 1 else 0 end) AS nzProjNum,
        round(SUM(CASE WHEN project_rating ='内资' THEN investment_amount ELSE 0 END),2) AS nzTz,
        SUM(CASE WHEN project_rating ='外资' then 1 else 0 end) AS wzProjNum,
        round(SUM(CASE WHEN project_rating ='外资' THEN investment_amount ELSE 0 END)/10000,2) AS wzTz
        FROM `project_digital_investment_attracting` 
        where deleted = 0  and  signing_time &gt;= #{currStartDate} and signing_time &lt;= #{currEndDate} 
        and district is not null  and current_project_progress is not null
       AND ( current_project_progress > 2 
				OR ( current_project_progress = 2 AND check_status = 1 ))
        <if test='rmb == 1'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 1000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 5'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 3000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 10'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 10000 AND project_rating = '外资')
            )
        </if>
        <if test='projectList.size >0'>
       AND project_code IN
    <foreach collection='projectList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </if>
        <if test='rmb1 != null '> and qyje &gt;= #{rmb1} </if>
        <if test='rmb2 != null '> and qyje &lt;= #{rmb2} </if>
         <if test='industry != null and industry != ""'> and project_type = #{industry} </if>
         <if test='isKcProj != null and isKcProj != ""'> and is_kc_proj = #{isKcProj} </if>
        GROUP BY district)b on a.id = b.district
        LEFT JOIN (
        SELECT district_code,
        case when #{rmb}=1 then sum(one_count)
        when #{rmb} =5 then sum(five_count)
        when #{rmb} =10 then sum(ten_count)
        else 0 end as ndmbrws,
        sum(five_count) fiveCount
        from t_proj_task
        where b_year = #{year} and sfqx=1
        GROUP BY district_code
        ) h on h.district_code = a.zs_dept
        order by a.zs_dept
        </script>"""
    )
    fun getStatisticsSignedProjectInfo(
        @Param("rmb") rmb: Int?,
        @Param("rmb1") rmb1: Double?,
        @Param("rmb2") rmb2: Double?,
        @Param("currStartDate") currStartDate: String?,
        @Param("currEndDate") currEndDate: String?,
        @Param("currDate") currDate: String?,
        @Param("year") year: String?,
        @Param("investor") investor: String?,
        @Param("investorType") investorType: String?,
        @Param("investorPlace") investorPlace: String?,
        @Param("isListed") isListed: String?,
        @Param("industry") industry: String?,
        @Param("isKcProj") isKcProj: String?,
        @Param("projectList") projectList: List<String>,
    ): List<Map<String, Any>>


    @Select(
        """<script>
       select a.`name` as district,a.id as districtCode, 
        IFNULL(b.projNums,0) projNums,IFNULL(b.ztz,0) ztz,IFNULL(b.monthNum,0) monthNum,IFNULL(b.monthQyje,0) monthQyje,
        IFNULL(b.nzProjNum,0) nzProjNum,IFNULL(b.nzTz,0) nzTz,IFNULL(b.wzProjNum,0) wzProjNum,IFNULL(b.wzTz,0) wzTz,
        h.ndmbrws,if(h.ndmbrws=0,"-",ROUND((b.projNums/h.ndmbrws * 100),2)) as ndmbwcl  from 
        (SELECT id,name,zs_dept FROM `system_area` 
        where deleted = 0 and parent_code = #{zoneCode} and zs_dept is not null 
        ORDER BY id )a
        left join (SELECT park ,count(1) projNums, 
        round(sum(qyje),2) as ztz,
        SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} then 1 else 0 end) AS monthNum,
        round(SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} THEN CASE WHEN project_rating ='内资' THEN investment_amount ELSE investment_amount *7/10000 END ELSE 0 END),2) AS monthQyje,
        SUM(CASE WHEN project_rating ='内资' then 1 else 0 end) AS nzProjNum,
        round(SUM(CASE WHEN project_rating ='内资' THEN investment_amount ELSE 0 END),2) AS nzTz,
        SUM(CASE WHEN project_rating ='外资' then 1 else 0 end) AS wzProjNum,
        round(SUM(CASE WHEN project_rating ='外资' THEN investment_amount ELSE 0 END)/10000,2) AS wzTz
        FROM `project_digital_investment_attracting` 
        where deleted = 0  and  signing_time &gt;= #{currStartDate} and signing_time &lt;= #{currEndDate} 
        and district is not null  and current_project_progress is not null
        AND ( current_project_progress > 2 
				OR ( current_project_progress = 2 AND check_status = 1 ))
        <if test='rmb == 1'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 1000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 5'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 3000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 10'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 10000 AND project_rating = '外资')
            )
        </if>
        <if test='projectList.size >0'>
       AND project_code IN
    <foreach collection='projectList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </if>
        <if test='rmb1 != null '> and qyje &gt;= #{rmb1} </if>
        <if test='rmb2 != null '> and qyje &lt;= #{rmb2} </if>
         <if test='industry != null and industry != ""'> and project_type = #{industry} </if>
         <if test='isKcProj != null and isKcProj != ""'> and is_kc_proj = #{isKcProj} </if>
        GROUP BY park)b on a.id = b.park
        LEFT JOIN (
        SELECT zone_code,
        case when #{rmb}=1 then sum(one_count)
        when #{rmb} =5 then sum(five_count)
        when #{rmb} =10 then sum(ten_count)
        else 0 end as ndmbrws,
        sum(five_count) fiveCount
        from t_proj_task
        where b_year = #{year} and sfqx=2
        GROUP BY zone_code
        ) h on h.zone_code = a.zs_dept
        order by a.zs_dept
        </script>"""
    )
    fun getStatisticsSignedProjectZoneInfo(
        @Param("rmb") rmb: Int?,
        @Param("rmb1") rmb1: Double?,
        @Param("rmb2") rmb2: Double?,
        @Param("currStartDate") currStartDate: String?,
        @Param("currEndDate") currEndDate: String?,
        @Param("currDate") currDate: String?,
        @Param("year") year: String?,
        @Param("zoneCode") zoneCode: String?,
        @Param("investor") investor: String?,
        @Param("investorType") investorType: String?,
        @Param("investorPlace") investorPlace: String?,
        @Param("isListed") isListed: String?,
        @Param("industry") industry: String?,
        @Param("isKcProj") isKcProj: String?,
        @Param("projectList") projectList: List<String>,
    ): List<Map<String, Any>>


    @Select(
        """<script>
       select a.`name` as district,a.id as districtCode, 
        IFNULL(b.projNums,0) projNums,IFNULL(b.ztz,0) ztz,
        IFNULL(b.zcProjNum,0) zcProjNum,IFNULL(b.zcTz,0) zcTz,IFNULL(b.baProjNum,0) baProjNum,IFNULL(b.baTz,0) baTz 
        from 
        (SELECT id,name,zs_dept FROM `system_area` 
        where deleted = 0 and `level`=3 )a
        left join (SELECT district ,count(1) projNums, 
        round(sum(qyje),2) as ztz,
        SUM(CASE WHEN r_progress in ('0','1','5','4') and (current_project_progress = '3' or current_project_progress = '4' or current_project_progress = '5' or (current_project_progress = '2' and check_status = 1)) then 1  else 0 end) AS zcProjNum,
        round(SUM(CASE WHEN r_progress in ('0','1','5','4') and (current_project_progress = '3' or current_project_progress = '4' or current_project_progress = '5' or (current_project_progress = '2' and check_status = 1)) THEN qyje ELSE 0 END),2) AS zcTz,
        SUM(CASE WHEN r_progress in ('2','3') then 1 else 0 end) AS baProjNum,
        round(SUM(CASE WHEN r_progress in ('2','3') THEN qyje ELSE 0 END),2) AS baTz
        FROM `project_digital_investment_attracting` 
        where deleted = 0  and  signing_time &gt;= #{currStartDate} and signing_time &lt;= #{currEndDate} 
        and district is not null  and current_project_progress is not null
        AND ( current_project_progress > 2 
				OR ( current_project_progress = 2 AND check_status = 1 ))
        <if test='rmb == 1'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 1000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 5'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 3000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 10'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 10000 AND project_rating = '外资')
            )
        </if>
        <if test='projectList.size >0'>
       AND project_code IN
    <foreach collection='projectList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </if>
        <if test='rmb1 != null '> and qyje &gt;= #{rmb1} </if>
        <if test='rmb2 != null '> and qyje &lt;= #{rmb2} </if>
         <if test='industry != null and industry != ""'> and project_type = #{industry} </if>
         <if test='isKcProj != null and isKcProj != ""'> and is_kc_proj = #{isKcProj} </if>
        GROUP BY district)b on a.id = b.district
        order by a.zs_dept
        </script>"""
    )
    fun getStatisticsProjectStatusInfo(
        @Param("rmb") rmb: Int?,
        @Param("rmb1") rmb1: Double?,
        @Param("rmb2") rmb2: Double?,
        @Param("currStartDate") currStartDate: String?,
        @Param("currEndDate") currEndDate: String?,
        @Param("investor") investor: String?,
        @Param("investorType") investorType: String?,
        @Param("investorPlace") investorPlace: String?,
        @Param("isListed") isListed: String?,
        @Param("industry") industry: String?,
        @Param("isKcProj") isKcProj: String?,
        @Param("projectList") projectList: List<String>,
    ): List<Map<String, Any>>


    @Select(
        """<script>
       select a.`name` as district,a.id as districtCode, 
        IFNULL(b.projNums,0) projNums,IFNULL(b.ztz,0) ztz,
        IFNULL(b.zcProjNum,0) zcProjNum,IFNULL(b.zcTz,0) zcTz,IFNULL(b.baProjNum,0) baProjNum,IFNULL(b.baTz,0) baTz 
        from 
        (SELECT id,name,zs_dept FROM `system_area` 
        where deleted = 0 and parent_code = #{zoneCode} and zs_dept is not null 
        ORDER BY id )a
        left join (SELECT park ,count(1) projNums, 
        round(sum(qyje),2) as ztz,
        SUM(CASE WHEN r_progress ='1' then 1 else 0 end) AS zcProjNum,
        round(SUM(CASE WHEN r_progress ='1' THEN qyje ELSE 0 END),2) AS zcTz,
        SUM(CASE WHEN r_progress ='5' then 1 else 0 end) AS baProjNum,
        round(SUM(CASE WHEN r_progress ='5' THEN qyje ELSE 0 END),2) AS baTz
        FROM `project_digital_investment_attracting` 
        where deleted = 0  and  signing_time &gt;= #{currStartDate} and signing_time &lt;= #{currEndDate} 
        and district is not null  and current_project_progress is not null
        AND ( current_project_progress > 2 
				OR ( current_project_progress = 2 AND check_status = 1 ))
        <if test='rmb == 1'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 1000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 5'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 3000 AND project_rating = '外资')
            )
        </if>
        <if test='rmb == 10'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 10000 AND project_rating = '外资')
            )
        </if>
        <if test='projectList.size >0'>
       AND project_code IN
    <foreach collection='projectList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </if>
        <if test='rmb1 != null '> and qyje &gt;= #{rmb1} </if>
        <if test='rmb2 != null '> and qyje &lt;= #{rmb2} </if>
         <if test='industry != null and industry != ""'> and project_type = #{industry} </if>
         <if test='isKcProj != null and isKcProj != ""'> and is_kc_proj = #{isKcProj} </if>
        GROUP BY park)b on a.id = b.park
        order by a.zs_dept
        </script>"""
    )
    fun getStatisticsProjectStatusZoneInfo(
        @Param("rmb") rmb: Int?,
        @Param("rmb1") rmb1: Double?,
        @Param("rmb2") rmb2: Double?,
        @Param("currStartDate") currStartDate: String?,
        @Param("currEndDate") currEndDate: String?,
        @Param("zoneCode") zoneCode: String?,
        @Param("investor") investor: String?,
        @Param("investorType") investorType: String?,
        @Param("investorPlace") investorPlace: String?,
        @Param("isListed") isListed: String?,
        @Param("industry") industry: String?,
        @Param("isKcProj") isKcProj: String?,
        @Param("projectList") projectList: List<String>,
    ): List<Map<String, Any>>


    @Select(
        """<script>
       select m.name name,n.* from 
        (SELECT _name name, _code code,p_id pCode FROM t_proj_type where `level` = 2 and _status = 1)m
            left join 
            (select d.PCode code,
            SUM(projNums) AS total,
                        SUM(ztz) AS totalQyje,
             SUM(monthNum) AS monthNum,
                        SUM(monthQyje) AS monthQyje,
                        SUM(CASE WHEN district = '321282000000' THEN projNums ELSE 0 END) AS jjsNum,
                        SUM(CASE WHEN district = '321282000000' THEN ztz ELSE 0 END) AS jjsQyje,
                        SUM(CASE WHEN district = '321283000000' THEN projNums ELSE 0 END) AS txsNum,
                        SUM(CASE WHEN district = '321283000000' THEN ztz ELSE 0 END) AS txsQyje,
                        SUM(CASE WHEN district = '321281000000' THEN projNums ELSE 0 END) AS xhsNum,
                        SUM(CASE WHEN district = '321281000000' THEN ztz ELSE 0 END) AS xhsQyje,
                        SUM(CASE WHEN district = '321202000000' THEN projNums ELSE 0 END) AS hlqNum,
                        SUM(CASE WHEN district = '321202000000' THEN ztz ELSE 0 END) AS hlqQyje,
                        SUM(CASE WHEN district = '321204000000' THEN projNums ELSE 0 END) AS jyqNum,
                        SUM(CASE WHEN district = '321204000000' THEN ztz ELSE 0 END) AS jyqQyje,
                        SUM(CASE WHEN district = '321203000000' THEN projNums ELSE 0 END) AS yygxqNum,
                        SUM(CASE WHEN district = '321203000000' THEN ztz ELSE 0 END) AS yygxqQyje
                         from 
            (
            select a.`name`,a.code as code,a.pCode,b.district district,b.project_category,
            IFNULL(b.projNums,0) projNums,IFNULL(b.ztz,0) ztz,IFNULL(b.monthNum,0) monthNum,IFNULL(b.monthQyje,0) monthQyje
              from 
            (SELECT _name name, _code code,p_id pCode FROM t_proj_type where `level` = 3 and _status = 1)a 
            left join 
            (SELECT district,project_category,count(1) projNums, 
            round(sum(qyje),2) as ztz,
            SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} then 1 else 0 end) AS monthNum,
            round(SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} THEN CASE WHEN project_rating ='内资' THEN investment_amount ELSE investment_amount *7/10000 END ELSE 0 END),2) AS monthQyje
            FROM `project_digital_investment_attracting` 
            where deleted = 0  and  signing_time &gt;= #{currStartDate} and signing_time &lt;= #{currEndDate} 
            and district is not null  and current_project_progress is not null
             AND ( current_project_progress > 2 
				OR ( current_project_progress = 2 AND check_status = 1 ))
            <if test='rmb == 1'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 1000 AND project_rating = '外资')
            )
            </if>
            <if test='rmb == 5'>
                AND (
                    (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                    OR (investment_amount &gt;= 3000 AND project_rating = '外资')
                )
            </if>
            <if test='rmb == 10'>
                AND (
                    (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                    OR (investment_amount &gt;= 10000 AND project_rating = '外资')
                )
            </if>
            <if test='projectList.size >0'>
       AND project_code IN
    <foreach collection='projectList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </if>
            <if test='rmb1 != null '> and qyje &gt;= #{rmb1} </if>
            <if test='rmb2 != null '> and qyje &lt;= #{rmb2} </if>
            GROUP BY district,project_category)b on a.name = b.project_category
            left join 
            (SELECT id,name,zs_dept FROM `system_area` 
            where deleted = 0 and `level`=3 )c on c.id = b.district)d
            group by d.PCode)n on m.code = n.code 
            order by m.code 
        </script>"""
    )
    fun getCountSignedProjTypeByLevel2(
        @Param("rmb") rmb: Int?,
        @Param("rmb1") rmb1: Double?,
        @Param("rmb2") rmb2: Double?,
        @Param("currStartDate") currStartDate: String,
        @Param("currEndDate") currEndDate: String,
        @Param("currDate") currDate: String?,
        @Param("level") level: Int,
        @Param("code") code: String?,
        @Param("projectList") projectList: List<String>,
    ): List<Map<String, Any>>


    @Select(
        """<script>
       select d.name,d.code,
            SUM(projNums) AS total,
                        SUM(ztz) AS totalQyje,
             SUM(monthNum) AS monthNum,
                        SUM(monthQyje) AS monthQyje,
                        SUM(CASE WHEN district = '321282000000' THEN projNums ELSE 0 END) AS jjsNum,
                        SUM(CASE WHEN district = '321282000000' THEN ztz ELSE 0 END) AS jjsQyje,
                        SUM(CASE WHEN district = '321283000000' THEN projNums ELSE 0 END) AS txsNum,
                        SUM(CASE WHEN district = '321283000000' THEN ztz ELSE 0 END) AS txsQyje,
                        SUM(CASE WHEN district = '321281000000' THEN projNums ELSE 0 END) AS xhsNum,
                        SUM(CASE WHEN district = '321281000000' THEN ztz ELSE 0 END) AS xhsQyje,
                        SUM(CASE WHEN district = '321202000000' THEN projNums ELSE 0 END) AS hlqNum,
                        SUM(CASE WHEN district = '321202000000' THEN ztz ELSE 0 END) AS hlqQyje,
                        SUM(CASE WHEN district = '321204000000' THEN projNums ELSE 0 END) AS jyqNum,
                        SUM(CASE WHEN district = '321204000000' THEN ztz ELSE 0 END) AS jyqQyje,
                        SUM(CASE WHEN district = '321203000000' THEN projNums ELSE 0 END) AS yygxqNum,
                        SUM(CASE WHEN district = '321203000000' THEN ztz ELSE 0 END) AS yygxqQyje
                         from 
            (
            select a.`name`,a.code as code,b.district district,b.project_category,
            IFNULL(b.projNums,0) projNums,IFNULL(b.ztz,0) ztz,IFNULL(b.monthNum,0) monthNum,IFNULL(b.monthQyje,0) monthQyje
              from 
            (SELECT _name name, _code code FROM t_proj_type where `level` = 3 and _status = 1
            <if test='code != null and code != ""'> and p_id = #{code} </if>
            )a 
            left join 
            (SELECT district,project_category,count(1) projNums, 
            round(sum(qyje),2) as ztz,
            SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} then 1 else 0 end) AS monthNum,
            round(SUM(CASE WHEN signing_time &gt;= #{currDate} and signing_time &lt;= #{currEndDate} THEN CASE WHEN project_rating ='内资' THEN investment_amount ELSE investment_amount *7/10000 end ELSE 0 END),2) AS monthQyje
            FROM `project_digital_investment_attracting` 
            where deleted = 0  and  signing_time &gt;= #{currStartDate} and signing_time &lt;= #{currEndDate} 
            and district is not null  and current_project_progress is not null
             AND ( current_project_progress > 2 
				OR ( current_project_progress = 2 AND check_status = 1 ))
            <if test='rmb == 1'>
            AND (
                (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                OR (investment_amount &gt;= 1000 AND project_rating = '外资')
            )
            </if>
            <if test='rmb == 5'>
                AND (
                    (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                    OR (investment_amount &gt;= 3000 AND project_rating = '外资')
                )
            </if>
            <if test='rmb == 10'>
                AND (
                    (investment_amount &gt;= #{rmb} AND project_rating = '内资')
                    OR (investment_amount &gt;= 10000 AND project_rating = '外资')
                )
            </if>
            <if test='projectList.size >0'>
       AND project_code IN
    <foreach collection='projectList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </if>
            <if test='rmb1 != null '> and qyje &gt;= #{rmb1} </if>
            <if test='rmb2 != null '> and qyje &lt;= #{rmb2} </if>
            GROUP BY district,project_category)b on a.name = b.project_category
            left join 
            (SELECT id,name,zs_dept FROM `system_area` 
            where deleted = 0 and `level`=3 )c on c.id = b.district)d
            group by d.name,d.code
            order by d.code
        </script>"""
    )
    fun getCountSignedProjTypeByLevel3(
        @Param("rmb") rmb: Int?,
        @Param("rmb1") rmb1: Double?,
        @Param("rmb2") rmb2: Double?,
        @Param("currStartDate") currStartDate: String,
        @Param("currEndDate") currEndDate: String,
        @Param("currDate") currDate: String?,
        @Param("level") level: Int,
        @Param("code") code: String?,
        @Param("projectList") projectList: List<String>,
    ): List<Map<String, Any>>
}
