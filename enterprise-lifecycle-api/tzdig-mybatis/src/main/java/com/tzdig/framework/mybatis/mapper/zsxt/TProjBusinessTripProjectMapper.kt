@file:Suppress("unused")

package com.tzdig.framework.mybatis.mapper.zsxt

import com.tzdig.framework.mybatis.base.BaseMapper
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTripProject
import org.apache.ibatis.annotations.Delete
import org.apache.ibatis.annotations.Param

interface TProjBusinessTripProjectMapper : BaseMapper<TProjBusinessTripProject> {

    @Delete(
        """
        delete from t_proj_business_trip_project
        where trip_id = #{tripId}
          and proj_signed_id = #{projSignedId}
        """
    )
    fun deleteByTripIdAndProjSignedId(
        @Param("tripId") tripId: Long,
        @Param("projSignedId") projSignedId: Long
    ): Int
}
