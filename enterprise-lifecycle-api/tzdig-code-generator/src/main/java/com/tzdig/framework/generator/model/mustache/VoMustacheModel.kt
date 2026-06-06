package com.tzdig.framework.generator.model.mustache

data class VoMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
    val fields: List<PropertyField>,
) : MustacheModel(
    template = "template/vo.mustache",
    packageName, imports, className,
)
