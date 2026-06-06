@file:Suppress("unused")

package com.tzdig.framework.mybatis.mapper.zsxt

import com.tzdig.framework.mybatis.base.BaseMapper
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned
import org.apache.ibatis.annotations.Select

interface TProjProjectSignedMapper : BaseMapper<TProjProjectSigned> {

    @Select("select max(substr(code, 7)) from t_proj_project_signed")
    fun findMaxNum(s: String): Int? = 0
    @Select("SELECT a.zs_dept FROM `system_area` a join user_area_grants b on a.id = b.area_id where userid = #{id} and length(a.zs_dept) < 12 and b.active = 1 order by a.zs_dept")
    fun getZoneCodesByUserId(id: String): MutableList<String>
    @Select("SELECT a.zs_dept FROM `system_area` a join user_area_grants b on a.id = b.area_id where userid = #{id} and length(a.zs_dept) = 12 and b.active = 1 order by a.zs_dept")
    fun getTownCodesByUserId(id: String): MutableList<String>
}
