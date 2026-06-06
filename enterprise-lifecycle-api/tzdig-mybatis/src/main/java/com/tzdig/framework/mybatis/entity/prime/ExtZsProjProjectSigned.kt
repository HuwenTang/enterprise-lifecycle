@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate

@Table("ext_zs_proj_project_signed", comment = "")
class ExtZsProjProjectSigned() : BaseModel<ExtZsProjProjectSigned>() {
    constructor(init: ExtZsProjProjectSigned.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目名称
     */
    @Column("_name", comment = "项目名称")
    var name: String? = null

    /**
     * 项目编号
     */
    @Column("_code", comment = "项目编号")
    var code: String? = null

    /**
     * 区县编码
     */
    @Column("district_code", comment = "区县编码")
    var districtCode: String? = null

    /**
     * 区县
     */
    @Column("district", comment = "区县")
    var district: String? = null

    /**
     * 园区code
     */
    @Column("zone_code", comment = "园区code")
    var zoneCode: String? = null

    /**
     * 园区名称
     */
    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    /**
     * 街镇
     */
    @Column("town_code", comment = "街镇")
    var townCode: String? = null

    /**
     * 街镇名
     */
    @Column("town_name", comment = "街镇名")
    var townName: String? = null

    /**
     * 项目类别, 1-内资,2-外资 默认1
     */
    @Column("p_type", comment = "项目类别, 1-内资,2-外资 默认1")
    var pType: Short? = null

    /**
     * 总投资额,  内资时单位是亿元,外资时单位是万美元
     */
    @Column("invest_money", comment = "总投资额,  内资时单位是亿元,外资时单位是万美元")
    var investMoney: Double? = null

    /**
     * 协议利用外资(万美元)
     */
    @Column("foreign_money", comment = "协议利用外资(万美元)")
    var foreignMoney: Double? = null

    /**
     * 项目类型, t_proj_type
     */
    @Column("proj_type", comment = "项目类型, t_proj_type")
    var projType: String? = null

    /**
     * 产业大类(不要显示的) t_proj_industry_first
     */
    @Column("industry_first_code", comment = "产业大类(不要显示的) t_proj_industry_first")
    var industryFirstCode: String? = null

    /**
     * 产业大类名称t_proj_industry_first
     */
    @Column("industry_first_name", comment = "产业大类名称t_proj_industry_first")
    var industryFirstName: String? = null

    /**
     * 行业编码(不要显示的)t_proj_industry
     */
    @Column("industry_code", comment = "行业编码(不要显示的)t_proj_industry")
    var industryCode: String? = null

    /**
     * 行业编码(显示的)t_proj_industry
     */
    @Column("industry_name", comment = "行业编码(显示的)t_proj_industry")
    var industryName: String? = null

    /**
     * 1-服务业 2-制造业
     */
    @Column("b_industry", comment = "1-服务业 2-制造业")
    var bIndustry: Short? = null

    /**
     * 投资方名称
     */
    @Column("investor", comment = "投资方名称")
    var investor: String? = null

    /**
     * 10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它
     */
    @Column("investor_type", comment = "10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它")
    var investorType: Short? = null

    /**
     * 90-香港 ,100-台湾,110-日本,&#13;&#10;120-韩国,130-美国,140-欧洲,&#13;&#10;150-新加坡,80-外资其他&#13;&#10;10 北京&#13;&#10;20 上海&#13;&#10;30 广州&#13;&#10;40 深圳&#13;&#10;50 苏州&#13;&#10;60 长三角其他城市&#13;&#10;70 内资其他&#13;&#10;
     */
    @Column("investor_place", comment = "90-香港 ,100-台湾,110-日本,&#13;&#10;120-韩国,130-美国,140-欧洲,&#13;&#10;150-新加坡,80-外资其他&#13;&#10;10 北京&#13;&#10;20 上海&#13;&#10;30 广州&#13;&#10;40 深圳&#13;&#10;50 苏州&#13;&#10;60 长三角其他城市&#13;&#10;70 内资其他&#13;&#10;")
    var investorPlace: String? = null

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
     * 项目简介, 大文本框
     */
    @Column("_desc", comment = "项目简介, 大文本框")
    var Desc: String? = null

    /**
     * 备案（核准）项目名称
     */
    @Column("check_name", comment = "备案（核准）项目名称")
    var checkName: String? = null

    /**
     * 备案（核准）投资总额（亿元）
     */
    @Column("check_money", comment = "备案（核准）投资总额（亿元）")
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
     * 统一社会信用代码证
     */
    @Column("u_code", comment = "统一社会信用代码证")
    var uCode: String? = null

    /**
     * 注册公司名称
     */
    @Column("company_name", comment = "注册公司名称")
    var companyName: String? = null

    /**
     * 注册资金
     */
    @Column("reg_money", comment = "注册资金")
    var regMoney: Double? = null

    /**
     * 注册日期
     */
    @Column("reg_date", comment = "注册日期")
    var regDate: LocalDate? = null

    /**
     * reg_foreign_money
     */
    @Column("reg_foreign_money", comment = "reg_foreign_money")
    var regForeignMoney: Double? = null

    /**
     * 注册信息统计日期：
     */
    @Column("reg_stat_date", comment = "注册信息统计日期：")
    var regStatDate: LocalDate? = null

    /**
     * 是否涉及固定资产投资项目1-是,2-否
     */
    @Column("is_fixed_asset", comment = "是否涉及固定资产投资项目1-是,2-否")
    var isFixedAsset: Short? = null

    /**
     * 是否涉及建设用地
     */
    @Column("is_use_land", comment = "是否涉及建设用地")
    var isUseLand: Short? = null

    /**
     * 建设用地规划许可证编号
     */
    @Column("land_licence", comment = "建设用地规划许可证编号")
    var landLicence: String? = null

    /**
     * 完成报批日期
     */
    @Column("finish_check_date", comment = "完成报批日期")
    var finishCheckDate: LocalDate? = null

    /**
     * 取得许可证日期
     */
    @Column("licence_date", comment = "取得许可证日期")
    var licenceDate: LocalDate? = null

    /**
     * 到账金额
     */
    @Column("received_money", comment = "到账金额")
    var receivedMoney: Double? = null

    /**
     * 0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工
     */
    @Column("progress", comment = "0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工  ")
    var progress: Short? = null

    /**
     * 0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交
     */
    @Column("check_status", comment = "0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交")
    var checkStatus: Short? = null

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
     * 投资方联系人
     */
    @Column("linker", comment = "投资方联系人")
    var linker: String? = null

    /**
     * 投资方联系电话
     */
    @Column("linker_tel", comment = "投资方联系电话")
    var linkerTel: String? = null

    /**
     * 招商人员
     */
    @Column("linker_tz", comment = "招商人员")
    var linkerTz: String? = null

    /**
     * 招商人员电话
     */
    @Column("linker_tz_tel", comment = "招商人员电话")
    var linkerTzTel: String? = null

    /**
     * 创建人的id,前端界面不管理,插入时用登录人帐号赋值
     */
    @Column("creator_id", comment = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    var creatorId: Int? = null

    /**
     * 创建人姓名
     */
    @Column("creator_name", comment = "创建人姓名")
    var creatorName: String? = null

    /**
     * 创建人的部门编码
     */
    @Column("creator_dept", comment = "创建人的部门编码")
    var creatorDept: String? = null

    /**
     * 最后一次审核结果描述
     */
    @Column("last_check_desc", comment = "最后一次审核结果描述")
    var lastCheckDesc: String? = null

    /**
     * 实际投入资金规模（亿元）
     */
    @Column("actual_invest", comment = "实际投入资金规模（亿元）")
    var actualInvest: Double? = null

    /**
     * 开工认定编码
     */
    @Column("start_code", comment = "开工认定编码")
    var startCode: String? = null

    /**
     * 实际建成产能
     */
    @Column("actual_output", comment = "实际建成产能")
    var actualOutput: Double? = null

    /**
     * 累计实际投入资金规模（亿元
     */
    @Column("sum_actual_invest", comment = "累计实际投入资金规模（亿元")
    var sumActualInvest: Double? = null

    /**
     * 修改人
     */
    @Column("update_id", comment = "修改人")
    var updateId: String? = null

    /**
     * 老项目创建人id
     */
    @Column("old_create_by", comment = "老项目创建人id")
    var oldCreateBy: String? = null

    /**
     * 老项目修改人id&#13;&#10;
     */
    @Column("old_update_by", comment = "老项目修改人id&#13;&#10;")
    var oldUpdateBy: String? = null

    /**
     * 老项目的主键ID
     */
    @Column("old_id", comment = "老项目的主键ID")
    var oldId: String? = null

    /**
     * 是否为六大产业项目
     */
    @Column("is_sixpro", comment = "是否为六大产业项目")
    var isSixpro: Short? = null

    /**
     * 六大产业项目编码
     */
    @Column("sixpro_code", comment = "六大产业项目编码")
    var sixproCode: String? = null

    /**
     * 备注
     */
    @Column("remarks", comment = "备注")
    var remarks: String? = null

    /**
     * 1-正常，2-删除
     */
    @Column("_status", comment = "1-正常，2-删除")
    var Status: Short? = null

    /**
     * 排序
     */
    @Column("order_idx", comment = "排序")
    var orderIdx: Int? = null

    /**
     * 签约金额（外资已根据汇率转换）
     */
    @Column("qyje", comment = "签约金额（外资已根据汇率转换）")
    var qyje: Double? = null

    /**
     * 开工确认 1：是 0：否
     */
    @Column("kgqr", comment = "开工确认 1：是 0：否")
    var kgqr: String? = null

    /**
     * 竣工确认 1：是 0：否
     */
    @Column("jgqr", comment = "竣工确认 1：是 0：否")
    var jgqr: String? = null

    /**
     * 项目评级
     */
    @Column("proj_level", comment = "项目评级")
    var projLevel: String? = null

    /**
     * 是否为新引进企业
     */
    @Column("is_new", comment = "是否为新引进企业")
    var isNew: Short? = null

    /**
     * 是否为世界500强或全球专业领域行业龙头企业
     */
    @Column("is_world", comment = "是否为世界500强或全球专业领域行业龙头企业")
    var isWorld: Short? = null

    /**
     * 是否为国内500强或国内行业排名前100企业
     */
    @Column("is_china", comment = "是否为国内500强或国内行业排名前100企业")
    var isChina: Short? = null

    /**
     * 是否为上市公司或上市辅导期企业
     */
    @Column("is_listed", comment = "是否为上市公司或上市辅导期企业")
    var isListed: Short? = null

    /**
     * 是否为独角兽企业
     */
    @Column("is_unicorn", comment = "是否为独角兽企业")
    var isUnicorn: Short? = null

    /**
     * 已投资项目对属地政府亩均税收（万元）
     */
    @Column("mujun_tax", comment = "已投资项目对属地政府亩均税收（万元）")
    var mujunTax: String? = null

    /**
     * 主要客户
     */
    @Column("main_customer", comment = "主要客户")
    var mainCustomer: String? = null

    /**
     * 计划总投资（万元）
     */
    @Column("plan_total", comment = "计划总投资（万元）")
    var planTotal: String? = null

    /**
     * 注册资本（万元）
     */
    @Column("zhuce_money", comment = "注册资本（万元）")
    var zhuceMoney: String? = null

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
     * 项目使用主要原、辅材料
     */
    @Column("project_material", comment = "项目使用主要原、辅材料")
    var projectMaterial: String? = null

    /**
     * 主要流程工艺
     */
    @Column("main_process", comment = "主要流程工艺")
    var mainProcess: String? = null

    /**
     * 是否为新供地项目
     */
    @Column("is_newproject", comment = "是否为新供地项目")
    var isNewproject: String? = null

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
     * 行业是否属于高新技术产业分类目录
     */
    @Column("is_gx", comment = "行业是否属于高新技术产业分类目录")
    var isGx: String? = null

    /**
     * 是否为高技术项目
     */
    @Column("is_gjs", comment = "是否为高技术项目")
    var isGjs: String? = null

    /**
     * 是否为国家工业战略性新兴产业
     */
    @Column("is_gyzl", comment = "是否为国家工业战略性新兴产业")
    var isGyzl: String? = null

    /**
     * 容积率
     */
    @Column("far", comment = "容积率")
    var far: String? = null

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
     * 预期用工人数（人）
     */
    @Column("yq_worker", comment = "预期用工人数（人）")
    var yqWorker: String? = null

    /**
     * 固定资产投资占比（%）
     */
    @Column("fixed_percent", comment = "固定资产投资占比（%）")
    var fixedPercent: String? = null

    /**
     * 投资强度（万元/千平方米）
     */
    @Column("invest_level", comment = "投资强度（万元/千平方米）")
    var investLevel: String? = null

    /**
     * 预期亩均税收（万元/千平方米）
     */
    @Column("yq_mjtax", comment = "预期亩均税收（万元/千平方米）")
    var yqMjtax: String? = null

    /**
     * 是否有产生废水和挥发性有机废水排放
     */
    @Column("is_waterpf", comment = "是否有产生废水和挥发性有机废水排放")
    var isWaterpf: String? = null

    /**
     * 产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂
     */
    @Column("is_wuran", comment = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    var isWuran: String? = null

    /**
     * 总能耗
     */
    @Column("total_use", comment = "总能耗")
    var totalUse: String? = null

    /**
     * 项目是否含有研发团队、产学研合作及研发机构建设内容
     */
    @Column("is_yanfa", comment = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    var isYanfa: String? = null

    /**
     * 项目是否拥有相关有效发明专利
     */
    @Column("is_zhuanli", comment = "项目是否拥有相关有效发明专利")
    var isZhuanli: String? = null

    /**
     * 是否拟列入重点活动签约项目库
     */
    @Column("is_important", comment = "是否拟列入重点活动签约项目库")
    var isImportant: String? = null

    /**
     * 是否为招商会项目
     */
    @Column("is_zsh", comment = "是否为招商会项目")
    var isZsh: String? = null

    /**
     * 招商会名称
     */
    @Column("zsh_name", comment = "招商会名称")
    var zshName: String? = null

    /**
     * 预计年销售（万元）
     */
    @Column("yj_year", comment = "预计年销售（万元）")
    var yjYear: String? = null

    /**
     * 备注
     */
    @Column("remark", comment = "备注")
    var remark: String? = null

    /**
     * 是否为瞪羚企业
     */
    @Column("is_gazelle", comment = "是否为瞪羚企业")
    var isGazelle: Short? = null

    /**
     * 是否为专精特新企业
     */
    @Column("is_specialized", comment = "是否为专精特新企业")
    var isSpecialized: Short? = null

    /**
     * 设备投资（万元）
     */
    @Column("device_invest", comment = "设备投资（万元）")
    var deviceInvest: String? = null

    /**
     * 固定资产投资（万元）
     */
    @Column("fixed_invest", comment = "固定资产投资（万元）")
    var fixedInvest: String? = null

    /**
     * 1 自行接洽 2 市级机关推荐
     */
    @Column("b_resource", comment = "1 自行接洽 2 市级机关推荐")
    var bResource: Int? = null

    /**
     * 市集机关名称
     */
    @Column("sjjg_name", comment = "市集机关名称")
    var sjjgName: String? = null

    /**
     * 企业联系人
     */
    @Column("qy_linker", comment = "企业联系人")
    var qyLinker: String? = null

    /**
     * 联系电话
     */
    @Column("qy_phone", comment = "联系电话")
    var qyPhone: String? = null

    /**
     * 申请用地年
     */
    @Column("sq_land_year", comment = "申请用地年")
    var sqLandYear: String? = null

    /**
     * 预期产值
     */
    @Column("yq_cz", comment = "预期产值")
    var yqCz: String? = null

    /**
     * 自评价等级 优良一般
     */
    @Column("zpj_level", comment = "自评价等级 优良一般")
    var zpjLevel: String? = null

    /**
     * 重点项目类型
     */
    @Column("import_proj_type", comment = "重点项目类型")
    var importProjType: String? = null

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
     * 是否重点项目
     */
    @Column("is_import_proj", comment = "是否重点项目")
    var isImportProj: String? = null

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
     * 专利数
     */
    @Column("zl_num", comment = "专利数")
    var zlNum: String? = null

    /**
     * 参赛获奖情况
     */
    @Column("hj_content", comment = "参赛获奖情况")
    var hjContent: String? = null

    /**
     * 认定进度
     */
    @Column("r_progress", comment = "认定进度")
    var rProgress: String? = null

    /**
     * 是否风险投资
     */
    @Column("is_warning_invest", comment = "是否风险投资")
    var isWarningInvest: String? = null

    /**
     * 是否项目支持
     */
    @Column("is_sj_proj", comment = "是否项目支持")
    var ifSjProj: String? = null

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
     * 工艺水平（工作效率）
     */
    @Column("gy_xl", comment = "工艺水平（工作效率）")
    var gyXl: String? = null

    /**
     * 工艺水平（良品率）
     */
    @Column("gy_lp", comment = "工艺水平（良品率）")
    var gyLp: String? = null

    /**
     * 工艺水平（整体评价）
     */
    @Column("gy_pj", comment = "工艺水平（整体评价）")
    var gyPj: String? = null

    /**
     * 资产负债表
     */
    @Column("zcfz", comment = "资产负债表")
    var zcfz: String? = null

    /**
     * 利润表
     */
    @Column("lirun", comment = "利润表")
    var lirun: String? = null

    /**
     * 现金流量表
     */
    @Column("xjll", comment = "现金流量表")
    var xjll: String? = null

    /**
     * 固定资产与流动资产占比
     */
    @Column("zczb", comment = "固定资产与流动资产占比")
    var zczb: String? = null

    /**
     * 资金来源
     */
    @Column("zjly", comment = "资金来源")
    var zjly: String? = null

    /**
     * 金融机构信用评级
     */
    @Column("xypj", comment = "金融机构信用评级")
    var xypj: String? = null

    /**
     * 行业协会评价
     */
    @Column("xhpj", comment = "行业协会评价")
    var xhpj: String? = null

    /**
     * 纳税合规性
     */
    @Column("hegui", comment = "纳税合规性")
    var hegui: String? = null

    /**
     * 综合评估等级
     */
    @Column("zhpg", comment = "综合评估等级")
    var zhpg: String? = null

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
     * 成效情况说明
     */
    @Column("cg_remark", comment = "成效情况说明")
    var cgRemark: String? = null

    /**
     * 是否特殊行业
     */
    @Column("tshy", comment = "是否特殊行业")
    var tshy: String? = null

    /**
     * 有无准入限制
     */
    @Column("zrxz", comment = "有无准入限制")
    var zrxz: String? = null

    /**
     * 是否两高项目
     */
    @Column("lgxm", comment = "是否两高项目")
    var lgxm: String? = null

    /**
     * 有无重金属排放
     */
    @Column("zjspf", comment = "有无重金属排放")
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
     * 是否建立企业研发中心
     */
    @Column("is_build_yfzx", comment = "是否建立企业研发中心")
    var ifBuildYfzx: String? = null

    /**
     * 企业研发中心
     */
    @Column("build_yfzx", comment = "企业研发中心")
    var buildYfzx: String? = null

    /**
     * 省级以上科技或人才等项目
     */
    @Column("sj_proj", comment = "省级以上科技或人才等项目")
    var sjProj: String? = null

    /**
     * 厂房租赁面积(平方米)
     */
    @Column("zl_land_area", comment = "厂房租赁面积(平方米)")
    var zlLandArea: String? = null

    /**
     * 折算用地
     */
    @Column("zl_land_area_zs", comment = "折算用地")
    var zlLandAreaZs: String? = null

    /**
     * 质态评估评审结果
     */
    @Column("ztpgzzcl", comment = "质态评估评审结果")
    var ztpgzzcl: String? = null

    /**
     * 批准部门及文号
     */
    @Column("pzwh", comment = "批准部门及文号")
    var pzwh: String? = null

    /**
     * 批准日期
     */
    @Column("pzrq", comment = "批准日期")
    var pzrq: LocalDate? = null

    /**
     * 成效情况
     */
    @Column("cxqk", comment = "成效情况")
    var cxqk: String? = null

    /**
     * qr_key
     */
    @Column("qr_key", comment = "qr_key")
    var qrKey: String? = null

    /**
     * 招商方
     */
    @Column("zsf", comment = "招商方")
    var zsf: String? = null

    /**
     * 投资方
     */
    @Column("tzf", comment = "投资方")
    var tzf: String? = null

    /**
     * 投资地址
     */
    @Column("tzdz", comment = "投资地址")
    var tzdz: String? = null

    /**
     * 佐证材料
     */
    @Column("xyzzcl", comment = "佐证材料")
    var xyzzcl: String? = null

    /**
     * 是否有融资需求
     */
    @Column("is_rzxq", comment = "是否有融资需求")
    var isRzxq: String? = null

    /**
     * 融资金额
     */
    @Column("rz_money", comment = "融资金额")
    var rzMoney: String? = null

    /**
     * 科创项目分类
     */
    @Column("kc_proj_type", comment = "科创项目分类")
    var kcProjType: String? = null

    /**
     * 科创佐证材料
     */
    @Column("kccl", comment = "科创佐证材料")
    var kccl: String? = null
}
