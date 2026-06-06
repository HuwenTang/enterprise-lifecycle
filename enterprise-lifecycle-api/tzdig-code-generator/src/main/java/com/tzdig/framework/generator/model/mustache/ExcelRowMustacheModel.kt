package com.tzdig.framework.generator.model.mustache

data class ExcelRowMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
    val fields: List<PropertyField>,
) : MustacheModel(
    template = "template/excelRow.mustache",
    packageName, imports, className,
)
