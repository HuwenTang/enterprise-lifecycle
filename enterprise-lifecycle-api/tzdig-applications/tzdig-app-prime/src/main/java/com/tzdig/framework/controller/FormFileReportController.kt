package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.model.dto.FormFileReportDTO
import com.tzdig.framework.model.vo.FormFileReportVO
import com.tzdig.framework.model.vo.KVPairList
import com.tzdig.framework.model.vo.KVPairVO
import com.tzdig.framework.mybatis.entity.prime.FormFileReport
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "文件报送任务管理")
@RestController
@RequestMapping("form-file-report")
class FormFileReportController {
    @Operation(summary = "全部文件报送任务列表")
    @GetMapping("all")
    fun allFormFileReport(
        @Schema(description = "牵头部门")
        @RequestParam(defaultValue = "") department: String,
    ): KVPairList<String> =
        query<FormFileReport> {
            if (department.isNotEmpty())
                and(FormFileReport::department eq department)
            orderBy(FormFileReport::taskName).desc()
        }.map { KVPairVO(it.id!!, it.taskName!!) }

    @Operation(summary = "查询文件报送任务列表")
    //@SaCheckPermission("form-file-report::query")
    @GetMapping
    @PageableQuery
    fun listFormFileReport(
        @Schema(description = "任务名称")
        @RequestParam(defaultValue = "") taskName: String,
        @Schema(description = "牵头部门")
        @RequestParam(defaultValue = "") department: String,
        pageable: Pageable,
    ): PageableResult<FormFileReportVO> {
        val page = paginate<FormFileReport>(pageable.pageNumber, pageable.pageSize) {
            if (taskName.isNotEmpty()) and(FormFileReport::taskName like taskName)
            if (department.isNotEmpty()) and(FormFileReport::department eq department)
        }.map(::FormFileReportVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询文件报送任务")
    //@SaCheckPermission("form-file-report::query")
    @GetMapping("{id}")
    fun getFormFileReport(
        @PathVariable id: String,
    ): FormFileReportVO {
        val record = queryOneById<FormFileReport>(id)
            ?: throw NotFoundException("文件报送任务不存在")
        return FormFileReportVO(record)
    }

    @Operation(summary = "创建文件报送任务")
    //@SaCheckPermission("form-file-report::create")
    @PostMapping
    fun createFormFileReport(
        @RequestBody dto: FormFileReportDTO,
    ) {
        dto.toFormFileReport().save()
    }

    @Operation(summary = "修改文件报送任务")
    //@SaCheckPermission("form-file-report::update")
    @PutMapping("{id}")
    fun updateFormFileReport(
        @PathVariable id: String,
        @RequestBody dto: FormFileReportDTO,
    ) {
        val record = queryOneById<FormFileReport>(id)
            ?: throw NotFoundException("文件报送任务不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除文件报送任务")
    //@SaCheckPermission("form-file-report::delete")
    @DeleteMapping("{id}")
    fun deleteFormFileReport(
        @PathVariable id: String,
    ) {
        val result = deleteById<FormFileReport>(id)
        if (result == 0) throw NotFoundException("文件报送任务不存在")
    }
}
