package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.DeptConstant.FAGAI_LIST
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.dto.ExtZsProjProjectSignedDTO
import com.tzdig.framework.model.dto.ExtZsProjectOperationDTO
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.entity.view.SysDept
import com.tzdig.framework.service.ProjectReviewService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProjectReviewServiceImpl(
    private val projectDigitalProjectReviewAllTask: ProjectDigitalProjectReviewAllTask,
) : ProjectReviewService {
    //    @Transactional
    override fun createQualityEvaluationTask(dto: ExtZsProjProjectSignedDTO) {
        var digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq dto.id)
        }
        if (queryOneById<ExtZsProjProjectSigned>(dto.id) != null && digitalInvestment?.isQualityEvaluation == true) {
            dto.toExtZsProjProjectSigned().updateById()
            return
        } else if (queryOneById<ExtZsProjProjectSigned>(dto.id) != null) {
            dto.toExtZsProjProjectSigned().updateById()
        } else {
            dto.toExtZsProjProjectSigned().save()
        }
        if (digitalInvestment == null) {
            digitalInvestment = createDigitalInvestment(dto)
        }
        digitalInvestment.isQualityEvaluation = true
        digitalInvestment.updateById()
        val record = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestment.id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
        }
        if (record == 0L) {
//            val evaluationIds: MutableList<String> = mutableListOf()
//            evaluationIds.add(
//                createReview(
//                    DeptConstant.SHUCHAN_CODE,
//                    digitalInvestment.id!!,
//                    ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION
//                )
//            )
            val evaluationIds = DeptConstant.DEPARTMENT_LIST.map {
                createReview(
                    it.first,
                    digitalInvestment.id!!,
                    ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION,
                    0
                )
            }
            projectDigitalProjectReviewAllTask.createTask(evaluationIds)
        }
    }

    @Transactional
    override fun createProjectReviewTask(dto: ExtZsProjProjectSignedDTO) {
        var digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq dto.id)
        }
        if (queryOneById<ExtZsProjProjectSigned>(dto.id) != null && digitalInvestment?.isProjectReview == true) {
            dto.toExtZsProjProjectSigned().updateById()
            return
        } else if (queryOneById<ExtZsProjProjectSigned>(dto.id) != null) {
            dto.toExtZsProjProjectSigned().updateById()
        } else {
            dto.toExtZsProjProjectSigned().save()
        }
        if (digitalInvestment == null) {
            digitalInvestment = createDigitalInvestment(dto)
        }
        digitalInvestment.isProjectReview = true
        // 审核状态为部门审核中
        if (digitalInvestment.currentProjectProgress == ProjectProgress.SIGNING) {
            digitalInvestment.checkStatus = 1
        }
        digitalInvestment.auditStatus = 1
        digitalInvestment.updateById()
        val record = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestment.id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
        }.mapNotNull { it.batch }.maxOrNull()
        val list = mutableListOf<String>()
        if (dto.isKcProj == "是") {
            list.add(
                createReview(
                    DeptConstant.KEJI_CODE,
                    digitalInvestment.id!!,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                    record ?: 0
                )
            )
        } else if (dto.bIndustry?.toInt() == 1) {
            list.add(
                createReview(
                    DeptConstant.FAGAI_CODE,
                    digitalInvestment.id!!,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                    record ?: 0
                )
            )
        } else if (dto.bIndustry?.toInt() == 2) {
            list.add(
                createReview(
                    DeptConstant.GONGXIN_CODE,
                    digitalInvestment.id!!,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                    record ?: 0
                )
            )
        }
        if (dto.pType?.toInt() == 2) {
            list.add(
                createReview(
                    DeptConstant.SHANGWU_CODE,
                    digitalInvestment.id!!,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                    record ?: 0
                )
            )
        }
        projectDigitalProjectReviewAllTask.createTask(list)
    }

    //创建和更新开工申请
    @Transactional
    override fun createStartApproval(dto: ExtZsProjectOperationDTO) {
        val digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq dto.id)
        } ?: throw IllegalArgumentException("未找到招商项目")
        val record = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestment.id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
        }.mapNotNull { it.batch }.maxOrNull()
        val existingReview = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestment.id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
        }
        val extZsProjectOperation = queryOneById<ExtZsProjectOperation>(dto.id)
        if (existingReview != null || digitalInvestment.auditStatusKaigong == 2) {
            dto.toExtZsProjectOperation().saveOrUpdate()
            return
        } else if (extZsProjectOperation == null) {
            dto.toExtZsProjectOperation().save()
        } else {
            dto.toExtZsProjectOperation().updateById()
        }
        digitalInvestment.isStartApproval = true
        digitalInvestment.auditStatusKaigong = 1
        digitalInvestment.updateById()
        val list = mutableListOf<String>()
        if (digitalInvestment.isKcProj == "是") {
            list.add(
                createReview(
                    DeptConstant.KEJI_CODE,
                    digitalInvestment.id!!,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                    record ?: 0
                )
            )
        } else {
            if (dto.bIndustry?.toInt() == 1) {
            val deptCode = FAGAI_LIST.find { it.first.second == digitalInvestment.district }?.first
            if (deptCode != null) {
                list.add(
                    createReview(
                        deptCode.first,
                        digitalInvestment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                        record ?: 0
                    )
                )
            }
        } else if (dto.bIndustry?.toInt() == 2) {
            if (dto.isQflp == "是") {
                list.add(
                    createReview(
                        DeptConstant.SHANGWU_CODE,
                        digitalInvestment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                        record ?: 0
                    )
                )
            }
//            if ((digitalInvestment.investmentAmount!! >= 5.0 && digitalInvestment.investmentFlag == "1") || (digitalInvestment.investmentFlag == "2" && digitalInvestment.investmentAmount!! * 7 >= 5.0)) {
//                list.add(
//                    createReview(
//                        DeptConstant.FAGAI_CODE,
//                        digitalInvestment.id!!,
//                        ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
//                        record ?: 0
//                    )
//                )
//            } else {
                val deptCode = FAGAI_LIST.find { it.first.second == digitalInvestment.district }?.first
                if (deptCode != null) {
                    list.add(
                        createReview(
                            deptCode.first,
                            digitalInvestment.id!!,
                            ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                            record ?: 0
                        )
                    )
                }
//            }
            }
        }
        projectDigitalProjectReviewAllTask.createTask(list)
    }

    override fun createProjectCompletionReview(dto: ExtZsProjectOperationDTO) {
        val digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq dto.id)
        } ?: throw IllegalArgumentException("未找到招商项目")
        if (queryOneById<ExtZsProjectOperation>(dto.id) == null) {
            dto.toExtZsProjectOperation().save()
        } else if (digitalInvestment.isCompletionApproval == true) {
            dto.toExtZsProjectOperation().saveOrUpdate()
            return
        } else {
            dto.toExtZsProjectOperation().updateById()
        }
        digitalInvestment.isCompletionApproval = true
        digitalInvestment.currentProjectProgress = ProjectProgress.START
        digitalInvestment.updateById()
        val record = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestment.id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
        }.mapNotNull { it.batch }.maxOrNull()
        val list = mutableListOf<String>()
        val deptCode = FAGAI_LIST.find { it.first.second == digitalInvestment.district }?.first?.first
        if (deptCode != null) {
        list.add(
            createReview(
                //演示临时注掉
                deptCode,
                digitalInvestment.id!!,
                ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW,
                record ?: 0
            )
        )
        }
        projectDigitalProjectReviewAllTask.createTask(list)
    }

    override fun generateWarning(zsId: String): SimpleValueDTO<MutableList<String>> {
        val digitalInvestmentId = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq zsId)
        }?.id
        val list = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
        }
        val itemList: MutableList<String> = mutableListOf()
        list.forEach { item ->
            val cob = DeptConstant.DEPARTMENT_LIST.find { it.first == item.cobId }?.second
            itemList.add(buildString {
                append("项目质态评估：")
                append("委办局${cob}/${item.deptName ?: throw IllegalArgumentException("未找到部门名称")}，")
                append("填报人：${item.name ?: throw IllegalArgumentException("未找到填报人名称")}，")
                append("状态：${item.status ?: throw IllegalArgumentException("未找到完成状态")}，")
                append("预警提示：${item.comment ?: throw IllegalArgumentException("未找到预警提示")}。")
            })
        }
        return SimpleValueDTO(itemList)
    }


    fun createDigitalInvestment(dto: ExtZsProjProjectSignedDTO): ProjectDigitalInvestmentAttracting {
        val digitalInvestment = ProjectDigitalInvestmentAttracting {
            id = dto.id
        }
        digitalInvestment.projectName = dto.name
        digitalInvestment.investOnlineId = dto.id
        val sysDeptList = all<SysDept>().associate { it.deptName to it.deptCode }
        val areas = all<SystemArea>().groupBy { it.level }
        // 三市三区
        digitalInvestment.district = areas[3]?.find { it.name == dto.district }?.id ?: dto.district
        if (digitalInvestment.district?.contains("高港") == true) digitalInvestment.district =
            "321203000000" //医药高新区（高港区）
        // 镇街园区
        digitalInvestment.park = areas[4]?.find { it.zsDept == sysDeptList[dto.zoneName] }?.id ?: dto.zoneName
        digitalInvestment.investmentFlag = dto.pType?.toString()
        digitalInvestment.currentProjectProgress = ProjectProgress.NEGOTIATION
        digitalInvestment.isQualityEvaluation = true
        digitalInvestment.projectAttribute = "招商项目"
        digitalInvestment.projectCategory = dto.projType
        digitalInvestment.nationalEconomicClassification = dto.industryName
        digitalInvestment.projectContent = dto.Desc
        digitalInvestment.sjjgName = dto.sjjgName
        digitalInvestment.source =
            if (dto.bResource == 1) "自行接洽" else if (dto.bResource == 2) "市级机关推荐" else "其他"
        digitalInvestment.save()
        return digitalInvestment
    }

    fun createReview(
        deptCode: String?,
        digitalInvestmentId: String,
        step: ProjectDigitalProjectReviewAll.Step,
        batch: Int,
    ): String {
        val ProjectDigitalProjectReviewAll = ProjectDigitalProjectReviewAll()
        ProjectDigitalProjectReviewAll.step = step
        ProjectDigitalProjectReviewAll.digitalInvestmentId = digitalInvestmentId
        ProjectDigitalProjectReviewAll.cobId = deptCode
        ProjectDigitalProjectReviewAll.status = "未完成"
        ProjectDigitalProjectReviewAll.batch = batch + 1
        ProjectDigitalProjectReviewAll.save()
        return ProjectDigitalProjectReviewAll.id!!
    }
}
