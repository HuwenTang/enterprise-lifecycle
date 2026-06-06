package com.tzdig.framework.generator.model.mustache

data class ServiceMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
) : MustacheModel(
    template = "template/service.mustache",
    packageName, imports, className,
)
