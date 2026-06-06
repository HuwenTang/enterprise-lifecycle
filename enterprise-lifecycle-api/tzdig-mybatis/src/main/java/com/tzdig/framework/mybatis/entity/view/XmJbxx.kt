@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.view

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import java.time.LocalDate
import java.time.LocalDateTime

@Table("xm_jbxx")
class XmJbxx() : MapperModel<XmJbxx> {
    constructor(init: XmJbxx.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目ID
     */
    @Column("xmid", comment = "项目ID")
    var xmid: String? = null

    /**
     * 项目编码
     */
    @Column("xmbm", comment = "项目编码")
    var xmbm: String? = null

    /**
     * 所属板块
     */
    @Column("ssbk", comment = "所属板块")
    var ssbk: String? = null

    /**
     * 行业名称
     */
    @Column("industry_name", comment = "行业名称")
    var industryName: String? = null

    /**
     * 项目类型名称
     */
    @Column("proj_type_name", comment = "项目类型名称")
    var projTypeName: String? = null

    /**
     * 项目属性
     */
    @Column("xmsx", comment = "项目属性")
    var xmsx: String? = null

    /**
     * 项目内容
     */
    @Column("xmnr", comment = "项目内容")
    var xmnr: String? = null

    /**
     * 投资标识（如内外资标志）
     */
    @Column("tzbs", comment = "投资标识（如内外资标志）")
    var tzbs: String? = null

    /**
     * 投资方所在地编码
     */
    @Column("investor_place", comment = "投资方所在地编码")
    var investorPlace: String? = null

    /**
     * 集聚地位置编码
     */
    @Column("jt_place", comment = "集聚地位置编码")
    var jtPlace: String? = null

    /**
     * 总投资额
     */
    @Column("invest_money", comment = "总投资额")
    var investMoney: Double? = null

    /**
     * 注册资本
     */
    @Column("zczb", comment = "注册资本")
    var zczb: Double? = null

    /**
     * 当前进度
     */
    @Column("dqjd", comment = "当前进度")
    var dqjd: String? = null

    /**
     * 入库时间
     */
    @Column("rksj", comment = "入库时间")
    var rksj: LocalDateTime? = null

    /**
     * 注册资金
     */
    @Column("zczj", comment = "注册资金")
    var zczj: Double? = null

    /**
     * 注册日期
     */
    @Column("reg_date", comment = "注册日期")
    var regDate: LocalDate? = null

    /**
     * 注册信息统计日期
     */
    @Column("reg_stat_date", comment = "注册信息统计日期")
    var regStatDate: LocalDate? = null

    /**
     * 注册资质资料
     */
    @Column("reg_zzzl", comment = "注册资质资料")
    var regZzzl: String? = null

    /**
     * 备案（核准）项目名称
     */
    @Column("check_name", comment = "备案（核准）项目名称")
    var checkName: String? = null

    /**
     * 备案（核准）投资总额
     */
    @Column("check_money", comment = "备案（核准）投资总额")
    var checkMoney: Double? = null

    /**
     * 备案（核准）日期
     */
    @Column("check_date", comment = "备案（核准）日期")
    var checkDate: LocalDate? = null

    /**
     * 备案（核准）统计日期
     */
    @Column("check_stat_date", comment = "备案（核准）统计日期")
    var checkStatDate: LocalDate? = null

    /**
     * 备案资质资料
     */
    @Column("check_zzzl", comment = "备案资质资料")
    var checkZzzl: String? = null

    /**
     * 是否涉及固定资产投资项目（1-是，2-否）
     */
    @Column("is_fixed_asset", comment = "是否涉及固定资产投资项目（1-是，2-否）")
    var isFixedAsset: String? = null

    /**
     * 是否涉及建设用地（1-是，2-否）
     */
    @Column("is_use_land", comment = "是否涉及建设用地（1-是，2-否）")
    var isUseLand: String? = null

    /**
     * 建设用地规划许可证编号
     */
    @Column("land_licence", comment = "建设用地规划许可证编号")
    var landLicence: String? = null

    /**
     * 取得许可证日期
     */
    @Column("licence_date", comment = "取得许可证日期")
    var licenceDate: LocalDate? = null

    /**
     * 完成报批日期
     */
    @Column("finish_check_date", comment = "完成报批日期")
    var finishCheckDate: LocalDate? = null

    /**
     * 报批资质资料
     */
    @Column("bp_zzzl", comment = "报批资质资料")
    var bpZzzl: String? = null

    /**
     * 开工日期
     */
    @Column("start_date_commit", comment = "开工日期")
    var startDateCommit: LocalDate? = null

    /**
     * 竣工日期
     */
    @Column("complete_date", comment = "竣工日期")
    var completeDate: LocalDate? = null

    /**
     * 是否为新引进企业
     */
    @Column("is_new", comment = "是否为新引进企业")
    var isNew: String? = null

    /**
     * 项目评级
     */
    @Column("xmpj", comment = "项目评级")
    var xmpj: String? = null

    /**
     * 计划总投资
     */
    @Column("jhztz", comment = "计划总投资")
    var jhztz: String? = null

    /**
     * 项目选址位置
     */
    @Column("xmxzwz", comment = "项目选址位置")
    var xmxzwz: String? = null

    /**
     * 是否招商会项目
     */
    @Column("isZs", comment = "是否招商会项目")
    var isZs: String? = null

    /**
     * 招商会名称
     */
    @Column("zshmc", comment = "招商会名称")
    var zshmc: String? = null

    /**
     * 项目进度描述
     */
    @Column("progress", comment = "项目进度描述")
    var progress: String? = null

    /**
     * 签约日期
     */
    @Column("signed_date", comment = "签约日期")
    var signedDate: LocalDate? = null

    /**
     * 签约信息统计日期
     */
    @Column("signed_stat_date", comment = "签约信息统计日期")
    var signedStatDate: LocalDate? = null

    /**
     * 是否签署合同
     */
    @Column("qyht", comment = "是否签署合同")
    var qyht: String? = null

    /**
     * 到位资金总额
     */
    @Column("wzzje", comment = "到位资金总额")
    var wzzje: Double? = null

    /**
     * 年内到账资金
     */
    @Column("nzzje", comment = "年内到账资金")
    var nzzje: Double? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 区县
     */
    @Column("district", comment = "区县")
    var district: String? = null

    /**
     * 园区名称
     */
    @Column("park", comment = "园区名称")
    var park: String? = null

    /**
     * 投资方名称
     */
    @Column("investor", comment = "投资方名称")
    var investor: String? = null

    /**
     * 投资方类型
     */
    @Column("investor_type", comment = "投资方类型")
    var investorType: String? = null

    /**
     * 统一社会信用代码
     */
    @Column("u_code", comment = "统一社会信用代码")
    var uCode: String? = null

    /**
     * 注册公司名称
     */
    @Column("company_name", comment = "注册公司名称")
    var companyName: String? = null

    /**
     * 注册资金金额
     */
    @Column("reg_money", comment = "注册资金金额")
    var regMoney: Double? = null

    /**
     * 企业联系人
     */
    @Column("qy_linker", comment = "企业联系人")
    var qyLinker: String? = null

    /**
     * 企业联系电话
     */
    @Column("qy_phone", comment = "企业联系电话")
    var qyPhone: String? = null

    /**
     * 申请用地年份
     */
    @Column("sq_land_year", comment = "申请用地年份")
    var sqLandYear: String? = null

    /**
     * 预期产值
     */
    @Column("yq_cz", comment = "预期产值")
    var yqCz: String? = null

    /**
     * 自评等级（优良一般）
     */
    @Column("zp_level", comment = "自评等级（优良一般）")
    var zpLevel: String? = null

    /**
     * 是否为上市公司或上市辅导期企业
     */
    @Column("is_listed", comment = "是否为上市公司或上市辅导期企业")
    var isListed: Short? = null

    /**
     * 项目选址位置
     */
    @Column("project_address", comment = "项目选址位置")
    var projectAddress: String? = null

    /**
     * 申请用地面积（亩）
     */
    @Column("sq_land_area", comment = "申请用地面积（亩）")
    var sqLandArea: String? = null

    /**
     * 计划开工时间
     */
    @Column("plan_start_date", comment = "计划开工时间")
    var planStartDate: LocalDate? = null

    /**
     * 计划竣工时间
     */
    @Column("plan_end_date", comment = "计划竣工时间")
    var planEndDate: LocalDate? = null

    /**
     * 计划总投资（万元）
     */
    @Column("plan_total", comment = "计划总投资（万元）")
    var planTotal: String? = null

    /**
     * 固定资产投资（万元）
     */
    @Column("fixed_invest", comment = "固定资产投资（万元）")
    var fixedInvest: String? = null

    /**
     * 设备投资（万元）
     */
    @Column("device_invest", comment = "设备投资（万元）")
    var deviceInvest: String? = null

    /**
     * 注册资本（万元）
     */
    @Column("zhuce_money", comment = "注册资本（万元）")
    var zhuceMoney: String? = null

    /**
     * 投资强度（万元/千平方米）
     */
    @Column("invest_level", comment = "投资强度（万元/千平方米）")
    var investLevel: String? = null

    /**
     * 预期开票销售（万元）
     */
    @Column("yq_kpxs", comment = "预期开票销售（万元）")
    var yqKpxs: String? = null

    /**
     * 预期税收（万元）
     */
    @Column("yq_ss", comment = "预期税收（万元）")
    var yqSs: String? = null

    /**
     * 预期亩均税收（万元/亩）
     */
    @Column("yq_mjtax", comment = "预期亩均税收（万元/亩）")
    var yqMjtax: String? = null

    /**
     * 总能耗
     */
    @Column("total_use", comment = "总能耗")
    var totalUse: String? = null

    /**
     * 是否有废水排放
     */
    @Column("is_waterpf", comment = "是否有废水排放")
    var isWaterpf: String? = null

    /**
     * 污染物说明
     */
    @Column("is_wuran", comment = "污染物说明")
    var isWuran: String? = null

    /**
     * 重点项目类型
     */
    @Column("import_proj_type", comment = "重点项目类型")
    var importProjType: String? = null

    /**
     * 是否为重点项目
     */
    @Column("is_import_proj", comment = "是否为重点项目")
    var isImportProj: String? = null

    /**
     * 计划总投资第一期
     */
    @Column("plan_total1", comment = "计划总投资第一期")
    var planTotal1: String? = null

    /**
     * 计划总投资第二期
     */
    @Column("plan_total2", comment = "计划总投资第二期")
    var planTotal2: String? = null

    /**
     * 是否风险投资
     */
    @Column("is_warning_invest", comment = "是否风险投资")
    var isWarningInvest: String? = null

    /**
     * 风险投资方名称
     */
    @Column("fx_name", comment = "风险投资方名称")
    var fxName: String? = null

    /**
     * 预期开票销售（第一年）
     */
    @Column("yq_kpxs1", comment = "预期开票销售（第一年）")
    var yqKpxs1: String? = null

    /**
     * 预期开票销售（第二年）
     */
    @Column("yq_kpxs2", comment = "预期开票销售（第二年）")
    var yqKpxs2: String? = null

    /**
     * 预期开票销售（第三年）
     */
    @Column("yq_kpxs3", comment = "预期开票销售（第三年）")
    var yqKpxs3: String? = null

    /**
     * 预期税收（第一年）
     */
    @Column("yq_ss1", comment = "预期税收（第一年）")
    var yqSs1: String? = null

    /**
     * 预期税收（第二年）
     */
    @Column("yq_ss2", comment = "预期税收（第二年）")
    var yqSs2: String? = null

    /**
     * 预期税收（第三年）
     */
    @Column("yq_ss3", comment = "预期税收（第三年）")
    var yqSs3: String? = null

    /**
     * 预期亩均税收（第一年）
     */
    @Column("yq_mjtax1", comment = "预期亩均税收（第一年）")
    var yqMjtax1: String? = null

    /**
     * 预期亩均税收（第二年）
     */
    @Column("yq_mjtax2", comment = "预期亩均税收（第二年）")
    var yqMjtax2: String? = null

    /**
     * 预期亩均税收（第三年）
     */
    @Column("yq_mjtax3", comment = "预期亩均税收（第三年）")
    var yqMjtax3: String? = null

    /**
     * 投资方实力评估
     */
    @Column("tzf_level", comment = "投资方实力评估")
    var tzfLevel: String? = null

    /**
     * 投资方风险评估
     */
    @Column("tzf_fx", comment = "投资方风险评估")
    var tzfFx: String? = null

    /**
     * 产业关联度
     */
    @Column("cy_gl", comment = "产业关联度")
    var cyGl: String? = null

    /**
     * 产品市场和工艺水平
     */
    @Column("cp_gy", comment = "产品市场和工艺水平")
    var cpGy: String? = null

    /**
     * 团队力量
     */
    @Column("team", comment = "团队力量")
    var team: String? = null

    /**
     * 项目简介
     */
    @Column("_desc", comment = "项目简介")
    var Desc: String? = null

    /**
     * 行业编码
     */
    @Column("industry_code", comment = "行业编码")
    var industryCode: String? = null

    /**
     * 专利数量
     */
    @Column("zl_num", comment = "专利数量")
    var zlNum: String? = null

    /**
     * 是否项目支持
     */
    @Column("is_sj_proj", comment = "是否项目支持")
    var isSjProj: String? = null

    /**
     * 获奖内容
     */
    @Column("hj_content", comment = "获奖内容")
    var hjContent: String? = null

    /**
     * 1-服务业 2-制造业
     */
    @Column("b_industry", comment = "1-服务业 2-制造业")
    var bIndustry: Short? = null

    /**
     * 资源来源（1自行接洽 2市级推荐）
     */
    @Column("b_resource", comment = "资源来源（1自行接洽 2市级推荐）")
    var bResource: Int? = null

    /**
     * 市集机关名称
     */
    @Column("sjjg_name", comment = "市集机关名称")
    var sjjgName: String? = null

    /**
     * 预期产值（第一年）
     */
    @Column("yq_cz1", comment = "预期产值（第一年）")
    var yqCz1: String? = null

    /**
     * 预期产值（第二年）
     */
    @Column("yq_cz2", comment = "预期产值（第二年）")
    var yqCz2: String? = null

    /**
     * 预期产值（第三年）
     */
    @Column("yq_cz3", comment = "预期产值（第三年）")
    var yqCz3: String? = null

    /**
     * 产品市场前景
     */
    @Column("cp_qj", comment = "产品市场前景")
    var cpQj: String? = null

    /**
     * 工艺效率
     */
    @Column("gy_xl", comment = "工艺效率")
    var gyXl: String? = null

    /**
     * 工艺良品率
     */
    @Column("gy_lp", comment = "工艺良品率")
    var gyLp: String? = null

    /**
     * 工艺整体评价
     */
    @Column("gy_pj", comment = "工艺整体评价")
    var gyPj: String? = null

    /**
     * 资产负债情况
     */
    @Column("zcfz", comment = "资产负债情况")
    var zcfz: String? = null

    /**
     * 利润情况
     */
    @Column("lirun", comment = "利润情况")
    var lirun: String? = null

    /**
     * 现金流量情况
     */
    @Column("xjll", comment = "现金流量情况")
    var xjll: String? = null

    /**
     * 固定资产与流动资产占比
     */
    @Column("gdldzb", comment = "固定资产与流动资产占比")
    var gdldzb: String? = null

    /**
     * 资金来源
     */
    @Column("zjly", comment = "资金来源")
    var zjly: String? = null

    /**
     * 信用评级
     */
    @Column("xypj", comment = "信用评级")
    var xypj: String? = null

    /**
     * 行业协会评价
     */
    @Column("xhpj", comment = "行业协会评价")
    var xhpj: String? = null

    /**
     * 合规性
     */
    @Column("hegui", comment = "合规性")
    var hegui: String? = null

    /**
     * 综合评估等级
     */
    @Column("zhpg", comment = "综合评估等级")
    var zhpg: String? = null

    /**
     * 状态
     */
    @Column("status", comment = "状态")
    var status: Short? = null

    /**
     * 认定进度
     */
    @Column("r_progress", comment = "认定进度")
    var rProgress: String? = null

    /**
     * 审核状态
     */
    @Column("check_status", comment = "审核状态")
    var checkStatus: Short? = null

    /**
     * 建筑类型
     */
    @Column("building_type", comment = "建筑类型")
    var buildingType: String? = null

    /**
     * 使用面积
     */
    @Column("use_area", comment = "使用面积")
    var useArea: String? = null

    /**
     * 租赁面积
     */
    @Column("rent_area", comment = "租赁面积")
    var rentArea: String? = null

    /**
     * 购买面积
     */
    @Column("buy_area", comment = "购买面积")
    var buyArea: String? = null

    /**
     * 年度销量
     */
    @Column("year_xl", comment = "年度销量")
    var yearXl: String? = null

    /**
     * 年度税收
     */
    @Column("year_ss", comment = "年度税收")
    var yearSs: String? = null

    /**
     * 评估状态
     */
    @Column("pg_status", comment = "评估状态")
    var pgStatus: String? = null

    /**
     * 是否科创项目
     */
    @Column("is_kc_proj", comment = "是否科创项目")
    var isKcProj: String? = null

    /**
     * 科创项目条件
     */
    @Column("kc_proj_tj", comment = "科创项目条件")
    var kcProjTj: String? = null

    /**
     * 是否QFLP外资项目
     */
    @Column("is_qflp", comment = "是否QFLP外资项目")
    var isQflp: String? = null

    /**
     * 成效说明
     */
    @Column("cg_remark", comment = "成效说明")
    var cgRemark: String? = null

    /**
     * 是否特殊行业
     */
    @Column("tshy", comment = "是否特殊行业")
    var tshy: String? = null

    /**
     * 准入限制
     */
    @Column("zrxz", comment = "准入限制")
    var zrxz: String? = null

    /**
     * 是否两高项目
     */
    @Column("lgxm", comment = "是否两高项目")
    var lgxm: String? = null

    /**
     * 是否有重金属排放
     */
    @Column("zjspf", comment = "是否有重金属排放")
    var zjspf: String? = null

    /**
     * 产品市场现状
     */
    @Column("cpscxz", comment = "产品市场现状")
    var cpscxz: String? = null

    /**
     * 工艺水平
     */
    @Column("gysp", comment = "工艺水平")
    var gysp: String? = null

    /**
     * 生产效率
     */
    @Column("scxl", comment = "生产效率")
    var scxl: String? = null

    /**
     * 良品率
     */
    @Column("lpl", comment = "良品率")
    var lpl: String? = null

    /**
     * 是否高新技术企业
     */
    @Column("is_gxjs", comment = "是否高新技术企业")
    var isGxjs: String? = null

    /**
     * 是否建立研发中心
     */
    @Column("is_build_yfzx", comment = "是否建立研发中心")
    var ifBuildYfzx: String? = null

    /**
     * 研发中心名称
     */
    @Column("build_yfzx", comment = "研发中心名称")
    var buildYfzx: String? = null

    /**
     * 签约金额
     */
    @Column("qyje", comment = "签约金额")
    var qyje: Double? = null

    /**
     * industry_first_name
     */
    @Column("industry_first_name", comment = "industry_first_name")
    var industryFirstName: String? = null

    /**
     * industry_first_code
     */
    @Column("industry_first_code", comment = "industry_first_code")
    var industryFirstCode: String? = null

    @Column("is_rzxq", comment = "是否融资需求")
    var isRzxq: String? = null

    @Column("rz_money", comment = "融资金额")
    var rzMoney: String? = null

    @Column("first_time", comment = "初次接洽时间")
    var firstTime: String? = null

    @Column("zl_land_area", comment = "租赁厂房面积")
    var zlLandArea: String? = null

    @Column("zl_land_area_zs", comment = "租赁厂房面积折算")
    var zlLandAreaZs: String? = null

    @Column("place_info", comment = "城市名称")
    var placeInfo: String? = null

    @Column("ygmj", comment = "已供面积")
    var ygmj: String? = null


    @Column("phmj", comment = "盘活面积")
    var phmj: String? = null

    @Column("is_swzjtr", comment = "是否有市外资金投入")
    var isSwzjtr: String? = null

    @Column("gqbl", comment = "股权比例")
    var gqbl: String? = null

    /**
     * 投资规模
     */
    @Column("tzgm", comment = "投资规模")
    var tzgm: String? = null
    /**
     * 是否增资扩产项目
     */
    @Column("zjkc", comment = "是否增资扩产项目")
    var zjkc: String? = null

}
