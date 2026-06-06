package com.tzdig.framework.model.vo

import cn.dev33.satoken.stp.StpUtil
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.security.extension.roleIds
import io.swagger.v3.oas.annotations.media.Schema

data class SessionVO(
    @Schema(description = "用户ID")
    val userid: String,
    @Schema(description = "姓名")
    val realName: String,
    @Schema(description = "角色列表")
    val roleIds: List<String>,
    @Schema(description = "组织列表")
    var organizations: List<OrganizationVO>,
    val token: String?,
) {
    constructor(userAccount: UserAccount, organizations: List<OrganizationVO>) : this(
        userid = userAccount.id!!,
        realName = userAccount.realName!!,
        roleIds = userAccount.roleIds,
        organizations = organizations,
        token = StpUtil.getTokenValue(),
    )
}
