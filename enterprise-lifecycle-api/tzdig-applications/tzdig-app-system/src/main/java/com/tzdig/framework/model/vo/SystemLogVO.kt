@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.system.SystemLog
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class SystemLogVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "用户ID")
    @ExcelProperty("用户ID")
    val userid: String?,
    @Schema(description = "用户姓名")
    @ExcelProperty("用户姓名")
    var userName: String? = null,
    @Schema(description = "日志名称")
    @ExcelProperty("日志名称")
    val name: String?,
    @Schema(description = "日志类型")
    @ExcelProperty("日志类型")
    val type: String?,
    @Schema(description = "请求方法")
    @ExcelProperty("请求方法")
    val method: String?,
    @Schema(description = "请求地址")
    @ExcelProperty("请求地址")
    val uri: String?,
    @Schema(description = "请求参数")
    @ExcelProperty("请求参数")
    val requestBody: String?,
    @Schema(description = "返回参数")
    @ExcelProperty("返回参数")
    val responseBody: String?,
    @Schema(description = "是否成功")
    @ExcelProperty("是否成功")
    val success: Boolean?,
    @Schema(description = "开始时间")
    @ExcelProperty("开始时间")
    val startTime: LocalDateTime?,
    @Schema(description = "结束时间")
    @ExcelProperty("结束时间")
    val endTime: LocalDateTime?,
    @Schema(description = "耗时(ms)")
    @ExcelProperty("耗时(ms)")
    val duration: Long?,
) {
    constructor(record: SystemLog) : this(
        id = record.id,
        userid = record.userid,
        name = record.name,
        type = record.type?.name,
        method = record.method,
        uri = record.uri,
        requestBody = record.requestBody,
        responseBody = record.responseBody,
        success = record.success,
        startTime = record.startTime,
        endTime = record.endTime,
        duration = record.duration,
    )
}
