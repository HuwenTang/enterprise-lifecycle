package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.EnumValue
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("system_log")
class SystemLog() : BaseModel<SystemLog>() {
    constructor(init: SystemLog.() -> Unit) : this() {
        this.init()
    }

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null

    /**
     * 日志名称
     */
    @Column("name", comment = "日志名称")
    var name: String? = null

    /**
     * 日志类型
     */
    @Column("type", comment = "日志类型")
    var type: Type? = null

    enum class Type(@EnumValue val value: String) {
        SESSION("session"),
        CREATE("create"),
        UPDATE("update"),
        DELETE("delete"),
        QUERY("query"),
        OTHER("other"),
    }

    /**
     * 请求方法
     */
    @Column("method", comment = "请求方法")
    var method: String? = null

    /**
     * 请求地址
     */
    @Column("uri", comment = "请求地址")
    var uri: String? = null

    /**
     * 请求参数
     */
    @Column("request_body", comment = "请求参数")
    var requestBody: String? = null

    /**
     * 返回参数
     */
    @Column("response_body", comment = "返回参数")
    var responseBody: String? = null

    /**
     * 是否成功
     */
    @Column("success", comment = "是否成功")
    var success: Boolean? = null

    /**
     * 开始时间
     */
    @Column("start_time", comment = "开始时间")
    var startTime: LocalDateTime? = null

    /**
     * 结束时间
     */
    @Column("end_time", comment = "结束时间")
    var endTime: LocalDateTime? = null

    /**
     * 耗时(ms)
     */
    @Column("duration", comment = "耗时(ms)")
    var duration: Long? = null
}
