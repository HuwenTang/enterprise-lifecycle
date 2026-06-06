package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.constant.DeptConstant.GONGXIN_LIST
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.dto.ProjectNonInvestmentConfirmationDTO
import com.tzdig.framework.model.vo.ProjectNonInvestmentConfirmationVO
import com.tzdig.framework.mybatis.entity.prime.*
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.mapper.prime.ProjectNonInvestmentConfirmationMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.ProjectFilingService
import com.tzdig.framework.service.impl.ProjectDigitalProjectReviewAllTask
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.math.BigDecimal
import java.time.LocalDate

@Tag(name = "非招商项目开工认定表管理")
@RestController
@RequestMapping("project-non-investment-confirmation")
class ProjectNonInvestmentConfirmationController(
    private val projectFilingService: ProjectFilingService,
    private val projectDigitalProjectReviewAllTask: ProjectDigitalProjectReviewAllTask
) {
    @Operation(summary = "查询非招商项目开工认定表列表")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping
    @PageableQuery
    fun listProjectNonInvestmentConfirmation(
        pageable: Pageable,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") name: String,
        @Schema(description = "项目代码")
        @RequestParam(defaultValue = "") code: String,
        @Schema(description = "项目内容")
        @RequestParam(defaultValue = "") content: String,
        @Schema(description = "市区")
        @RequestParam(defaultValue = "") district: String,
        @Schema(description = "项目板块")
        @RequestParam(defaultValue = "") park: String,
        @Schema(description = "投资方名称")
        @RequestParam(defaultValue = "") investor: String,
        @Schema(description = "产业链")
        @RequestParam(defaultValue = "") industryChain: String,
        @Schema(description = "工业/服务业")
        @RequestParam(defaultValue = "") industryService: String,
        @Schema(description = "项目投资额1")
        @RequestParam(defaultValue = "") investmentAmount1: Double?,
        @Schema(description = "项目投资额2")
        @RequestParam(defaultValue = "") investmentAmount2: Double?,
        @Schema(description = "备案开始日期")
        @RequestParam(required = false) recordDate1: LocalDate?,
        @Schema(description = "备案结束日期")
        @RequestParam(required = false) recordDate2: LocalDate?,
        @Schema(description = "开工开始日期")
        @RequestParam(required = false) startDate1: LocalDate?,
        @Schema(description = "开工结束日期")
        @RequestParam(required = false) startDate2: LocalDate?,
        @Schema(description = "竣工开始日期")
        @RequestParam(required = false) endDate1: LocalDate?,
        @Schema(description = "竣工结束日期")
        @RequestParam(required = false) endDate2: LocalDate?,
        @Schema(description = "投资类型")
        @RequestParam(defaultValue = "") investmentType: String,
        @Schema(description = "内资/外资")
        @RequestParam investmentNature: Boolean?,
        @Schema(description = "是否列统")
        @RequestParam isLt: Boolean?,
        @Schema(description = "项目阶段")
        @RequestParam(defaultValue = "") projectStage: String,
        @Schema(description = "入库状态")
        @RequestParam rkStat: Int?,
        @Schema(description = "是否草稿")
        @RequestParam status: Boolean,
    ): PageableResult<ProjectNonInvestmentConfirmationVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val page = paginate<ProjectNonInvestmentConfirmation>(pageable.pageNumber, pageable.pageSize) {
            if (!userAccount.hasRole(SystemRole.ROOT) && !status) {
                and {
                    it.or(ProjectNonInvestmentConfirmation::cityDistrict inList grantedAreas)
                    it.or(ProjectNonInvestmentConfirmation::park inList grantedAreas)
                }
            }
            if (projectStage.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::progress eq projectStage)
            }
            if (investor.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::investor like investor)
            }
            if (industryChain.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::industryDirection eq industryChain)
            }
            if (content.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::mainProducts like content)
            }
            if (industryService.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::projectType eq industryService)
            }
            if (district.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::cityDistrict eq district)
            }
            if (park.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::park eq park)
            }
            if (investmentAmount1 != null) {
                and(ProjectNonInvestmentConfirmation::investmentAmount ge BigDecimal.valueOf(investmentAmount1))
            }
            if (investmentAmount2 != null) {
                and(ProjectNonInvestmentConfirmation::investmentAmount lt BigDecimal.valueOf(investmentAmount2))
            }
            if (name.isNotEmpty()) and(ProjectNonInvestmentConfirmation::projectName like name)
            if (code.isNotEmpty()) and(ProjectNonInvestmentConfirmation::projectCode like code)
            if (recordDate1 != null) {
                and(ProjectNonInvestmentConfirmation::applicationTime gt recordDate1.atTime(0, 0, 0))
            }
            if (recordDate2 != null) {
                and(ProjectNonInvestmentConfirmation::applicationTime le recordDate2.atTime(23, 59, 59))
            }
            if (startDate1 != null) {
                and(ProjectNonInvestmentConfirmation::commencementDate gt startDate1)
            }
            if (startDate2 != null) {
                and(ProjectNonInvestmentConfirmation::commencementDate le startDate2)
            }
            if (endDate1 != null) {
                and(ProjectNonInvestmentConfirmation::endDate gt endDate1)
            }
            if (endDate2 != null) {
                and(ProjectNonInvestmentConfirmation::endDate le endDate2)
            }
            if (investmentType.isNotEmpty()) {
                and(ProjectNonInvestmentConfirmation::investmentType eq investmentType)
            }
            if (investmentNature != null) {
                and(ProjectNonInvestmentConfirmation::isForeignCapital eq investmentNature)
            }
            if (isLt == true) {
                and(ProjectNonInvestmentConfirmation::isLt eq true)

            } else if (isLt == false) {
                and(ProjectNonInvestmentConfirmation::isLt eq false)
            }
            if (rkStat != null) {
                and(ProjectNonInvestmentConfirmation::rkStat eq rkStat)
            }
            if (status) {
                val creator = userAccount.realName
                and(ProjectNonInvestmentConfirmation::status eq 1)
                and(ProjectNonInvestmentConfirmation::creator eq creator)
            } else {
                and(ProjectNonInvestmentConfirmation::status eq 2)
            }
            orderBy(ProjectNonInvestmentConfirmation::updateTime).desc()
        }.map(::ProjectNonInvestmentConfirmationVO)
        page.records.forEach {
            if (queryCount<ProjectKeyProject> {
                    where(ProjectKeyProject::digitalInvestmentId eq it.projectCode)
                } != 0L) {
                it.isFilled = true
            }
            val projectKeyProject = query<ProjectKeyProject> {
                where(ProjectKeyProject::digitalInvestmentId eq it.projectCode)
                and(ProjectKeyProject::status eq 2)
            }
            if (projectKeyProject.isNotEmpty()) {
                it.projectAttributeList.add("市重点")
            }
        }
        return PageableResult.of(page)
    }


    @Operation(summary = "查询非招商项目开工认定表是否存在")
    @GetMapping("exists")
    fun existsProjectNonInvestmentConfirmation(
        @Schema(description = "项目编号")
        @RequestParam(defaultValue = "") code: String,
    ): SimpleValueDTO<String> {
        val nonInvestmentRecord = queryOne<ProjectNonInvestmentConfirmation> {
            and(ProjectNonInvestmentConfirmation::projectCode eq code)
        }
        if (nonInvestmentRecord == null) {
            val onlineApprovalRecord = queryOne<ProjectOnlineApproval> {
                and(ProjectOnlineApproval::projectCode eq code)
            }
            val investmentRecord = if (onlineApprovalRecord == null) {
                null
            } else {
                val investmentId = queryOne<ProjectInvestmentXOnlineApproval> {
                    and(ProjectInvestmentXOnlineApproval::onlineApprovalId eq onlineApprovalRecord.id)
                }?.investmentId
                if (investmentId != null) {
                    queryOneById<ProjectDigitalInvestmentAttracting>(investmentId)
                } else {
                    null
                }
            }

            if (investmentRecord == null) {
                return if (onlineApprovalRecord == null) {
                    SimpleValueDTO("未查询到该项目信息，手动填写")
                } else {
                    SimpleValueDTO("该项目已在在线审批系统存在，自动填写")
                }
            } else {
                return SimpleValueDTO("该项目已在招商项目录入，请核对确认项目代码")
            }
        }
        return SimpleValueDTO("该项目已在增资扩产项目录入，请核对确认项目代码")
    }


    @Operation(summary = "查询非招商项目开工认定表")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("{id}")
    fun getProjectNonInvestmentConfirmation(
        @PathVariable id: String,
    ): ProjectNonInvestmentConfirmationVO {
        val record = queryOneById<ProjectNonInvestmentConfirmation>(id)
            ?: throw NotFoundException("非招商项目开工认定表不存在")
        val result = ProjectNonInvestmentConfirmationVO(record)
        return result
    }

    @Transactional
    @Operation(summary = "创建非招商项目开工认定表")
    //@SaCheckPermission("project-non-investment-confirmation::create")
    @PostMapping
    fun createProjectNonInvestmentConfirmation(
        @RequestBody dto: ProjectNonInvestmentConfirmationDTO,
    ) {
        dto.creator = userAccount.realName
        val industryClassification = queryOne<SystemDict> {
            and(SystemDict::catalog eq "gg_industry_category")
            and(SystemDict::code eq dto.industryClassification)
        }
        dto.isOnlineApproval = queryCount<ProjectOnlineApproval> {
            and(ProjectOnlineApproval::projectCode eq dto.projectCode)
        } != 0L
        dto.industryClassification = StringBuilder()
            .append(industryClassification?.code)
            .append("-")
            .append(industryClassification?.label)
            .toString()
        if (dto.investmentType == "增资扩产") {
            dto.rkStat = 0
        } else {
            dto.rkStat = 1
        }
        dto.toProjectNonInvestmentConfirmation().save()
        val nonInvestment =
            queryOne<ProjectNonInvestmentConfirmation> { where(ProjectNonInvestmentConfirmation::projectCode eq dto.projectCode) }

        // 同步创建招商项目
        if (nonInvestment != null) {
            createProject(nonInvestment)
        }

        val constructionRecord = queryOne<ProjectConstructionApproval> {
            and(ProjectConstructionApproval::projectCode eq dto.projectCode)
        }
        nonInvestment?.progress = ProjectProgress.RECORD
        nonInvestment?.updateById()
        val onlineApprovalRecord = queryOne<ProjectOnlineApproval> {
            and(ProjectOnlineApproval::projectCode eq dto.projectCode)
        }
        if (onlineApprovalRecord != null) {
            updateProjectInvestmentXOnlineApproval(dto.projectCode, nonInvestment!!.id)
        }
        if (constructionRecord != null) {
            val record = queryOne<ProjectInvestmentXConstructionApproval> {
                and(ProjectInvestmentXConstructionApproval::constructionApprovalId eq constructionRecord.id)
            }
            if (record == null) {
                ProjectInvestmentXConstructionApproval {
                    this.constructionApprovalId = constructionRecord.id
                    this.nonInvestmentId = nonInvestment?.id
                }.save()
            } else {
                record.nonInvestmentId = nonInvestment?.id
                record.updateById()
            }
            nonInvestment?.progress = ProjectProgress.APPROVAL
            nonInvestment?.updateById()
        }
    }

    @Transactional
    @Operation(summary = "非招商项目开工竣工认定")
    //@SaCheckPermission("project-non-investment-confirmation::update")
    @PutMapping("{id}")
    fun updateProjectNonInvestmentConfirmation(
        @PathVariable id: String,
        @RequestBody dto: ProjectNonInvestmentConfirmationDTO,
    ) {
        val record = queryOneById<ProjectNonInvestmentConfirmation>(id)
            ?: throw NotFoundException("非招商项目表不存在")
        if (dto.isStarted == true) {
//            record.progress = ProjectProgress.START
            createStartApproval(dto)
        }
        if (dto.isEnd == true) {
//            record.progress = ProjectProgress.COMPLETION
            createEndApproval(dto)
        }
        if (dto.isLt == true) {
            dto.isIncludedInDatabase = true
        }
        dto.into(record).updateById()
    }

    @Operation(summary = "删除非招商项目开工认定表")
    //@SaCheckPermission("project-non-investment-confirmation::delete")
    @DeleteMapping("{id}")
    fun deleteProjectNonInvestmentConfirmation(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectNonInvestmentConfirmation>(id)
        if (result == 0) throw NotFoundException("非招商项目开工认定表不存在")
    }

    @Operation(summary = "增资扩产入库审核")
    @PostMapping("review/{id}")
    fun reviewProjectInvestment(
        @PathVariable id: String,
        @RequestBody dto: ProjectNonInvestmentConfirmationDTO,
    ) {
        val record = queryOneById<ProjectNonInvestmentConfirmation>(id)
            ?: throw NotFoundException("非招商项目表不存在")
        record.rkStat = dto.rkStat
        record.comments = dto.comments
        dto.into(record).updateById()
    }


    @Operation(summary = "批量导出非招商项目开工认定表")
    //@SaCheckPermission("project-non-investment-confirmation::query")
    @GetMapping("export.xlsx")
    fun exportProjectNonInvestmentConfirmation(
        @RequestParam(defaultValue = "") fields: Set<String>,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") name: String,
        @Schema(description = "项目代码")
        @RequestParam(defaultValue = "") code: String,
        @Schema(description = "市区")
        @RequestParam(defaultValue = "") district: String,
        @Schema(description = "项目板块")
        @RequestParam(defaultValue = "") park: String,
        @Schema(description = "项目投资额1")
        @RequestParam(defaultValue = "") investmentAmount1: Double?,
        @Schema(description = "项目投资额2")
        @RequestParam(defaultValue = "") investmentAmount2: Double?,
        @Schema(description = "备案开始日期")
        @RequestParam(required = false) recordDate1: LocalDate?,
        @Schema(description = "备案结束日期")
        @RequestParam(required = false) recordDate2: LocalDate?,
        @Schema(description = "开工开始日期")
        @RequestParam(required = false) startDate1: LocalDate?,
        @Schema(description = "开工结束日期")
        @RequestParam(required = false) startDate2: LocalDate?,
        @Schema(description = "竣工开始日期")
        @RequestParam(required = false) endDate1: LocalDate?,
        @Schema(description = "竣工结束日期")
        @RequestParam(required = false) endDate2: LocalDate?,
        @Schema(description = "投资类型")
        @RequestParam(defaultValue = "") investmentType: String,
        @Schema(description = "内资/外资")
        @RequestParam investmentNature: Boolean?,
        @Schema(description = "是否列统")
        @RequestParam isLt: Boolean?,
        @Schema(description = "项目阶段")
        @RequestParam(defaultValue = "") projectStage: String,
        @Schema(description = "项目内容")
        @RequestParam(defaultValue = "") content: String,
        @Schema(description = "投资方名称")
        @RequestParam(defaultValue = "") investor: String,
        @Schema(description = "产业链")
        @RequestParam(defaultValue = "") industryChain: String,
        @Schema(description = "工业/服务业")
        @RequestParam(defaultValue = "") industryService: String,
        @Schema(description = "入库状态")
        @RequestParam rkStat: Int?,
        @Schema(description = "是否草稿")
        @RequestParam status: Boolean,
    ): FileDownloadVO {
        val grantedAreas = DataGrantsUtils.grantedAreas
        val wrapper = QueryWrapper()
        if (grantedAreas.isEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::id.isNull)
        } else {
            wrapper.and {
                it.or(ProjectNonInvestmentConfirmation::cityDistrict inList grantedAreas)
                it.or(ProjectNonInvestmentConfirmation::park inList grantedAreas)
            }
        }
        if (projectStage.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::progress eq projectStage)
        }
        if (district.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::cityDistrict eq district)
        }
        if (park.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::park eq park)
        }
        if (investmentAmount1 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::investmentAmount ge BigDecimal.valueOf(investmentAmount1))
        }
        if (investmentAmount2 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::investmentAmount le BigDecimal.valueOf(investmentAmount2))
        }
        if (name.isNotEmpty()) wrapper.and(ProjectNonInvestmentConfirmation::projectName like name)
        if (code.isNotEmpty()) wrapper.and(ProjectNonInvestmentConfirmation::projectCode like code)
        if (recordDate1 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::applicationTime gt recordDate1.atTime(0, 0, 0))
        }
        if (recordDate2 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::applicationTime le recordDate2.atTime(23, 59, 59))
        }
        if (startDate1 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::commencementDate gt startDate1)
        }
        if (startDate2 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::commencementDate le startDate2)
        }
        if (endDate1 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::endDate gt endDate1)
        }
        if (endDate2 != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::endDate le endDate2)
        }
        if (investmentType.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::investmentType eq investmentType)
        }
        if (isLt == true) {
            wrapper.and(ProjectNonInvestmentConfirmation::isLt eq true)

        } else if (isLt == false) {
            wrapper.and(ProjectNonInvestmentConfirmation::isLt eq false)
        }
        if (investor.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::investor like investor)
        }
        if (industryChain.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::industryDirection eq industryChain)
        }
        if (content.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::mainProducts like content)
        }
        if (industryService.isNotEmpty()) {
            wrapper.and(ProjectNonInvestmentConfirmation::projectType eq industryService)
        }
        if (investmentNature != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::isForeignCapital eq investmentNature)
        }
        if (rkStat != null) {
            wrapper.and(ProjectNonInvestmentConfirmation::rkStat eq rkStat)
        }
        if (status) {
            val creator = userAccount.realName
            wrapper.and(ProjectNonInvestmentConfirmation::status eq 1)
            wrapper.and(ProjectNonInvestmentConfirmation::creator eq creator)
        } else {
            wrapper.and(ProjectNonInvestmentConfirmation::status eq 2)
        }
        val file = ExcelWriteUtils(ProjectNonInvestmentConfirmationVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectNonInvestmentConfirmationMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(wrapper)
                        for (record in records) emitter.next(ProjectNonInvestmentConfirmationVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("增资扩产项目表导出.xlsx")
    }

    private fun updateProjectInvestmentXOnlineApproval(projectCode: String?, nonInvestmentId: String?) {
        val onlineApprovalId = queryOne<ProjectOnlineApproval> {
            and(ProjectOnlineApproval::projectCode eq projectCode)
        }?.id
        if (onlineApprovalId != null) {
            val record = queryOne<ProjectInvestmentXOnlineApproval> {
                and(ProjectInvestmentXOnlineApproval::onlineApprovalId eq onlineApprovalId)
            }
            if (record == null) {
                ProjectInvestmentXOnlineApproval {
                    this.onlineApprovalId = onlineApprovalId
                    this.nonInvestmentId = nonInvestmentId
                }.save()
            } else {
                record.nonInvestmentId = nonInvestmentId
                record.updateById()
            }
        }
    }

    fun createStartApproval(dto: ProjectNonInvestmentConfirmationDTO) {
        val digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq dto.id)
        } ?: throw IllegalArgumentException("未找到增资扩产项目")
        val record = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestment.id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
        }.mapNotNull { it.batch }.maxOrNull()
        val existingReview = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq digitalInvestment.id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
        }
        val extZsProjectOperation = queryOneById<ExtZsProjectOperation>(dto.id!!)
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
        val deptCode = GONGXIN_LIST.find { it.first.second == digitalInvestment.district }?.first
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
        projectDigitalProjectReviewAllTask.createTask(list)
    }

    fun createEndApproval(dto: ProjectNonInvestmentConfirmationDTO) {
        val digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq dto.id)
        } ?: throw IllegalArgumentException("未找到招商项目")
        if (queryOneById<ExtZsProjectOperation>(dto.id!!) == null) {
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
        val deptCode = GONGXIN_LIST.find { it.first.second == digitalInvestment.district }?.first
        if (deptCode != null) {
            list.add(
                createReview(
                    deptCode.first,
                    digitalInvestment.id!!,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW,
                    record ?: 0
                )
            )
        }
        projectDigitalProjectReviewAllTask.createTask(list)
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

    fun createProject(nonInvest: ProjectNonInvestmentConfirmation) {
        // 检查是否已存在对应的招商项目，避免重复创建
        val existingProject = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq nonInvest.id)
        }

        if (existingProject != null) {
            // 如果已存在，更新现有记录
            with(existingProject) {
                projectCode = nonInvest.projectCode
                projectName = nonInvest.projectName
                district = nonInvest.cityDistrict
                park = nonInvest.park
                currentProjectProgress = nonInvest.progress
                projectLocation = nonInvest.projectAddress
                filingApprovalProjectName = nonInvest.projectName
                filingInfoStatisticsDate = nonInvest.applicationTime?.toLocalDate()
                filingApprovalInvestmentTotal = nonInvest.investmentAmount?.toDouble()
                investmentFlag =
                    if (nonInvest.isForeignCapital == true) ("1") else if (nonInvest.isForeignCapital == false) ("2") else null
                investor = nonInvest.investor
                investmentAmount = nonInvest.investmentAmount?.toDouble()?.div(10000)
                totalInvestmentUsd =
                    if (nonInvest.isForeignCapital == true) nonInvest.investmentAmount?.toDouble()?.div(10000) else null
                totalInvestmentCny =
                    if (nonInvest.isForeignCapital != true) nonInvest.investmentAmount?.toDouble()?.div(10000) else null
                projectType = nonInvest.projectType
                belongingIndustry = nonInvest.industryDirection
                industryMajorClassName = nonInvest.industryCode
                industryClassification = nonInvest.industryClassification
                fixedAssetInvestment = nonInvest.fixedAssetInvestment?.toFloat()
                uscc = nonInvest.unifiedSocialCreditCode
                projectContent = nonInvest.mainProducts
                remarks = nonInvest.remarks
                startConfirmDate = nonInvest.commencementDate
                endConfirmDate = nonInvest.endDate
                isLt = nonInvest.isLt
                ltCode = nonInvest.ltCode
                isZzkc = true
                source = "增资扩产"
                projectRating =
                    if (nonInvest.isForeignCapital == true) "外资" else if (nonInvest.isForeignCapital == false) "内资" else null
                updateById()
            }
        } else {
            // 如果不存在，创建新记录
            ProjectDigitalInvestmentAttracting {
                projectCode = nonInvest.projectCode
                projectName = nonInvest.projectName
                district = nonInvest.cityDistrict
                park = nonInvest.park
                currentProjectProgress = nonInvest.progress
                projectLocation = nonInvest.projectAddress
                filingApprovalProjectName = nonInvest.projectName
                filingInfoStatisticsDate = nonInvest.applicationTime?.toLocalDate()
                filingApprovalInvestmentTotal = nonInvest.investmentAmount?.toDouble()
                investmentFlag = nonInvest.investmentType
                investor = nonInvest.investor
                investmentAmount = nonInvest.investmentAmount?.toDouble()?.div(10000)
                totalInvestmentUsd =
                    if (nonInvest.isForeignCapital == true) nonInvest.investmentAmount?.toDouble()?.div(10000) else null
                totalInvestmentCny =
                    if (nonInvest.isForeignCapital != true) nonInvest.investmentAmount?.toDouble()?.div(10000) else null
                projectType = nonInvest.projectType
                belongingIndustry = nonInvest.industryDirection
                industryMajorClassName = nonInvest.industryCode
                industryClassification = nonInvest.industryClassification
                fixedAssetInvestment = nonInvest.fixedAssetInvestment?.toFloat()
                uscc = nonInvest.unifiedSocialCreditCode
                projectContent = nonInvest.mainProducts
                remarks = nonInvest.remarks
                startConfirmDate = nonInvest.commencementDate
                endConfirmDate = nonInvest.endDate
                isLt = nonInvest.isLt
                ltCode = nonInvest.ltCode
                isZzkc = true
                investOnlineId = nonInvest.id
                source = "增资扩产"
                projectRating =
                    if (nonInvest.isForeignCapital == true) "外资" else if (nonInvest.isForeignCapital == false) "内资" else null
            }.save()
        }
    }
}
