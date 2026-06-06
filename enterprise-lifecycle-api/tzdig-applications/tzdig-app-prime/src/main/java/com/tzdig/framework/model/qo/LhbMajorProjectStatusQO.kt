package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbMajorProjectStatusQO(
    @param:Schema(description = "市（区）")
    val cityDistrict: String? = null,
    @param:Schema(description = "① 项目数量")
    val projectCount: Int? = null,
    @param:Schema(description = "计划总投资")
    val plannedTotalInvestment: BigDecimal? = null,
    @param:Schema(description = "年度投资（计划）")
    val annualInvestmentPlan: BigDecimal? = null,
    @param:Schema(description = "年度投资完成情况-已列统项目数")
    val listedProjectCount: Int? = null,
    @param:Schema(description = "② 实际入库投资")
    val actualInvestedAmount: BigDecimal? = null,
    @param:Schema(description = "③ ☆投资完成率(%)")
    val investmentCompletionRate: BigDecimal? = null,
    @param:Schema(description = "④ 新开工项目数")
    val newStartedProjectCount: Int? = null,
    @param:Schema(description = "⑤ 已开工项目数")
    val startedProjectCount: Int? = null,
    @param:Schema(description = "⑥ 开工率(%)")
    val startRate: BigDecimal? = null,
    @param:Schema(description = "已开工未列统项目数")
    val startedUnlistedProjectCount: Int? = null,
)
