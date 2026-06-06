package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema

class StatisticVO(
    @get:Schema(description = "市场主体数量")
    var data: Long? = null,
    @get:Schema(description = "已签约项目数量")
    var signData: Long? = null,
    @get:Schema(description = "在建项目数量")
    var buildData: Long? = null,
)
