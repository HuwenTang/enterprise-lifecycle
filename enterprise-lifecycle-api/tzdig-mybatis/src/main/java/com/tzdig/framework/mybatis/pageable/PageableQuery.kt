package com.tzdig.framework.mybatis.pageable

import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.Schema

@Parameter(
    name = "page", description = "分页页号", `in` = ParameterIn.QUERY,
    schema = Schema(type = "integer", format = "int32", defaultValue = "1"),
)
@Parameter(
    name = "size", description = "分页大小", `in` = ParameterIn.QUERY,
    schema = Schema(type = "integer", format = "int32", defaultValue = "10"),
)
@Parameter(
    name = "pageable", hidden = true
)
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FUNCTION)
annotation class PageableQuery
