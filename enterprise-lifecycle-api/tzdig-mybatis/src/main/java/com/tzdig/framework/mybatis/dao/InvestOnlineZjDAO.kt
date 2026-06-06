package com.tzdig.framework.mybatis.dao

import com.tzdig.framework.mybatis.bo.InvestOnlineBO
import com.tzdig.framework.mybatis.bo.ResultBO
import com.tzdig.framework.mybatis.bo.TotalBO
import com.tzdig.framework.mybatis.bo.TotalMoneyBO
import com.tzdig.framework.mybatis.entity.view.QyxmCyflTjxx111
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface InvestOnlineZjDAO {
    @Select(
        """
    select
    case when dept_code like '001001%' then '靖江市'
         when dept_code like '001002%' then '泰兴市'
         when dept_code like '001003%' then '兴化市'
         when dept_code like '001004%' then '海陵区'
         when dept_code like '001006%' then '姜堰区'
         when dept_code like '001007%' then '医药高新区（高港区）'
         else '其他'
        end as name,
    sum(xmzsl) as total,
    ROUND(sum(xmzsl)/(select sum(xmzsl)from qyxm_zj_tjxx_view where year = #{year})*100,2) as zb,
    sum(xmzje) as total_money,
    ROUND(sum(xmzje)/(select sum(xmzje)from qyxm_zj_tjxx_view where year = #{year})*100,2)as zb_money
    from qyxm_zj_tjxx_view
    where year = #{year}
    group by name
    ORDER BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;
    """
    )
    fun getQyxmZjTotal(@Param("year") year: Int): List<TotalBO>

    @Select(
        """<script>
    select
    dept_name as name,
    sum(xmzsl) as total,
    ROUND(sum(xmzsl)/(select sum(xmzsl)from qyxm_zj_tjxx_view where year = #{year} and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>)*100,2) as zb,
    sum(xmzje) as total_money,
    ROUND(sum(xmzje)/(select sum(xmzje)from qyxm_zj_tjxx_view where year = #{year} and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>)*100,2)as zb_money
    from qyxm_zj_tjxx_view
    where year = #{year}
    and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    group by name
    </script>"""
    )
    fun getQyxmAreaTotal(@Param("year") year: Int, @Param("deptCode") deptCode: List<String>): List<TotalBO>

    @Select(
        """
        select 
        case when dept_code like '001001%' then '靖江市'
            when dept_code like '001002%' then '泰兴市'
            when dept_code like '001003%' then '兴化市'
            when dept_code like '001004%' then '海陵区'
            when dept_code like '001006%' then '姜堰区'
            when dept_code like '001007%' then '医药高新区（高港区）'
            else '其他'
        end as name, 
        sum(nzzje) as total,
        sum(nzje2) as yyys,
        sum(nzje3) as wyys,
        sum(nzje4) as syys
        from qyxm_zj_tjxx_view
        where year = #{year}
        group by name
        ORDER BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;
        """
    )
    fun getQyxmZjNz(@Param("year") year: Int): List<InvestOnlineBO>

    @Select(
        """<script>
        select 
        dept_name as name, 
        sum(nzzje) as total,
        sum(nzje2) as yyys,
        sum(nzje3) as wyys,
        sum(nzje4) as syys
        from qyxm_zj_tjxx_view
        where year = #{year}
        and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
        group by name
        </script>"""
    )
    fun getQyxmAreaNz(@Param("year") year: Int, @Param("deptCode") deptCode: List<String>): List<InvestOnlineBO>

    @Select(
        """
        select 
        case when dept_code like '001001%' then '靖江市'
            when dept_code like '001002%' then '泰兴市'
            when dept_code like '001003%' then '兴化市'
            when dept_code like '001004%' then '海陵区'
            when dept_code like '001006%' then '姜堰区'
            when dept_code like '001007%' then '医药高新区（高港区）'
            else '其他'
        end as name, 
        sum(wzzje)/10000 as total,
        sum(wzje2) as yyys,
        sum(wzje3) as wyys,
        sum(wzje4) as syys
        from qyxm_zj_tjxx_view
        where year = #{year}
        group by name
        ORDER BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;
        """
    )
    fun getQyxmZjWz(@Param("year") year: Int): List<InvestOnlineBO>

    @Select(
        """<script>
        select 
        dept_name as name, 
        sum(wzzje)/10000 as total,
        sum(wzje2) as yyys,
        sum(wzje3) as wyys,
        sum(wzje4) as syys
        from qyxm_zj_tjxx_view
        where year = #{year}
        and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
        group by name
        </script>
        """
    )
    fun getQyxmAreaWz(@Param("year") year: Int, @Param("deptCode") deptCode: List<String>): List<InvestOnlineBO>

    @Select(
        """
    select
    case when dept_code like '001001%' then '靖江市'
         when dept_code like '001002%' then '泰兴市'
         when dept_code like '001003%' then '兴化市'
         when dept_code like '001004%' then '海陵区'
         when dept_code like '001006%' then '姜堰区'
         when dept_code like '001007%' then '医药高新区（高港区）'
         else '其他'
        end as name,
    sum(xmzsl) as total,
    ROUND(sum(xmzsl)/(select sum(xmzsl)from ztxm_zj_tjxx where year = #{year})*100,2) as zb,
    sum(xmzje) as total_money,
    ROUND(sum(xmzje)/(select sum(xmzje)from ztxm_zj_tjxx where year = #{year})*100,2) as zb_money
    from ztxm_zj_tjxx
    where year = #{year}
    group by name
    ORDER BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;
    """
    )
    fun getZtxmZjTotal(@Param("year") year: Int): List<TotalBO>

    @Select(
        """<script>
    select
    dept_name as name,
    sum(xmzsl) as total,
    ROUND(sum(xmzsl)/(select sum(xmzsl)from ztxm_zj_tjxx where year = #{year} and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>)*100,2) as zb,
    sum(xmzje) as total_money,
    ROUND(sum(xmzje)/(select sum(xmzje) from ztxm_zj_tjxx where year = #{year} and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>)*100,2)as zb_money
    from ztxm_zj_tjxx
    where year = #{year}
    and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    group by name
    </script>"""
    )
    fun getZtxmAreaTotal(@Param("year") year: Int, @Param("deptCode") deptCode: List<String>): List<TotalBO>

    @Select(
        """
        select 
        case when dept_code like '001001%' then '靖江市'
            when dept_code like '001002%' then '泰兴市'
            when dept_code like '001003%' then '兴化市'
            when dept_code like '001004%' then '海陵区'
            when dept_code like '001006%' then '姜堰区'
            when dept_code like '001007%' then '医药高新区（高港区）'
            else '其他'
        end as name, 
        sum(nzzje) as total,
        sum(nzje2) as yyys,
        sum(nzje3) as wyys,
        sum(nzje4) as syys
        from ztxm_zj_tjxx
        where year = #{year}
        group by name
        ORDER BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;
        """
    )
    fun getZtxmZjNz(@Param("year") year: Int): List<InvestOnlineBO>

    @Select(
        """<script>
        select 
        dept_name as name, 
        sum(nzzje) as total,
        sum(nzje2) as yyys,
        sum(nzje3) as wyys,
        sum(nzje4) as syys
        from ztxm_zj_tjxx
        where year = #{year}
        and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
        group by name
        </script>"""
    )
    fun getZtxmAreaNz(@Param("year") year: Int, @Param("deptCode") deptCode: List<String>): List<InvestOnlineBO>


    @Select(
        """
        select 
        case when dept_code like '001001%' then '靖江市'
            when dept_code like '001002%' then '泰兴市'
            when dept_code like '001003%' then '兴化市'
            when dept_code like '001004%' then '海陵区'
            when dept_code like '001006%' then '姜堰区'
            when dept_code like '001007%' then '医药高新区（高港区）'
            else '其他'
        end as name, 
        sum(wzzje)/10000 as total,
        sum(wzje2) as yyys,
        sum(wzje3) as wyys,
        sum(wzje4) as syys
        from ztxm_zj_tjxx
        where year = #{year}
        group by name
        order BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;
        """
    )
    fun getZtxmZjWz(@Param("year") year: Int): List<InvestOnlineBO>

    @Select(
        """<script>
        select 
        dept_name as name, 
        sum(wzzje)/10000 as total,
        sum(wzje2) as yyys,
        sum(wzje3) as wyys,
        sum(wzje4) as syys
        from ztxm_zj_tjxx
        where year = #{year}
        and dept_code in 
     <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
        group by name
        </script>
        """
    )
    fun getZtxmAreaWz(@Param("year") year: Int, @Param("deptCode") deptCode: List<String>): List<InvestOnlineBO>

    @Select(
        """
    select 
    month as month,
    sum(xmzje) as projectCount,
    sum(xmzsl) as projectTotal,
    round((sum(xmzje)-sum(qnxmzje))/sum(qnxmzje), 2) as projectTotalTrend,
    round((sum(xmzsl)-sum(qnxmzsl))/sum(qnxmzsl), 2)  as projectCountTrend
    from qyxm_ydqs_tjxx
    where year = #{year}
    and month = #{month};
    """
    )
    fun getQyxmYdqs(@Param("year") year: Int, @Param("month") month: Int): ResultBO

    @Select(
        """<script>
        select 
        month as month,
        sum(xmzje) as projectCount,
        sum(xmzsl) as projectTotal,
        round((sum(xmzje)-sum(qnxmzje))/sum(qnxmzje)*100, 2) as projectTotalTrend,
        round((sum(xmzsl)-sum(qnxmzsl))/sum(qnxmzsl)*100, 2)  as projectCountTrend
        from qyxm_ydqs_tjxx
        where year = #{year}
        and month = #{month}
        and dept_code in
        <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </script>"""
    )
    fun getQyxmYdqsArea(
        @Param("year") year: Int,
        @Param("month") month: Int,
        @Param("deptCode") deptCode: List<String>,
    ): ResultBO

    @Select(
        """
    select 
    month as month,
    sum(xmzje) as projectCount,
    sum(xmzsl) as projectTotal,
    round((sum(xmzje)-sum(qnxmzje))/sum(qnxmzje), 2) as projectTotalTrend,
    round((sum(xmzsl)-sum(qnxmzsl))/sum(qnxmzsl), 2)  as projectCountTrend
    from ztxm_ydqs_tjxx
    where year = #{year}
    and month = #{month};
    """
    )
    fun getZtxmYdqs(
        @Param("year") year: Int,
        @Param("month") month: Int,
    ): ResultBO

    @Select(
        """<script>
        select 
        month as month,
        sum(xmzje) as projectCount,
        sum(xmzsl) as projectTotal,
        round((sum(xmzje)-sum(qnxmzje))/sum(qnxmzje)*100, 2) as projectTotalTrend,
        round((sum(xmzsl)-sum(qnxmzsl))/sum(qnxmzsl)*100, 2) as projectCountTrend
        from ztxm_ydqs_tjxx
        where year = #{year}
        and month = #{month}
        and dept_code in
        <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </script>"""
    )
    fun getZtxmYdqsArea(
        @Param("year") year: Int,
        @Param("month") month: Int,
        @Param("deptCode") deptCode: List<String>,
    ): ResultBO

    @Select(
        """
    select
    case when dept_code like '001001%' then '靖江市'
         when dept_code like '001002%' then '泰兴市'
         when dept_code like '001003%' then '兴化市'
         when dept_code like '001004%' then '海陵区'
         when dept_code like '001006%' then '姜堰区'
         when dept_code like '001007%' then '医药高新区（高港区）'
         else '其他'
        end as name,
        year as year,
    sum(xmzsl) as total,
    sum(xmzje) as total_money
    from ztxm_ydqs_tjxx
    where year = #{year}
    and month = #{month}
    group by name
    ORDER BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;"""
    )
    fun getZtxmZjTotalByYear(
        @Param("year") year: Int,
        @Param("month") month: Int,
    ): List<TotalMoneyBO>

    @Select(
        """<script>
    select
    dept_name as name,
        year as year,
    xmzsl as total,
    xmzje as total_money
    from ztxm_ydqs_tjxx
    where year = #{year}
    and month = #{month}
    and dept_code in
        <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    order by total desc
    </script>
    """
    )
    fun getZtxmZjAreaTotalByYear(
        @Param("year") year: Int,
        @Param("month") month: Int,
        @Param("deptCode") deptCode: List<String>,
    ): List<TotalMoneyBO>

    @Select(
        """
    select
    case when dept_code like '001001%' then '靖江市'
         when dept_code like '001002%' then '泰兴市'
         when dept_code like '001003%' then '兴化市'
         when dept_code like '001004%' then '海陵区'
         when dept_code like '001006%' then '姜堰区'
         when dept_code like '001007%' then '医药高新区（高港区）'
         else '其他'
        end as name,
    year as year,
    sum(xmzsl) as total,
    sum(xmzje) as total_money
    from qyxm_ydqs_tjxx
    where year = #{year}
    and month = #{month}
    group by name
    ORDER BY CASE
             WHEN name = '靖江市' THEN 1
             WHEN name = '泰兴市' THEN 2
             WHEN name = '兴化市' THEN 3
             WHEN name = '海陵区' THEN 4
             WHEN name = '姜堰区' THEN 5
             WHEN name = '新高区' THEN 6
             WHEN name = '医药高新区（高港区）' THEN 6
             ELSE 7
             END;"""
    )
    fun getQyxmZjTotalByYear(
        @Param("year") year: Int,
        @Param("month") month: Int,
    ): List<TotalMoneyBO>


    @Select(
        """ <script>
    select
    dept_name as name,
    year as year,
    xmzsl as total,
    xmzje as total_money
    from qyxm_ydqs_tjxx
    where year = #{year}
    and month = #{month}
    and dept_code in
        <foreach collection='deptCode' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    order by total desc
    </script>
    """
    )
    fun getQyxmZjAreaTotalByYear(
        @Param("year") year: Int,
        @Param("month") month: Int,
        @Param("deptCode") deptCode: List<String>,
    ): List<TotalMoneyBO>

    @Select(
        """
    select year, cybm, cymc, xmsl, xmje, ROUND(slzb*100,2) as slzb
    from qyxm_cyfl_tjxx111
    where year = #{year}
    """
    )
    fun getQyxmYdqsByYear(@Param("year") year: Int): List<QyxmCyflTjxx111>
}
