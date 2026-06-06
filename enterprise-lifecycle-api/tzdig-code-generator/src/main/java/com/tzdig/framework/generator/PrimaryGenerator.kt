package com.tzdig.framework.generator

import com.tzdig.framework.generator.model.Columns
import com.tzdig.framework.generator.model.base.BaseModel
import com.tzdig.framework.generator.model.mustache.*
import com.tzdig.framework.generator.model.mustache.MustacheModel.Companion.sortedImports
import java.io.File
import kotlin.reflect.full.memberProperties

class PrimaryGenerator(
    private val javaDirectory: File,
    packages: String,
    private val mybatisPackage: String,
    private val mybatisSubPackage: String,
) {
    private val packages: List<String> = packages.split('.')
    private val dtoPackage: MutableList<String> =
        this.packages.toMutableList().apply { add("model"); add("dto") }
    private val qoPackage: MutableList<String> =
        this.packages.toMutableList().apply { add("model"); add("qo") }
    private val voPackage: MutableList<String> =
        this.packages.toMutableList().apply { add("model"); add("vo") }
    private val controllerPackage: MutableList<String> =
        this.packages.toMutableList().apply { add("controller") }

    fun generate(
        table: String,
        tableComment: String,
    ) {
        val className = table.split('_').joinToString("") { it.replaceFirstChar(Char::uppercase) }
        generateModel(table, className, "ExcelRow")
        generateModel(table, className, "DTO")
        generateModel(table, className, "QO")
        generateModel(table, className, "VO")
        generateController(table, className, tableComment)
    }

    private fun generateModel(
        tableName: String,
        className: String,
        suffix: String,
    ) {
        var dir = javaDirectory.absoluteFile
        when (suffix) {
            "ExcelRow" -> dtoPackage
            "DTO" -> dtoPackage
            "QO" -> qoPackage
            else -> voPackage
        }.forEach { dir = dir.resolve(it) }
        dir.mkdirs()
        val file = dir.resolve("${className}${suffix}.kt")
        //
        val imports = mutableSetOf<String>()
        when (suffix) {
            "ExcelRow" -> {
                imports.add("cn.idev.excel.annotation.ExcelProperty")
                imports.add("cn.idev.excel.annotation.write.style.HeadFontStyle")
                imports.add("cn.idev.excel.annotation.write.style.HeadRowHeight")
                imports.add("com.tzdig.framework.core.annotation.processor.ExcelRow")
            }

            "DTO" -> {
                imports.add("io.swagger.v3.oas.annotations.media.Schema")
            }

            "QO" -> {
                imports.add("io.swagger.v3.oas.annotations.media.Schema")
            }

            else -> {
                imports.add("cn.idev.excel.annotation.ExcelProperty")
                imports.add("io.swagger.v3.oas.annotations.media.Schema")
            }
        }
        if (suffix != "QO") {
            if (mybatisSubPackage.isNotEmpty()) {
                imports.add("${mybatisPackage}.entity.${mybatisSubPackage}.${className}")
            } else {
                imports.add("${mybatisPackage}.entity.${className}")
            }
        }
        val fields = Columns.getColumns(tableName).mapNotNull { col ->
            if (col.fieldName == "id" && suffix == "VO")
                return@mapNotNull col.transfer4dto(className, imports)
            if (col.fieldName in BaseModel::class.memberProperties.map { it.name })
                return@mapNotNull null
            col.transfer4dto(className, imports)
        }
        when (suffix) {
            "ExcelRow" -> {
                ExcelRowMustacheModel(
                    packageName = dtoPackage.joinToString("."),
                    imports = imports.sortedImports(),
                    className = className,
                    fields = fields,
                )
            }

            "DTO" -> {
                DtoMustacheModel(
                    packageName = dtoPackage.joinToString("."),
                    imports = imports.sortedImports(),
                    className = className,
                    fields = fields,
                )
            }

            "QO" -> {
                QoMustacheModel(
                    packageName = qoPackage.joinToString("."),
                    imports = imports.sortedImports(),
                    className = className,
                    fields = fields,
                )
            }

            else -> {
                VoMustacheModel(
                    packageName = voPackage.joinToString("."),
                    imports = imports.sortedImports(),
                    className = className,
                    fields = fields,
                )
            }
        }.render(file)
    }

    private fun generateController(
        tableName: String,
        className: String,
        tableComment: String,
    ) {
        var dir = javaDirectory.absoluteFile
        controllerPackage.forEach { dir = dir.resolve(it) }
        dir.mkdirs()
        val file = dir.resolve("${className}Controller.kt")
        //
        val imports = mutableSetOf(
//            "cn.dev33.satoken.annotation.SaCheckPermission",
            "com.mybatisflex.core.row.Db",
            "com.mybatisflex.kotlin.extensions.db.deleteById",
            "com.mybatisflex.kotlin.extensions.db.mapper",
            "com.mybatisflex.kotlin.extensions.db.paginate",
            "com.mybatisflex.kotlin.extensions.db.queryOneById",
            "com.mybatisflex.kotlin.scope.QueryScope",
            "io.swagger.v3.oas.annotations.tags.Tag",
            "io.swagger.v3.oas.annotations.Operation",
            "org.springframework.http.MediaType",
            "org.springframework.web.bind.annotation.*",
            "org.springframework.web.multipart.MultipartFile",
            "reactor.core.publisher.Flux",
            "com.tzdig.framework.mybatis.pageable.Pageable",
            "com.tzdig.framework.mybatis.pageable.PageableQuery",
            "com.tzdig.framework.mybatis.pageable.PageableResult",
            "com.tzdig.framework.web.exception.NotFoundException",
            "com.tzdig.framework.web.util.ExcelReadUtils",
            "com.tzdig.framework.web.util.ExcelWriteUtils",
            "com.tzdig.framework.file.model.vo.ExcelImportResultVO",
            "com.tzdig.framework.file.model.vo.FileDownloadVO",
            "com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO",
            "com.tzdig.framework.file.util.createNewTempFile",
            "com.tzdig.framework.file.util.tempFile",
            "${dtoPackage.joinToString(".")}.${className}ExcelRow",
            "${dtoPackage.joinToString(".")}.${className}DTO",
            "${qoPackage.joinToString(".")}.${className}QO",
            "${voPackage.joinToString(".")}.${className}VO",
        )
        if (mybatisSubPackage.isNotEmpty()) {
            imports.add("${mybatisPackage}.entity.${mybatisSubPackage}.${className}")
            imports.add("${mybatisPackage}.mapper.${mybatisSubPackage}.${className}Mapper")
        } else {
            imports.add("${mybatisPackage}.entity.${className}")
            imports.add("${mybatisPackage}.mapper.${className}Mapper")
        }
        ControllerMustacheModel(
            packageName = controllerPackage.joinToString("."),
            imports = imports.sortedImports(),
            className = className,
            path = tableName.replace('_', '-'),
            tableComment = tableComment,
        ).render(file)
    }
}
