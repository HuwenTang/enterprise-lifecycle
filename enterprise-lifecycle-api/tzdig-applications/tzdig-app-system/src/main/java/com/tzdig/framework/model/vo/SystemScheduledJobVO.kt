@file:Suppress("unused")

package com.tzdig.framework.model.vo

import com.alibaba.fastjson2.parseArray
import com.alibaba.fastjson2.parseObject
import com.tzdig.framework.mybatis.entity.system.SystemScheduledJob
import com.tzdig.framework.mybatis.entity.system.scheduled.info.ScheduledInfo
import io.swagger.v3.oas.annotations.media.Schema

data class SystemScheduledJobVO(
    @get:Schema(description = "主键")
    val id: String,
    @get:Schema(description = "任务名称")
    val summary: String,
    @get:Schema(description = "实例IP")
    val ip: String,
    @get:Schema(description = "实例端口")
    val port: Int,
    @get:Schema(description = "路径")
    val contextPath: String,
    @get:Schema(description = "定时任务属性")
    val scheduledProps: ScheduledInfo?,
    @get:Schema(description = "参数类型")
    val parameterTypes: List<String>,
) {
    constructor(record: SystemScheduledJob) : this(
        id = record.id!!,
        summary = record.summary!!,
        ip = record.ip!!,
        port = record.port!!,
        contextPath = record.contextPath!!,
        scheduledProps = record.scheduledProps?.parseObject<ScheduledInfo>(),
        parameterTypes = record.parameterTypes.parseArray<String>(),
    )
}
