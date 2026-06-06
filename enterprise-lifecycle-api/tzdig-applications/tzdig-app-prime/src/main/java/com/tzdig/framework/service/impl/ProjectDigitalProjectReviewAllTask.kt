package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNull
import com.mybatisflex.kotlin.extensions.model.batchUpdateById
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll.Step.*
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.tzt.model.TaskRequest
import com.tzdig.framework.tzt.properties.TaizhengtongProperties
import com.tzdig.framework.tzt.service.TaizhengtongClient
import com.tzdig.framework.web.util.SettingsUtils
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.net.URLEncoder

@Service
class ProjectDigitalProjectReviewAllTask(
    private val taizhengtongProperties: TaizhengtongProperties,
    private val taizhengtongClient: TaizhengtongClient,
    private val userService: UserService,
    @param:Value($$"${server.pc-host}")
    private val pcHost: String,
    @param:Value($$"${server.h5-host}")
    private val h5Host: String,
) {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val enableNotification: Boolean
        get() = SettingsUtils["enable_notification"]?.toBooleanStrictOrNull() ?: false

    fun createTask(reviewIds: Collection<String>) {
        if (reviewIds.isEmpty()) return
        if (!enableNotification) return
        val list = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::id inList reviewIds)
            and(ProjectDigitalProjectReviewAll::taskCode.isNull)
        }
        if (list.isEmpty()) {
            logger.warn("没有待创建待办的记录")
            return
        }
        val appToken = taizhengtongClient.getAppToken()
        for ((step, rows) in list.groupBy { it.step }) {
            val role = when (step) {
                QUALITY_EVALUATION -> SystemRole.QUALITY_EVALUATION
                PROJECT_REVIEW -> SystemRole.PROJECT_REVIEW_DEPT
                PROJECT_REVIEW_ZB -> SystemRole.PROJECT_REVIEW_ZB
                PROJECT_START_REVIEW -> SystemRole.PROJECT_REVIEW_START
                PROJECT_COMPLETION_REVIEW -> SystemRole.PROJECT_REVIEW_COMPLETION
//                PROJECT_START_REVIEW_ZB -> SystemRole.PROJECT_REVIEW_ZB
                else -> continue
            }
            val subject = when (step) {
                QUALITY_EVALUATION -> "质态评估"
                PROJECT_REVIEW -> "签约核定"
                PROJECT_REVIEW_ZB -> "签约核定"
                PROJECT_START_REVIEW -> "开工审核"
                PROJECT_COMPLETION_REVIEW -> "竣工审核"
//                PROJECT_START_REVIEW_ZB -> "开工专班审核"
                else -> continue
            }
            val userByRole = userService.getUserIdsByRole(role)
            val staffMap = rows.mapNotNull { it.cobId }
                .associateWith { cobId ->
                    userService.getUsersByCob(cobId)
                        .intersect(userByRole)
                }
            for (row in rows) {
                logger.info("[{}]创建待办任务: {}", subject, row.id)
                val staffIds = if (row.cobId == null) {
                    userByRole
                } else {
                    staffMap[row.cobId]
                }?.map { "${taizhengtongProperties.gid}-${it}" }
                if (staffIds.isNullOrEmpty()) {
                    logger.warn("[{}]未找到{}人员: {}", subject, step.name, row.cobId)
                    continue
                }
                val digitalInvestmentId = row.digitalInvestmentId!!
                val investment = queryOneById<ProjectDigitalInvestmentAttracting>(digitalInvestmentId)
                val descriptions = listOf(
                    TaskRequest.DescriptionKV("应用", "企业全生命周期"),
                    TaskRequest.DescriptionKV("招商项目", investment?.projectName ?: "undefined"),
                    TaskRequest.DescriptionKV("任务名称", subject),
                )
                val cardLink = step.link(false) + "?id=${digitalInvestmentId}"
                val pcCardLink = step.link(true) + "?id=${digitalInvestmentId}"
                val request = TaskRequest(
                    orgId = taizhengtongProperties.gid,
                    staffIds = staffIds,
                    appCategoryName = "企业全生命周期",
                    thirdUniCode = "ProjectDigitalProjectReviewAll-${row.id}",
                    subject = subject,
                    descriptionKVs = descriptions,
                    cardLink = "${h5Host}/?redirect=" + URLEncoder.encode(cardLink, Charsets.UTF_8),
                    pcCardLink = "${pcHost}/login?redirect=" + URLEncoder.encode(pcCardLink, Charsets.UTF_8),
                    statusTagNo = "未完成",
                    statusTagYes = "已完成",
                )
                if (SettingsUtils["is_send_massage"] == "true") {
                    row.taskCode = taizhengtongClient.createTask(appToken, request)
                }
                logger.info("创建待办成功: {}", row.taskCode)
            }
            rows.batchUpdateById()
        }
    }

    private fun ProjectDigitalProjectReviewAll.Step.link(isPc: Boolean): String =
        when (to(isPc)) {
            QUALITY_EVALUATION to true -> "/xmgl/qa-state"
            QUALITY_EVALUATION to false -> "/qualitative-state"
            PROJECT_REVIEW to true -> "/xmgl/pro-sign"
            PROJECT_REVIEW to false -> "/qualitative-signing"
            PROJECT_REVIEW_ZB to true -> "/xmgl/pro-sign"
            PROJECT_REVIEW_ZB to false -> "/qualitative-signing"
            PROJECT_START_REVIEW to true -> "/xmgl/pro-start"
            PROJECT_START_REVIEW to false -> "/pro-start/pro-start-detail"
            PROJECT_COMPLETION_REVIEW to true -> "/xmgl/pro-end"
            PROJECT_COMPLETION_REVIEW to false -> "/pro-end/pro-end-detail"
            else -> "/home"
        }
}
