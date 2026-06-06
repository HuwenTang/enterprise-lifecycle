package com.tzdig.framework.controller

import com.tzdig.framework.core.util.urlEncoded
import com.tzdig.framework.file.service.FileService
import com.tzdig.framework.file.service.S3Service
import com.tzdig.framework.model.vo.FileVO
import com.tzdig.framework.web.exception.ApiException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@Tag(name = "文件服务")
@RestController
@RequestMapping("file")
@ConditionalOnBean(FileService::class)
class FileController(
    private val s3Service: S3Service,
    private val fileService: FileService,
) {
    @Operation(summary = "上传文件")
    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun upload(
        @RequestPart("files", required = false)
        @Schema(type = "file") files: List<MultipartFile>?,
        @RequestPart("file", required = false)
        @Schema(type = "file") fileList: List<MultipartFile>?,
    ): List<FileVO> = ((files ?: emptyList()) + (fileList ?: emptyList()))
        .filter { file ->
            if (file.isEmpty) return@filter false
            if (!fileService.checkMimeType(file))
                throw ApiException("文件名称异常或文件已损坏")
            true
        }
        .map { file ->
            val name = fileService.upload(file)
            val originalFilename = file.originalFilename ?: ""
            val path = "/file/$name"
            val url = s3Service.getSignedObjectUrl(path, filename = originalFilename.urlEncoded)
            FileVO(
                name = originalFilename,
                path = path + '#' + originalFilename.urlEncoded,
                url = (url ?: path) + '#' + originalFilename.urlEncoded,
            )
        }

    @Operation(summary = "下载文件", hidden = true)
    @GetMapping("{hash}/{name}")
    fun download(
        @PathVariable hash: String,
        @PathVariable name: String,
        @RequestHeader(HttpHeaders.IF_NONE_MATCH, required = false) ifNoneMatch: String?,
    ) = fileService.download("${hash}/${name}", ifNoneMatch)
}
