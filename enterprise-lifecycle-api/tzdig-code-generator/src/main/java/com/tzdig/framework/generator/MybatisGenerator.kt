package com.tzdig.framework.generator

import com.tzdig.framework.generator.model.Columns
import com.tzdig.framework.generator.model.base.BaseModel
import com.tzdig.framework.generator.model.mustache.EntityMustacheModel
import com.tzdig.framework.generator.model.mustache.MapperMustacheModel
import com.tzdig.framework.generator.model.mustache.MustacheModel.Companion.sortedImports
import com.tzdig.framework.generator.model.mustache.ServiceMustacheModel
import java.io.File
import kotlin.reflect.full.memberProperties

class MybatisGenerator(
    private val javaDirectory: File,
    packages: String,
    subPackage: String,
) {
    private val packages: List<String> = packages.split('.')
    private val entityPackage: MutableList<String> =
        this.packages.toMutableList().apply { add("entity") }
    private val mapperPackage: MutableList<String> =
        this.packages.toMutableList().apply { add("mapper") }
    private val servicePackage: MutableList<String> =
        this.packages.toMutableList().apply { add("service") }

    init {
        if (subPackage.isNotEmpty()) {
            entityPackage.add(subPackage)
            mapperPackage.add(subPackage)
            servicePackage.add(subPackage)
        }
    }

    fun generate(
        tableName: String,
        tableComment: String,
        excludeEnumTypes: Set<String> = emptySet(),
        overrideColumns: Set<String> = emptySet(),
    ) {
        val className = tableName.split('_').joinToString("") { it.replaceFirstChar(Char::uppercase) }
        generateEntity(tableName, tableComment, className, excludeEnumTypes, overrideColumns)
        generateMapper(className)
        generateService(className)
    }

    private fun generateEntity(
        tableName: String,
        tableComment: String,
        className: String,
        excludeEnumTypes: Set<String>,
        overrideColumns: Set<String>
    ) {
        var dir = javaDirectory.absoluteFile
        entityPackage.forEach { dir = dir.resolve(it) }
        dir.mkdirs()
        val file = dir.resolve("${className}.kt")
        //
        val imports = mutableSetOf(
            "com.mybatisflex.annotation.Column",
            "com.mybatisflex.annotation.Table",
            "com.tzdig.framework.mybatis.base.BaseModel",
            //"com.tzdig.framework.generator.model.base.BaseModel",
        )
        val fields = Columns.getColumns(tableName).mapNotNull { col ->
            val override = col.columnName in overrideColumns
            if (col.fieldName in BaseModel::class.memberProperties.map { it.name } && !override)
                return@mapNotNull null
            col.transfer4entity(override, imports, excludeEnumTypes)
        }
        EntityMustacheModel(
            packageName = entityPackage.joinToString("."),
            imports = imports.sortedImports(),
            className = className,
            tableName = tableName,
            tableComment = tableComment,
            fields = fields,
        ).render(file)
    }

    private fun generateMapper(className: String) {
        var dir = javaDirectory.absoluteFile
        mapperPackage.forEach { dir = dir.resolve(it) }
        dir.mkdirs()
        val file = dir.resolve("${className}Mapper.kt")
        //
        val imports = setOf(
            "${entityPackage.joinToString(".")}.${className}",
            "com.tzdig.framework.mybatis.base.BaseMapper",
            //"com.tzdig.framework.generator.model.base.BaseMapper",
        )
        MapperMustacheModel(
            packageName = mapperPackage.joinToString("."),
            imports = imports.sortedImports(),
            className = className,
        ).render(file)
    }

    private fun generateService(className: String) {
        var dir = javaDirectory.absoluteFile
        servicePackage.forEach { dir = dir.resolve(it) }
        dir.mkdirs()
        val file = dir.resolve("I${className}.kt")
        //
        val imports = setOf(
            "${entityPackage.joinToString(".")}.${className}",
            "${mapperPackage.joinToString(".")}.${className}Mapper",
            "com.mybatisflex.core.service.IService",
            "com.mybatisflex.spring.service.impl.ServiceImpl",
            "org.springframework.stereotype.Service",
        )
        ServiceMustacheModel(
            packageName = servicePackage.joinToString("."),
            imports = imports.sortedImports(),
            className = className,
        ).render(file)
    }
}
