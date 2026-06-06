package com.tzdig.framework.generator.model.mustache

data class DtoMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
    val fields: List<PropertyField>,
) : MustacheModel(
    template = "template/dto.mustache",
    packageName, imports, className,
) {
    data class Field(
        val fieldName: String,
        val fieldType: String,
        val comment: String,
    )
}
