package com.tzdig.framework.mybatis.dao

import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import java.math.BigDecimal

@Mapper
interface ElectricInfoDAO {
    @Select(
        """
        select round(sum(${'$'}{name})/100000,2)
        from enterprise_economic_info
        where id in (select t1.id
                     from enterprise_info t1
                              join enterprise_tag_by_year t2 on t2.uscc = t1.id
                     where t1.district = #{division}
                     and t2.year = #{year}
                     and t2.quarter =  #{quarter}
                     and t2.tag = 'electric_info');"""
    )
    fun getRealRevenue(
        @Param("name") name: String,
        @Param("division") division: String,
        @Param("year") year: Int,
        @Param("quarter") quarter: Int
    ): BigDecimal?

    @Select(
        """
       select sum(${'$'}{name})
        from ${'$'}{year}
        where city_district = #{division};"""
    )
    fun getExpectRevenue(
        @Param("division") division: String,
        @Param("name") name: String,
        @Param("year") year: String
    ): BigDecimal?

    @Select(
        """
      select round(sum(${'$'}{name})/100000,2)
        from enterprise_economic_info
        where id in (select t1.id
                     from enterprise_info t1
                              join enterprise_tag_by_year t2 on t2.uscc = t1.id
                     and t2.year = #{year}
                     and t2.quarter =  #{quarter}
                     and t2.tag = 'electric_info');"""
    )
    fun getTotalOperatingIncome(
        @Param("name") name: String,
        @Param("year") year: Int,
        @Param("quarter") quarter: Int
    ): BigDecimal?
}
