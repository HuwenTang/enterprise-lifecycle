package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.UserOrganization
import io.swagger.v3.oas.annotations.media.Schema

data class OrganizationVO(
    @get:Schema(description = "组织ID")
    val id: String,
    @get:Schema(description = "组织名称")
    val name: String,
    @get:Schema(description = "父级组织ID")
    val parentId: String?,
    @get:Schema(description = "排序")
    val sort: Int,
    @get:Schema(description = "所属委办局ID")
    val cobId: String?,
    @get:Schema(description = "所属委办局ID")
    val cobName: String?,
) {
    constructor(userOrganization: UserOrganization, cobId: String?, cobName: String?) : this(
        id = userOrganization.id!!,
        name = userOrganization.name!!,
        parentId = userOrganization.parentId,
        sort = userOrganization.sort!!,
        cobId = cobId,
        cobName = cobName,
    )

    constructor(userOrganization: UserOrganization) : this(
        userOrganization = userOrganization,
        cobId = userOrganization.cob,
        cobName = null,
    )
}
