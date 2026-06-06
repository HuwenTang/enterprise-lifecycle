package com.tzdig.framework.file.model.vo

import java.io.File

data class FileDownloadVO(
    val name: String,
    var path: String,
) {
    init {
        val filename = path.substringAfterLast('#', "")
        path = path.substringBefore('?').substringBefore('#') + '#' + filename
    }

    companion object {
        fun File.downloadVO(name: String): FileDownloadVO {
            val absolutePath = absolutePath.replace('\\', '/').substringAfter(':')
            return FileDownloadVO(name, absolutePath)
        }
    }
}
