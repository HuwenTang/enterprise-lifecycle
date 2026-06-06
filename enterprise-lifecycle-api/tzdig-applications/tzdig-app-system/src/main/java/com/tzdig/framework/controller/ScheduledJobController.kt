package com.tzdig.framework.controller

import com.alibaba.fastjson2.parseObject
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.core.extension.APPLICATION_JSON_MEDIA_TYPE
import com.tzdig.framework.core.extension.string
import com.tzdig.framework.model.vo.SystemScheduledJobVO
import com.tzdig.framework.mybatis.entity.system.SystemScheduledJob
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.service.XTokenService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.web.bind.annotation.*

@Tag(name = "定时任务管理")
@SaCheckRoot
@RestController
@RequestMapping("scheduled-job")
class ScheduledJobController(
    private val xTokenService: XTokenService,
    private val okHttpClient: OkHttpClient,
) {
    @Operation(summary = "查询任务列表")
    @GetMapping
    @PageableQuery
    fun listSystemScheduledJob(
        @Schema(description = "任务名称")
        @RequestParam(defaultValue = "") summary: String,
    ): PageableResult<SystemScheduledJobVO> {
        val page = paginate<SystemScheduledJob>(pageable.pageNumber, pageable.pageSize) {
            if (summary.isNotEmpty()) and(SystemScheduledJob::summary like summary)
        }.map(::SystemScheduledJobVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询任务")
    @GetMapping("{id}")
    fun getSystemScheduledJob(
        @PathVariable id: String,
    ): SystemScheduledJobVO {
        val record = queryOneById<SystemScheduledJob>(id)
            ?: throw NotFoundException("定时任务不存在")
        return SystemScheduledJobVO(record)
    }

    @Operation(summary = "执行任务")
    @PostMapping("{id}")
    fun execute(
        @PathVariable id: String,
        @RequestBody params: String?,
    ) {
        val job = queryOneById<SystemScheduledJob>(id)
            ?: throw NotFoundException("任务不存在")
        val body = params.takeUnless { it.isNullOrEmpty() }.let { it ?: "[]" }
            .toRequestBody(APPLICATION_JSON_MEDIA_TYPE)
        val (tokenKey, tokenValue) = xTokenService.generateToken()
        val request = Request.Builder()
            .url("http://${job.ip}:${job.port}${job.contextPath}/actuator/scheduled-task/${id}")
            .header("X-Token-Key", tokenKey)
            .header("X-Token-Value", tokenValue)
            .post(body)
            .build()
        okHttpClient.newCall(request).execute().use {
            if (!it.isSuccessful) {
                val resp = it.string().parseObject<ApiException.Response>()
                throw ApiException(resp.message)
            }
        }
    }
}
