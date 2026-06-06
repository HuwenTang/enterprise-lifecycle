package com.tzdig.framework.service

import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll

interface ProjectDigitalProjectReviewService {
    fun evaluationCallBack(investment: ProjectDigitalInvestmentAttracting)
    fun createTask(reviewIds: Collection<String>)
    fun updateTaskStatus(reviewId: String)
    fun sendSms(reviews: Collection<ProjectDigitalProjectReviewAll>)

    fun sendReviewSms(digitalInvestmentId: String)

    fun projectScore(record: ProjectDigitalProjectReviewAll)
}
