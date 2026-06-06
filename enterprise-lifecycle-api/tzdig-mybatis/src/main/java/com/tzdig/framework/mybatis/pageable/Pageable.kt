package com.tzdig.framework.mybatis.pageable

import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

data class Pageable(
    @get:Schema(description = "分页页号", defaultValue = "1")
    private val page: Long = 1,
    @get:Schema(description = "分页大小", defaultValue = "10")
    private val size: Long = 10,
) {
    @get:Schema(hidden = true)
    val pageNumber: Long get() = this.page

    @get:Schema(hidden = true)
    val pageSize: Long get() = this.size

    companion object {
        private val lock = ReentrantLock()

        @JvmStatic
        val pageable: Pageable
            get() = lock.withLock {
                val attributes = RequestContextHolder.getRequestAttributes() as ServletRequestAttributes
                val request = attributes.request
                var pageable =
                    attributes.getAttribute(::pageable.name, ServletRequestAttributes.SCOPE_REQUEST) as? Pageable
                if (pageable == null) {
                    pageable = Pageable(
                        page = request.getParameter(Pageable::page.name)?.toLong() ?: 1,
                        size = request.getParameter(Pageable::size.name)?.toLong() ?: 10,
                    )
                    attributes.setAttribute(::pageable.name, pageable, ServletRequestAttributes.SCOPE_REQUEST)
                }
                return pageable
            }
    }
}
