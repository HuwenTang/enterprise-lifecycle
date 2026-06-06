package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema

class Statistic4KuVO(
    @get:Schema(description = "签约库数量")
    var signData: Long? = null,
    @get:Schema(description = "备案库数量")
    var recordData: Long? = null,
    @get:Schema(description = "开工库数量")
    var buildData: Long? = null,
    @get:Schema(description = "投产库数量")
    var productData: Long? = null,
)
