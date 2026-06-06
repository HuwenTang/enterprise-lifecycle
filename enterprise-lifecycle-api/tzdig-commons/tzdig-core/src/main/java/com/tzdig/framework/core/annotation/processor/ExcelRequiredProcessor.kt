package com.tzdig.framework.core.annotation.processor

interface ExcelRequiredProcessor<T : ExcelRow<T>> {
    fun processExcelRequired()
}
