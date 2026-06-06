@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectDigitalProjectReviewAllDTO(
    @get:Schema(description = "招商id")
    val digitalInvestmentId: String,
    @get:Schema(description = "审核结果")
    var result: String? = null,
    @get:Schema(description = "审核评价")
    val comment: String? = null,
    @get:Schema(description = "实际完成投资（亿元）")
    val actualInvestment: Float? = null,
    @get:Schema(description = "分数")
    val score: Float? = null,
    @get:Schema(description = "步骤")
    var step: ProjectDigitalProjectReviewAll.Step? = null,
    @get:Schema(description = "年份")
    val year: Int? = null,
) {
    fun toProjectDigitalProjectReviewAll(): ProjectDigitalProjectReviewAll =
        ProjectDigitalProjectReviewAll {
            into(this)
        }

    fun into(record: ProjectDigitalProjectReviewAll): ProjectDigitalProjectReviewAll {
        record.digitalInvestmentId = digitalInvestmentId
        record.result = result
        record.comment = comment
        record.completionInvestMoney = actualInvestment
        record.score = score
        record.step = step
        return record
    }
}
