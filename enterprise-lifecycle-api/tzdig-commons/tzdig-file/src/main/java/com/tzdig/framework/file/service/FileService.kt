package com.tzdig.framework.file.service

import org.springframework.core.io.Resource
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile

interface FileService {
    fun upload(file: MultipartFile): String
    fun download(
        name: String,
        ifNoneMatch: String?,
    ): ResponseEntity<Resource>

    fun checkMimeType(file: MultipartFile): Boolean
}
