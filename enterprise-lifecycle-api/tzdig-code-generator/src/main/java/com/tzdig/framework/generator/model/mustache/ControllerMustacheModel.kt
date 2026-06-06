package com.tzdig.framework.generator.model.mustache

data class ControllerMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
    val path: String,
    val tableComment: String,
) : MustacheModel(
    template = "template/controller.mustache",
    packageName, imports, className,
)
