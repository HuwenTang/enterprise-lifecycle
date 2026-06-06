package com.tzdig.framework.service.impl

import com.alibaba.fastjson2.JSONObject
import com.alibaba.fastjson2.parseObject
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.mybatisflex.kotlin.extensions.model.batchUpdateById
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.core.extension.string
import com.tzdig.framework.core.extension.toJsonRequest
import com.tzdig.framework.model.pojo.BmpgCallBackPOJO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll.Step.*
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.entity.system.SystemSmsLog
import com.tzdig.framework.mybatis.entity.system.UserXRole
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.ProjectDigitalProjectReviewService
import com.tzdig.framework.sms.service.SmsService
import com.tzdig.framework.tzt.model.TaskRequest
import com.tzdig.framework.tzt.properties.TaizhengtongProperties
import com.tzdig.framework.tzt.service.TaizhengtongClient
import com.tzdig.framework.web.util.SettingsUtils
import okhttp3.OkHttpClient
import okhttp3.Request
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.net.URLEncoder

@Service
class ProjectDigitalProjectReviewServiceImpl(
    private val taizhengtongProperties: TaizhengtongProperties,
    private val taizhengtongClient: TaizhengtongClient,
    private val userService: UserService,
    @param:Value($$"${server.pc-host}")
    private val pcHost: String,
    @param:Value($$"${server.h5-host}")
    private val h5Host: String,
    private val smsService: SmsService,
    private val okHttpClient: OkHttpClient,
) : ProjectDigitalProjectReviewService {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val enableNotification: Boolean
        get() = SettingsUtils["enable_notification"]?.toBooleanStrictOrNull() ?: false

    override fun createTask(reviewIds: Collection<String>) {
        if (reviewIds.isEmpty()) return
        if (!enableNotification) return
        val list = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::id inList reviewIds)
            and(ProjectDigitalProjectReviewAll::taskCode.isNull)
            and(ProjectDigitalProjectReviewAll::status eq ("未完成"))
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

    override fun evaluationCallBack(investment: ProjectDigitalInvestmentAttracting) {
        val records = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq investment.id)
            and(ProjectDigitalProjectReviewAll::step eq QUALITY_EVALUATION)
        }
        val pgList = records.map { record ->
            val cob = userService.getUserOrganizationById(record.cobId!!)
            BmpgCallBackPOJO.PgListItem(
                signedId = investment.investOnlineId!!,
                pgbm = "${cob?.name ?: ""}/${record.deptName}",
                pgyj = record.comment ?: "null",
                name = record.name ?: "null",
                status = record.status!!,
            )
        }
        val payload = BmpgCallBackPOJO(investment.investOnlineId!!, pgList)
        bmpgCallBack(payload)
    }

    fun bmpgCallBack(payload: BmpgCallBackPOJO): JSONObject {
        val requestBody = payload.toJsonRequest()
        val request = Request.Builder()
            .url("http://192.177.35.253/zsxt-api/tProjProjectSigned/bmpgCallBack")
            .post(requestBody)
            .build()
        okHttpClient.newCall(request).execute().use { response ->
            return response.string().parseObject()
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

    override fun updateTaskStatus(reviewId: String) {
        val review = queryOneById<ProjectDigitalProjectReviewAll>(reviewId) ?: return
        val taskCode = review.taskCode ?: return
        val appToken = taizhengtongClient.getAppToken()
        val info = taizhengtongClient.getTaskInfo(appToken, taskCode) ?: return
        val staffIdList = info.getJSONArray("partExecutorList")
        for (staffId in staffIdList) {
            staffId as String
            if (review.status == "未完成") {
                taizhengtongClient.updateTaskStatus(appToken, taskCode, staffId, 0)
            } else {
                taizhengtongClient.updateTaskStatus(appToken, taskCode, staffId, 1)
            }
        }
    }

    override fun sendSms(reviews: Collection<ProjectDigitalProjectReviewAll>) {
        if (!enableNotification) return
        val appToken = taizhengtongClient.getAppToken()
        val map = mutableMapOf<String, Int>()
        for (review in reviews) {
            val taskCode = review.taskCode ?: continue
            val info = taizhengtongClient.getTaskInfo(appToken, taskCode) ?: continue
            val staffIdList = info.getJSONArray("partExecutorList")
            for (staffId in staffIdList) {
                staffId as String
                val count = map[staffId] ?: 0
                map[staffId] = count + 1
            }
        }
        val records = mutableListOf<SystemSmsLog>()
        for ((staffId, count) in map) {
            if (count <= 0) continue
            val userid = staffId.substring(taizhengtongProperties.gid.length + 1)
            val user = userService.getUserAccountById(userid) ?: continue
            if (user.grantForTaizhengtong != true || user.mobile == null) continue
            val content = "${user.realName}，您有${count}条项目工单待处理，请至企业全生命周期管理服务平台及时处理，谢谢!"
            val resp = smsService.sendMassMessage(
                content = content,
                mobiles = listOf(user.mobile!!),
            )
            val record = SystemSmsLog {
                this.uuid = resp.uuid
                this.mobile = user.mobile
                this.content = content
            }
            records.add(record)
        }
        records.batchInsert()
    }

    //发送审核未通过短信
    override fun sendReviewSms(digitalInvestmentId: String) {
        if (!enableNotification) return
        val record = queryOneById<ProjectDigitalInvestmentAttracting>(digitalInvestmentId)
        val step: String
        val desc: String
        when (record?.auditStatus) {
            2 -> {
                step = "通过签约核定部门审核"
                desc = "提交专班审核"
            }

            3 -> {
                step = "在签约核定部门审核阶段被退回"
                desc = "补充材料"
            }

            5 -> {
                step = "通过签约核定并计分"
                desc = "查看"
            }

            6 -> {
                step = "在签约核定专班审核阶段被退回"
                desc = "补充材料"
            }

            7 -> {
                step = "在签约核定专班审核阶段未通过"
                desc = "查看"
            }

            else -> {
                when (record?.auditStatusKaigong) {
                    2 -> {
                        step = "通过开工认定部门审核"
                        desc = "提交专班审核"
                    }

                    3 -> {
                        step = "在开工认定部门审核阶段被退回"
                        desc = "补充材料"
                    }

                    5 -> {
                        step = "通过开工认定并计分"
                        desc = "查看"
                    }

                    6 -> {
                        step = "在开工认定专班审核阶段被退回"
                        desc = "补充材料"
                    }

                    7 -> {
                        step = "在签约核定专班审核阶段未通过"
                        desc = "查看"
                    }

                    else -> {
                        return
                    }
                }
            }
        }
        val cob = queryOne<SystemDict> {
            where(SystemDict::label eq record.sjjgName)
            and(SystemDict::catalog eq "project_dept")
        }
        if (cob == null) return
        val cobUserList = userService.getUsersByCob(cob.code!!)
        if (cobUserList.isEmpty()) return
        val staffIdList = query<UserXRole> {
            where(UserXRole::roleId eq SystemRole.DEPARTMENT_PROJECT)
            and(UserXRole::userid inList cobUserList)
        }.mapNotNull { it.userid }
        if (staffIdList.isEmpty()) return
        val records = mutableListOf<SystemSmsLog>()
        for (staffId in staffIdList) {
            val user = userService.getUserAccountById(staffId) ?: continue
            val content =
                "您所在的部门${record.sjjgName}招引的${record.projectName}项目已${step}，请至企业全生命周期管理服务平台我的项目模块${desc}，谢谢!"
            val resp = smsService.sendMassMessage(
                content = content,
                mobiles = listOf(user.mobile!!),
            )
            val record = SystemSmsLog {
                this.uuid = resp.uuid
                this.mobile = user.mobile
                this.content = content
            }
            records.add(record)
        }
        records.batchInsert()
    }

    override fun projectScore(record: ProjectDigitalProjectReviewAll) {
        val project = queryOneById<ProjectDigitalInvestmentAttracting>(record.digitalInvestmentId!!) ?: return
        if (record.step == PROJECT_START_REVIEW) {
            //如果签约核定未通过，则不进行计分
            val review = queryCount<ProjectDigitalProjectReviewAll> {
                where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq project.id)
                and(ProjectDigitalProjectReviewAll::step eq PROJECT_REVIEW_ZB)
                and(ProjectDigitalProjectReviewAll::score ge 0f)
                and(ProjectDigitalProjectReviewAll::status eq "已完成")
                and(ProjectDigitalProjectReviewAll::result ne '2')
            }
            if (review == 0L) {
                return
            }
        }
        if (record.result == "1") {
            record.score = 0f
            if (project.investmentFlag == "1") {
                when (record.step) {
                    PROJECT_REVIEW_ZB -> {
                        record.score = if (project.isKcProj == "是") {
                            when {
                                project.investmentAmount!! in 0.1..<0.5 -> 0.1f
                                project.investmentAmount!! in 0.5..<1.0 -> 0.6f
                                project.investmentAmount!! in 1.0..<2.0 -> 0.9f
                                project.investmentAmount!! >= 2.0 -> 1.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "工业") {
                            //工业项目
                            when {
                                project.investmentAmount!! in 0.5..<1.0 -> 0.1f
                                project.investmentAmount!! in 1.0..<5.0 -> 0.3f
                                project.investmentAmount!! in 5.0..<10.0 -> 0.6f
                                project.investmentAmount!! in 10.0..<20.0 -> 0.9f
                                project.investmentAmount!! in 20.0..<50.0 -> 1.2f
                                project.investmentAmount!! >= 50 -> 1.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "服务业") {
                            //服务业项目
                            when {
                                project.investmentAmount!! in 0.2..<0.5 -> 0.1f
                                project.investmentAmount!! in 0.5..<1.0 -> 0.3f
                                project.investmentAmount!! in 1.0..<3.0 -> 0.6f
                                project.investmentAmount!! in 3.0..<5.0 -> 0.9f
                                project.investmentAmount!! in 5.0..<10.0 -> 1.2f
                                10 <= project.investmentAmount!! -> 1.5f
                                else -> 0f
                            }
                        } else {
                            0f
                        }
                    }

                    PROJECT_START_REVIEW -> {
                        record.score = if (project.isKcProj == "是") {
                            when {
                                project.investmentAmount!! in 0.1..<0.5 -> 0.2f
                                project.investmentAmount!! in 0.5..<1.0 -> 1.4f
                                project.investmentAmount!! in 1.0..<2.0 -> 2.1f
                                project.investmentAmount!! >= 2.0 -> 3.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "工业") {
                            //工业项目
                            when {
                                project.investmentAmount!! in 0.5..<1.0 -> 0.2f
                                project.investmentAmount!! in 1.0..<5.0 -> 0.7f
                                project.investmentAmount!! in 5.0..<10.0 -> 1.4f
                                project.investmentAmount!! in 10.0..<20.0 -> 2.1f
                                project.investmentAmount!! in 20.0..<50.0 -> 2.8f
                                project.investmentAmount!! >= 50 -> 3.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "服务业") {
                            //服务业项目
                            when {
                                project.investmentAmount!! in 0.2..<0.5 -> 0.2f
                                project.investmentAmount!! in 0.5..<1.0 -> 0.7f
                                project.investmentAmount!! in 1.0..<3.0 -> 1.4f
                                project.investmentAmount!! in 3.0..<5.0 -> 2.1f
                                project.investmentAmount!! in 5.0..<10.0 -> 2.8f
                                10 <= project.investmentAmount!! -> 3.5f
                                else -> 0f
                            }
                        } else 0f
                    }

                    else -> {}
                }
            } else if (project.investmentFlag == "2") {
                when (record.step) {
                    PROJECT_REVIEW_ZB -> {
                        record.score = if (project.isKcProj == "是") {
                            when {
                                project.investmentAmount!! * 7 in 0.1..<0.5 -> 0.1f
                                project.investmentAmount!! * 7 in 0.5..<1.0 -> 0.6f
                                project.investmentAmount!! * 7 in 1.0..<2.0 -> 0.9f
                                project.investmentAmount!! * 7 >= 2.0 -> 1.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "工业") {
                            //工业项目
                            when {
                                project.investmentAmount!! in 300.0..<600.0 -> 0.1f
                                project.investmentAmount!! in 600.0..<3000.0 -> 0.3f
                                project.investmentAmount!! in 3000.0..<6000.0 -> 0.6f
                                project.investmentAmount!! in 6000.0..<12000.0 -> 0.9f
                                project.investmentAmount!! in 12000.0..<30000.0 -> 1.2f
                                project.investmentAmount!! >= 30000.0 -> 1.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "服务业") {
                            //服务业项目
                            when {
                                project.investmentAmount!! in 120.0..<300.0 -> 0.1f
                                project.investmentAmount!! in 300.0..<600.0 -> 0.3f
                                project.investmentAmount!! in 600.0..<1800.0 -> 0.6f
                                project.investmentAmount!! in 1800.0..<3000.0 -> 0.9f
                                project.investmentAmount!! in 3000.0..<6000.0 -> 1.2f
                                project.investmentAmount!! >= 6000.0 -> 1.5f
                                else -> 0f
                            }
                        } else {
                            0f
                        }
                    }

                    PROJECT_START_REVIEW -> {
                        record.score = if (project.isKcProj == "是") {
                            when {
                                project.investmentAmount!! * 7 in 0.1..<0.5 -> 0.2f
                                project.investmentAmount!! * 7 in 0.5..<1.0 -> 1.4f
                                project.investmentAmount!! * 7 in 1.0..<2.0 -> 2.1f
                                project.investmentAmount!! * 7 >= 2.0 -> 3.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "工业") {
                            //工业项目
                            when {
                                project.investmentAmount!! in 300.0..<600.0 -> 0.2f
                                project.investmentAmount!! in 600.0..<3000.0 -> 0.7f
                                project.investmentAmount!! in 3000.0..<6000.0 -> 1.4f
                                project.investmentAmount!! in 6000.0..<12000.0 -> 2.1f
                                project.investmentAmount!! in 12000.0..<30000.0 -> 2.8f
                                project.investmentAmount!! >= 30000.0 -> 3.5f
                                else -> 0f
                            }
                        } else if (project.projectType == "服务业") {
                            //服务业项目
                            when {
                                project.investmentAmount!! in 120.0..<300.0 -> 0.2f
                                project.investmentAmount!! in 300.0..<600.0 -> 0.7f
                                project.investmentAmount!! in 600.0..<1800.0 -> 1.4f
                                project.investmentAmount!! in 1800.0..<3000.0 -> 2.1f
                                project.investmentAmount!! in 3000.0..<6000.0 -> 2.8f
                                project.investmentAmount!! >= 6000.0 -> 3.5f
                                else -> 0f
                            }
                        } else 0f
                    }

                    else -> {}
                }
                if (project.isQflp == "是") {
                    record.score = record.score?.plus(
                        //Qflp项目
                        when {
                            project.investmentAmount!! in 120.0..<300.0 -> 0.1f
                            project.investmentAmount!! in 300.0..<600.0 -> 0.3f
                            project.investmentAmount!! in 600.0..<1800.0 -> 0.6f
                            project.investmentAmount!! in 1800.0..<3000.0 -> 0.9f
                            project.investmentAmount!! in 3000.0..<6000.0 -> 1.2f
                            project.investmentAmount!! >= 6000.0 -> 1.5f
                            else -> 0f
                        }
                    )
                }
            }
            record.updateById()
        }
    }
}
