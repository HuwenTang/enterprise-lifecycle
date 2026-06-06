package com.tzdig.framework.generator.model

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.BaseMapper
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.generator.model.mustache.EntityMustacheModel
import com.tzdig.framework.generator.model.mustache.PropertyField
import com.tzdig.framework.generator.properties.Configuration

@Table("information_schema.columns")
class Columns {
    interface Mapper : BaseMapper<Columns>

    @Column("table_schema")
    var tableSchema: String? = null

    @Column("table_name")
    var tableName: String? = null

    @Column("column_name")
    var columnName: String? = null

    @Column("data_type")
    var dataType: String? = null

    @Column("column_comment")
    var columnComment: String? = null

    @Column("column_type")
    var columnType: String? = null

    @Column("column_key")
    var columnKey: String? = null

    val fieldName: String?
        get() = columnName
            ?.trimStart { !it.isLetter() }
            ?.split('_')
            ?.mapIndexed { index, it ->
                if (index == 0) it.lowercase()
                else it.lowercase().replaceFirstChar(Char::uppercase)
            }
            ?.joinToString("")

    companion object {
        fun getColumns(tableName: String) = query<Columns> {
            where(Columns::tableSchema eq Configuration.mysql.schema)
            and(Columns::tableName eq tableName)
        }

        private fun typeMap(dataType: String?) = when (dataType) {
            "char" -> "String"
            "varchar" -> "String"
            "text" -> "String"
            "longtext" -> "String"
            "tinyint" -> "Boolean"
            "smallint" -> "Short"
            "int" -> "Int"
            "bigint" -> "Long"
            "float" -> "Float"
            "double" -> "Double"
            "decimal" -> "BigDecimal"
            "timestamp" -> "Date"
            "datetime" -> "LocalDateTime"
            "date" -> "LocalDate"
            "time" -> "LocalTime"
            // "enum" -> "String"
            "json" -> "String"
            else -> null
        }

        private fun typeImports(dataType: String?) = when (dataType) {
            "timestamp" -> "java.util.Date"
            "datetime" -> "java.time.LocalDateTime"
            "date" -> "java.time.LocalDate"
            "time" -> "java.time.LocalTime"
            "decimal" -> "java.math.BigDecimal"
            else -> null
        }
    }

    fun transfer4entity(
        override: Boolean,
        imports: MutableSet<String>,
        excludeEnumTypes: Set<String>
    ): EntityMustacheModel.Field {
        val field = EntityMustacheModel.Field(
            comment = if (columnComment.isNullOrBlank()) columnName!!
            else columnComment!!.replace("[\\s]*\n[\\s]*", "\\n"),
            columnName = columnName!!,
            fieldName = fieldName!!,
            fieldType = if (dataType == "enum") {
                fieldName!!.replaceFirstChar(Char::uppercase)
            } else {
                typeMap(dataType) ?: "Nothing"
            },
            primary = columnKey == "PRI",
            override = override,
        )
        typeImports(dataType)?.run(imports::add)
        if (field.primary) {
            imports.add("com.mybatisflex.annotation.Id")
        }
        if (dataType == "enum" && field.fieldType !in excludeEnumTypes) {
            imports.add("com.mybatisflex.annotation.EnumValue")
            field.enumerateItems = columnType!!
                .substring(5, columnType!!.length - 1)
                .split(',')
                .map {
                    val item = it.substring(1, it.length - 1)
                    EntityMustacheModel.EnumerateItem(
                        name = item.uppercase(),
                        value = item,
                    )
                }
        }
        return field
    }

    fun transfer4dto(
        className: String,
        imports: MutableSet<String>,
    ): PropertyField {
        val field = PropertyField(
            fieldName = fieldName!!,
            fieldType = if (dataType == "enum") {
                className + '.' + fieldName!!.replaceFirstChar(Char::uppercase)
            } else {
                typeMap(dataType) ?: "Nothing"
            },
            comment = if (columnComment.isNullOrBlank()) columnName!!
            else columnComment!!.replace("[\\s]*\n[\\s]*", "\\n"),
        )
        typeImports(dataType)?.run(imports::add)
        return field
    }
}
