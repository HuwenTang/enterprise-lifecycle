package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.model.dto.FormSupportIndicatorDTO
import com.tzdig.framework.model.vo.FormSupportIndicatorVO
import com.tzdig.framework.model.vo.KVPairList
import com.tzdig.framework.model.vo.KVPairVO
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicator
import com.tzdig.framework.mybatis.entity.prime.FormSupportIndicator
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "支撑指标信息管理")
@RestController
@RequestMapping("form-support-indicator")
class FormSupportIndicatorController {
    @Operation(summary = "全部支撑指标")
    @GetMapping("all")
    fun allFormSupportIndicator(
        @RequestParam(defaultValue = "") department: String,
    ): KVPairList<String> =
        query<FormSupportIndicator> {
            if (department.isNotEmpty())
                and(FormSupportIndicator::department eq department)
            orderBy(FormSupportIndicator::indicatorName).desc()
        }.map { KVPairVO(it.id!!, it.indicatorName!!) }

    @Operation(summary = "查询支撑指标信息列表")
    //@SaCheckPermission("form-support-indicator::query")
    @GetMapping
    @PageableQuery
    fun listFormSupportIndicator(
        pageable: Pageable,
        @Schema(description = "支撑指标名称")
        @RequestParam(defaultValue = "") indicatorName: String,
        @Schema(description = "牵头部门")
        @RequestParam(defaultValue = "") department: String,
    ): PageableResult<FormSupportIndicatorVO> {
        val page = paginate<FormSupportIndicator>(pageable.pageNumber, pageable.pageSize) {
            if (indicatorName.isNotEmpty())
                and(FormSupportIndicator::indicatorName like indicatorName)
            if (department.isNotEmpty())
                and(FormSupportIndicator::department like department)
            orderBy(FormSupportIndicator::createTime).desc()
        }.map(::FormSupportIndicatorVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询支撑指标信息")
    //@SaCheckPermission("form-support-indicator::query")
    @GetMapping("{id}")
    fun getFormSupportIndicator(
        @PathVariable id: String,
    ): FormSupportIndicatorVO {
        val record = queryOneById<FormSupportIndicator>(id)
            ?: throw NotFoundException("支撑指标信息不存在")
        return FormSupportIndicatorVO(record)
    }

    @Operation(summary = "创建支撑指标信息")
    //@SaCheckPermission("form-support-indicator::create")
    @PostMapping
    fun createFormSupportIndicator(
        @RequestBody dto: FormSupportIndicatorDTO,
    ) {
        dto.toFormSupportIndicator().save()
    }

    @Operation(summary = "修改支撑指标信息")
    //@SaCheckPermission("form-support-indicator::update")
    @PutMapping("{id}")
    fun updateFormSupportIndicator(
        @PathVariable id: String,
        @RequestBody dto: FormSupportIndicatorDTO,
    ) {
        val record = queryOneById<FormSupportIndicator>(id)
            ?: throw NotFoundException("支撑指标信息不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除支撑指标信息")
    //@SaCheckPermission("form-support-indicator::delete")
    @DeleteMapping("{id}")
    fun deleteFormSupportIndicator(
        @PathVariable id: String,
    ) {
        val cnt = queryCount<FormMonitorIndicator> {
            where(FormMonitorIndicator::supportIndicatorId eq id)
        }
        if (cnt > 0) {
            throw ApiException("${cnt}项监测指标正在使用该支撑指标，请确认后再试")
        }
        val result = deleteById<FormSupportIndicator>(id)
        if (result == 0) {
            throw NotFoundException("支撑指标信息不存在")
        }
    }
}
