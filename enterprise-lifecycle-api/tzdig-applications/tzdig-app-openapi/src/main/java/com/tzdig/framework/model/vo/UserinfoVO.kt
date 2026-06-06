package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.UserAccount
import io.swagger.v3.oas.annotations.media.Schema

data class UserinfoVO(
    @Schema(description = "用户ID")
    val userid: String,
    @Schema(description = "用户姓名")
    val realName: String,
    @Schema(description = "部门ID")
    val dept: String?,
) {
    constructor(user: UserAccount, dept: String?) : this(
        userid = user.id!!,
        realName = user.realName!!,
        dept = dept,
    )
}
