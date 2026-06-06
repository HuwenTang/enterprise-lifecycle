package com.tzdig.framework.mongo.pageable

import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.data.domain.PageRequest

data class Pageable(
    @Schema(description = "分页页号", defaultValue = "1")
    private val page: Long = 1,
    @Schema(description = "分页大小", defaultValue = "10")
    private val size: Long = 10,
) {
    @get:Schema(hidden = true)
    val pageNumber: Int get() = this.page.toInt() - 1

    @get:Schema(hidden = true)
    val pageSize: Int get() = this.size.toInt()

    fun asPageRequest(): PageRequest = PageRequest.of(pageNumber, pageSize)
}
