package com.tzdig.framework.service

import com.alibaba.fastjson2.JSONObject

interface ProjectReviewService {

    fun createZbReview(digitalInvestmentId: String): String?

//    fun createStartZbReview(digitalInvestmentId: String): String?

    fun checkCallBack(signedId: String, checkStatus: Boolean, cobId: String?, comment: String?): JSONObject

    fun callBack(signedId: String, checkStatus: Boolean, cobId: String?, comment: String?): JSONObject
}
