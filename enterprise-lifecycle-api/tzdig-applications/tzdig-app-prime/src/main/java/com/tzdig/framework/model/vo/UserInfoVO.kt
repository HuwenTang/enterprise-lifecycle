package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.prime.InternetSupervise
import io.swagger.v3.oas.annotations.media.Schema

data class UserInfoVO(
    @get:Schema(description = "用户ID")
    val id: String,
    @get:Schema(description = "用户姓名")
    val name: String,
    @get:Schema(description = "泰政通委办局ID")
    var cobId: String,
) {
    fun toInternetSupervise(): InternetSupervise =
        InternetSupervise {
            this.userId = id
            this.userName = name
            this.orgId = cobId
        }
}
