package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.model.vo.CascadeVO
import com.tzdig.framework.model.vo.KVPairVO
import com.tzdig.framework.mybatis.entity.system.SystemArea
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@SaIgnore
@Tag(name = "行政区划管理")
@RestController
@RequestMapping("system-area")
class SystemAreaController {
    @Operation(summary = "行政区划树")
    @GetMapping("cascade")
    fun getSystemAreaTree(): CascadeVO<String> {
        val list = query<SystemArea> {
            orderBy(SystemArea::sort).asc()
        }.map { it.parentCode to CascadeVO(it.id!!, it.name!!) }
        list.groupBy { it.first }
            .forEach { (parentId, pairs) ->
                val pair = list.find { it.second.value == parentId } ?: return@forEach
                pair.second.children = pairs.map { it.second }
            }
        return list.find { it.second.value == AreaConstant.TAIZHOU_CODE }!!.second
    }

    @Operation(summary = "按级别查询行政区划")
    @GetMapping
    fun getSystemAreaListByLevel(
        @Schema(description = "行政区划级别")
        @RequestParam level: Short,
    ): List<KVPairVO<String>> {
        val list = query<SystemArea> {
            where(SystemArea::level eq level)
            orderBy(SystemArea::sort).asc()
        }
        return list.map { KVPairVO(it.id!!, it.name!!) }
    }

    @Operation(summary = "按父级查询行政区划")
    @GetMapping("{parentCode}/children")
    fun getSystemAreaListByParent(
        @Schema(description = "父级行政区划代码")
        @PathVariable parentCode: String,
    ): List<KVPairVO<String>> {
        val list = query<SystemArea> {
            where(SystemArea::parentCode eq parentCode)
            orderBy(SystemArea::sort).asc()
        }
        return list.map { KVPairVO(it.id!!, it.name!!) }
    }
}
