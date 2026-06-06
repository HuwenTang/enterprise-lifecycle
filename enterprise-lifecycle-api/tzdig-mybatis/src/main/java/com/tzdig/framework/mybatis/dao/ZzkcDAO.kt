package com.tzdig.framework.mybatis.dao

import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import java.time.LocalDate


@Mapper
interface ZzkcDAO {

    @Select(
        """
            select count(0)
            from project_non_investment_confirmation 
            where application_time between #{start} and #{end} and city_district = #{district}
            and investment_amount >= 500
            and investment_type = #{type}
            and rk_stat = 1
            and deleted = 0
            ;
        """
    )
    fun count1(
        @Param("start") start: LocalDate,
        @Param("end") end: LocalDate,
        @Param("district") district: String,
        @Param("type") type: String
    ): Long

    @Select(
        """<script>
            select count(0)
            from project_non_investment_confirmation
            where not deleted
            and
            <foreach collection='yearMonthStr' item='item' separator='or' open='(' close=')'>
                project_code like concat(#{item},'-%')
            </foreach>
            and city_district = #{district}
            and investment_amount >= 500
            and investment_type = #{type}
            and rk_stat = 1
        </script>"""
    )
    fun count3(
        @Param("yearMonthStr") yearMonthStr: List<String>,
        @Param("district") district: String,
        @Param("type") type: String
    ): Long

    @Select(
        """
            select count(0)
from project_digital_investment_attracting 
join project_investment_x_online_approval on project_digital_investment_attracting.id = project_investment_x_online_approval.investment_id
join project_online_approval on project_investment_x_online_approval.online_approval_id = project_online_approval.id
where project_online_approval.application_time between #{start} and #{end} and district = #{district}
and source != '增资扩产'
and is_zzkc
 and investment_amount >= 0.05
 and project_digital_investment_attracting.deleted = 0;
        """
    )
    fun count2(
        @Param("start") start: LocalDate,
        @Param("end") end: LocalDate,
        @Param("district") district: String
    ): Long

    @Select(
        """<script>
select count(0)
from project_digital_investment_attracting 
join project_investment_x_online_approval on project_digital_investment_attracting.id = project_investment_x_online_approval.investment_id
join project_online_approval on project_investment_x_online_approval.online_approval_id = project_online_approval.id
where not project_digital_investment_attracting.deleted
and 
<foreach collection='yearMonthStr' item='item' separator='or' open='(' close=')'>
    project_online_approval.project_code like concat(#{item},'-%')
</foreach>
and district = #{district}
and source != '增资扩产'
and is_zzkc
and investment_amount >= 0.05
and ((current_project_progress = 2 and check_status = 1) or current_project_progress > 2)
</script>"""
    )
    fun count4(
        @Param("yearMonthStr") yearMonthStr: List<String>,
        @Param("district") district: String
    ): Long
}
