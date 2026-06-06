package com.tzdig.framework.sms.model

data class MassRequest(
    val items: List<MsgItem>,
    val content: String,
    val msgType: String = "sms",
) {
    data class MsgItem(
        val to: String,
    )
}
