package com.tzdig.framework.sms.service

import com.tzdig.framework.sms.model.GroupRequest
import com.tzdig.framework.sms.model.SmsResponse

interface SmsService {
    fun sendMassMessage(content: String, mobiles: List<String>): SmsResponse
    fun sendGroupMessage(messages: List<GroupRequest.MsgItem>): SmsResponse
}
