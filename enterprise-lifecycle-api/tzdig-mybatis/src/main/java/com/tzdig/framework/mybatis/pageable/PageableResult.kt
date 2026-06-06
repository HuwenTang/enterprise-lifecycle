package com.tzdig.framework.mybatis.pageable

import com.mybatisflex.core.paginate.Page

data class PageableResult<T : Any>(
    val page: Long,
    val size: Long,
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
            page = page.pageNumber,
            size = page.pageSize,
            totalPage = page.totalPage,
            total = page.totalRow,
            records = page.records,
        )

        @JvmStatic
        fun <T : Any> of(pageable: Pageable, total: Long, records: List<T>): PageableResult<T> {
            val totalPage = if (total == 0L) 0L else (total + pageable.pageSize - 1) / pageable.pageSize
            return PageableResult(
                page = pageable.pageNumber,
                size = pageable.pageSize,
                totalPage = totalPage,
                total = total,
                records = records
            )
        }
    }
}
