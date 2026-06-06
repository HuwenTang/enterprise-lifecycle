package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema

data class StatisticCenterVO(
    @get:Schema(description = "发改-工程研究中心(产业技术创新中心)省级")
    val count1: Long? = null,
    @get:Schema(description = "发改-工程研究中心(产业技术创新中心)市级")
    val count2: Long? = null,
    @get:Schema(description = "商务-外资研发中心省级")
    val count3: Long? = null,
    @get:Schema(description = "商务-外资研发中心市级")
    val count4: Long? = null,
    @get:Schema(description = "科技-重点实验室省级")
    val count5: Long? = null,
    @get:Schema(description = "科技-重点实验室市级")
    val count6: Long? = null,
    @get:Schema(description = "科技-重点实验室国家级")
    val count7: Long? = null,
    @get:Schema(description = "工信-企业技术中心省级")
    val count8: Long? = null,
    @get:Schema(description = "工信-企业技术中心市级")
    val count9: Long? = null,
    @get:Schema(description = "科技-工程技术研究中心省级")
    val count10: Long? = null,
    @get:Schema(description = "科技-工程技术研究中心市级")
    val count11: Long? = null,
    @get:Schema(description = "科技-院士工作站省级")
    val count12: Long? = null,
    @get:Schema(description = "科技-院士工作站市级")
    val count13: Long? = null,
)
