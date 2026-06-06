import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

/**
 * 2026年1-3月份项目招引建设通报表 - 导出专用VO
 * 对应 Excel: 420空表（全类目含备注）泰州市2026年1-3月份项目招引建设通报表
 */
class ExportLHBVO(

    // --- A列: 市(区)名称 ---
    @get:Schema(description = "市（区）名称，如：靖江市、泰兴市等")
    var regionName: String = "",

    // --- H列: 固定资产投资情况 (Fixed Asset Investment) ---
    @get:Schema(description = "1-2月份完成数（亿元）")
    var faiMonth1Completed: BigDecimal? = null,

    @get:Schema(description = "一季度预测数（亿元）")
    var faiQ1Forecast: BigDecimal? = null,

    @get:Schema(description = "一季度完成进度（百分比）")
    var faiQ1Progress: BigDecimal? = null,

    @get:Schema(description = "全年预测数（亿元）")
    var faiYearForecast: BigDecimal? = null,

    @get:Schema(description = "全年完成进度（百分比）")
    var faiYearProgress: BigDecimal? = null,

    // --- M列: 省重大项目情况 (Provincial Major) ---
    @get:Schema(description = "省重大项目数量（个）")
    var pmProjectCount: Long? = null,

    @get:Schema(description = "省重大项目计划总投资（亿元）")
    var pmPlannedTotalInvestment: BigDecimal? = null,

    @get:Schema(description = "省重大项目年度投资计划（亿元）")
    var pmAnnualInvestment: BigDecimal? = null,

    @get:Schema(description = "省重大已列统项目数（个）")
    var pmListedProjectCount: Long? = null,

    @get:Schema(description = "省重大实际入库投资（亿元）")
    var pmActualInvestment: BigDecimal? = null,

    @get:Schema(description = "省重大项目投资完成率（百分比）")
    var pmInvestmentRate: BigDecimal? = null,

    @get:Schema(description = "省重大新开工项目数（个）")
    var pmNewStartCount: Long? = null,

    @get:Schema(description = "省重大已开工项目数（个）")
    var pmStartedCount: Long? = null,

    @get:Schema(description = "省重大项目开工率（百分比）")
    var pmStartRate: BigDecimal? = null,

    @get:Schema(description = "省重大已开工但未列统项目数（个）")
    var pmStartedButUnlistedCount: Long? = null,

    // --- W列: 市重点项目情况 (Municipal Key) ---
    @get:Schema(description = "市重点项目数量（个）")
    var mkProjectCount: Long? = null,

    @get:Schema(description = "市重点项目计划总投资（亿元）")
    var mkPlannedTotalInvestment: BigDecimal? = null,

    @get:Schema(description = "市重点项目年度投资计划（亿元）")
    var mkAnnualInvestment: BigDecimal? = null,

    @get:Schema(description = "市重点已列统项目数（个）")
    var mkListedProjectCount: Long? = null,

    @get:Schema(description = "市重点实际入库投资（亿元）")
    var mkActualInvestment: BigDecimal? = null,

    @get:Schema(description = "市重点项目投资完成率（百分比）")
    var mkInvestmentRate: BigDecimal? = null,

    @get:Schema(description = "市重点新开工项目数（个）")
    var mkNewStartCount: Long? = null,

    @get:Schema(description = "市重点已开工项目数（个）")
    var mkStartedCount: Long? = null,

    @get:Schema(description = "市重点项目开工率（百分比）")
    var mkStartRate: Double? = null,

    @get:Schema(description = "市重点已开工但未列统项目数（个）")
    var mkStartedButUnlistedCount: Long? = null,

    // --- AG列: 签约项目情况 (Signed) ---
    // 500万-1亿元项目
    @get:Schema(description = "签约项目：500万元-1亿元（总数）")
    var signed50mTo100mTotal: Long? = null,

    @get:Schema(description = "签约项目：500万元-1亿元（当月新增）")
    var signed50mTo100mNew: Long? = null,

    // 1亿元以上项目
    @get:Schema(description = "签约项目：1亿元（1000万美元）以上（总数）")
    var signed100mPlusTotal: Long? = null,

    @get:Schema(description = "签约项目：1亿元（1000万美元）以上（当月新增）")
    var signed100mPlusNew: Long? = null,

    // 其中：协议投资5亿元以上
    @get:Schema(description = "签约项目：1亿元以上项目中，协议投资5亿元（3000万美元）以上（总数）")
    var signed100mPlus500mTotal: Long? = null,

    @get:Schema(description = "签约项目：1亿元以上项目中，协议投资5亿元（3000万美元）以上（当月新增）")
    var signed100mPlus500mNew: Long? = null,

    // 其中：年度投资1亿元以上
    @get:Schema(description = "签约项目：1亿元以上项目中，年度投资1亿元以上（总数）")
    var signed100mPlusAnnual100mTotal: Long? = null,

    @get:Schema(description = "签约项目：1亿元以上项目中，年度投资1亿元以上（当月新增）")
    var signed100mPlusAnnual100mNew: Long? = null,

    // --- AO列: 备案项目情况 (Record Filing) ---
    // 500万-1亿元项目
    @get:Schema(description = "备案项目：500万元-1亿元（总数）")
    var filed50mTo100mTotal: Long? = null,

    @get:Schema(description = "备案项目：500万元-1亿元（当月新增）")
    var filed50mTo100mNew: Long? = null,

    // 1亿元以上项目
    @get:Schema(description = "备案项目：1亿元（1000万美元）以上（总数）")
    var filed100mPlusTotal: Long? = null,

    @get:Schema(description = "备案项目：1亿元（1000万美元）以上（当月新增）")
    var filed100mPlusNew: Long? = null,

    // 其中：协议投资5亿元以上
    @get:Schema(description = "备案项目：1亿元以上项目中，协议投资5亿元（3000万美元）以上（总数）")
    var filed100mPlus500mTotal: Long? = null,

    @get:Schema(description = "备案项目：1亿元以上项目中，协议投资5亿元（3000万美元）以上（当月新增）")
    var filed100mPlus500mNew: Long? = null,

    // 增资扩产
    @get:Schema(description = "备案项目：增资扩产项目（总数）")
    var filedExpansionTotal: Long? = null,

    @get:Schema(description = "备案项目：增资扩产项目（当月新增）")
    var filedExpansionNew: Long? = null,

    // 外资利润再投资
    @get:Schema(description = "备案项目：外资利润再投资项目（总数）")
    var filedReinvestTotal: Long? = null,

    @get:Schema(description = "备案项目：外资利润再投资项目（当月新增）")
    var filedReinvestNew: Long? = null,

    // --- AY列: 开工项目情况 (Construction Start Count) ---
    @get:Schema(description = "开工项目：500万元-1亿元（总数）")
    var cs50mTo100mTotal: Long? = null,

    @get:Schema(description = "开工项目：500万元-1亿元（当月新增）")
    var cs50mTo100mNew: Long? = null,

    @get:Schema(description = "开工项目：1亿元（1000万美元）以上（总数）")
    var cs100mPlusTotal: Long? = null,

    @get:Schema(description = "开工项目：1亿元（1000万美元）以上（当月新增）")
    var cs100mPlusNew: Long? = null,

    // 其中：协议投资5亿元以上
    @get:Schema(description = "开工项目：1亿元以上项目中，协议投资5亿元（3000万美元）以上（总数）")
    var cs100mPlus500mTotal: Long? = null,

    @get:Schema(description = "开工项目：1亿元以上项目中，协议投资5亿元（3000万美元）以上（当月新增）")
    var cs100mPlus500mNew: Long? = null,

    // --- BE列: 开工项目投资情况 (Construction Start Investment) ---
    // 500万-1亿元项目
    @get:Schema(description = "开工项目投资：500万元-1亿元（计划总投资）")
    var csi50mTo100mPlannedTotal: BigDecimal? = null,

    @get:Schema(description = "开工项目投资：500万元-1亿元（年度计划投资）")
    var csi50mTo100mAnnualPlan: BigDecimal? = null,

    @get:Schema(description = "开工项目投资：500万元-1亿元（已完成投资）")
    var csi50mTo100mCompleted: BigDecimal? = null,

    // 500万-1亿元项目：当月新增
    @get:Schema(description = "开工项目投资：500万元-1亿元（当月新增）")
    var csi50mTo100mNew: BigDecimal? = null,

    @get:Schema(description = "开工项目投资：500万元-1亿元（年度计划完成率）")
    var csi50mTo100mRate: BigDecimal? = null,

    // 1亿元以上项目
    @get:Schema(description = "开工项目投资：1亿元（1000万美元）以上（计划总投资）")
    var csi100mPlusPlannedTotal: BigDecimal? = null,

    @get:Schema(description = "开工项目投资：1亿元（1000万美元）以上（年度计划投资）")
    var csi100mPlusAnnualPlan: BigDecimal? = null,

    @get:Schema(description = "开工项目投资：1亿元（1000万美元）以上（已完成投资）")
    var csi100mPlusCompleted: BigDecimal? = null,

    // 1亿元以上项目：当月新增
    @get:Schema(description = "开工项目投资：1亿元（1000万美元）以上（当月新增）")
    var csi100mPlusNew: BigDecimal? = null,

    @get:Schema(description = "开工项目投资：1亿元（1000万美元）以上（年度计划完成率）")
    var csi100mPlusRate: BigDecimal? = null,

    // --- BO列: 竣工项目情况 (Completion) ---
    @get:Schema(description = "竣工项目：500万元-1亿元（总数）")
    var completed50mTo100mTotal: Long? = null,

    @get:Schema(description = "竣工项目：500万元-1亿元（当月新增）")
    var completed50mTo100mNew: Long? = null,

    @get:Schema(description = "竣工项目：1亿元（1000万美元）以上（总数）")
    var completed100mPlusTotal: Long? = null,

    @get:Schema(description = "竣工项目：1亿元（1000万美元）以上（当月新增）")
    var completed100mPlusNew: Long? = null,

    // --- BS列: 四上企业 (Four Above) ---
    @get:Schema(description = "四上企业新增数：总数")
    var faTotalTotal: Long? = null,

    @get:Schema(description = "四上企业新增数：工业")
    var faIndustry: Long? = null,

    @get:Schema(description = "四上企业新增数：建筑业")
    var faConstruction: Long? = null,

    @get:Schema(description = "四上企业新增数：批零业")
    var faWholesaleRetail: Long? = null,

    @get:Schema(description = "四上企业新增数：住餐业")
    var faAccommodationCatering: Long? = null,

    @get:Schema(description = "四上企业新增数：房地产业")
    var faRealEstate: Long? = null,

    @get:Schema(description = "四上企业新增数：服务业")
    var faServices: Long? = null,
)
