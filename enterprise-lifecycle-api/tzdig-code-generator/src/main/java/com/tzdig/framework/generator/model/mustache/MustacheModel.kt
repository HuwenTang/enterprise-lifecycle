package com.tzdig.framework.generator.model.mustache

import com.github.mustachejava.DefaultMustacheFactory
import com.github.mustachejava.Mustache
import com.tzdig.framework.generator.util.ResourceUtils.classLoader
import java.io.File

@Suppress("unused")
abstract class MustacheModel(
    template: String,
    open val packageName: String,
    open val imports: List<Import>,
    open val className: String,
) {
    val mustache: Mustache
    val excelRowClassName get() = "${className}ExcelRow"
    val dtoClassName get() = "${className}DTO"
    val qoClassName get() = "${className}QO"
    val voClassName get() = "${className}VO"
    val mapperClassName get() = "${className}Mapper"

    init {
        val file = classLoader.getResource(template)!!.file
        mustache = mustacheFactory.compile(file)
    }

    fun render(file: File) = file.writer().use { writer ->
        mustache.execute(writer, this).flush()
    }

    companion object {
        const val STRING_GENERICS = "<String>"

        private val mustacheFactory = DefaultMustacheFactory()
        fun Set<String>.sortedImports() = map(MustacheModel::Import).sortedBy { it.importClass }
    }

    data class Import(
        val importClass: String,
    )
}
