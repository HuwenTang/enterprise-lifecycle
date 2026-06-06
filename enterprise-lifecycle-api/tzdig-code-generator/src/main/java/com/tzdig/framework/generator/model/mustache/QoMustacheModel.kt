package com.tzdig.framework.generator.model.mustache

data class QoMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
    val fields: List<PropertyField>,
) : MustacheModel(
    template = "template/qo.mustache",
    packageName, imports, className,
)