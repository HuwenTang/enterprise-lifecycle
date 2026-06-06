@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonProperty
import com.tzdig.framework.core.util.toInstant
import com.tzdig.framework.core.util.toLocalDate
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ExtZsProjProjectSignedDTO(
    @get:Schema(description = "_id")
    val id: String,
    @get:Schema(description = "项目名称")
    @param:JsonProperty("_name")
    val name: String?,
    @get:Schema(description = "项目编号")
    @param:JsonProperty("_code")
    val code: String?,
    @get:Schema(description = "区县编码")
    @param:JsonProperty("district_code")
    val districtCode: String?,
    @get:Schema(description = "区县")
    val district: String?,
    @get:Schema(description = "园区code")
    @param:JsonProperty("zone_code")
    val zoneCode: String?,
    @get:Schema(description = "园区名称")
    @param:JsonProperty("zone_name")
    val zoneName: String?,
    @get:Schema(description = "街镇")
    @param:JsonProperty("town_code")
    val townCode: String?,
    @get:Schema(description = "街镇名")
    @param:JsonProperty("town_name")
    val townName: String?,
    @get:Schema(description = "项目类别, 1-内资,2-外资 默认1")
    @param:JsonProperty("p_type")
    val pType: Short?,
    @get:Schema(description = "总投资额,  内资时单位是亿元,外资时单位是万美元")
    @param:JsonProperty("invest_money")
    val investMoney: Double?,
    @get:Schema(description = "协议利用外资(万美元)")
    @param:JsonProperty("foreign_money")
    val foreignMoney: Double?,
    @get:Schema(description = "项目类型, t_proj_type")
    @param:JsonProperty("proj_type")
    val projType: String?,
    @get:Schema(description = "产业大类(不要显示的) t_proj_industry_first")
    @param:JsonProperty("industry_first_code")
    val industryFirstCode: String?,
    @get:Schema(description = "产业大类名称t_proj_industry_first")
    @param:JsonProperty("industry_first_name")
    val industryFirstName: String?,
    @get:Schema(description = "行业编码(不要显示的)t_proj_industry")
    @param:JsonProperty("industry_code")
    val industryCode: String?,
    @get:Schema(description = "行业编码(显示的)t_proj_industry")
    @param:JsonProperty("industry_name")
    val industryName: String?,
    @get:Schema(description = "1-服务业 2-制造业")
    @param:JsonProperty("b_industry")
    val bIndustry: Short?,
    @get:Schema(description = "投资方名称")
    @param:JsonProperty("investor")
    val investor: String?,
    @get:Schema(description = "10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它")
    @param:JsonProperty("investor_type")
    val investorType: Short?,
    @get:Schema(description = "90-香港 ,100-台湾,110-日本,&#13;&#10;120-韩国,130-美国,140-欧洲,&#13;&#10;150-新加坡,80-外资其他&#13;&#10;10 北京&#13;&#10;20 上海&#13;&#10;30 广州&#13;&#10;40 深圳&#13;&#10;50 苏州&#13;&#10;60 长三角其他城市&#13;&#10;70 内资其他&#13;&#10;")
    @param:JsonProperty("investor_place")
    val investorPlace: String?,
    @get:Schema(description = "签约日期")
    @param:JsonProperty("signed_date")
    val signedDate: Long?,
    @get:Schema(description = "签约信息统计日期")
    @param:JsonProperty("signed_stat_date")
    val signedStatDate: Long?,
    @get:Schema(description = "项目简介, 大文本框")
    @param:JsonProperty("_desc")
    val Desc: String?,
    @get:Schema(description = "备案（核准）项目名称")
    @param:JsonProperty("check_name")
    val checkName: String?,
    @get:Schema(description = "备案（核准）投资总额（亿元）")
    @param:JsonProperty("check_money")
    val checkMoney: Double?,
    @get:Schema(description = "备案（核准）日期")
    @param:JsonProperty("check_date")
    val checkDate: Long?,
    @get:Schema(description = "备案（核准）统计日期")
    @param:JsonProperty("check_stat_date")
    val checkStatDate: Long?,
    @get:Schema(description = "统一社会信用代码证")
    @param:JsonProperty("u_code")
    val uCode: String?,
    @get:Schema(description = "注册公司名称")
    @param:JsonProperty("company_name")
    val companyName: String?,
    @get:Schema(description = "注册资金")
    @param:JsonProperty("reg_money")
    val regMoney: Double?,
    @get:Schema(description = "注册日期")
    @param:JsonProperty("reg_date")
    @get:JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "yyyy-MM-dd")
    val regDate: Long?,
    @get:Schema(description = "reg_foreign_money")
    @param:JsonProperty("reg_foreign_money")
    val regForeignMoney: Double?,
    @get:Schema(description = "注册信息统计日期：")
    @param:JsonProperty("reg_stat_date")
    @get:JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "yyyy-MM-dd")
    val regStatDate: Long?,
    @get:Schema(description = "是否涉及固定资产投资项目1-是,2-否")
    @param:JsonProperty("is_fixed_asset")
    val isFixedAsset: Short?,
    @get:Schema(description = "是否涉及建设用地")
    @param:JsonProperty("is_use_land")
    val isUseLand: Short?,
    @get:Schema(description = "建设用地规划许可证编号")
    @param:JsonProperty("land_licence")
    val landLicence: String?,
    @get:Schema(description = "完成报批日期")
    @param:JsonProperty("finish_check_date")
    @get:JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "yyyy-MM-dd")
    val finishCheckDate: Long?,
    @get:Schema(description = "取得许可证日期")
    @param:JsonProperty("licence_date")
    @get:JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "yyyy-MM-dd")
    val licenceDate: Long?,
    @get:Schema(description = "到账金额")
    @param:JsonProperty("received_money")
    val receivedMoney: Double?,
    @get:Schema(description = "0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工  ")
    @param:JsonProperty("progress")
    val progress: Short?,
    @get:Schema(description = "0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交")
    @param:JsonProperty("check_status")
    val checkStatus: Short?,
    @get:Schema(description = "开工日期")
    @param:JsonProperty("start_date")
    @get:JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "yyyy-MM-dd")
    val startDateCommit: Long?,
    @get:Schema(description = "竣工日期")
    @param:JsonProperty("complete_date")
    @get:JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "yyyy-MM-dd")
    val completeDate: Long?,
    @get:Schema(description = "投资方联系人")
    @param:JsonProperty("linker")
    val linker: String?,
    @get:Schema(description = "投资方联系电话")
    @param:JsonProperty("linker_tel")
    val linkerTel: String?,
    @get:Schema(description = "招商人员")
    @param:JsonProperty("linker_tz")
    val linkerTz: String?,
    @get:Schema(description = "招商人员电话")
    @param:JsonProperty("linker_tz_tel")
    val linkerTzTel: String?,
    @get:Schema(description = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    @param:JsonProperty("creator_id")
    val creatorId: Int?,
    @get:Schema(description = "创建人姓名")
    @param:JsonProperty("creator_name")
    val creatorName: String?,
    @get:Schema(description = "创建人的部门编码")
    @param:JsonProperty("creator_dept")
    val creatorDept: String?,
    @get:Schema(description = "最后一次审核结果描述")
    @param:JsonProperty("last_check_desc")
    val lastCheckDesc: String?,
    @get:Schema(description = "实际投入资金规模（亿元）")
    @param:JsonProperty("actual_invest")
    val actualInvest: Double?,
    @get:Schema(description = "开工认定编码")
    @param:JsonProperty("start_code")
    val startCode: String?,
    @get:Schema(description = "实际建成产能")
    @param:JsonProperty("actual_output")
    val actualOutput: Double?,
    @get:Schema(description = "累计实际投入资金规模（亿元")
    @param:JsonProperty("sum_actual_invest")
    val sumActualInvest: Double?,
    @get:Schema(description = "修改人")
    @param:JsonProperty("update_id")
    val updateId: String?,
    @get:Schema(description = "老项目创建人id")
    @param:JsonProperty("old_create_by")
    val oldCreateBy: String?,
    @get:Schema(description = "老项目修改人id&#13;&#10;")
    @param:JsonProperty("old_update_by")
    val oldUpdateBy: String?,
    @get:Schema(description = "老项目的主键ID")
    @param:JsonProperty("old_id")
    val oldId: String?,
    @get:Schema(description = "是否为六大产业项目")
    @param:JsonProperty("is_sixpro")
    val isSixpro: Short?,
    @get:Schema(description = "六大产业项目编码")
    @param:JsonProperty("sixpro_code")
    val sixproCode: String?,
    @get:Schema(description = "备注")
    val remarks: String?,
    @get:Schema(description = "1-正常，2-删除")
    @param:JsonProperty("_status")
    val Status: Short?,
    @get:Schema(description = "排序")
    @param:JsonProperty("order_idx")
    val orderIdx: Int?,
    @get:Schema(description = "签约金额（外资已根据汇率转换）")
    val qyje: Double?,
    @get:Schema(description = "开工确认 1：是 0：否")
    val kgqr: String?,
    @get:Schema(description = "竣工确认 1：是 0：否")
    val jgqr: String?,
    @get:Schema(description = "项目评级")
    @param:JsonProperty("proj_level")
    val projLevel: String?,
    @get:Schema(description = "是否为新引进企业")
    @param:JsonProperty("is_new")
    val isNew: Short?,
    @get:Schema(description = "是否为世界500强或全球专业领域行业龙头企业")
    @param:JsonProperty("is_world")
    val isWorld: Short?,
    @get:Schema(description = "是否为国内500强或国内行业排名前100企业")
    @param:JsonProperty("is_china")
    val isChina: Short?,
    @get:Schema(description = "是否为上市公司或上市辅导期企业")
    @param:JsonProperty("is_listed")
    val isListed: Short?,
    @get:Schema(description = "是否为独角兽企业")
    @param:JsonProperty("is_unicorn")
    val isUnicorn: Short?,
    @get:Schema(description = "已投资项目对属地政府亩均税收（万元）")
    @param:JsonProperty("mujun_tax")
    val mujunTax: String?,
    @get:Schema(description = "主要客户")
    @param:JsonProperty("main_customer")
    val mainCustomer: String?,
    @get:Schema(description = "计划总投资（万元）")
    @param:JsonProperty("plan_total")
    val planTotal: String?,
    @get:Schema(description = "注册资本（万元）")
    @param:JsonProperty("zhuce_money")
    val zhuceMoney: String?,
    @get:Schema(description = "计划开工时间")
    @param:JsonProperty("plan_start_date")
    @param:JsonFormat(shape = JsonFormat.Shape.NUMBER, pattern = "yyyy-MM-dd")
    val planStartDate: Long?,
    @get:Schema(description = "计划竣工时间")
    @param:JsonProperty("plan_end_date")
    val planEndDate: Long?,
    @get:Schema(description = "项目使用主要原、辅材料")
    @param:JsonProperty("project_material")
    val projectMaterial: String?,
    @get:Schema(description = "主要流程工艺")
    @param:JsonProperty("main_process")
    val mainProcess: String?,
    @get:Schema(description = "是否为新供地项目")
    @param:JsonProperty("is_newproject")
    val isNewproject: String?,
    @get:Schema(description = "项目选址位置")
    @param:JsonProperty("project_address")
    val projectAddress: String?,
    @get:Schema(description = "申请用地面积（亩）")
    @param:JsonProperty("sq_land_area")
    val sqLandArea: String?,
    @get:Schema(description = "行业是否属于高新技术产业分类目录")
    @param:JsonProperty("is_gx")
    val isGx: String?,
    @get:Schema(description = "是否为高技术项目")
    @param:JsonProperty("is_gjs")
    val isGjs: String?,
    @get:Schema(description = "是否为国家工业战略性新兴产业")
    @param:JsonProperty("is_gyzl")
    val isGyzl: String?,
    @get:Schema(description = "容积率")
    val far: String?,
    @get:Schema(description = "预期开票销售（万元）")
    @param:JsonProperty("yq_kpxs")
    val yqKpxs: String?,
    @get:Schema(description = "预期税收（万元）")
    @param:JsonProperty("yq_ss")
    val yqSs: String?,
    @get:Schema(description = "预期用工人数（人）")
    @param:JsonProperty("yq_worker")
    val yqWorker: String?,
    @get:Schema(description = "固定资产投资占比（%）")
    @param:JsonProperty("fixed_percent")
    val fixedPercent: String?,
    @get:Schema(description = "投资强度（万元/千平方米）")
    @param:JsonProperty("invest_level")
    val investLevel: String?,
    @get:Schema(description = "预期亩均税收（万元/千平方米）")
    @param:JsonProperty("yq_mjtax")
    val yqMjtax: String?,
    @get:Schema(description = "是否有产生废水和挥发性有机废水排放")
    @param:JsonProperty("is_waterpf")
    val isWaterpf: String?,
    @get:Schema(description = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    @param:JsonProperty("is_wuran")
    val isWuran: String?,
    @get:Schema(description = "总能耗")
    @param:JsonProperty("total_use")
    val totalUse: String?,
    @get:Schema(description = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    @param:JsonProperty("is_yanfa")
    val isYanfa: String?,
    @get:Schema(description = "项目是否拥有相关有效发明专利")
    @param:JsonProperty("is_zhuanli")
    val isZhuanli: String?,
    @get:Schema(description = "是否拟列入重点活动签约项目库")
    @param:JsonProperty("is_important")
    val isImportant: String?,
    @get:Schema(description = "是否为招商会项目")
    @param:JsonProperty("is_zsh")
    val isZsh: String?,
    @get:Schema(description = "招商会名称")
    @param:JsonProperty("zsh_name")
    val zshName: String?,
    @get:Schema(description = "预计年销售（万元）")
    @param:JsonProperty("yj_year")
    val yjYear: String?,
    @get:Schema(description = "备注")
    val remark: String?,
    @get:Schema(description = "是否为瞪羚企业")
    @param:JsonProperty("is_gazelle")
    val isGazelle: Short?,
    @get:Schema(description = "是否为专精特新企业")
    @param:JsonProperty("is_specialized")
    val isSpecialized: Short?,
    @get:Schema(description = "设备投资（万元）")
    @param:JsonProperty("device_invest")
    val deviceInvest: String?,
    @get:Schema(description = "固定资产投资（万元）")
    @param:JsonProperty("fixed_invest")
    val fixedInvest: String?,
    @get:Schema(description = "1 自行接洽 2 市级机关推荐")
    @param:JsonProperty("b_resource")
    val bResource: Int?,
    @get:Schema(description = "市集机关名称")
    @param:JsonProperty("sjjg_name")
    val sjjgName: String?,
    @get:Schema(description = "企业联系人")
    @param:JsonProperty("qy_linker")
    val qyLinker: String?,
    @get:Schema(description = "联系电话")
    @param:JsonProperty("qy_phone")
    val qyPhone: String?,
    @get:Schema(description = "申请用地年")
    @param:JsonProperty("sq_land_year")
    val sqLandYear: String?,
    @get:Schema(description = "预期产值")
    @param:JsonProperty("yq_cz")
    val yqCz: String?,
    @get:Schema(description = "自评价等级 优良一般")
    @param:JsonProperty("zpj_level")
    val zpjLevel: String?,
    @get:Schema(description = "重点项目类型")
    @param:JsonProperty("import_proj_type")
    val importProjType: String?,
    @get:Schema(description = "计划总投资第一期")
    @param:JsonProperty("plan_total1")
    val planTotal1: String?,
    @get:Schema(description = "计划总投资第二期")
    @param:JsonProperty("plan_total2")
    val planTotal2: String?,
    @get:Schema(description = "是否重点项目")
    @param:JsonProperty("is_import_proj")
    val isImportProj: String?,
    @get:Schema(description = "风险投资方名称")
    @param:JsonProperty("fx_name")
    val fxName: String?,
    @get:Schema(description = "预期开票销售（第一年）")
    @param:JsonProperty("yq_kpxs1")
    val yqKpxs1: String?,
    @get:Schema(description = "预期开票销售（第二年）")
    @param:JsonProperty("yq_kpxs2")
    val yqKpxs2: String?,
    @get:Schema(description = "预期开票销售（第三年）")
    @param:JsonProperty("yq_kpxs3")
    val yqKpxs3: String?,
    @get:Schema(description = "预期税收（第一年）")
    @param:JsonProperty("yq_ss1")
    val yqSs1: String?,
    @get:Schema(description = "预期税收（第二年）")
    @param:JsonProperty("yq_ss2")
    val yqSs2: String?,
    @get:Schema(description = "预期税收（第三年）")
    @param:JsonProperty("yq_ss3")
    val yqSs3: String?,
    @get:Schema(description = "预期亩均税收（第一年）")
    @param:JsonProperty("yq_mjtax1")
    val yqMjtax1: String?,
    @get:Schema(description = "预期亩均税收（第二年）")
    @param:JsonProperty("yq_mjtax2")
    val yqMjtax2: String?,
    @get:Schema(description = "预期亩均税收（第三年）")
    @param:JsonProperty("yq_mjtax3")
    val yqMjtax3: String?,
    @get:Schema(description = "投资方实力评估")
    @param:JsonProperty("tzf_level")
    val tzfLevel: String?,
    @get:Schema(description = "投资方风险评估")
    @param:JsonProperty("tzf_fx")
    val tzfFx: String?,
    @get:Schema(description = "产业关联度")
    @param:JsonProperty("cy_gl")
    val cyGl: String?,
    @get:Schema(description = "产品市场和工艺水平")
    @param:JsonProperty("cp_gy")
    val cpGy: String?,
    @get:Schema(description = "团队力量")
    val team: String?,
    @get:Schema(description = "专利数")
    @param:JsonProperty("zl_num")
    val zlNum: String?,
    @get:Schema(description = "参赛获奖情况")
    @param:JsonProperty("hj_content")
    val hjContent: String?,
    @get:Schema(description = "认定进度")
    @param:JsonProperty("r_progress")
    val rProgress: String?,
    @get:Schema(description = "是否风险投资")
    @param:JsonProperty("is_warning_invest")
    val isWarningInvest: String?,
    @get:Schema(description = "是否项目支持")
    @param:JsonProperty("is_sj_proj")
    val ifSjProj: String?,
    @get:Schema(description = "预期产值（第一年）")
    @param:JsonProperty("yq_cz1")
    val yqCz1: String?,
    @get:Schema(description = "预期产值（第二年）")
    @param:JsonProperty("yq_cz2")
    val yqCz2: String?,
    @get:Schema(description = "预期产值（第三年）")
    @param:JsonProperty("yq_cz3")
    val yqCz3: String?,
    @get:Schema(description = "产品市场前景")
    @param:JsonProperty("cp_qj")
    val cpQj: String?,
    @get:Schema(description = "工艺水平（工作效率）")
    @param:JsonProperty("gy_xl")
    val gyXl: String?,
    @get:Schema(description = "工艺水平（良品率）")
    @param:JsonProperty("gy_lp")
    val gyLp: String?,
    @get:Schema(description = "工艺水平（整体评价）")
    @param:JsonProperty("gy_pj")
    val gyPj: String?,
    @get:Schema(description = "资产负债表")
    val zcfz: String?,
    @get:Schema(description = "利润表")
    val lirun: String?,
    @get:Schema(description = "现金流量表")
    val xjll: String?,
    @get:Schema(description = "固定资产与流动资产占比")
    val zczb: String?,
    @get:Schema(description = "资金来源")
    val zjly: String?,
    @get:Schema(description = "金融机构信用评级")
    val xypj: String?,
    @get:Schema(description = "行业协会评价")
    val xhpj: String?,
    @get:Schema(description = "纳税合规性")
    val hegui: String?,
    @get:Schema(description = "综合评估等级")
    val zhpg: String?,
    @get:Schema(description = "评估状态")
    @param:JsonProperty("pg_status")
    val pgStatus: String?,
    @get:Schema(description = "是否科创项目")
    @param:JsonProperty("is_kc_proj")
    val isKcProj: String?,
    @get:Schema(description = "科创项目认定条件")
    @param:JsonProperty("kc_proj_tj")
    val kcProjTj: String?,
    @get:Schema(description = "QFLP外资项目")
    @param:JsonProperty("is_qflp")
    val isQflp: String?,
    @get:Schema(description = "成效情况说明")
    @param:JsonProperty("cg_remark")
    val cgRemark: String?,
    @get:Schema(description = "是否特殊行业")
    val tshy: String?,
    @get:Schema(description = "有无准入限制")
    val zrxz: String?,
    @get:Schema(description = "是否两高项目")
    val lgxm: String?,
    @get:Schema(description = "有无重金属排放")
    val zjspf: String?,
    @get:Schema(description = "产品市场现状")
    val cpscxz: String?,
    @get:Schema(description = "工艺水平")
    val gysp: String?,
    @get:Schema(description = "生产效率")
    val scxl: String?,
    @get:Schema(description = "良品率")
    val lpl: String?,
    @get:Schema(description = "是否高新技术企业")
    @param:JsonProperty("is_gxjs")
    val isGxjs: String?,
    @get:Schema(description = "是否建立企业研发中心")
    @param:JsonProperty("is_build_yfzx")
    val ifBuildYfzx: String?,
    @get:Schema(description = "企业研发中心")
    @param:JsonProperty("build_yfzx")
    val buildYfzx: String?,
    @get:Schema(description = "省级以上科技或人才等项目")
    @param:JsonProperty("sj_proj")
    val sjProj: String?,
    @get:Schema(description = "厂房租赁面积(平方米)")
    @param:JsonProperty("zl_land_area")
    val zlLandArea: String?,
    @get:Schema(description = "折算用地")
    @param:JsonProperty("zl_land_area_zs")
    val zlLandAreaZs: String?,
    @get:Schema(description = "质态评估评审结果")
    val ztpgzzcl: String?,
    @get:Schema(description = "批准部门及文号")
    val pzwh: String?,
    @get:Schema(description = "批准日期")
    val pzrq: LocalDate?,
    @get:Schema(description = "成效情况")
    val cxqk: String?,
    @get:Schema(description = "qr_key")
    val qrKey: String?,
    @get:Schema(description = "招商方")
    val zsf: String?,
    @get:Schema(description = "投资方")
    val tzf: String?,
    @get:Schema(description = "投资地址")
    val tzdz: String?,
    @get:Schema(description = "佐证材料")
    val xyzzcl: String?,
) {
    fun toExtZsProjProjectSigned(): ExtZsProjProjectSigned =
        ExtZsProjProjectSigned {
            into(this)
        }

    fun into(record: ExtZsProjProjectSigned): ExtZsProjProjectSigned {
        record.id = id
        record.name = name
        record.code = code
        record.districtCode = districtCode
        record.district = district
        record.zoneCode = zoneCode
        record.zoneName = zoneName
        record.townCode = townCode
        record.townName = townName
        record.pType = pType
        record.investMoney = investMoney
        record.foreignMoney = foreignMoney
        record.projType = projType
        record.industryFirstCode = industryFirstCode
        record.industryFirstName = industryFirstName
        record.industryCode = industryCode
        record.industryName = industryName
        record.bIndustry = bIndustry
        record.investor = investor
        record.investorType = investorType
        record.investorPlace = investorPlace
        record.signedDate = signedDate?.toInstant()?.toLocalDate()
        record.signedStatDate = signedStatDate?.toInstant()?.toLocalDate()
        record.Desc = Desc
        record.checkName = checkName
        record.checkMoney = checkMoney
        record.checkDate = checkDate?.toInstant()?.toLocalDate()
        record.checkStatDate = checkStatDate?.toInstant()?.toLocalDate()
        record.uCode = uCode
        record.companyName = companyName
        record.regMoney = regMoney
        record.regDate = regDate?.toInstant()?.toLocalDate()
        record.regForeignMoney = regForeignMoney
        record.regStatDate = regStatDate?.toInstant()?.toLocalDate()
        record.isFixedAsset = isFixedAsset
        record.isUseLand = isUseLand
        record.landLicence = landLicence
        record.finishCheckDate = finishCheckDate?.toInstant()?.toLocalDate()
        record.licenceDate = licenceDate?.toInstant()?.toLocalDate()
        record.receivedMoney = receivedMoney
        record.progress = progress
        record.checkStatus = checkStatus
        record.startDateCommit = startDateCommit?.toInstant()?.toLocalDate()
        record.completeDate = completeDate?.toInstant()?.toLocalDate()
        record.linker = linker
        record.linkerTel = linkerTel
        record.linkerTz = linkerTz
        record.linkerTzTel = linkerTzTel
        record.creatorId = creatorId
        record.creatorName = creatorName
        record.creatorDept = creatorDept
        record.lastCheckDesc = lastCheckDesc
        record.actualInvest = actualInvest
        record.startCode = startCode
        record.actualOutput = actualOutput
        record.sumActualInvest = sumActualInvest
        record.updateId = updateId
        record.oldCreateBy = oldCreateBy
        record.oldUpdateBy = oldUpdateBy
        record.oldId = oldId
        record.isSixpro = isSixpro
        record.sixproCode = sixproCode
        record.remarks = remarks
        record.Status = Status
        record.orderIdx = orderIdx
        record.qyje = qyje
        record.kgqr = kgqr
        record.jgqr = jgqr
        record.projLevel = projLevel
        record.isNew = isNew
        record.isWorld = isWorld
        record.isChina = isChina
        record.isListed = isListed
        record.isUnicorn = isUnicorn
        record.mujunTax = mujunTax
        record.mainCustomer = mainCustomer
        record.planTotal = planTotal
        record.zhuceMoney = zhuceMoney
        record.planStartDate = planStartDate?.toInstant()?.toLocalDate()
        record.planEndDate = planEndDate?.toInstant()?.toLocalDate()
        record.projectMaterial = projectMaterial
        record.mainProcess = mainProcess
        record.isNewproject = isNewproject
        record.projectAddress = projectAddress
        record.sqLandArea = sqLandArea
        record.isGx = isGx
        record.isGjs = isGjs
        record.isGyzl = isGyzl
        record.far = far
        record.yqKpxs = yqKpxs
        record.yqSs = yqSs
        record.yqWorker = yqWorker
        record.fixedPercent = fixedPercent
        record.investLevel = investLevel
        record.yqMjtax = yqMjtax
        record.isWaterpf = isWaterpf
        record.isWuran = isWuran
        record.totalUse = totalUse
        record.isYanfa = isYanfa
        record.isZhuanli = isZhuanli
        record.isImportant = isImportant
        record.isZsh = isZsh
        record.zshName = zshName
        record.yjYear = yjYear
        record.remark = remark
        record.isGazelle = isGazelle
        record.isSpecialized = isSpecialized
        record.deviceInvest = deviceInvest
        record.fixedInvest = fixedInvest
        record.bResource = bResource
        record.sjjgName = sjjgName
        record.qyLinker = qyLinker
        record.qyPhone = qyPhone
        record.sqLandYear = sqLandYear
        record.yqCz = yqCz
        record.zpjLevel = zpjLevel
        record.importProjType = importProjType
        record.planTotal1 = planTotal1
        record.planTotal2 = planTotal2
        record.isImportProj = isImportProj
        record.fxName = fxName
        record.yqKpxs1 = yqKpxs1
        record.yqKpxs2 = yqKpxs2
        record.yqKpxs3 = yqKpxs3
        record.yqSs1 = yqSs1
        record.yqSs2 = yqSs2
        record.yqSs3 = yqSs3
        record.yqMjtax1 = yqMjtax1
        record.yqMjtax2 = yqMjtax2
        record.yqMjtax3 = yqMjtax3
        record.tzfLevel = tzfLevel
        record.tzfFx = tzfFx
        record.cyGl = cyGl
        record.cpGy = cpGy
        record.team = team
        record.zlNum = zlNum
        record.hjContent = hjContent
        record.rProgress = rProgress
        record.isWarningInvest = isWarningInvest
        record.ifSjProj = ifSjProj
        record.yqCz1 = yqCz1
        record.yqCz2 = yqCz2
        record.yqCz3 = yqCz3
        record.cpQj = cpQj
        record.gyXl = gyXl
        record.gyLp = gyLp
        record.gyPj = gyPj
        record.zcfz = zcfz
        record.lirun = lirun
        record.xjll = xjll
        record.zczb = zczb
        record.zjly = zjly
        record.xypj = xypj
        record.xhpj = xhpj
        record.hegui = hegui
        record.zhpg = zhpg
        record.pgStatus = pgStatus
        record.isKcProj = isKcProj
        record.kcProjTj = kcProjTj
        record.isQflp = isQflp
        record.cgRemark = cgRemark
        record.tshy = tshy
        record.zrxz = zrxz
        record.lgxm = lgxm
        record.zjspf = zjspf
        record.cpscxz = cpscxz
        record.gysp = gysp
        record.scxl = scxl
        record.lpl = lpl
        record.isGxjs = isGxjs
        record.ifBuildYfzx = ifBuildYfzx
        record.buildYfzx = buildYfzx
        record.sjProj = sjProj
        record.zlLandArea = zlLandArea
        record.zlLandAreaZs = zlLandAreaZs
        record.ztpgzzcl = ztpgzzcl
        record.pzwh = pzwh
        record.pzrq = pzrq
        record.cxqk = cxqk
        record.qrKey = qrKey
        record.zsf = zsf
        record.tzf = tzf
        record.tzdz = tzdz
        record.xyzzcl = xyzzcl
        return record
    }
}
