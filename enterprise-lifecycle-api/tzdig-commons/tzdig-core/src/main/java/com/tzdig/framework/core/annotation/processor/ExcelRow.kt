package com.tzdig.framework.core.annotation.processor

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.core.annotation.ExcelRequired
import org.springframework.util.ObjectUtils
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.hasAnnotation

abstract class ExcelRow<T : ExcelRow<T>> :
    ExcelRequiredProcessor<T> {
    private val declaredMemberProperties
        get() = this::class.declaredMemberProperties

    @ExcelProperty("失败原因", index = 0)
    var failReason: String? = null

    override fun processExcelRequired() {
        for (prop in declaredMemberProperties) {
            if (!prop.hasAnnotation<ExcelRequired>()) continue
            val value = prop.getter.call(this)
            if (!ObjectUtils.isEmpty(value)) continue
            val name = prop.findAnnotation<ExcelProperty>()?.value ?: prop.name
            throw IllegalArgumentException("${name}不可为空")
        }
    }

    @Throws(IllegalArgumentException::class)
    open fun verify() {
        processExcelRequired()
    }
}
