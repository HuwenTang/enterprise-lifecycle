package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.mybatisflex.kotlin.extensions.db.query
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.model.vo.CascadeVO
import com.tzdig.framework.mybatis.entity.system.SystemArea
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "行政区划管理")
@RestController
@RequestMapping("administrative-division")
class AdministrativeDivisionController {
    @SaIgnore
    @Operation(summary = "行政区划树")
    @GetMapping("cascade")
    fun getAdministrativeDivisionTree(): List<CascadeVO<String>> {
        val list = query<SystemArea> {
            orderBy(SystemArea::sort).asc()
        }.map { it.parentCode to CascadeVO(it.id!!, it.name!!) }
        list.groupBy { it.first }
            .forEach { (parentId, pairs) ->
                val pair = list.find { it.second.value == parentId } ?: return@forEach
                pair.second.children = pairs.map { it.second }
            }
        val root = list.find { it.second.value == AreaConstant.TAIZHOU_CODE }!!.second
        return listOf(root)
    }
}
