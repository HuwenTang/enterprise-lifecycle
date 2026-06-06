package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.mybatisflex.kotlin.extensions.kproperty.notIn
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.mybatisflex.kotlin.extensions.model.batchUpdateById
import com.tzdig.framework.model.dto.FormMonitorIndicatorDTO
import com.tzdig.framework.model.vo.FormMonitorIndicatorFieldVO
import com.tzdig.framework.model.vo.FormMonitorIndicatorVO
import com.tzdig.framework.model.vo.KVPairList
import com.tzdig.framework.model.vo.KVPairVO
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicator
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicatorField
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

@Tag(name = "监测指标信息管理")
@RestController
@RequestMapping("form-monitor-indicator")
class FormMonitorIndicatorController {
    @Operation(summary = "全部监测指标")
    @GetMapping("all")
    fun allFormSupportIndicator(
        @RequestParam(defaultValue = "") supportIndicatorId: String,
    ): KVPairList<String> =
        query<FormMonitorIndicator> {
            if (supportIndicatorId.isNotEmpty())
                and(FormMonitorIndicator::supportIndicatorId eq supportIndicatorId)
            orderBy(FormMonitorIndicator::indicatorName).desc()
        }.map { KVPairVO(it.id!!, it.indicatorName!!) }

    @Operation(summary = "查询监测指标信息列表")
    //@SaCheckPermission("form-monitor-indicator::query")
    @GetMapping
    @PageableQuery
    fun listFormMonitorIndicator(
        pageable: Pageable,
        @Schema(description = "支撑指标id")
        @RequestParam(defaultValue = "") supportIndicatorId: String,
        @Schema(description = "监测指标名称")
        @RequestParam(defaultValue = "") indicatorName: String,
        @Schema(description = "牵头部门")
        @RequestParam(defaultValue = "") department: String,
    ): PageableResult<FormMonitorIndicatorVO> {
        val page = paginate<FormMonitorIndicator>(pageable.pageNumber, pageable.pageSize) {
            if (supportIndicatorId.isNotEmpty())
                and(FormMonitorIndicator::supportIndicatorId like supportIndicatorId)
            if (indicatorName.isNotEmpty())
                and(FormMonitorIndicator::indicatorName like indicatorName)
            if (department.isNotEmpty())
                and(FormMonitorIndicator::department like department)
            orderBy(FormMonitorIndicator::createTime).desc()
        }.map(::FormMonitorIndicatorVO)
        if (page.records.isEmpty()) return PageableResult.empty(pageable)
        val supportIndicatorMap = queryListByIds<FormSupportIndicator>(page.records.map { it.supportIndicatorId })
            .associateBy { it.id }
        page.records.forEach {
            it.supportIndicatorName = supportIndicatorMap[it.supportIndicatorId]!!.indicatorName!!
            it.supportIndicatorDepartment = supportIndicatorMap[it.supportIndicatorId]!!.department
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询监测指标信息")
    //@SaCheckPermission("form-monitor-indicator::query")
    @GetMapping("{id}")
    fun getFormMonitorIndicator(
        @PathVariable id: String,
    ): FormMonitorIndicatorVO {
        val record = queryOneById<FormMonitorIndicator>(id)
            ?: throw NotFoundException("监测指标信息不存在")
        val supportIndicator = queryOneById<FormSupportIndicator>(record.supportIndicatorId!!)
            ?: throw NotFoundException("支撑指标不存在")
        return FormMonitorIndicatorVO(record).apply {
            supportIndicatorName = supportIndicator.indicatorName!!
        }
    }

    @Operation(summary = "查询监测指标字段")
    @GetMapping("{id}/fields")
    fun getFormMonitorIndicatorFields(
        @PathVariable id: String,
    ): List<FormMonitorIndicatorFieldVO> {
        val fields = filter<FormMonitorIndicatorField> { FormMonitorIndicatorField::monitorIndicatorId eq id }
        return fields.map(::FormMonitorIndicatorFieldVO)
    }

    @Operation(summary = "创建监测指标信息")
    //@SaCheckPermission("form-monitor-indicator::create")
    @PostMapping
    fun createFormMonitorIndicator(
        @RequestBody dto: FormMonitorIndicatorDTO,
    ) {
        if (dto.fields.isEmpty())
            throw ApiException("请选择字段")
        val monitorIndicator = dto.toFormMonitorIndicator()
        monitorIndicator.save()
        dto.fields.map { it.toFormMonitorIndicatorField(monitorIndicator.id!!) }.batchInsert()
    }

    @Operation(summary = "修改监测指标信息")
    //@SaCheckPermission("form-monitor-indicator::update")
    @PutMapping("{id}")
    fun updateFormMonitorIndicator(
        @PathVariable id: String,
        @RequestBody dto: FormMonitorIndicatorDTO,
    ) {
        if (dto.fields.isEmpty())
            throw ApiException("请选择字段")
        val record = queryOneById<FormMonitorIndicator>(id)
            ?: throw NotFoundException("监测指标信息不存在")
        dto.into(record).updateById()
        deleteWith<FormMonitorIndicatorField> {
            (FormMonitorIndicatorField::monitorIndicatorId eq id)
                .and(
                    FormMonitorIndicatorField::id notIn dto.fields.map { it.id }
                )
        }
        val fields = dto.fields.map { it.toFormMonitorIndicatorField(record.id!!, it.id) }
        with(fields.filter { it.id.isNullOrEmpty() }) {
            if (isNotEmpty()) batchInsert()
        }
        with(fields.filter { !it.id.isNullOrEmpty() }) {
            if (isNotEmpty()) batchUpdateById()
        }
    }

    @Operation(summary = "删除监测指标信息")
    //@SaCheckPermission("form-monitor-indicator::delete")
    @DeleteMapping("{id}")
    fun deleteFormMonitorIndicator(
        @PathVariable id: String,
    ) {
        val result = deleteById<FormMonitorIndicator>(id)
        if (result == 0) throw NotFoundException("监测指标信息不存在")
    }
}
