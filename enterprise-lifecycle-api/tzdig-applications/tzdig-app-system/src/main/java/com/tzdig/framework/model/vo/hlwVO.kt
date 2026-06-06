package com.tzdig.framework.model.vo

import cn.dev33.satoken.stp.StpUtil
import com.tzdig.framework.mybatis.entity.prime.ExtHlwJgOrg
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.security.extension.roleIds
import io.swagger.v3.oas.annotations.media.Schema

data class hlwVO(
    @Schema(description = "用户手机")
    val mobile: String,
    @Schema(description = "姓名")
    val realName: String,
    @Schema(description = "组织列表")
    var organizations: List<ExtHlwjgOrgVO>,
){
    constructor(userAccount: UserAccount, organizations: List<ExtHlwjgOrgVO>) : this(
        mobile = userAccount.mobile!!,
        realName = userAccount.realName!!,
        organizations = organizations
    )
}
