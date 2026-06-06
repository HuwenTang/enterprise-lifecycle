package com.tzdig.framework.model.vo

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import io.swagger.v3.oas.annotations.media.Schema

data class MyOrganizationVO(
    @Schema(description = "部门ID")
    val id: String,
    @Schema(description = "部门名称")
    val name: String,
    @Schema(description = "委办局ID")
    val cobId: String,
    @Schema(description = "委办局名称")
    var cobName: String?,
    @JsonIgnore
    @Schema(description = "排序")
    var sort: Pair<Int?, Int>,
) {
    constructor(record: UserOrganization) : this(
        id = record.id!!,
        name = record.name!!,
        cobId = record.cob!!,
        cobName = null,
        sort = null to record.sort!!,
    )
}
