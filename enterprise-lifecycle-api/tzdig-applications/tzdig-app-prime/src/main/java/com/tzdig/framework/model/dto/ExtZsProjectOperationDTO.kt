@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate
import java.time.LocalDateTime

data class ExtZsProjectOperationDTO(
    @param:Schema(description = "项目名称")
    val name: String?,
    @param:Schema(description = "招引单位")
    val zoneName: String?,
    @param:Schema(description = "投资方名称")
    val investor: String?,
    @param:Schema(description = "项目选址位置")
    val projectAddress: String?,
    @param:Schema(description = "签约日期")
    val signedStatDate: LocalDateTime?,
    @param:Schema(description = "1-服务业 2-制造业")
    val bIndustry: String?,
    @param:Schema(description = "是否科创项目")
    val isKcProj: String?,
    @param:Schema(description = "科创项目认定条件")
    val kcProjTj: String?,
    @param:Schema(description = "QFLP外资项目")
    val isQflp: String?,
    @param:Schema(description = "统一社会信用代码")
    val uCode: String?,
    @param:Schema(description = "注册日期")
    val regDate: LocalDateTime?,
    @param:Schema(description = "主要产品、产能及主要建设内容")
    val desc: String?,
    @param:Schema(description = "行业分类代码")
    val industryCode: String?,
    @param:Schema(description = "行业分类")
    val industryName: String?,
    @param:Schema(description = "产业方向")
    val projType: String?,
    @param:Schema(description = "总投资")
    val investMoney: String?,
    @param:Schema(description = "固定资产投资（万元）")
    val fixedInvest: String?,
    @param:Schema(description = "批准部门及文号")
    val pzwh: String?,
    @param:Schema(description = "批准日期")
    val pzrq: LocalDateTime?,
    @param:Schema(description = "成效情况")
    val cxqk: String?,
    @param:Schema(description = "备案核准日期")
    val checkStatDate: LocalDate?,
    @param:Schema(description = "开工作证材料")
    val kgzzcl: String?,
    @param:Schema(description = "竣工佐证材料")
    val jgzzcl: String?,
    @param:Schema(description = "质态评估评审结果")
    val ztpgzzcl: String?,
    @param:Schema(description = "开工日期")
    val startDateCommit: LocalDateTime?,
    @param:Schema(description = "竣工")
    val completeDate: LocalDateTime?,
    @param:Schema(description = "是否为签约工业、服务业项目转科创项目")
    val kgIsZkc: String?,
    @param:Schema(description = "符合科创证明材料")
    val kczzcl: String?,
    @param:Schema(description = "人才佐证材料")
    val rczzcl: String?,
    @param:Schema(description = " 企业人员总数")
    val qyTotalNum: String?,
    @param:Schema(description = "企业社保2个月以上人数")
    val qySbNum: String?,
    @param:Schema(description = "企业在泰研发人数")
    val qyTzyfNum: String?,
    @param:Schema(description = "企业当年度研发投入（万元）")
    val qyYfMoney: String?,
    @param:Schema(description = "参保作证材料/专利证书或受理通知书证明材料")
    val cbzzcl: String?,
) {
    fun toExtZsProjectOperation(): ExtZsProjectOperation =
        ExtZsProjectOperation {
            into(this)
        }

    fun into(record: ExtZsProjectOperation): ExtZsProjectOperation {
        record.name = name
        record.zoneName = zoneName
        record.investor = investor
        record.projectAddress = projectAddress
        record.signedStatDate = signedStatDate
        record.bIndustry = bIndustry
        record.isKcProj = isKcProj
        record.kcProjTj = kcProjTj
        record.isQflp = isQflp
        record.uCode = uCode
        record.regDate = regDate
        record.desc = desc
        record.industryCode = industryCode
        record.industryName = industryName
        record.projType = projType
        record.investMoney = investMoney
        record.fixedInvest = fixedInvest
        record.pzwh = pzwh
        record.pzrq = pzrq
        record.cxqk = cxqk
        record.checkStatDate = checkStatDate
        record.kgzzcl = kgzzcl
        record.jgzzcl = jgzzcl
        record.ztpgzzcl = ztpgzzcl
        record.startDateCommit = startDateCommit
        record.completeDate = completeDate
        record.kgIsZkc = kgIsZkc
        record.kczzcl = kczzcl
        record.rczzcl = rczzcl
        record.qyTotalNum = qyTotalNum
        record.qySbNum = qySbNum
        record.qyTzyfNum = qyTzyfNum
        record.qyYfMoney = qyYfMoney
        record.cbzzcl = cbzzcl
        return record
    }
}
