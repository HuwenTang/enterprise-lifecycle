@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.alibaba.fastjson2.parseArray
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.mybatis.entity.prime.ProjectAppeal
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectAppealVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String,
    @get:Schema(description = "申诉人")
    @ExcelProperty("申诉人")
    var appealer: String = "",
    @get:Schema(description = "申诉时间")
    @ExcelProperty("申诉时间")
    val createTime: LocalDateTime,
    @get:Schema(description = "招商ID")
    @ExcelProperty("招商ID")
    val investmentId: String,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String,
    @get:Schema(description = "市级机关名称")
    @ExcelProperty("市级机关名称")
    val sjjgName: String,
    @get:Schema(description = "用户ID")
    @ExcelProperty("用户ID")
    val userid: String,
    @get:Schema(description = "问题描述")
    @ExcelProperty("问题描述")
    val description: String,
    @get:Schema(description = "图片")
    @ExcelProperty("图片")
    val images: List<FileDownloadVO>,
    @get:Schema(description = "状态")
    val status: String,
) : S3Transformable {
    @get:Schema(description = "状态")
    @get:JsonLabel("project_appeal_status")
    val statusLabel: String get() = status

    constructor(record: ProjectAppeal) : this(
        id = record.id!!,
        createTime = record.createTime!!,
        investmentId = record.investmentId!!,
        projectName = record.projectName!!,
        sjjgName = record.sjjgName!!,
        userid = record.userid!!,
        description = record.description!!,
        images = record.images.parseArray<FileDownloadVO>(),
        status = record.status!!,
    )

    override fun s3transform(transform: (String) -> String) {
        for (image in images) {
            image.path = transform(image.path)
        }
    }
}
