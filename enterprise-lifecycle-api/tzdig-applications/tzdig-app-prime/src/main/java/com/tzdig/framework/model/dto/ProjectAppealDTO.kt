@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.alibaba.fastjson2.toJSONString
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.mybatis.entity.prime.ProjectAppeal
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.security.extension.userAccount
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectAppealDTO(
    @param:Schema(description = "招商ID")
    val investmentId: String,
    @param:Schema(description = "问题描述")
    val description: String,
    @param:Schema(description = "图片")
    val images: List<FileDownloadVO>,
) {
    fun toProjectAppeal(): ProjectAppeal =
        ProjectAppeal {
            userid = userAccount.id
            status = ProjectAppeal.Status.PENDING
            into(this)
        }

    fun into(record: ProjectAppeal): ProjectAppeal {
        record.investmentId = investmentId
        val project = queryOneById<ProjectDigitalInvestmentAttracting>(investmentId)
        record.projectName = project?.projectName
        record.sjjgName = project?.sjjgName
        record.description = description
        record.images = images.toJSONString()
        return record
    }
}
