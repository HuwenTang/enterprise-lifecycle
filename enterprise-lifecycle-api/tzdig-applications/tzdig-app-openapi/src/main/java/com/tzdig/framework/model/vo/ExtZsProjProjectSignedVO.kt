@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ExtZsProjProjectSignedVO(
    @get:Schema(description = "_id")
    @ExcelProperty("_id")
    val id: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val name: String?,
    @get:Schema(description = "项目编号")
    @ExcelProperty("项目编号")
    val code: String?,
    @get:Schema(description = "区县编码")
    @ExcelProperty("区县编码")
    val districtCode: String?,
    @get:Schema(description = "区县")
    @ExcelProperty("区县")
    val district: String?,
    @get:Schema(description = "园区code")
    @ExcelProperty("园区code")
    val zoneCode: String?,
    @get:Schema(description = "园区名称")
    @ExcelProperty("园区名称")
    val zoneName: String?,
    @get:Schema(description = "街镇")
    @ExcelProperty("街镇")
    val townCode: String?,
    @get:Schema(description = "街镇名")
    @ExcelProperty("街镇名")
    val townName: String?,
    @get:Schema(description = "项目类别, 1-内资,2-外资 默认1")
    @ExcelProperty("项目类别, 1-内资,2-外资 默认1")
    val pType: Short?,
    @get:Schema(description = "总投资额,  内资时单位是亿元,外资时单位是万美元")
    @ExcelProperty("总投资额,  内资时单位是亿元,外资时单位是万美元")
    val investMoney: Double?,
    @get:Schema(description = "协议利用外资(万美元)")
    @ExcelProperty("协议利用外资(万美元)")
    val foreignMoney: Double?,
    @get:Schema(description = "项目类型, t_proj_type")
    @ExcelProperty("项目类型, t_proj_type")
    val projType: String?,
    @get:Schema(description = "项目类型, t_proj_type")
    var projTypeLabel: String? = null,
    @get:Schema(description = "产业大类(不要显示的) t_proj_industry_first")
    @ExcelProperty("产业大类(不要显示的) t_proj_industry_first")
    val industryFirstCode: String?,
    @get:Schema(description = "产业大类名称t_proj_industry_first")
    @ExcelProperty("产业大类名称t_proj_industry_first")
    val industryFirstName: String?,
    @get:Schema(description = "行业编码(不要显示的)t_proj_industry")
    @ExcelProperty("行业编码(不要显示的)t_proj_industry")
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
    @ExcelProperty("10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它")
    val investorType: Short?,
    @get:Schema(description = "90-香港 ,100-台湾,110-日本,&#13;&#10;120-韩国,130-美国,140-欧洲,&#13;&#10;150-新加坡,80-外资其他&#13;&#10;10 北京&#13;&#10;20 上海&#13;&#10;30 广州&#13;&#10;40 深圳&#13;&#10;50 苏州&#13;&#10;60 长三角其他城市&#13;&#10;70 内资其他&#13;&#10;")
    @ExcelProperty("90-香港 ,100-台湾,110-日本,&#13;&#10;120-韩国,130-美国,140-欧洲,&#13;&#10;150-新加坡,80-外资其他&#13;&#10;10 北京&#13;&#10;20 上海&#13;&#10;30 广州&#13;&#10;40 深圳&#13;&#10;50 苏州&#13;&#10;60 长三角其他城市&#13;&#10;70 内资其他&#13;&#10;")
    val investorPlace: String?,
    @get:Schema(description = "签约日期")
    @ExcelProperty("签约日期")
    val signedDate: LocalDate?,
    @get:Schema(description = "签约信息统计日期")
    @ExcelProperty("签约信息统计日期")
    val signedStatDate: LocalDate?,
    @get:Schema(description = "项目简介, 大文本框")
    @ExcelProperty("项目简介, 大文本框")
    val Desc: String?,
    @get:Schema(description = "备案（核准）项目名称")
    @ExcelProperty("备案（核准）项目名称")
    val checkName: String?,
    @get:Schema(description = "备案（核准）投资总额（亿元）")
    @ExcelProperty("备案（核准）投资总额（亿元）")
    val checkMoney: Double?,
    @get:Schema(description = "备案（核准）日期")
    @ExcelProperty("备案（核准）日期")
    val checkDate: LocalDate?,
    @get:Schema(description = "备案（核准）统计日期")
    @ExcelProperty("备案（核准）统计日期")
    val checkStatDate: LocalDate?,
    @get:Schema(description = "统一社会信用代码证")
    @ExcelProperty("统一社会信用代码证")
    val uCode: String?,
    @get:Schema(description = "注册公司名称")
    @ExcelProperty("注册公司名称")
    val companyName: String?,
    @get:Schema(description = "注册资金")
    @ExcelProperty("注册资金")
    val regMoney: Double?,
    @get:Schema(description = "注册日期")
    @ExcelProperty("注册日期")
    val regDate: LocalDate?,
    @get:Schema(description = "reg_foreign_money")
    @ExcelProperty("reg_foreign_money")
    val regForeignMoney: Double?,
    @get:Schema(description = "注册信息统计日期：")
    @ExcelProperty("注册信息统计日期：")
    val regStatDate: LocalDate?,
    @get:Schema(description = "是否涉及固定资产投资项目1-是,2-否")
    @ExcelProperty("是否涉及固定资产投资项目1-是,2-否")
    val isFixedAsset: Short?,
    @get:Schema(description = "是否涉及建设用地")
    @ExcelProperty("是否涉及建设用地")
    val isUseLand: Short?,
    @get:Schema(description = "建设用地规划许可证编号")
    @ExcelProperty("建设用地规划许可证编号")
    val landLicence: String?,
    @get:Schema(description = "完成报批日期")
    @ExcelProperty("完成报批日期")
    val finishCheckDate: LocalDate?,
    @get:Schema(description = "取得许可证日期")
    @ExcelProperty("取得许可证日期")
    val licenceDate: LocalDate?,
    @get:Schema(description = "到账金额")
    @ExcelProperty("到账金额")
    val receivedMoney: Double?,
    @get:Schema(description = "0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工  ")
    @ExcelProperty("0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工  ")
    val progress: Short?,
    @get:Schema(description = "0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交")
    @ExcelProperty("0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交")
    val checkStatus: Short?,
    @get:Schema(description = "开工日期")
    @ExcelProperty("开工日期")
    val startDateCommit: LocalDate?,
    @get:Schema(description = "竣工日期")
    @ExcelProperty("竣工日期")
    val completeDate: LocalDate?,
    @get:Schema(description = "投资方联系人")
    @ExcelProperty("投资方联系人")
    val linker: String?,
    @get:Schema(description = "投资方联系电话")
    @ExcelProperty("投资方联系电话")
    val linkerTel: String?,
    @get:Schema(description = "招商人员")
    @ExcelProperty("招商人员")
    val linkerTz: String?,
    @get:Schema(description = "招商人员电话")
    @ExcelProperty("招商人员电话")
    val linkerTzTel: String?,
    @get:Schema(description = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    @ExcelProperty("创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    val creatorId: Int?,
    @get:Schema(description = "创建人姓名")
    @ExcelProperty("创建人姓名")
    val creatorName: String?,
    @get:Schema(description = "创建人的部门编码")
    @ExcelProperty("创建人的部门编码")
    val creatorDept: String?,
    @get:Schema(description = "最后一次审核结果描述")
    @ExcelProperty("最后一次审核结果描述")
    val lastCheckDesc: String?,
    @get:Schema(description = "实际投入资金规模（亿元）")
    @ExcelProperty("实际投入资金规模（亿元）")
    val actualInvest: Double?,
    @get:Schema(description = "开工认定编码")
    @ExcelProperty("开工认定编码")
    val startCode: String?,
    @get:Schema(description = "实际建成产能")
    @ExcelProperty("实际建成产能")
    val actualOutput: Double?,
    @get:Schema(description = "累计实际投入资金规模（亿元")
    @ExcelProperty("累计实际投入资金规模（亿元")
    val sumActualInvest: Double?,
    @get:Schema(description = "修改人")
    @ExcelProperty("修改人")
    val updateId: String?,
    @get:Schema(description = "老项目创建人id")
    @ExcelProperty("老项目创建人id")
    val oldCreateBy: String?,
    @get:Schema(description = "老项目修改人id&#13;&#10;")
    @ExcelProperty("老项目修改人id&#13;&#10;")
    val oldUpdateBy: String?,
    @get:Schema(description = "老项目的主键ID")
    @ExcelProperty("老项目的主键ID")
    val oldId: String?,
    @get:Schema(description = "是否为六大产业项目")
    @ExcelProperty("是否为六大产业项目")
    val isSixpro: Short?,
    @get:Schema(description = "六大产业项目编码")
    @ExcelProperty("六大产业项目编码")
    val sixproCode: String?,
    @get:Schema(description = "备注")
    @ExcelProperty("备注")
    val remarks: String?,
    @get:Schema(description = "1-正常，2-删除")
    @ExcelProperty("1-正常，2-删除")
    val Status: Short?,
    @get:Schema(description = "排序")
    @ExcelProperty("排序")
    val orderIdx: Int?,
    @get:Schema(description = "签约金额（外资已根据汇率转换）")
    @ExcelProperty("签约金额（外资已根据汇率转换）")
    val qyje: Double?,
    @get:Schema(description = "开工确认 1：是 0：否")
    @ExcelProperty("开工确认 1：是 0：否")
    val kgqr: String?,
    @get:Schema(description = "竣工确认 1：是 0：否")
    @ExcelProperty("竣工确认 1：是 0：否")
    val jgqr: String?,
    @get:Schema(description = "项目评级")
    @ExcelProperty("项目评级")
    val projLevel: String?,
    @get:Schema(description = "是否为新引进企业")
    @ExcelProperty("是否为新引进企业")
    val isNew: Short?,
    @get:Schema(description = "是否为世界500强或全球专业领域行业龙头企业")
    @ExcelProperty("是否为世界500强或全球专业领域行业龙头企业")
    val isWorld: Short?,
    @get:Schema(description = "是否为国内500强或国内行业排名前100企业")
    @ExcelProperty("是否为国内500强或国内行业排名前100企业")
    val isChina: Short?,
    @get:Schema(description = "是否为上市公司或上市辅导期企业")
    @ExcelProperty("是否为上市公司或上市辅导期企业")
    val isListed: Short?,
    @get:Schema(description = "是否为独角兽企业")
    @ExcelProperty("是否为独角兽企业")
    val isUnicorn: Short?,
    @get:Schema(description = "已投资项目对属地政府亩均税收（万元）")
    @ExcelProperty("已投资项目对属地政府亩均税收（万元）")
    val mujunTax: String?,
    @get:Schema(description = "主要客户")
    @ExcelProperty("主要客户")
    val mainCustomer: String?,
    @get:Schema(description = "计划总投资（万元）")
    @ExcelProperty("计划总投资（万元）")
    val planTotal: String?,
    @get:Schema(description = "注册资本（万元）")
    @ExcelProperty("注册资本（万元）")
    val zhuceMoney: String?,
    @get:Schema(description = "计划开工时间")
    @ExcelProperty("计划开工时间")
    val planStartDate: LocalDate?,
    @get:Schema(description = "计划竣工时间")
    @ExcelProperty("计划竣工时间")
    val planEndDate: LocalDate?,
    @get:Schema(description = "项目使用主要原、辅材料")
    @ExcelProperty("项目使用主要原、辅材料")
    val projectMaterial: String?,
    @get:Schema(description = "主要流程工艺")
    @ExcelProperty("主要流程工艺")
    val mainProcess: String?,
    @get:Schema(description = "是否为新供地项目")
    @ExcelProperty("是否为新供地项目")
    val isNewproject: String?,
    @get:Schema(description = "项目选址位置")
    @ExcelProperty("项目选址位置")
    val projectAddress: String?,
    @get:Schema(description = "申请用地面积（亩）")
    @ExcelProperty("申请用地面积（亩）")
    val sqLandArea: String?,
    @get:Schema(description = "行业是否属于高新技术产业分类目录")
    @ExcelProperty("行业是否属于高新技术产业分类目录")
    val isGx: String?,
    @get:Schema(description = "是否为高技术项目")
    @ExcelProperty("是否为高技术项目")
    val isGjs: String?,
    @get:Schema(description = "是否为国家工业战略性新兴产业")
    @ExcelProperty("是否为国家工业战略性新兴产业")
    val isGyzl: String?,
    @get:Schema(description = "容积率")
    @ExcelProperty("容积率")
    val far: String?,
    @get:Schema(description = "预期开票销售（万元）")
    @ExcelProperty("预期开票销售（万元）")
    val yqKpxs: String?,
    @get:Schema(description = "预期税收（万元）")
    @ExcelProperty("预期税收（万元）")
    val yqSs: String?,
    @get:Schema(description = "预期用工人数（人）")
    @ExcelProperty("预期用工人数（人）")
    val yqWorker: String?,
    @get:Schema(description = "固定资产投资占比（%）")
    @ExcelProperty("固定资产投资占比（%）")
    val fixedPercent: String?,
    @get:Schema(description = "投资强度（万元/千平方米）")
    @ExcelProperty("投资强度（万元/千平方米）")
    val investLevel: String?,
    @get:Schema(description = "预期亩均税收（万元/千平方米）")
    @ExcelProperty("预期亩均税收（万元/千平方米）")
    val yqMjtax: String?,
    @get:Schema(description = "是否有产生废水和挥发性有机废水排放")
    @ExcelProperty("是否有产生废水和挥发性有机废水排放")
    val isWaterpf: String?,
    @get:Schema(description = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    @ExcelProperty("产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    val isWuran: String?,
    @get:Schema(description = "总能耗")
    @ExcelProperty("总能耗")
    val totalUse: String?,
    @get:Schema(description = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    @ExcelProperty("项目是否含有研发团队、产学研合作及研发机构建设内容")
    val isYanfa: String?,
    @get:Schema(description = "项目是否拥有相关有效发明专利")
    @ExcelProperty("项目是否拥有相关有效发明专利")
    val isZhuanli: String?,
    @get:Schema(description = "是否拟列入重点活动签约项目库")
    @ExcelProperty("是否拟列入重点活动签约项目库")
    val isImportant: String?,
    @get:Schema(description = "是否为招商会项目")
    @ExcelProperty("是否为招商会项目")
    val isZsh: String?,
    @get:Schema(description = "招商会名称")
    @ExcelProperty("招商会名称")
    val zshName: String?,
    @get:Schema(description = "预计年销售（万元）")
    @ExcelProperty("预计年销售（万元）")
    val yjYear: String?,
    @get:Schema(description = "备注")
    @ExcelProperty("备注")
    val remark: String?,
    @get:Schema(description = "是否为瞪羚企业")
    @ExcelProperty("是否为瞪羚企业")
    val isGazelle: Short?,
    @get:Schema(description = "是否为专精特新企业")
    @ExcelProperty("是否为专精特新企业")
    val isSpecialized: Short?,
    @get:Schema(description = "设备投资（万元）")
    @ExcelProperty("设备投资（万元）")
    val deviceInvest: String?,
    @get:Schema(description = "固定资产投资（万元）")
    @ExcelProperty("固定资产投资（万元）")
    val fixedInvest: String?,
    @get:Schema(description = "1 自行接洽 2 市级机关推荐")
    @ExcelProperty("1 自行接洽 2 市级机关推荐")
    val bResource: Int?,
    @get:Schema(description = "市集机关名称")
    @ExcelProperty("市集机关名称")
    val sjjgName: String?,
    @get:Schema(description = "企业联系人")
    @ExcelProperty("企业联系人")
    val qyLinker: String?,
    @get:Schema(description = "联系电话")
    @ExcelProperty("联系电话")
    val qyPhone: String?,
    @get:Schema(description = "申请用地年")
    @ExcelProperty("申请用地年")
    val sqLandYear: String?,
    @get:Schema(description = "预期产值")
    @ExcelProperty("预期产值")
    val yqCz: String?,
    @get:Schema(description = "自评价等级 优良一般")
    @ExcelProperty("自评价等级 优良一般")
    val zpjLevel: String?,
    @get:Schema(description = "重点项目类型")
    @ExcelProperty("重点项目类型")
    val importProjType: String?,
    @get:Schema(description = "计划总投资第一期")
    @ExcelProperty("计划总投资第一期")
    val planTotal1: String?,
    @get:Schema(description = "计划总投资第二期")
    @ExcelProperty("计划总投资第二期")
    val planTotal2: String?,
    @get:Schema(description = "是否重点项目")
    @ExcelProperty("是否重点项目")
    val isImportProj: String?,
    @get:Schema(description = "风险投资方名称")
    @ExcelProperty("风险投资方名称")
    val fxName: String?,
    @get:Schema(description = "预期开票销售（第一年）")
    @ExcelProperty("预期开票销售（第一年）")
    val yqKpxs1: String?,
    @get:Schema(description = "预期开票销售（第二年）")
    @ExcelProperty("预期开票销售（第二年）")
    val yqKpxs2: String?,
    @get:Schema(description = "预期开票销售（第三年）")
    @ExcelProperty("预期开票销售（第三年）")
    val yqKpxs3: String?,
    @get:Schema(description = "预期税收（第一年）")
    @ExcelProperty("预期税收（第一年）")
    val yqSs1: String?,
    @get:Schema(description = "预期税收（第二年）")
    @ExcelProperty("预期税收（第二年）")
    val yqSs2: String?,
    @get:Schema(description = "预期税收（第三年）")
    @ExcelProperty("预期税收（第三年）")
    val yqSs3: String?,
    @get:Schema(description = "预期亩均税收（第一年）")
    @ExcelProperty("预期亩均税收（第一年）")
    val yqMjtax1: String?,
    @get:Schema(description = "预期亩均税收（第二年）")
    @ExcelProperty("预期亩均税收（第二年）")
    val yqMjtax2: String?,
    @get:Schema(description = "预期亩均税收（第三年）")
    @ExcelProperty("预期亩均税收（第三年）")
    val yqMjtax3: String?,
    @get:Schema(description = "投资方实力评估")
    @ExcelProperty("投资方实力评估")
    val tzfLevel: String?,
    @get:Schema(description = "投资方风险评估")
    @ExcelProperty("投资方风险评估")
    val tzfFx: String?,
    @get:Schema(description = "产业关联度")
    @ExcelProperty("产业关联度")
    val cyGl: String?,
    @get:Schema(description = "产品市场和工艺水平")
    @ExcelProperty("产品市场和工艺水平")
    val cpGy: String?,
    @get:Schema(description = "团队力量")
    @ExcelProperty("团队力量")
    val team: String?,
    @get:Schema(description = "专利数")
    @ExcelProperty("专利数")
    val zlNum: String?,
    @get:Schema(description = "参赛获奖情况")
    @ExcelProperty("参赛获奖情况")
    val hjContent: String?,
    @get:Schema(description = "认定进度")
    @ExcelProperty("认定进度")
    val rProgress: String?,
    @get:Schema(description = "是否风险投资")
    @ExcelProperty("是否风险投资")
    val isWarningInvest: String?,
    @get:Schema(description = "是否项目支持")
    @ExcelProperty("是否项目支持")
    val ifSjProj: String?,
    @get:Schema(description = "预期产值（第一年）")
    @ExcelProperty("预期产值（第一年）")
    val yqCz1: String?,
    @get:Schema(description = "预期产值（第二年）")
    @ExcelProperty("预期产值（第二年）")
    val yqCz2: String?,
    @get:Schema(description = "预期产值（第三年）")
    @ExcelProperty("预期产值（第三年）")
    val yqCz3: String?,
    @get:Schema(description = "产品市场前景")
    @ExcelProperty("产品市场前景")
    val cpQj: String?,
    @get:Schema(description = "工艺水平（工作效率）")
    @ExcelProperty("工艺水平（工作效率）")
    val gyXl: String?,
    @get:Schema(description = "工艺水平（良品率）")
    @ExcelProperty("工艺水平（良品率）")
    val gyLp: String?,
    @get:Schema(description = "工艺水平（整体评价）")
    @ExcelProperty("工艺水平（整体评价）")
    val gyPj: String?,
    @get:Schema(description = "资产负债表")
    @ExcelProperty("资产负债表")
    val zcfz: String?,
    @get:Schema(description = "利润表")
    @ExcelProperty("利润表")
    val lirun: String?,
    @get:Schema(description = "现金流量表")
    @ExcelProperty("现金流量表")
    val xjll: String?,
    @get:Schema(description = "固定资产与流动资产占比")
    @ExcelProperty("固定资产与流动资产占比")
    val zczb: String?,
    @get:Schema(description = "资金来源")
    @ExcelProperty("资金来源")
    val zjly: String?,
    @get:Schema(description = "金融机构信用评级")
    @ExcelProperty("金融机构信用评级")
    val xypj: String?,
    @get:Schema(description = "行业协会评价")
    @ExcelProperty("行业协会评价")
    val xhpj: String?,
    @get:Schema(description = "纳税合规性")
    @ExcelProperty("纳税合规性")
    val hegui: String?,
    @get:Schema(description = "综合评估等级")
    @ExcelProperty("综合评估等级")
    val zhpg: String?,
    @get:Schema(description = "评估状态")
    @ExcelProperty("评估状态")
    val pgStatus: String?,
    @get:Schema(description = "是否科创项目")
    @ExcelProperty("是否科创项目")
    val isKcProj: String?,
    @get:Schema(description = "科创项目认定条件")
    @ExcelProperty("科创项目认定条件")
    val kcProjTj: String?,
    @get:Schema(description = "QFLP外资项目")
    @ExcelProperty("QFLP外资项目")
    val isQflp: String?,
    @get:Schema(description = "成效情况说明")
    @ExcelProperty("成效情况说明")
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
    @ExcelProperty("产品市场现状")
    val cpscxz: String?,
    @get:Schema(description = "工艺水平")
    @ExcelProperty("工艺水平")
    val gysp: String?,
    @get:Schema(description = "生产效率")
    @ExcelProperty("生产效率")
    val scxl: String?,
    @get:Schema(description = "良品率")
    @ExcelProperty("良品率")
    val lpl: String?,
    @get:Schema(description = "是否高新技术企业")
    @ExcelProperty("是否高新技术企业")
    val isGxjs: String?,
    @get:Schema(description = "是否建立企业研发中心")
    @ExcelProperty("是否建立企业研发中心")
    val ifBuildYfzx: String?,
    @get:Schema(description = "企业研发中心")
    @ExcelProperty("企业研发中心")
    val buildYfzx: String?,
    @get:Schema(description = "省级以上科技或人才等项目")
    @ExcelProperty("省级以上科技或人才等项目")
    val sjProj: String?,
    @get:Schema(description = "厂房租赁面积(平方米)")
    @ExcelProperty("厂房租赁面积(平方米)")
    val zlLandArea: String?,
    @get:Schema(description = "折算用地")
    @ExcelProperty("折算用地")
    val zlLandAreaZs: String?,
    @get:Schema(description = "质态评估评审结果")
    @ExcelProperty("质态评估评审结果")
    val ztpgzzcl: List<String>?,
    @get:Schema(description = "批准部门及文号")
    @ExcelProperty("批准部门及文号")
    val pzwh: String?,
    @get:Schema(description = "批准日期")
    @ExcelProperty("批准日期")
    val pzrq: LocalDate?,
    @get:Schema(description = "成效情况")
    @ExcelProperty("成效情况")
    val cxqk: String?,
    @get:Schema(description = "qr_key")
    @ExcelProperty("qr_key")
    val qrKey: String?,
    @get:Schema(description = "招商方")
    @ExcelProperty("招商方")
    val zsf: String?,
    @get:Schema(description = "投资方")
    @ExcelProperty("投资方")
    val tzf: String?,
    @get:Schema(description = "投资地址")
    @ExcelProperty("投资地址")
    val tzdz: String?,
    @get:Schema(description = "佐证材料")
    @ExcelProperty("佐证材料")
    val xyzzcl: List<String>?,
    @get:Schema(description = "是否有融资需求")
    @ExcelProperty("是否有融资需求")
    val isRzxq: String?,
    @get:Schema(description = "融资金额")
    @ExcelProperty("融资金额")
    val rzMoney: String?,
    @get:Schema(description = "科创项目分类")
    @ExcelProperty("科创项目分类")
    val kcProjType: String?,
    @get:Schema(description = "科创佐证材料")
    @ExcelProperty("科创佐证材料")
    val kccl: List<String>?,
) {
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
        Status = record.Status,
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
    )
}
