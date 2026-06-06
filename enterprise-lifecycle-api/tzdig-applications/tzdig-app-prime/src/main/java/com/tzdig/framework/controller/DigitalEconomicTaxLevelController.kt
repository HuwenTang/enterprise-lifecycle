package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.model.dto.DigitalEconomicTaxLevelDTO
import com.tzdig.framework.model.vo.DigitalEconomicTaxLevelVO
import com.tzdig.framework.mybatis.entity.prime.DigitalEconomicTaxLevel
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "数字经济开票销售分档管理")
@RestController
@RequestMapping("digital-economic-tax-level")
class DigitalEconomicTaxLevelController {
    @Operation(summary = "查询数字经济开票销售分档列表")
    //@SaCheckPermission("digital-economic-tax-level::query")
    @GetMapping
    @PageableQuery
    fun listDigitalEconomicTaxLevel(
        pageable: Pageable,
        @Schema(description = "地区")
        @RequestParam area: String?,
    ): PageableResult<DigitalEconomicTaxLevelVO> {
        val areaCode = AreaConstant.DISTRICT_LIST.find { it.second == area }?.first
        val page = paginate<DigitalEconomicTaxLevel>(pageable.pageNumber, pageable.pageSize) {
            if (areaCode != null) and(DigitalEconomicTaxLevel::district eq areaCode)
        }.map(::DigitalEconomicTaxLevelVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询数字经济开票销售分档")
    //@SaCheckPermission("digital-economic-tax-level::query")
    @GetMapping("{id}")
    fun getDigitalEconomicTaxLevel(
        @PathVariable id: String,
    ): DigitalEconomicTaxLevelVO {
        val record = queryOneById<DigitalEconomicTaxLevel>(id)
            ?: throw NotFoundException("数字经济开票销售分档不存在")
        return DigitalEconomicTaxLevelVO(record)
    }

    @Operation(summary = "创建数字经济开票销售分档")
    //@SaCheckPermission("digital-economic-tax-level::create")
    @PostMapping
    fun createDigitalEconomicTaxLevel(
        @RequestBody dto: DigitalEconomicTaxLevelDTO,
    ) {
        dto.toDigitalEconomicTaxLevel().save()
    }

    @Operation(summary = "修改数字经济开票销售分档")
    //@SaCheckPermission("digital-economic-tax-level::update")
    @PutMapping("{id}")
    fun updateDigitalEconomicTaxLevel(
        @PathVariable id: String,
        @RequestBody dto: DigitalEconomicTaxLevelDTO,
    ) {
        val record = queryOneById<DigitalEconomicTaxLevel>(id)
            ?: throw NotFoundException("数字经济开票销售分档不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除数字经济开票销售分档")
    //@SaCheckPermission("digital-economic-tax-level::delete")
    @DeleteMapping("{id}")
    fun deleteDigitalEconomicTaxLevel(
        @PathVariable id: String,
    ) {
        val result = deleteById<DigitalEconomicTaxLevel>(id)
        if (result == 0) throw NotFoundException("数字经济开票销售分档不存在")
    }
}
