package com.tzdig.framework.generator.model.mustache

data class EntityMustacheModel(
    override val packageName: String,
    override val imports: List<Import>,
    override val className: String,
    val tableName: String,
    val tableComment: String,
    val fields: List<Field>,
) : MustacheModel(
    template = "template/entity.mustache",
    packageName, imports, className,
) {
    data class Field(
        val comment: String,
        val columnName: String,
        val fieldName: String,
        val fieldType: String,
        val primary: Boolean = false,
        val override: Boolean = false,
        var enumerateItems: List<EnumerateItem>? = null,
    ) {
        @Suppress("unused")
        val enumerated: Boolean get() = !enumerateItems.isNullOrEmpty()
    }

    data class EnumerateItem(
        val name: String,
        val value: String,
    )
}
