package com.tzdig.framework.generator.model.mustache

data class MapperMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
) : MustacheModel(
    template = "template/mapper.mustache",
    packageName, imports, className,
)
