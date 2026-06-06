package com.tzdig.framework.config

import com.tzdig.framework.file.properties.FileProperties
import io.swagger.v3.oas.annotations.Operation
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.attribute.BasicFileAttributes
import java.time.Instant
import java.time.temporal.ChronoUnit
import kotlin.io.path.deleteIfExists

@Configuration
class TmpDownloadConfigurer : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("${FileProperties.tempDownload}/**")
            .addResourceLocations("file:${FileProperties.tempDownload}/")
    }

    @Operation(summary = "清理临时下载文件")
    @Scheduled(cron = "0 55 23 * * ?")
    fun clearExpired() {
        val expirationTime = Instant.now().minus(3, ChronoUnit.DAYS)
        val dirPath = Paths.get(FileProperties.tempDownload)
        Files.newDirectoryStream(dirPath).use { stream ->
            for (file in stream) {
                try {
                    // 跳过子目录
                    if (Files.isDirectory(file)) continue
                    // 获取文件属性
                    val lastAccessTime = Files.readAttributes(file, BasicFileAttributes::class.java)
                        .lastAccessTime()
                        .toInstant()
                    // 比较最后操作时间是否早于过期时间
                    if (lastAccessTime.isBefore(expirationTime)) {
                        file.deleteIfExists()
                    }
                } catch (_: IOException) {
                }
            }
        }
    }
}
