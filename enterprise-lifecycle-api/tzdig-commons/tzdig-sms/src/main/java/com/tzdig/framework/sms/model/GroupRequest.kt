package com.tzdig.framework.sms.model

data class GroupRequest(
    val items: List<MsgItem>,
    val msgType: String = "sms",
) {
    data class MsgItem(
        val to: String,
        val content: String,
    )
}
