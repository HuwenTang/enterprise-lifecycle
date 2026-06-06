@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate
import java.time.LocalDateTime

@Table("ext_zs_project_operation", comment = "项目开工信息表")
class ExtZsProjectOperation() : BaseModel<ExtZsProjectOperation>() {
    constructor(init: ExtZsProjectOperation.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目名称
     */
    @Column("name", comment = "项目名称")
    var name: String? = null

    /**
     * 招引单位
     */
    @Column("zone_name", comment = "招引单位")
    var zoneName: String? = null

    /**
     * 投资方名称
     */
    @Column("investor", comment = "投资方名称")
    var investor: String? = null

    /**
     * 项目选址位置
     */
    @Column("project_address", comment = "项目选址位置")
    var projectAddress: String? = null

    /**
     * 签约日期
     */
    @Column("signed_stat_date", comment = "签约日期")
    var signedStatDate: LocalDateTime? = null

    /**
     * 1-服务业 2-制造业
     */
    @Column("b_industry", comment = "1-服务业 2-制造业")
    var bIndustry: String? = null

    /**
     * 是否科创项目
     */
    @Column("is_kc_proj", comment = "是否科创项目")
    var isKcProj: String? = null

    /**
     * 科创项目认定条件
     */
    @Column("kc_proj_tj", comment = "科创项目认定条件")
    var kcProjTj: String? = null

    /**
     * QFLP外资项目
     */
    @Column("is_qflp", comment = "QFLP外资项目")
    var isQflp: String? = null

    /**
     * 统一社会信用代码
     */
    @Column("u_code", comment = "统一社会信用代码")
    var uCode: String? = null

    /**
     * 注册日期
     */
    @Column("reg_date", comment = "注册日期")
    var regDate: LocalDateTime? = null

    /**
     * 主要产品、产能及主要建设内容
     */
    @Column("desc", comment = "主要产品、产能及主要建设内容")
    var desc: String? = null

    /**
     * 行业分类代码
     */
    @Column("industry_code", comment = "行业分类代码")
    var industryCode: String? = null

    /**
     * 行业分类
     */
    @Column("industry_name", comment = "行业分类")
    var industryName: String? = null

    /**
     * 产业方向
     */
    @Column("proj_type", comment = "产业方向")
    var projType: String? = null

    /**
     * 总投资
     */
    @Column("invest_money", comment = "总投资")
    var investMoney: String? = null

    /**
     * 固定资产投资（万元）
     */
    @Column("fixed_invest", comment = "固定资产投资（万元）")
    var fixedInvest: String? = null

    /**
     * 批准部门及文号
     */
    @Column("pzwh", comment = "批准部门及文号")
    var pzwh: String? = null

    /**
     * 批准日期
     */
    @Column("pzrq", comment = "批准日期")
    var pzrq: LocalDateTime? = null

    /**
     * 成效情况
     */
    @Column("cxqk", comment = "成效情况")
    var cxqk: String? = null

    /**
     * 备案核准日期
     */
    @Column("check_stat_date", comment = "备案核准日期")
    var checkStatDate: LocalDate? = null

    /**
     * 开工作证材料
     */
    @Column("kgzzcl", comment = "开工作证材料")
    var kgzzcl: String? = null

    /**
     * 竣工佐证材料
     */
    @Column("jgzzcl", comment = "竣工佐证材料")
    var jgzzcl: String? = null

    /**
     * 质态评估评审结果
     */
    @Column("ztpgzzcl", comment = "质态评估评审结果")
    var ztpgzzcl: String? = null

    /**
     * 开工日期
     */
    @Column("start_date_commit", comment = "开工日期")
    var startDateCommit: LocalDateTime? = null

    /**
     * 竣工
     */
    @Column("complete_date", comment = "竣工")
    var completeDate: LocalDateTime? = null

    /**
     * 是否为签约工业、服务业项目转科创项目
     */
    @Column("kg_is_zkc", comment = "是否为签约工业、服务业项目转科创项目")
    var kgIsZkc: String? = null

    /**
     * 符合科创证明材料
     */
    @Column("kczzcl", comment = "符合科创证明材料")
    var kczzcl: String? = null

    /**
     * 人才佐证材料
     */
    @Column("rczzcl", comment = "人才佐证材料")
    var rczzcl: String? = null

    /**
     *  企业人员总数
     */
    @Column("qy_total_num", comment = " 企业人员总数")
    var qyTotalNum: String? = null

    /**
     * 企业社保2个月以上人数
     */
    @Column("qy_sb_num", comment = "企业社保2个月以上人数")
    var qySbNum: String? = null

    /**
     * 企业在泰研发人数
     */
    @Column("qy_tzyf_num", comment = "企业在泰研发人数")
    var qyTzyfNum: String? = null

    /**
     * 企业当年度研发投入（万元）
     */
    @Column("qy_yf_money", comment = "企业当年度研发投入（万元）")
    var qyYfMoney: String? = null

    /**
     * 参保作证材料/专利证书或受理通知书证明材料
     */
    @Column("cbzzcl", comment = "参保作证材料/专利证书或受理通知书证明材料")
    var cbzzcl: String? = null
}
