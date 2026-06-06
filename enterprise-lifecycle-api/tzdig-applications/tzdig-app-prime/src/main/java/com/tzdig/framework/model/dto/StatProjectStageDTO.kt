@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.StatProjectStage
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class StatProjectStageDTO(
    @param:Schema(description = "工改ID")
    val constructionApprovalId: String? = null,
    @param:Schema(description = "项目代码")
    val projectCode: String? = null,
    @param:Schema(description = "项目地址-行政区划")
    val administrativeDivision: String? = null,
    @param:Schema(description = "园区")
    val park: String? = null,
    @param:Schema(description = "项目阶段")
    val stage: String? = null,
    @param:Schema(description = "进入当前阶段时间")
    val stageCreateTime: LocalDateTime? = null,
) {
    fun toStatProjectStage(): StatProjectStage =
        StatProjectStage {
            into(this)
        }

    fun into(record: StatProjectStage): StatProjectStage {
        record.constructionApprovalId = constructionApprovalId
        record.projectCode = projectCode
        record.district = administrativeDivision
        record.park = park
        record.stage = stage
        record.stageCreateTime = stageCreateTime
        return record
    }
}
