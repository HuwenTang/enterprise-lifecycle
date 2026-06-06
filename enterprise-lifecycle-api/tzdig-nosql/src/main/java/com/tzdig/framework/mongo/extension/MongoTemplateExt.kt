package com.tzdig.framework.mongo.extension

import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.CriteriaDefinition
import org.springframework.data.mongodb.core.query.Query

@JvmOverloads
inline fun <reified T : Any> MongoTemplate.page(
    criteria: CriteriaDefinition,
    pageRequest: PageRequest,
    sort: Sort = Sort.unsorted(),
): Page<T> {
    val query = Query(criteria).with(sort)
    val total = count(query, T::class.java)
    if (total == 0L) return PageImpl(emptyList(), pageRequest, 0)
    val content = find(query.with(pageRequest), T::class.java)
    return PageImpl(content, pageRequest, total)
}
