@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate
import java.time.LocalDateTime

data class ExtZsProjectOperationVO(
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val name: String?,
    @get:Schema(description = "招引单位")
    @ExcelProperty("招引单位")
    val zoneName: String?,
    @get:Schema(description = "投资方名称")
    @ExcelProperty("投资方名称")
    val investor: String?,
    @get:Schema(description = "项目选址位置")
    @ExcelProperty("项目选址位置")
    val projectAddress: String?,
    @get:Schema(description = "签约日期")
    @ExcelProperty("签约日期")
    val signedStatDate: LocalDateTime?,
    @get:Schema(description = "1-服务业 2-制造业")
    @ExcelProperty("1-服务业 2-制造业")
    val bIndustry: String?,
    @get:Schema(description = "是否科创项目")
    @ExcelProperty("是否科创项目")
    val isKcProj: String?,
    @get:Schema(description = "科创项目认定条件")
    @ExcelProperty("科创项目认定条件")
    val kcProjTj: String?,
    @get:Schema(description = "QFLP外资项目")
    @ExcelProperty("QFLP外资项目")
    val isQflp: String?,
    @get:Schema(description = "统一社会信用代码")
    @ExcelProperty("统一社会信用代码")
    val uCode: String?,
    @get:Schema(description = "注册日期")
    @ExcelProperty("注册日期")
    val regDate: LocalDateTime?,
    @get:Schema(description = "主要产品、产能及主要建设内容")
    @ExcelProperty("主要产品、产能及主要建设内容")
    val desc: String?,
    @get:Schema(description = "行业分类代码")
    @ExcelProperty("行业分类代码")
    val industryCode: String?,
    @get:Schema(description = "行业分类")
    @ExcelProperty("行业分类")
    val industryName: String?,
    @get:Schema(description = "产业方向")
    @ExcelProperty("产业方向")
    val projType: String?,
    @get:Schema(description = "项目类型, t_proj_type")
    var projTypeLabel: String? = null,
    @get:Schema(description = "总投资")
    @ExcelProperty("总投资")
    val investMoney: String?,
    @get:Schema(description = "固定资产投资（万元）")
    @ExcelProperty("固定资产投资（万元）")
    val fixedInvest: String?,
    @get:Schema(description = "批准部门及文号")
    @ExcelProperty("批准部门及文号")
    val pzwh: String?,
    @get:Schema(description = "批准日期")
    @ExcelProperty("批准日期")
    val pzrq: LocalDateTime?,
    @get:Schema(description = "成效情况")
    @ExcelProperty("成效情况")
    val cxqk: String?,
    @get:Schema(description = "备案核准日期")
    @ExcelProperty("备案核准日期")
    val checkStatDate: LocalDate?,
    @get:Schema(description = "开工作证材料")
    @ExcelProperty("开工作证材料")
    val kgzzcl: List<String>?,
    @get:Schema(description = "竣工佐证材料")
    @ExcelProperty("竣工佐证材料")
    val jgzzcl: List<String>?,
    @get:Schema(description = "质态评估评审结果")
    @ExcelProperty("质态评估评审结果")
    val ztpgzzcl: List<String>?,
    @get:Schema(description = "开工日期")
    @ExcelProperty("开工日期")
    val startDate: LocalDateTime?,
    @get:Schema(description = "竣工")
    @ExcelProperty("竣工")
    val endDate: LocalDateTime?,
    @get:Schema(description = "招引单位")
    @ExcelProperty("招引单位")
    var department: String?,
    @get:Schema(description = "内外资")
    @ExcelProperty("内外资")
    var pType: String?,
    @get:Schema(description = "是否为签约工业、服务业项目转科创项目")
    @ExcelProperty("是否为签约工业、服务业项目转科创项目")
    val kgIsZkc: String?,
    @get:Schema(description = "符合科创证明材料")
    @ExcelProperty("符合科创证明材料")
    val kczzcl: String?,
    @get:Schema(description = "人才佐证材料")
    @ExcelProperty("人才佐证材料")
    val rczzcl: List<String>?,
    @get:Schema(description = " 企业人员总数")
    @ExcelProperty(" 企业人员总数")
    val qyTotalNum: String?,
    @get:Schema(description = "企业社保2个月以上人数")
    @ExcelProperty("企业社保2个月以上人数")
    val qySbNum: String?,
    @get:Schema(description = "企业在泰研发人数")
    @ExcelProperty("企业在泰研发人数")
    val qyTzyfNum: String?,
    @get:Schema(description = "企业当年度研发投入（万元）")
    @ExcelProperty("企业当年度研发投入（万元）")
    val qyYfMoney: String?,
    @get:Schema(description = "参保作证材料/专利证书或受理通知书证明材料")
    @ExcelProperty("参保作证材料/专利证书或受理通知书证明材料")
    val cbzzcl: List<String>?,
) {
    constructor(record: ExtZsProjectOperation) : this(
        name = record.name,
        zoneName = record.zoneName,
        investor = record.investor,
        projectAddress = record.projectAddress,
        signedStatDate = record.signedStatDate,
        bIndustry = record.bIndustry,
        isKcProj = record.isKcProj,
        isQflp = record.isQflp,
        uCode = record.uCode,
        regDate = record.regDate,
        desc = record.desc,
        industryCode = record.industryCode,
        industryName = record.industryName,
        projType = record.projType,
        investMoney = record.investMoney,
        fixedInvest = record.fixedInvest,
        pzwh = record.pzwh,
        pzrq = record.pzrq,
        cxqk = record.cxqk,
        checkStatDate = record.checkStatDate,
        kgzzcl = record.kgzzcl?.split(";")?.filter(String::isNotEmpty),
        jgzzcl = record.jgzzcl?.split(";")?.filter(String::isNotEmpty),
        ztpgzzcl = record.ztpgzzcl?.split(";")?.filter(String::isNotEmpty),
        kcProjTj = record.kcProjTj,
        startDate = record.startDateCommit,
        endDate = record.completeDate,
        department = null,
        pType = null,
        kgIsZkc = record.kgIsZkc,
        kczzcl = record.kczzcl,
        rczzcl = record.rczzcl?.split(";")?.filter(String::isNotEmpty),
        qyTotalNum = record.qyTotalNum,
        qySbNum = record.qySbNum,
        qyTzyfNum = record.qyTzyfNum,
        qyYfMoney = record.qyYfMoney,
        cbzzcl = record.cbzzcl?.split(";")?.filter(String::isNotEmpty),
    )
}
