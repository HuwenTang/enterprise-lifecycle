package com.tzdig.framework.web.rpc

import com.alibaba.fastjson2.parseArray
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.tzdig.framework.core.annotation.CustomJob
import com.tzdig.framework.core.util.SpringUtils
import com.tzdig.framework.core.util.ThreadPoolUtils
import com.tzdig.framework.mybatis.entity.system.SystemScheduledJob
import com.tzdig.framework.web.annotation.InternalRpcApi
import com.tzdig.framework.web.config.ScheduleJobConfig
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("actuator/scheduled-task")
class ScheduledJobRest {
    private val logger = LoggerFactory.getLogger(javaClass)

    @InternalRpcApi
    @Operation(summary = "执行任务", hidden = true)
    @PostMapping("{id}")
    fun execute(
        @PathVariable id: String,
        @RequestBody params: Array<Any?>,
    ) {
        val job = queryOneById<SystemScheduledJob>(id)
            ?: throw NotFoundException("任务不存在")
        val parameterTypes = job.parameterTypes.parseArray<String>()
            .map { Class.forName(it) }
            .toTypedArray()
        if (!ScheduleJobConfig.check(job))
            throw NotFoundException("任务不存在")
        val bean = SpringUtils.getBean(job.beanName!!)
        val beanClass = Class.forName(job.beanClass)
        val method = beanClass.getMethod(job.methodName!!, *parameterTypes)
            ?: throw NotFoundException("任务不存在")
        val scheduled = method.getDeclaredAnnotation(Scheduled::class.java)
        val customJob = method.getDeclaredAnnotation(CustomJob::class.java)
        if (scheduled != null || customJob != null) ThreadPoolUtils.runAsync {
            try {
                method.invoke(bean, *params)
            } catch (e: Exception) {
                logger.error("invoke failed: {}", e.message, e)
            }
        }
    }
}
