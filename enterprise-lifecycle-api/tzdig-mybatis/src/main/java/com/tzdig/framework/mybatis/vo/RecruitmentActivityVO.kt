package com.tzdig.framework.mybatis.vo

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "招商活动列表VO")
data class RecruitmentActivityVO(
    @get:Schema(description = "项目ID")
    val id: String?,

    @get:Schema(description = "项目名称")
    val projectName: String?,

    @get:Schema(description = "活动内容")
    val activityContent: String?,

    @get:Schema(description = "开始时间")
    val startTime: String?,

    @get:Schema(description = "结束时间")
    val endTime: String?,

    @get:Schema(description = "主要领导")
    val mainLeader: String?,

    @get:Schema(description = "所属产业链")
    val industryChain: String?,

    @get:Schema(description = "审核状态")
    val auditStatus: Int?,

    @get:Schema(description = "审核状态名称")
    val auditStatusName: String?,

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
)
