@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.StatProjectItemCostTime
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class StatProjectItemCostTimeDTO(
    @param:Schema(description = "工改ID")
    val constructionApprovalId: String?,
    @param:Schema(description = "项目代码")
    val projectCode: String?,
    @param:Schema(description = "项目地址-行政区划")
    val administrativeDivision: String?,
    @param:Schema(description = "园区")
    val park: String?,
    @param:Schema(description = "办件编号")
    val documentNumber: String?,
    @param:Schema(description = "事项名称")
    val itemName: String?,
    @param:Schema(description = "办件状态")
    val docStatus: String?,
    @param:Schema(description = "花费时间（小时）")
    val spendTime: Long?,
    @param:Schema(description = "开始时间")
    val startTime: LocalDateTime? = null,
) {
    fun toStatProjectItemCostTime(): StatProjectItemCostTime =
        StatProjectItemCostTime {
            into(this)
        }

    fun into(record: StatProjectItemCostTime): StatProjectItemCostTime {
        record.constructionApprovalId = constructionApprovalId
        record.projectCode = projectCode
        record.district = administrativeDivision
        record.park = park
        record.documentNumber = documentNumber
        record.itemName = itemName
        record.docStatus = docStatus
        record.spendTime = spendTime
        record.startTime = startTime

        return record
    }
}
