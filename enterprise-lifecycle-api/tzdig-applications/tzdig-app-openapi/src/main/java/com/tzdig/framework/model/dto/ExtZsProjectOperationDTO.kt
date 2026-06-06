@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.tzdig.framework.core.util.toInstant
import com.tzdig.framework.core.util.toLocalDate
import com.tzdig.framework.core.util.toLocalDateTime
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import io.swagger.v3.oas.annotations.media.Schema

data class ExtZsProjectOperationDTO(
    @Schema(description = "招商项目ID")
    val id: String,
    @Schema(description = "项目名称")
    val name: String?,
    @Schema(description = "招引单位")
    @JsonProperty("zone_name")
    val zoneName: String?,
    @Schema(description = "投资方名称")
    val investor: String?,
    @Schema(description = "项目选址位置")
    @JsonProperty("project_address")
    val projectAddress: String?,
    @Schema(description = "签约日期")
    @JsonProperty("signed_stat_date")
    val signedStatDate: Long?,
    @Schema(description = "1-服务业 2-制造业")
    @JsonProperty("b_industry")
    val bIndustry: String?,
    @Schema(description = "是否科创项目")
    @JsonProperty("is_kc_proj")
    val isKcProj: String?,
    @Schema(description = "QFLP外资项目")
    @JsonProperty("is_qflp")
    val isQflp: String?,
    @Schema(description = "统一社会信用代码")
    @JsonProperty("u_code")
    val uCode: String?,
    @Schema(description = "注册日期")
    @JsonProperty("reg_date")
    val regDate: Long?,
    @Schema(description = "主要产品、产能及主要建设内容")
    val desc: String?,
    @Schema(description = "行业分类代码")
    @JsonProperty("industry_code")
    val industryCode: String?,
    @Schema(description = "行业分类")
    @JsonProperty("industry_name")
    val industryName: String?,
    @Schema(description = "产业方向")
    @JsonProperty("proj_type")
    val projType: String?,
    @Schema(description = "总投资")
    @JsonProperty("invest_money")
    val investMoney: String?,
    @Schema(description = "固定资产投资（万元）")
    @JsonProperty("fixed_invest")
    val fixedInvest: String?,
    @Schema(description = "批准部门及文号")
    val pzwh: String?,
    @Schema(description = "批准日期")
    val pzrq: Long?,
    @Schema(description = "成效情况")
    val cxqk: String?,
    @Schema(description = "备案核准日期")
    @JsonProperty("check_stat_date")
    val checkStatDate: Long?,
    @Schema(description = "开工作证材料")
    val kgzzcl: String?,
    @Schema(description = "竣工佐证材料")
    val jgzzcl: String?,
    @Schema(description = "质态评估评审结果")
    val ztpgzzcl: String?,
    @Schema(description = "科创项目认定条件")
    @JsonProperty("kc_proj_tj")
    val kcProjTj: String?,
    @Schema(description = "开工时间")
    @JsonProperty("start_date_commit")
    val startTime: Long?,
    @Schema(description = "竣工时间")
    @JsonProperty("complete_date")
    val endTime: Long?,
) {
    fun toExtZsProjectOperation(): ExtZsProjectOperation =
        ExtZsProjectOperation {
            into(this)
        }

    fun into(record: ExtZsProjectOperation): ExtZsProjectOperation {
        record.id = id
        record.name = name
        record.zoneName = zoneName
        record.investor = investor
        record.projectAddress = projectAddress
        record.signedStatDate = signedStatDate?.toInstant()?.toLocalDateTime()
        record.bIndustry = bIndustry
        record.isKcProj = isKcProj
        record.isQflp = isQflp
        record.uCode = uCode
        record.regDate = regDate?.toInstant()?.toLocalDateTime()
        record.desc = desc
        record.industryCode = industryCode
        record.industryName = industryName
        record.projType = projType
        record.investMoney = investMoney
        record.fixedInvest = fixedInvest
        record.pzwh = pzwh
        record.pzrq = pzrq?.toInstant()?.toLocalDateTime()
        record.cxqk = cxqk
        record.checkStatDate = checkStatDate?.toInstant()?.toLocalDate()
        record.kgzzcl = kgzzcl
        record.jgzzcl = jgzzcl
        record.ztpgzzcl = ztpgzzcl
        record.kcProjTj = kcProjTj
        record.startDateCommit = startTime?.toInstant()?.toLocalDateTime()
        record.completeDate = endTime?.toInstant()?.toLocalDateTime()
        return record
    }
}
