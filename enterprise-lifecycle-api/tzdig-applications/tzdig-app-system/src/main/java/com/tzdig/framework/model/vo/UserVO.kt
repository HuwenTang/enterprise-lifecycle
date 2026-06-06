package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.system.UserAccount
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class UserVO(
    @Schema(description = "用户ID")
    @ExcelProperty()
    val id: String,
    @Schema(description = "用户姓名")
    val realName: String,
    @Schema(description = "手机号码")
    val mobile: String,
    @Schema(description = "泰政通授权")
    var grantForTaizhengtong: Boolean,
    @Schema(description = "上次登录时间")
    val lastLoginTime: LocalDateTime?,
) {
    constructor(userAccount: UserAccount) : this(
        id = userAccount.id!!,
        realName = userAccount.realName!!,
        mobile = userAccount.mobile!!,
        grantForTaizhengtong = userAccount.grantForTaizhengtong!!,
        lastLoginTime = userAccount.lastLoginTime,
    )
}
