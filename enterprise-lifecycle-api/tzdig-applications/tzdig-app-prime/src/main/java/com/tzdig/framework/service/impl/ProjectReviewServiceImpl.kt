package com.tzdig.framework.service.impl

import cn.dev33.satoken.stp.StpUtil
import com.alibaba.fastjson2.JSONObject
import com.alibaba.fastjson2.parseObject
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.extension.string
import com.tzdig.framework.core.extension.toJsonRequest
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.service.ProjectReviewService
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.http.HttpHeaders
import org.springframework.stereotype.Service

@Service
class ProjectReviewServiceImpl(
    private val okHttpClient: OkHttpClient,
) : ProjectReviewService {
    override fun createZbReview(digitalInvestmentId: String): String? {
        val review = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestmentId)
            where(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
            orderBy(ProjectDigitalProjectReviewAll::batch).desc()
            limit(1)
        }
        val reviewZb = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestmentId)
            where(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB)
            orderBy(ProjectDigitalProjectReviewAll::batch).desc()
            limit(1)
        }
        if (review?.result.isNullOrEmpty()) {
            return null
        }
        val projectDigitalProjectReviewAll = ProjectDigitalProjectReviewAll()
        projectDigitalProjectReviewAll.digitalInvestmentId = digitalInvestmentId
        projectDigitalProjectReviewAll.step = ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB
        projectDigitalProjectReviewAll.status = "未完成"
        projectDigitalProjectReviewAll.batch = if (reviewZb.isNotEmpty()) {
            reviewZb.maxOf { it.batch ?: 0 } + 1
        } else {
            review.batch ?: 0
        }
        projectDigitalProjectReviewAll.save()
        return projectDigitalProjectReviewAll.id!!
    }

//    override fun createStartZbReview(digitalInvestmentId: String): String? {
//        val review = queryOne<ProjectDigitalProjectReviewAll> {
//            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestmentId)
//            where(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
//            orderBy(ProjectDigitalProjectReviewAll::batch).desc()
//            limit(1)
//        }
//        if (review?.result.isNullOrEmpty()) {
//            return null
//        }
//        val projectDigitalProjectReviewAll = ProjectDigitalProjectReviewAll()
//        projectDigitalProjectReviewAll.digitalInvestmentId = digitalInvestmentId
//        projectDigitalProjectReviewAll.step = ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW_ZB
//        projectDigitalProjectReviewAll.status = "未完成"
//        projectDigitalProjectReviewAll.batch = (review.batch ?: 0)
//        projectDigitalProjectReviewAll.save()
//        return projectDigitalProjectReviewAll.id!!
//    }

    // 项目审核结果回调
    override fun checkCallBack(signedId: String, checkStatus: Boolean, cobId: String?, comment: String?): JSONObject {
//        val cobName = DeptConstant.DEPARTMENT_LIST.find { it.first == cobId }?.second
//        val item = buildString {
//            append("项目审核结果：")
//            append("委办局：${cobName}， ")
//            append("审核结果：${if (checkStatus) "通过" else "未通过"}，")
//            append("审核评价：${comment ?: "无"}。")
//        }
//        val requestBody = mapOf(
//            "signedId" to signedId,
//            "checkStatus" to if (checkStatus) 1 else 0,
//            "lastCheckDesc" to item,
//        ).toJsonRequest()
//        val request = Request.Builder()
//            .url("http://172.22.26.71:8003/api/proj/project/signed/checkCallBack")
//            .post(requestBody)
//            .build()
//        okHttpClient.newCall(request).execute().use { response ->
//            return response.string().parseObject()
//        }
        return JSONObject()//TODO
    }

    // 开竣工审核结果回调
    override fun callBack(signedId: String, checkStatus: Boolean, cobId: String?, comment: String?): JSONObject {
        val cobName = DeptConstant.DEPARTMENT_LIST.find { it.first == cobId }?.second
            ?: DeptConstant.FAGAI_LIST.find { it.first.first == cobId }?.second
        val item = buildString {
            append("项目审核结果：")
            append("委办局：${cobName}， ")
            append("审核结果：${if (checkStatus) "通过" else "未通过"}，")
            append("审核评价：${comment ?: "无"}。")
        }
        val requestBody = mapOf(
            "signedId" to signedId,
            "checkStatus" to if (checkStatus) 1 else 3,
            "lastCheckDesc" to item,
        ).toJsonRequest()
        val request = Request.Builder()
            .url("http://192.177.35.253/zsxt-api/tProjProjectSigned/kgjgCheckCallBack")
            .header(HttpHeaders.AUTHORIZATION, StpUtil.getTokenValue())
            .post(requestBody)
            .build()
        okHttpClient.newCall(request).execute().use { response ->
            return response.string().parseObject()
        }
    }
}
