package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.prime.ExtHlwJgOrg
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import io.swagger.v3.oas.annotations.media.Schema

data class ExtHlwjgOrgVO(
    @Schema(description = "组织ID")
    val id: String,
    @Schema(description = "组织名称")
    val name: String,
    @Schema(description = "父级组织ID")
    val parentId: String?,
) {
    constructor(extHlwJgOrg: ExtHlwJgOrg) : this(
        id = extHlwJgOrg.organizationId!!,
        name = extHlwJgOrg.organizationName!!,
        parentId = extHlwJgOrg.parentId,
    )
}
