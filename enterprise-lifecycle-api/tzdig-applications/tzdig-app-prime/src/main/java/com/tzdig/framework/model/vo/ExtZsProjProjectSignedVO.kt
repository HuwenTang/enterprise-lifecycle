@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.file.service.S3Service
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ExtZsProjProjectSignedVO(
    @get:Schema(description = "_id")
    @ExcelIgnore
    val id: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val name: String?,
    @get:Schema(description = "评估状态")
    @ExcelProperty("评估状态")
    val status: String?,
    @get:Schema(description = "项目编号")
    @ExcelIgnore
    val code: String?,
    @get:Schema(description = "区县编码")
    @ExcelIgnore
    val districtCode: String?,
    @get:Schema(description = "区县")
    @ExcelIgnore
    val district: String?,
    @get:Schema(description = "园区code")
    @ExcelIgnore
    val zoneCode: String?,
    @get:Schema(description = "园区名称")
    @ExcelProperty("园区名称")
    val zoneName: String?,
    @get:Schema(description = "街镇")
    @ExcelIgnore
    val townCode: String?,
    @get:Schema(description = "街镇名")
    @ExcelIgnore
    val townName: String?,
    @get:Schema(description = "项目类别, 1-内资,2-外资 默认1")
    @ExcelIgnore
    val pType: Short?,
    @get:Schema(description = "总投资额,  内资时单位是亿元,外资时单位是万美元")
    @ExcelIgnore
    val investMoney: Double?,
    @get:Schema(description = "协议利用外资(万美元)")
    @ExcelIgnore
    val foreignMoney: Double?,
    @get:Schema(description = "项目类型, t_proj_type")
    @ExcelIgnore
    val projType: String?,
    @get:Schema(description = "项目类型, t_proj_type")
    @ExcelProperty("产业方向")
    var projTypeLabel: String? = null,
    @get:Schema(description = "产业大类(不要显示的) t_proj_industry_first")
    @ExcelIgnore
    val industryFirstCode: String?,
    @get:Schema(description = "产业大类名称t_proj_industry_first")
    @ExcelIgnore
    val industryFirstName: String?,
    @get:Schema(description = "行业编码(不要显示的)t_proj_industry")
    @ExcelIgnore
    val industryCode: String?,
    @get:Schema(description = "行业编码(显示的)t_proj_industry")
    @ExcelProperty("行业编码(显示的)t_proj_industry")
    val industryName: String?,
    @get:Schema(description = "1-服务业 2-制造业")
    @ExcelProperty("1-服务业 2-制造业")
    val bIndustry: Short?,
    @get:Schema(description = "投资方名称")
    @ExcelProperty("投资方名称")
    val investor: String?,
    @get:Schema(description = "10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它")
    @ExcelIgnore
    val investorType: Short?,
    @get:Schema(description = "90-香港 ,100-台湾,110-日本,&#13;&#10;120-韩国,130-美国,140-欧洲,&#13;&#10;150-新加坡,80-外资其他&#13;&#10;10 北京&#13;&#10;20 上海&#13;&#10;30 广州&#13;&#10;40 深圳&#13;&#10;50 苏州&#13;&#10;60 长三角其他城市&#13;&#10;70 内资其他&#13;&#10;")
    @ExcelIgnore
    val investorPlace: String?,
    @get:Schema(description = "签约日期")
    @ExcelIgnore
    val signedDate: LocalDate?,
    @get:Schema(description = "签约信息统计日期")
    @ExcelIgnore
    val signedStatDate: LocalDate?,
    @get:Schema(description = "项目简介, 大文本框")
    @ExcelProperty("项目简介")
    val Desc: String?,
    @get:Schema(description = "备案（核准）项目名称")
    @ExcelIgnore
    val checkName: String?,
    @get:Schema(description = "备案（核准）投资总额（亿元）")
    @ExcelIgnore
    val checkMoney: Double?,
    @get:Schema(description = "备案（核准）日期")
    @ExcelIgnore
    val checkDate: LocalDate?,
    @get:Schema(description = "备案（核准）统计日期")
    @ExcelIgnore
    val checkStatDate: LocalDate?,
    @get:Schema(description = "统一社会信用代码证")
    @ExcelIgnore
    val uCode: String?,
    @get:Schema(description = "注册公司名称")
    @ExcelIgnore
    val companyName: String?,
    @get:Schema(description = "注册资金")
    @ExcelIgnore
    val regMoney: Double?,
    @get:Schema(description = "注册日期")
    @ExcelIgnore
    val regDate: LocalDate?,
    @get:Schema(description = "reg_foreign_money")
    @ExcelIgnore
    val regForeignMoney: Double?,
    @get:Schema(description = "注册信息统计日期：")
    @ExcelIgnore
    val regStatDate: LocalDate?,
    @get:Schema(description = "是否涉及固定资产投资项目1-是,2-否")
    @ExcelIgnore
    val isFixedAsset: Short?,
    @get:Schema(description = "是否涉及建设用地")
    @ExcelIgnore
    val isUseLand: Short?,
    @get:Schema(description = "建设用地规划许可证编号")
    @ExcelIgnore
    val landLicence: String?,
    @get:Schema(description = "完成报批日期")
    @ExcelIgnore
    val finishCheckDate: LocalDate?,
    @get:Schema(description = "取得许可证日期")
    @ExcelIgnore
    val licenceDate: LocalDate?,
    @get:Schema(description = "到账金额")
    @ExcelIgnore
    val receivedMoney: Double?,
    @get:Schema(description = "0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工  ")
    @ExcelIgnore
    val progress: Short?,
    @get:Schema(description = "0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交")
    @ExcelIgnore
    val checkStatus: Short?,
    @get:Schema(description = "开工日期")
    @ExcelProperty("开工日期")
    val startDateCommit: LocalDate?,
    @get:Schema(description = "竣工日期")
    @ExcelProperty("竣工日期")
    val completeDate: LocalDate?,
    @get:Schema(description = "投资方联系人")
    @ExcelIgnore
    val linker: String?,
    @get:Schema(description = "投资方联系电话")
    @ExcelIgnore
    val linkerTel: String?,
    @get:Schema(description = "招商人员")
    @ExcelIgnore
    val linkerTz: String?,
    @get:Schema(description = "招商人员电话")
    @ExcelIgnore
    val linkerTzTel: String?,
    @get:Schema(description = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    @ExcelIgnore
    val creatorId: Int?,
    @get:Schema(description = "创建人姓名")
    @ExcelIgnore
    val creatorName: String?,
    @get:Schema(description = "创建人的部门编码")
    @ExcelIgnore
    val creatorDept: String?,
    @get:Schema(description = "最后一次审核结果描述")
    @ExcelIgnore
    val lastCheckDesc: String?,
    @get:Schema(description = "实际投入资金规模（亿元）")
    @ExcelIgnore
    val actualInvest: Double?,
    @get:Schema(description = "开工认定编码")
    @ExcelIgnore
    val startCode: String?,
    @get:Schema(description = "实际建成产能")
    @ExcelIgnore
    val actualOutput: Double?,
    @get:Schema(description = "累计实际投入资金规模（亿元")
    @ExcelIgnore
    val sumActualInvest: Double?,
    @get:Schema(description = "修改人")
    @ExcelIgnore
    val updateId: String?,
    @get:Schema(description = "老项目创建人id")
    @ExcelIgnore
    val oldCreateBy: String?,
    @get:Schema(description = "老项目修改人id&#13;&#10;")
    @ExcelIgnore
    val oldUpdateBy: String?,
    @get:Schema(description = "老项目的主键ID")
    @ExcelIgnore
    val oldId: String?,
    @get:Schema(description = "是否为六大产业项目")
    @ExcelIgnore
    val isSixpro: Short?,
    @get:Schema(description = "六大产业项目编码")
    @ExcelIgnore
    val sixproCode: String?,
    @get:Schema(description = "备注")
    @ExcelIgnore
    val remarks: String?,
    @get:Schema(description = "排序")
    @ExcelIgnore
    val orderIdx: Int?,
    @get:Schema(description = "签约金额（外资已根据汇率转换）")
    @ExcelIgnore
    val qyje: Double?,
    @get:Schema(description = "开工确认 1：是 0：否")
    @ExcelIgnore
    val kgqr: String?,
    @get:Schema(description = "竣工确认 1：是 0：否")
    @ExcelIgnore
    val jgqr: String?,
    @get:Schema(description = "项目评级")
    @ExcelIgnore
    val projLevel: String?,
    @get:Schema(description = "是否为新引进企业")
    @ExcelIgnore
    val isNew: Short?,
    @get:Schema(description = "是否为世界500强或全球专业领域行业龙头企业")
    @ExcelIgnore
    val isWorld: Short?,
    @get:Schema(description = "是否为国内500强或国内行业排名前100企业")
    @ExcelIgnore
    val isChina: Short?,
    @get:Schema(description = "是否为上市公司或上市辅导期企业")
    @ExcelProperty("是否为上市公司或上市辅导期企业")
    val isListed: Short?,
    @get:Schema(description = "是否为独角兽企业")
    @ExcelIgnore
    val isUnicorn: Short?,
    @get:Schema(description = "已投资项目对属地政府亩均税收（万元）")
    @ExcelIgnore
    val mujunTax: String?,
    @get:Schema(description = "主要客户")
    @ExcelIgnore
    val mainCustomer: String?,
    @get:Schema(description = "计划总投资（万元）")
    @ExcelProperty("计划总投资（万元）")
    val planTotal: String?,
    @get:Schema(description = "注册资本（万元）")
    @ExcelProperty("注册资本（万元）")
    val zhuceMoney: String?,
    @get:Schema(description = "计划开工时间")
    @ExcelIgnore
    val planStartDate: LocalDate?,
    @get:Schema(description = "计划竣工时间")
    @ExcelIgnore
    val planEndDate: LocalDate?,
    @get:Schema(description = "项目使用主要原、辅材料")
    @ExcelIgnore
    val projectMaterial: String?,
    @get:Schema(description = "主要流程工艺")
    @ExcelIgnore
    val mainProcess: String?,
    @get:Schema(description = "是否为新供地项目")
    @ExcelIgnore
    val isNewproject: String?,
    @get:Schema(description = "项目选址位置")
    @ExcelProperty("项目选址位置")
    val projectAddress: String?,
    @get:Schema(description = "申请用地面积（亩）")
    @ExcelProperty("申请用地面积（亩）")
    val sqLandArea: String?,
    @get:Schema(description = "行业是否属于高新技术产业分类目录")
    @ExcelIgnore
    val isGx: String?,
    @get:Schema(description = "是否为高技术项目")
    @ExcelIgnore
    val isGjs: String?,
    @get:Schema(description = "是否为国家工业战略性新兴产业")
    @ExcelIgnore
    val isGyzl: String?,
    @get:Schema(description = "容积率")
    @ExcelIgnore
    val far: String?,
    @get:Schema(description = "预期开票销售（万元）")
    @ExcelIgnore
    val yqKpxs: String?,
    @get:Schema(description = "预期税收（万元）")
    @ExcelIgnore
    val yqSs: String?,
    @get:Schema(description = "预期用工人数（人）")
    @ExcelIgnore
    val yqWorker: String?,
    @get:Schema(description = "固定资产投资占比（%）")
    @ExcelIgnore
    val fixedPercent: String?,
    @get:Schema(description = "投资强度（万元/千平方米）")
    @ExcelProperty("投资强度（万元/千平方米）")
    val investLevel: String?,
    @get:Schema(description = "预期亩均税收（万元/千平方米）")
    @ExcelIgnore
    val yqMjtax: String?,
    @get:Schema(description = "是否有产生废水和挥发性有机废水排放")
    @ExcelIgnore
    val isWaterpf: String?,
    @get:Schema(description = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    @ExcelProperty("预计年排污情况（废水、废气等）")
    val isWuran: String?,
    @get:Schema(description = "总能耗")
    @ExcelProperty("预计年耗能情况(吨标煤)")
    val totalUse: String?,
    @get:Schema(description = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    @ExcelIgnore
    val isYanfa: String?,
    @get:Schema(description = "项目是否拥有相关有效发明专利")
    @ExcelIgnore
    val isZhuanli: String?,
    @get:Schema(description = "是否拟列入重点活动签约项目库")
    @ExcelIgnore
    val isImportant: String?,
    @get:Schema(description = "是否为招商会项目")
    @ExcelIgnore
    val isZsh: String?,
    @get:Schema(description = "招商会名称")
    @ExcelIgnore
    val zshName: String?,
    @get:Schema(description = "预计年销售（万元）")
    @ExcelIgnore
    val yjYear: String?,
    @get:Schema(description = "备注")
    @ExcelIgnore
    val remark: String?,
    @get:Schema(description = "是否为瞪羚企业")
    @ExcelIgnore
    val isGazelle: Short?,
    @get:Schema(description = "是否为专精特新企业")
    @ExcelIgnore
    val isSpecialized: Short?,
    @get:Schema(description = "设备投资（万元）")
    @ExcelIgnore
    val deviceInvest: String?,
    @get:Schema(description = "固定资产投资（万元）")
    @ExcelProperty("固定资产投资（万元）")
    val fixedInvest: String?,
    @get:Schema(description = "1 自行接洽 2 市级机关推荐")
    @ExcelIgnore
    val bResource: Int?,
    @get:Schema(description = "市集机关名称")
    @ExcelIgnore
    val sjjgName: String?,
    @get:Schema(description = "企业联系人")
    @ExcelIgnore
    val qyLinker: String?,
    @get:Schema(description = "联系电话")
    @ExcelIgnore
    val qyPhone: String?,
    @get:Schema(description = "申请用地年")
    @ExcelIgnore
    val sqLandYear: String?,
    @get:Schema(description = "预期产值")
    @ExcelIgnore
    val yqCz: String?,
    @get:Schema(description = "自评价等级 优良一般")
    @ExcelIgnore
    val zpjLevel: String?,
    @get:Schema(description = "重点项目类型")
    @ExcelIgnore
    val importProjType: String?,
    @get:Schema(description = "计划总投资第一期")
    @ExcelIgnore
    val planTotal1: String?,
    @get:Schema(description = "计划总投资第二期")
    @ExcelIgnore
    val planTotal2: String?,
    @get:Schema(description = "是否重点项目")
    @ExcelIgnore
    val isImportProj: String?,
    @get:Schema(description = "风险投资方名称")
    @ExcelIgnore
    val fxName: String?,
    @get:Schema(description = "预期开票销售（第一年）")
    @ExcelProperty("预期开票销售（第一年）")
    val yqKpxs1: String?,
    @get:Schema(description = "预期开票销售（第二年）")
    @ExcelIgnore
    val yqKpxs2: String?,
    @get:Schema(description = "预期开票销售（第三年）")
    @ExcelIgnore
    val yqKpxs3: String?,
    @get:Schema(description = "预期税收（第一年）")
    @ExcelProperty("预期税收（第一年）")
    val yqSs1: String?,
    @get:Schema(description = "预期税收（第二年）")
    @ExcelIgnore
    val yqSs2: String?,
    @get:Schema(description = "预期税收（第三年）")
    @ExcelIgnore
    val yqSs3: String?,
    @get:Schema(description = "预期亩均税收（第一年）")
    @ExcelProperty("预期亩均税收（第一年）")
    val yqMjtax1: String?,
    @get:Schema(description = "预期亩均税收（第二年）")
    @ExcelIgnore
    val yqMjtax2: String?,
    @get:Schema(description = "预期亩均税收（第三年）")
    @ExcelIgnore
    val yqMjtax3: String?,
    @get:Schema(description = "投资方实力评估")
    @ExcelIgnore
    val tzfLevel: String?,
    @get:Schema(description = "投资方风险评估")
    @ExcelIgnore
    val tzfFx: String?,
    @get:Schema(description = "产业关联度")
    @ExcelProperty("产业关联度")
    val cyGl: String?,
    @get:Schema(description = "产品市场和工艺水平")
    @ExcelIgnore
    val cpGy: String?,
    @get:Schema(description = "团队力量")
    @ExcelIgnore
    val team: String?,
    @get:Schema(description = "专利数")
    @ExcelIgnore
    val zlNum: String?,
    @get:Schema(description = "参赛获奖情况")
    @ExcelIgnore
    val hjContent: String?,
    @get:Schema(description = "认定进度")
    @ExcelIgnore
    val rProgress: String?,
    @get:Schema(description = "是否风险投资")
    @ExcelIgnore
    val isWarningInvest: String?,
    @get:Schema(description = "是否项目支持")
    @ExcelIgnore
    val ifSjProj: String?,
    @get:Schema(description = "预期产值（第一年）")
    @ExcelProperty("预期产值（第一年）")
    val yqCz1: String?,
    @get:Schema(description = "预期产值（第二年）")
    @ExcelIgnore
    val yqCz2: String?,
    @get:Schema(description = "预期产值（第三年）")
    @ExcelIgnore
    val yqCz3: String?,
    @get:Schema(description = "产品市场前景")
    @ExcelIgnore
    val cpQj: String?,
    @get:Schema(description = "工艺水平（工作效率）")
    @ExcelIgnore
    val gyXl: String?,
    @get:Schema(description = "工艺水平（良品率）")
    @ExcelIgnore
    val gyLp: String?,
    @get:Schema(description = "工艺水平（整体评价）")
    @ExcelIgnore
    val gyPj: String?,
    @get:Schema(description = "资产负债表")
    @ExcelIgnore
    val zcfz: String?,
    @get:Schema(description = "利润表")
    @ExcelIgnore
    val lirun: String?,
    @get:Schema(description = "现金流量表")
    @ExcelIgnore
    val xjll: String?,
    @get:Schema(description = "固定资产与流动资产占比")
    @ExcelIgnore
    val zczb: String?,
    @get:Schema(description = "资金来源")
    @ExcelIgnore
    val zjly: String?,
    @get:Schema(description = "金融机构信用评级")
    @ExcelIgnore
    val xypj: String?,
    @get:Schema(description = "行业协会评价")
    @ExcelIgnore
    val xhpj: String?,
    @get:Schema(description = "纳税合规性")
    @ExcelIgnore
    val hegui: String?,
    @get:Schema(description = "综合评估等级")
    @ExcelProperty("综合评估等级")
    val zhpg: String?,
    @get:Schema(description = "评估状态")
    @ExcelIgnore
    val pgStatus: String?,
    @get:Schema(description = "是否科创项目")
    @ExcelProperty("是否科创项目")
    val isKcProj: String?,
    @get:Schema(description = "科创项目认定条件")
    @ExcelIgnore
    val kcProjTj: String?,
    @get:Schema(description = "QFLP外资项目")
    @ExcelProperty("QFLP外资项目")
    val isQflp: String?,
    @get:Schema(description = "成效情况说明")
    @ExcelIgnore
    val cgRemark: String?,
    @get:Schema(description = "是否特殊行业")
    @ExcelProperty("是否特殊行业")
    val tshy: String?,
    @get:Schema(description = "有无准入限制")
    @ExcelProperty("有无准入限制")
    val zrxz: String?,
    @get:Schema(description = "是否两高项目")
    @ExcelProperty("是否两高项目")
    val lgxm: String?,
    @get:Schema(description = "有无重金属排放")
    @ExcelProperty("有无重金属排放")
    val zjspf: String?,
    @get:Schema(description = "产品市场现状")
    @ExcelIgnore
    val cpscxz: String?,
    @get:Schema(description = "工艺水平")
    @ExcelIgnore
    val gysp: String?,
    @get:Schema(description = "生产效率")
    @ExcelIgnore
    val scxl: String?,
    @get:Schema(description = "良品率")
    @ExcelIgnore
    val lpl: String?,
    @get:Schema(description = "是否高新技术企业")
    @ExcelProperty("是否高新技术企业")
    val isGxjs: String?,
    @get:Schema(description = "是否建立企业研发中心")
    @ExcelIgnore
    val ifBuildYfzx: String?,
    @get:Schema(description = "企业研发中心")
    @ExcelIgnore
    val buildYfzx: String?,
    @get:Schema(description = "省级以上科技或人才等项目")
    @ExcelIgnore
    val sjProj: String?,
    @get:Schema(description = "厂房租赁面积(平方米)")
    @ExcelProperty("厂房租赁面积(平方米)")
    val zlLandArea: String?,
    @get:Schema(description = "折算用地")
    @ExcelProperty("折算用地")
    val zlLandAreaZs: String?,
    @get:Schema(description = "质态评估评审结果")
    @ExcelIgnore
    val ztpgzzcl: List<String>?,
    @get:Schema(description = "批准部门及文号")
    @ExcelIgnore
    val pzwh: String?,
    @get:Schema(description = "批准日期")
    @ExcelIgnore
    val pzrq: LocalDate?,
    @get:Schema(description = "成效情况")
    @ExcelIgnore
    val cxqk: String?,
    @get:Schema(description = "qr_key")
    @ExcelIgnore
    val qrKey: String?,
    @get:Schema(description = "招商方")
    @ExcelIgnore
    val zsf: String?,
    @get:Schema(description = "投资方")
    @ExcelIgnore
    val tzf: String?,
    @get:Schema(description = "投资地址")
    @ExcelIgnore
    val tzdz: String?,
    @get:Schema(description = "佐证材料")
    @ExcelIgnore
    var xyzzcl: List<String>?,
    @get:Schema(description = "是否有融资需求")
    @ExcelIgnore
    val isRzxq: String?,
    @get:Schema(description = "融资金额")
    @ExcelIgnore
    val rzMoney: String?,
    @get:Schema(description = "科创项目分类")
    @ExcelIgnore
    val kcProjType: String?,
    @get:Schema(description = "科创佐证材料")
    @ExcelIgnore
    val kccl: List<String>?,
) : S3Transformable {
    constructor(record: ExtZsProjProjectSigned) : this(
        id = record.id,
        name = record.name,
        code = record.code,
        districtCode = record.districtCode,
        district = record.district,
        zoneCode = record.zoneCode,
        zoneName = record.zoneName,
        townCode = record.townCode,
        townName = record.townName,
        pType = record.pType,
        investMoney = record.investMoney,
        foreignMoney = record.foreignMoney,
        projType = record.projType,
        industryFirstCode = record.industryFirstCode,
        industryFirstName = record.industryFirstName,
        industryCode = record.industryCode,
        industryName = record.industryName,
        bIndustry = record.bIndustry,
        investor = record.investor,
        investorType = record.investorType,
        investorPlace = record.investorPlace,
        signedDate = record.signedDate,
        signedStatDate = record.signedStatDate,
        Desc = record.Desc,
        checkName = record.checkName,
        checkMoney = record.checkMoney,
        checkDate = record.checkDate,
        checkStatDate = record.checkStatDate,
        uCode = record.uCode,
        companyName = record.companyName,
        regMoney = record.regMoney,
        regDate = record.regDate,
        regForeignMoney = record.regForeignMoney,
        regStatDate = record.regStatDate,
        isFixedAsset = record.isFixedAsset,
        isUseLand = record.isUseLand,
        landLicence = record.landLicence,
        finishCheckDate = record.finishCheckDate,
        licenceDate = record.licenceDate,
        receivedMoney = record.receivedMoney,
        progress = record.progress,
        checkStatus = record.checkStatus,
        startDateCommit = record.startDateCommit,
        completeDate = record.completeDate,
        linker = record.linker,
        linkerTel = record.linkerTel,
        linkerTz = record.linkerTz,
        linkerTzTel = record.linkerTzTel,
        creatorId = record.creatorId,
        creatorName = record.creatorName,
        creatorDept = record.creatorDept,
        lastCheckDesc = record.lastCheckDesc,
        actualInvest = record.actualInvest,
        startCode = record.startCode,
        actualOutput = record.actualOutput,
        sumActualInvest = record.sumActualInvest,
        updateId = record.updateId,
        oldCreateBy = record.oldCreateBy,
        oldUpdateBy = record.oldUpdateBy,
        oldId = record.oldId,
        isSixpro = record.isSixpro,
        sixproCode = record.sixproCode,
        remarks = record.remarks,
        orderIdx = record.orderIdx,
        qyje = record.qyje,
        kgqr = record.kgqr,
        jgqr = record.jgqr,
        projLevel = record.projLevel,
        isNew = record.isNew,
        isWorld = record.isWorld,
        isChina = record.isChina,
        isListed = record.isListed,
        isUnicorn = record.isUnicorn,
        mujunTax = record.mujunTax,
        mainCustomer = record.mainCustomer,
        planTotal = record.planTotal,
        zhuceMoney = record.zhuceMoney,
        planStartDate = record.planStartDate,
        planEndDate = record.planEndDate,
        projectMaterial = record.projectMaterial,
        mainProcess = record.mainProcess,
        isNewproject = record.isNewproject,
        projectAddress = record.projectAddress,
        sqLandArea = record.sqLandArea,
        isGx = record.isGx,
        isGjs = record.isGjs,
        isGyzl = record.isGyzl,
        far = record.far,
        yqKpxs = record.yqKpxs,
        yqSs = record.yqSs,
        yqWorker = record.yqWorker,
        fixedPercent = record.fixedPercent,
        investLevel = record.investLevel,
        yqMjtax = record.yqMjtax,
        isWaterpf = record.isWaterpf,
        isWuran = record.isWuran,
        totalUse = record.totalUse,
        isYanfa = record.isYanfa,
        isZhuanli = record.isZhuanli,
        isImportant = record.isImportant,
        isZsh = record.isZsh,
        zshName = record.zshName,
        yjYear = record.yjYear,
        remark = record.remark,
        isGazelle = record.isGazelle,
        isSpecialized = record.isSpecialized,
        deviceInvest = record.deviceInvest,
        fixedInvest = record.fixedInvest,
        bResource = record.bResource,
        sjjgName = record.sjjgName,
        qyLinker = record.qyLinker,
        qyPhone = record.qyPhone,
        sqLandYear = record.sqLandYear,
        yqCz = record.yqCz,
        zpjLevel = record.zpjLevel,
        importProjType = record.importProjType,
        planTotal1 = record.planTotal1,
        planTotal2 = record.planTotal2,
        isImportProj = record.isImportProj,
        fxName = record.fxName,
        yqKpxs1 = record.yqKpxs1,
        yqKpxs2 = record.yqKpxs2,
        yqKpxs3 = record.yqKpxs3,
        yqSs1 = record.yqSs1,
        yqSs2 = record.yqSs2,
        yqSs3 = record.yqSs3,
        yqMjtax1 = record.yqMjtax1,
        yqMjtax2 = record.yqMjtax2,
        yqMjtax3 = record.yqMjtax3,
        tzfLevel = record.tzfLevel,
        tzfFx = record.tzfFx,
        cyGl = record.cyGl,
        cpGy = record.cpGy,
        team = record.team,
        zlNum = record.zlNum,
        hjContent = record.hjContent,
        rProgress = record.rProgress,
        isWarningInvest = record.isWarningInvest,
        ifSjProj = record.ifSjProj,
        yqCz1 = record.yqCz1,
        yqCz2 = record.yqCz2,
        yqCz3 = record.yqCz3,
        cpQj = record.cpQj,
        gyXl = record.gyXl,
        gyLp = record.gyLp,
        gyPj = record.gyPj,
        zcfz = record.zcfz,
        lirun = record.lirun,
        xjll = record.xjll,
        zczb = record.zczb,
        zjly = record.zjly,
        xypj = record.xypj,
        xhpj = record.xhpj,
        hegui = record.hegui,
        zhpg = record.zhpg,
        pgStatus = record.pgStatus,
        isKcProj = record.isKcProj,
        kcProjTj = record.kcProjTj,
        isQflp = record.isQflp,
        cgRemark = record.cgRemark,
        tshy = record.tshy,
        zrxz = record.zrxz,
        lgxm = record.lgxm,
        zjspf = record.zjspf,
        cpscxz = record.cpscxz,
        gysp = record.gysp,
        scxl = record.scxl,
        lpl = record.lpl,
        isGxjs = record.isGxjs,
        ifBuildYfzx = record.ifBuildYfzx,
        buildYfzx = record.buildYfzx,
        sjProj = record.sjProj,
        zlLandArea = record.zlLandArea,
        zlLandAreaZs = record.zlLandAreaZs,
        ztpgzzcl = record.ztpgzzcl?.split(";")?.filter(String::isNotEmpty),
        pzwh = record.pzwh,
        pzrq = record.pzrq,
        cxqk = record.cxqk,
        qrKey = record.qrKey,
        zsf = record.zsf,
        tzf = record.tzf,
        tzdz = record.tzdz,
        xyzzcl = record.xyzzcl?.split(";")?.filter(String::isNotEmpty),
        isRzxq = record.isRzxq,
        rzMoney = record.rzMoney,
        kcProjType = record.kcProjType,
        kccl = record.kccl?.split(";")?.filter(String::isNotEmpty),
        status = if (queryOne<ProjectDigitalInvestmentAttracting> { where(ProjectDigitalInvestmentAttracting::investOnlineId eq record.id) }?.isQualityEvaluationComplete == true) {
            "全部评估完成"
        } else {
            "未评估完成"
        }
    )

    override val disposition get() = S3Service.Disposition.INLINE
    override fun s3transform(transform: (String) -> String) {
        xyzzcl = xyzzcl?.map {
            if (it.startsWith('/')) {
                transform(it)
            } else {
                it
            }
        }
    }
}
