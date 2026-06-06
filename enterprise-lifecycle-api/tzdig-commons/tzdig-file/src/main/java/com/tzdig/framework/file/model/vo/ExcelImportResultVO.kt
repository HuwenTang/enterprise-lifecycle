package com.tzdig.framework.file.model.vo

data class ExcelImportResultVO(
    val totalCount: Long,
    val successCount: Long,
    val failCount: Long,
    val result: FileDownloadVO?,
)
