package com.tzdig.framework.mongo.pageable

import org.springframework.data.domain.Page

data class PageableResult<T : Any>(
    val page: Int,
    val size: Int,
    val totalPage: Long,
    val total: Long,
    val records: List<T>,
) {
    companion object {
        @JvmStatic
        fun <T : Any> empty(pageable: Pageable) = PageableResult<T>(
            page = pageable.pageNumber,
            size = pageable.pageSize,
            totalPage = 0,
            total = 0,
            records = emptyList(),
        )

        @JvmStatic
        fun <T : Any> of(page: Page<T>) = PageableResult<T>(
            page = page.number + 1,
            size = page.size,
            totalPage = page.totalPages.toLong(),
            total = page.totalElements,
            records = page.content,
        )
    }
}
