package com.tzdig.framework.model.vo.fagai

import com.fasterxml.jackson.annotation.JsonIgnore
import com.mybatisflex.annotation.Table
import io.swagger.v3.oas.annotations.media.Schema

@Table("project_filing_info")
data class FilingProjectItem(
    @get:Schema(description = "市（区）", hidden = true)
    @JsonIgnore
    val district: String = "",
    @get:Schema(description = "园区", hidden = true)
    @JsonIgnore
    val park: String = "",
    @get:Schema(description = "总和")
    val total: Int = 0,
) {
    constructor(list: List<FilingProjectItem>) : this(
        total = list.sumOf { it.total },
    )
}
