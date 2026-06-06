package com.tzdig.framework.file.util

import com.tzdig.framework.file.properties.FileProperties
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.*

fun createNewTempFile(fileExt: String): File {
    val suffix = ('.' + fileExt.lowercase())
        .replace('/', '.')
        .replace('\\', '.')
        .substringAfterLast('.')
    return File("${FileProperties.tempDownload}/${UUID.randomUUID()}.${suffix}")
        .apply { parentFile.mkdirs() }
        .apply { createNewFile() }
        .apply { deleteOnExit() }
}

fun MultipartFile.tempFile(suffix: String): File {
    val file = File.createTempFile("temp-", suffix)
    file.deleteOnExit()
    transferTo(file)
    return file
}
