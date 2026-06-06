package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "五大战区投资项目列表VO")
data class ZoneInvestmentProjectVO(
    @get:Schema(description = "项目ID")
    val id: String?,

    @get:Schema(description = "投资方名称")
    val investor: String?,

    @get:Schema(description = "项目名称")
    val projectName: String? = null,

    @get:Schema(description = "项目类别")
    val projectCategory: String?,

    @get:Schema(description = "投资规模")
    val investmentAmount: Double?,

    @get:Schema(description = "项目内容")
    val projectContent: String?,

    @get:Schema(description = "市(区)编码")
    val districtCode: String?,

    @get:Schema(description = "市(区)")
    val district: String? = null,

    @get:Schema(description = "园区code")
    val zoneCode: String?,

    @get:Schema(description = "园区名称")
    val zoneName: String? = null,

    @get:Schema(description = "街镇")
    val townCode: String? = null,

    @get:Schema(description = "街镇名")
    val townName: String? = null,

    @get:Schema(description = "入库时间（创建时间）")
    val entryTime: String?,

    @get:Schema(description = "报送日期（t_proj_project表无此字段，返回null）")
    val finishCheckDate: String?,

    @get:Schema(description = "洽谈进度（代码）：1-接洽中, 2-已本地考察, 3-签约前谈判, 4-意向达成, 5-签约")
    val negotiationProgress: String?,

    @get:Schema(description = "洽谈进度名称")
    val negotiationProgressName: String?,

    @get:Schema(description = "数据状态（代码）：1-流转至签约项目, 2-流转至共享项目")
    val dataStatus: String?,

    @get:Schema(description = "数据状态名称")
    val dataStatusName: String?,

    @get:Schema(description = "投资方注册地字典编码")
    val countryRegionOriginal: String?,

    @get:Schema(description = "投资方注册地/所属战区名称。内资示例：北京（京津冀区域）、上海（长三角区域）、南京（南京、合肥区域）、深圳（珠三角区域）、内资其他；外资示例：外资其他、香港、台湾、日本、韩国、美国、欧洲、新加坡")
    val countryRegionStandard: String?
)
