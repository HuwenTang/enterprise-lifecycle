package com.tzdig.framework.mybatis.extension

import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableResult

/**
 * 将 List 转换为 PageableResult
 * 适用于手动分页场景（使用原生 SQL 的 Mapper）
 *
 * @param pageable 分页参数
 * @param totalCount 总记录数
 * @return 分页结果
 */
fun <T : Any> List<T>.toPageableResult(
    pageable: Pageable,
    totalCount: Int
): PageableResult<T> {
    if (isEmpty()) {
        return PageableResult(
            page = pageable.pageNumber,
            size = pageable.pageSize,
            totalPage = 0,
            total = 0,
            records = emptyList()
        )
    }
    
    val totalPage = if (totalCount == 0) 0L 
        else (totalCount.toLong() + pageable.pageSize - 1) / pageable.pageSize
    
    return PageableResult(
        page = pageable.pageNumber,
        size = pageable.pageSize,
        totalPage = totalPage,
        total = totalCount.toLong(),
        records = this
    )
}
