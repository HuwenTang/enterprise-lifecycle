package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class UserFeedbackQO(
    @param:Schema(description = "反馈人手机号")
    val userMobile: String = "",
    @param:Schema(description = "反馈人名称")
    val name: String = "",
    @param:Schema(description = "问题分类")
    val problemCategory: Int? = null,
    @param:Schema(description = "处理状态")
    val status: Boolean? = null,
    @param:Schema(description = "反馈时间")
    val createTime1: LocalDate? = null,
    @param:Schema(description = "反馈时间")
    val createTime2: LocalDate? = null,
    @param:Schema(description = "处理时间")
    val updateTime1: LocalDate? = null,
    @param:Schema(description = "处理时间")
    val updateTime2: LocalDate? = null,
    @param:Schema(description = "责任部门")
    val department: String = "",
)
