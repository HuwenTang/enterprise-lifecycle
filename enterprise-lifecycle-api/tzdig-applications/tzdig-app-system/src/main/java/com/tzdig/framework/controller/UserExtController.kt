package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryListByIds
import com.mybatisflex.kotlin.extensions.db.update
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.notIn
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.vo.AreaVO
import com.tzdig.framework.model.vo.MyOrganizationVO
import com.tzdig.framework.model.vo.UserAreaGrantsVO
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.entity.system.UserAreaGrants
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.entity.system.UserXOrganization
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.util.DataGrantsUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*


@Tag(name = "用户授权信息")
@RestController
@RequestMapping("user")
class UserExtController(
    private val dataGrantsUtils: DataGrantsUtils,
) {
    @Operation(summary = "查询是否市区授权")
    @GetMapping("grants/area")
    fun getIsCity(): SimpleValueDTO<Boolean> {
        val list = filter<UserAreaGrants> { UserAreaGrants::userid eq userAccount.id }
        if (list.isEmpty()) {
            return SimpleValueDTO(false)
        }
        val areas = queryListByIds<SystemArea>(list.map { it.areaId!! }).map { it.level }
        return SimpleValueDTO(areas.contains(2) || areas.contains(3))
    }

    @Operation(summary = "查询所属单位")
    @GetMapping("my-organization")
    fun getMyOrganization(): List<MyOrganizationVO> {
        val baseOrgList = filter<UserXOrganization> { UserXOrganization::userid eq userAccount.id }
            .map { it.organizationId!! }
        if (baseOrgList.isEmpty()) return emptyList()
        val organizations = filter<UserOrganization> { UserOrganization::id inList baseOrgList }
            .map(::MyOrganizationVO)
        if (organizations.isEmpty()) return emptyList()
        val cobList = filter<UserOrganization> { UserOrganization::id inList organizations.map { it.cobId } }
            .associateBy { it.id }
        organizations.forEach {
            it.cobName = cobList[it.cobId]?.name
            it.sort = cobList[it.cobId]?.sort to it.sort.second
        }
        return organizations.sortedWith(compareBy({ it.sort.first ?: Int.MAX_VALUE }, { it.sort.second }))
    }

    @Operation(summary = "查询数据授权激活记录")
    @GetMapping("area-grants")
    fun getActiveAreaGrants(
        @Schema(description = "区划级别")
        @RequestParam(defaultValue = "") level: Collection<Short>,
    ): UserAreaGrantsVO {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) return UserAreaGrantsVO()
        val areas = query<SystemArea> {
            where(SystemArea::id inList grantedAreas)
            if (level.isNotEmpty()) and(SystemArea::level inList level)
            orderBy(SystemArea::level).asc()
        }
        val data4cascader = areas.mapNotNull { area ->
            when (area.level?.toInt()) {
                2 -> listOf(area.id!!)
                3 -> listOf(area.parentCode!!, area.id!!)
                4 -> listOf(AreaConstant.TAIZHOU_CODE, area.parentCode!!, area.id!!)
                else -> null
            }
        }
        return UserAreaGrantsVO(
            areas = areas.map(::AreaVO),
            data4cascader = data4cascader,
        )
    }

    @Operation(summary = "修改数据授权激活记录")
    @PutMapping("area-grants")
    fun updateActiveAreaGrants(
        @Schema(description = "区划ID")
        @RequestBody areaIdList: Collection<String>,
    ) {
        val userid = userAccount.id
        if (!areaIdList.isEmpty()) {
            update<UserAreaGrants> {
                UserAreaGrants::active.set(true)
                where(UserAreaGrants::userid eq userid)
                and(UserAreaGrants::areaId inList areaIdList)
            }
            update<UserAreaGrants> {
                UserAreaGrants::active.set(false)
                where(UserAreaGrants::userid eq userid)
                and(UserAreaGrants::areaId notIn areaIdList)
            }
        } else {
            update<UserAreaGrants> {
                UserAreaGrants::active.set(false)
                where(UserAreaGrants::userid eq userid)
            }
        }
        dataGrantsUtils.flushCache(userid!!)
    }
}
