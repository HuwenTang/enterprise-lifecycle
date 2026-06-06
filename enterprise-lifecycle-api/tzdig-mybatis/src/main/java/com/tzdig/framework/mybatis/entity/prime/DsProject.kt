@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Id
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import java.math.BigDecimal
import java.time.LocalDateTime

@Table("DS_PROJECT", comment = "项目信息（数据同步）", dataSource = "gong-gai")
class DsProject() : MapperModel<DsProject> {
    constructor(init: DsProject.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目代码
     */
    @Id
    @Column("deal_code", comment = "项目代码")
    var dealCode: String? = null

    /**
     * 项目名称
     */
    @Column("apply_project_name", comment = "项目名称")
    var applyProjectName: String? = null

    /**
     * 项目类型
     */
    @Column("audit_type", comment = "项目类型")
    var auditType: String? = null

    /**
     * 建设性质
     */
    @Column("project_type", comment = "建设性质")
    var projectType: String? = null

    /**
     * 项目（法人）单位名称
     */
    @Column("project_dept", comment = "项目（法人）单位名称")
    var projectDept: String? = null

    /**
     * 法人类型
     */
    @Column("frxz", comment = "法人类型")
    var frxz: String? = null

    /**
     * 项目法人证照类型
     */
    @Column("person_certtype", comment = "项目法人证照类型")
    var personCerttype: String? = null

    /**
     * 项目法人证照号码
     */
    @Column("person_certno", comment = "项目法人证照号码")
    var personCertno: String? = null

    /**
     * 拟开工时间
     */
    @Column("project_starttime", comment = "拟开工时间")
    var projectStarttime: Int? = null

    /**
     * 拟建成时间
     */
    @Column("project_endtime", comment = "拟建成时间")
    var projectEndtime: Int? = null

    /**
     * 总投资（万元）
     */
    @Column("total_money", comment = "总投资（万元）")
    var totalMoney: BigDecimal? = null

    /**
     * 建设地点
     */
    @Column("project_address", comment = "建设地点")
    var projectAddress: String? = null

    /**
     * 建设地点详情
     */
    @Column("area_detail_code", comment = "建设地点详情")
    var areaDetailCode: String? = null

    /**
     * 所属行业
     */
    @Column("industry", comment = "所属行业")
    var industry: String? = null

    /**
     * 建设规模及内容
     */
    @Column("scale_content", comment = "建设规模及内容")
    var scaleContent: String? = null

    /**
     * 联系人
     */
    @Column("contact", comment = "联系人")
    var contact: String? = null

    /**
     * 联系电话
     */
    @Column("contact_tel", comment = "联系电话")
    var contactTel: String? = null

    /**
     * 联系人邮箱
     */
    @Column("contact_email", comment = "联系人邮箱")
    var contactEmail: String? = null

    /**
     * 用地面积
     */
    @Column("ydmj", comment = "用地面积")
    var ydmj: BigDecimal? = null

    /**
     * 新增用地面积
     */
    @Column("xzydmj", comment = "新增用地面积")
    var xzydmj: BigDecimal? = null

    /**
     * 农用地面积
     */
    @Column("nydmj", comment = "农用地面积")
    var nydmj: BigDecimal? = null

    /**
     * 项目资本金
     */
    @Column("xmzbj", comment = "项目资本金")
    var xmzbj: BigDecimal? = null

    /**
     * 资金来源
     */
    @Column("zjly", comment = "资金来源")
    var zjly: String? = null

    /**
     * 财政资金来源
     */
    @Column("czzjly", comment = "财政资金来源")
    var czzjly: String? = null

    /**
     * 量化建设规模的类别1
     */
    @Column("lhjsgmlb1", comment = "量化建设规模的类别1")
    var lhjsgmlb1: String? = null

    /**
     * 量化建设规模的数值1
     */
    @Column("lhjsgmsz1", comment = "量化建设规模的数值1")
    var lhjsgmsz1: BigDecimal? = null

    /**
     * 量化建设规模的单位1
     */
    @Column("lhjsgmdw1", comment = "量化建设规模的单位1")
    var lhjsgmdw1: String? = null

    /**
     * 量化建设规模的类别2
     */
    @Column("lhjsgmlb2", comment = "量化建设规模的类别2")
    var lhjsgmlb2: String? = null

    /**
     * 量化建设规模的数值2
     */
    @Column("lhjsgmsz2", comment = "量化建设规模的数值2")
    var lhjsgmsz2: BigDecimal? = null

    /**
     * 量化建设规模的单位2
     */
    @Column("lhjsgmdw2", comment = "量化建设规模的单位2")
    var lhjsgmdw2: String? = null

    /**
     * 量化建设规模的类别3
     */
    @Column("lhjsgmlb3", comment = "量化建设规模的类别3")
    var lhjsgmlb3: String? = null

    /**
     * 量化建设规模的数值3
     */
    @Column("lhjsgmsz3", comment = "量化建设规模的数值3")
    var lhjsgmsz3: BigDecimal? = null

    /**
     * 量化建设规模的类别3
     */
    @Column("lhjsgmdw3", comment = "量化建设规模的类别3")
    var lhjsgmdw3: String? = null

    /**
     * 是否技改项目
     */
    @Column("isjgxm", comment = "是否技改项目")
    var isjgxm: String? = null

    /**
     * 数据变更时间
     */
    @Column("exchange_time", comment = "数据变更时间")
    var exchangeTime: LocalDateTime? = null

    /**
     * 行政区划代码
     */
    @Column("area_code", comment = "行政区划代码")
    var areaCode: String? = null

    /**
     * 行政区划名称
     */
    @Column("area_name", comment = "行政区划名称")
    var areaName: String? = null

    /**
     * 项目属性
     */
    @Column("project_property", comment = "项目属性")
    var projectProperty: String? = null

    /**
     * 是否是外资项目
     */
    @Column("is_foreign", comment = "是否是外资项目")
    var isForeign: String? = null

    /**
     * 是否涉及国家安全
     */
    @Column("foreign_involve_security", comment = "是否涉及国家安全")
    var foreignInvolveSecurity: String? = null

    /**
     * 投资方式
     */
    @Column("foreign_investment_way", comment = "投资方式")
    var foreignInvestmentWay: String? = null

    /**
     * 适用产业政策条目类型
     */
    @Column("foreign_policy_type", comment = "适用产业政策条目类型")
    var foreignPolicyType: String? = null

    /**
     * 适用产业政策条目
     */
    @Column("foreign_policy_item", comment = "适用产业政策条目")
    var foreignPolicyItem: String? = null

    /**
     * 折合美元（万元）
     */
    @Column("foreign_total_dollar", comment = "折合美元（万元）")
    var foreignTotalDollar: BigDecimal? = null

    /**
     * 使用的汇率（人民币/美元）
     */
    @Column("foreign_total_rate", comment = "使用的汇率（人民币/美元）")
    var foreignTotalRate: BigDecimal? = null

    /**
     * 项目资本金
     */
    @Column("foreign_capital", comment = "项目资本金")
    var foreignCapital: BigDecimal? = null

    /**
     * 项目资本金折合美元（外资用）
     */
    @Column("foreign_capital_dollar", comment = "项目资本金折合美元（外资用）")
    var foreignCapitalDollar: BigDecimal? = null

    /**
     * 项目资本金使用的汇率（外资用）
     */
    @Column("foreign_capital_rate", comment = "项目资本金使用的汇率（外资用）")
    var foreignCapitalRate: BigDecimal? = null

    /**
     * 投资者名称（外资用）
     */
    @Column("investor", comment = "投资者名称（外资用）")
    var investor: String? = null

    /**
     * 注册国别地区（外资用）
     */
    @Column("investor_country", comment = "注册国别地区（外资用）")
    var investorCountry: String? = null

    /**
     * 出资额（外资用）
     */
    @Column("investor_capital", comment = "出资额（外资用）")
    var investorCapital: BigDecimal? = null

    /**
     * 出资比例（外资用）
     */
    @Column("investor_capital_percent", comment = "出资比例（外资用）")
    var investorCapitalPercent: BigDecimal? = null

    /**
     * 出资方式（外资用）
     */
    @Column("investor_capital_type", comment = "出资方式（外资用）")
    var investorCapitalType: String? = null

    /**
     * 是否涉及新增固定资产投资
     */
    @Column("foreign_is_add_investment", comment = "是否涉及新增固定资产投资")
    var foreignIsAddInvestment: String? = null

    /**
     * 土地获取方式
     */
    @Column("foreign_land_way", comment = "土地获取方式")
    var foreignLandWay: String? = null

    /**
     * 总用地面积（外资用）
     */
    @Column("foreign_land_area", comment = "总用地面积（外资用）")
    var foreignLandArea: BigDecimal? = null

    /**
     * 总建筑面积（外资用）
     */
    @Column("foreign_building_area", comment = "总建筑面积（外资用）")
    var foreignBuildingArea: BigDecimal? = null

    /**
     * 是否新增设备（外资用）
     */
    @Column("foreign_is_add_equipment", comment = "是否新增设备（外资用）")
    var foreignIsAddEquipment: String? = null

    /**
     * 其中：拟进口设备数量及金额（外资用）
     */
    @Column("foreign_equipment_num", comment = "其中：拟进口设备数量及金额（外资用）")
    var foreignEquipmentNum: String? = null

    /**
     * 项目单位是否筹建中（外资用）
     */
    @Column("foreign_is_have_dept", comment = "项目单位是否筹建中（外资用）")
    var foreignIsHaveDept: String? = null

    /**
     * 项目单位地址(外资用)
     */
    @Column("foreign_dept_address", comment = "项目单位地址(外资用)")
    var foreignDeptAddress: String? = null

    /**
     * 项目单位性质(外资用)
     */
    @Column("foreign_dept_nature", comment = "项目单位性质(外资用)")
    var foreignDeptNature: String? = null

    /**
     * 项目单位中、外方各股东及持股比例是否与项目资本金出资结构相同
     */
    @Column("foreign_is_same", comment = "项目单位中、外方各股东及持股比例是否与项目资本金出资结构相同")
    var foreignIsSame: String? = null

    /**
     * 中方股比(外资用)
     */
    @Column("foreign_china_percent", comment = "中方股比(外资用)")
    var foreignChinaPercent: BigDecimal? = null

    /**
     * 外方股比(外资用)
     */
    @Column("foreign_foreign_percent", comment = "外方股比(外资用)")
    var foreignForeignPercent: BigDecimal? = null

    /**
     * 主要经营范围(外资用)
     */
    @Column("foreign_management", comment = "主要经营范围(外资用)")
    var foreignManagement: String? = null

    /**
     * 联系电话（外资用）
     */
    @Column("foreign_tel", comment = "联系电话（外资用）")
    var foreignTel: String? = null

    /**
     * 传真（外资用）
     */
    @Column("foreign_fax", comment = "传真（外资用）")
    var foreignFax: String? = null

    /**
     * 通讯地址（外资用）
     */
    @Column("foreign_address", comment = "通讯地址（外资用）")
    var foreignAddress: String? = null

    /**
     * 备注（外资用）
     */
    @Column("foreign_remark", comment = "备注（外资用）")
    var foreignRemark: String? = null

    /**
     * 项目所在地（境外用）
     */
    @Column("abroad_project_address", comment = "项目所在地（境外用）")
    var abroadProjectAddress: String? = null

    /**
     * 中方投资额（境外用）
     */
    @Column("abroad_chinese_investment", comment = "中方投资额（境外用）")
    var abroadChineseInvestment: BigDecimal? = null

    /**
     * 所属地区详细
     */
    @Column("area_detial", comment = "所属地区详细")
    var areaDetial: String? = null

    /**
     * 所属行业
     */
    @Column("the_industry", comment = "所属行业")
    var theIndustry: String? = null

    /**
     * 项目类型（外资用）
     */
    @Column("foreign_project_type", comment = "项目类型（外资用）")
    var foreignProjectType: String? = null

    /**
     * 核准文件文号(外资用)
     */
    @Column("foreign_approve_num", comment = "核准文件文号(外资用)")
    var foreignApproveNum: String? = null

    /**
     * 一般性变更事项及原因(外资用)
     */
    @Column("foreign_change_reason", comment = "一般性变更事项及原因(外资用)")
    var foreignChangeReason: String? = null

    /**
     * 法人单位的法定代表人姓名
     */
    @Column("legal_person_name", comment = "法人单位的法定代表人姓名")
    var legalPersonName: String? = null

    /**
     * 项目申报日期
     */
    @Column("apply_time", comment = "项目申报日期")
    var applyTime: LocalDateTime? = null

    /**
     * 项目具体建设地点
     */
    @Column("address_detial", comment = "项目具体建设地点")
    var addressDetail: String? = null

    /**
     * 建设地点名称
     */
    @Column("area_detials", comment = "建设地点名称")
    var areaDetials: String? = null

    /**
     * 项目预审时间
     */
    @Column("finishtime", comment = "项目预审时间")
    var finishtime: LocalDateTime? = null

    /**
     * 项目预审部门
     */
    @Column("deal_deptname", comment = "项目预审部门")
    var dealDeptname: String? = null

    /**
     * 是否属于集中建设项目
     */
    @Column("is_focus", comment = "是否属于集中建设项目")
    var isFocus: String? = null

    /**
     * 集中建设单位名称
     */
    @Column("focus_dept_name", comment = "集中建设单位名称")
    var focusDeptName: String? = null

    /**
     * 集中建设单位统一社会信用代码
     */
    @Column("focus_dept_code", comment = "集中建设单位统一社会信用代码")
    var focusDeptCode: String? = null

    /**
     * 集中建设单位法定代表人姓名
     */
    @Column("focus_dept_legap", comment = "集中建设单位法定代表人姓名")
    var focusDeptLegap: String? = null

    /**
     * 泰兴掌上督同步
     */
    @Column("sync_sign", comment = "泰兴掌上督同步")
    var syncSign: BigDecimal? = null
}
