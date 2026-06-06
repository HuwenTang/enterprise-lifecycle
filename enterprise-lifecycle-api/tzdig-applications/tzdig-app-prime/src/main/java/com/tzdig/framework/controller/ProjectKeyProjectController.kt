package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNull
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectKeyProjectDTO
import com.tzdig.framework.model.dto.ProjectKeyProjectExcelRow
import com.tzdig.framework.model.vo.ProjectKeyProjectVO
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProject
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProjectReview
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.mapper.prime.ProjectKeyProjectMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "重点项目信息表管理")
@RestController
@RequestMapping("project-key-project")
class ProjectKeyProjectController {
    @Operation(summary = "查询重点项目信息表列表")
    //@SaCheckPermission("project-key-project::query")
    @GetMapping
    @PageableQuery
    fun listProjectKeyProject(
        pageable: Pageable,
        @Schema(description = "项目内容")
        @RequestParam(defaultValue = "") content: String,
        @Schema(description = "投资方名称")
        @RequestParam(defaultValue = "") investor: String,
        @Schema(description = "产业链")
        @RequestParam(defaultValue = "") industryChain: String,
        @Schema(description = "工业/服务业")
        @RequestParam(defaultValue = "") industryService: String,
        @Schema(description = "项目类别(内外资)")
        @RequestParam(defaultValue = "") investmentType: String,
        @Schema(description = "项目来源")
        @RequestParam(defaultValue = "") projectSource: String,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") projectName: String,
        @Schema(description = "项目所在区县")
        @RequestParam(defaultValue = "") district: String,
        @Schema(description = "项目所在园区")
        @RequestParam(defaultValue = "") park: String,
        @Schema(description = "是否新开工")
        @RequestParam isNewStart: Boolean?,
        @Schema(description = "是否开工")
        @RequestParam isStart: Boolean?,
        @Schema(description = "是否统计入库")
        @RequestParam isStatistics: Boolean?,
        @Schema(description = "发改项目名称")
        @RequestParam(defaultValue = "") projectFgName: String,
        @Schema(description = "是否草稿")
        @RequestParam status: Boolean,
    ): PageableResult<ProjectKeyProjectVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val page = paginate<ProjectKeyProject>(pageable.pageNumber, pageable.pageSize) {
            if (!userAccount.hasRole(SystemRole.ROOT) || !userAccount.hasRole(SystemRole.KEY_PORJ)) {
                and {
                    it.or(ProjectKeyProject::district inList grantedAreas)
                    it.or(ProjectKeyProject::park inList grantedAreas)
                }
            }
            if (content.isNotEmpty()) {
                and(ProjectKeyProject::constructionContent like content)
            }
            if (investor.isNotEmpty()) {
                and(ProjectKeyProject::investorName like investor)
            }
            if (industryChain.isNotEmpty()) {
                and(ProjectKeyProject::x eq industryChain)
            }
            if (industryService.isNotEmpty()) {
                and(ProjectKeyProject::industryCategory eq industryService)
            }
            if (investmentType.isNotEmpty()) {
                and(ProjectKeyProject::investmentType eq investmentType)
            }
            if (projectSource.isNotEmpty()) {
                and(ProjectKeyProject::projectSource eq projectSource)
            }
            if (projectName.isNotEmpty()) {
                and(ProjectKeyProject::projectName like projectName)
            }
            if (park.isNotEmpty()) {
                and(ProjectKeyProject::park eq park)
            }
            if (district.isNotEmpty()) {
                and(ProjectKeyProject::district eq district)
            }
            if (projectFgName.isNotEmpty()) {
                and(ProjectKeyProject::fgName like projectFgName)
            }

            if (isNewStart == true) {
                and(ProjectKeyProject::ifNewStart2026 eq true)
            } else if (isNewStart == false) {
                and(ProjectKeyProject::ifNewStart2026 eq false)
            }
            if (isStart == true) {
                and(ProjectKeyProject::ifStart eq true)
            } else if (isStart == false) {
                and(ProjectKeyProject::ifStart eq false)
            }
            if (isStatistics == true) {
                and(ProjectKeyProject::ifStorage eq true)
            } else if (isStatistics == false) {
                and(ProjectKeyProject::ifStorage eq false)
            }
            if (status) {
                val creator = userAccount.realName
                and(ProjectKeyProject::status eq 1)
                and(ProjectKeyProject::creator eq creator)
            } else {
                and(ProjectKeyProject::status eq 2)
            }
        }.map(::ProjectKeyProjectVO)
//        page.records.forEach {
//            it.ifStart = if ()
//        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询重点项目信息表")
    //@SaCheckPermission("project-key-project::query")
    @GetMapping("{id}")
    fun getProjectKeyProject(
        @PathVariable id: String,
    ): ProjectKeyProjectVO {
        val record = queryOneById<ProjectKeyProject>(id)
            ?: throw NotFoundException("重点项目信息表不存在")
        return ProjectKeyProjectVO(record)
    }

    @Transactional
    @Operation(summary = "推送重点项目审核")
    @GetMapping("review")
    fun createProjectKeyProjectReview(
        @RequestParam projectIds: List<String>,
        @RequestParam reviewer: List<String>,
    ) {
        if (reviewer.isEmpty()) {
            throw IllegalArgumentException("请选择审核人")
        }
        if (projectIds.isEmpty()) {
            throw IllegalArgumentException("请选择要推送的重点项目")
        }
        projectIds.forEach { projectId ->
            val keyProject =
                queryOneById<ProjectKeyProject>(projectId) ?: throw NotFoundException("重点项目信息表不存在")
            if (keyProject.projectEvaluationStatus == "待评估") {
                if (query<ProjectKeyProjectReview> {
                        and(ProjectKeyProjectReview::keyProjectId eq projectId)
                    }.isNotEmpty()) {
                    throw IllegalArgumentException("重点项目信息表已推送")
                }
            }
            reviewer.forEach { reviewer ->
                val deptCode = query<SystemDict> {
                    and(SystemDict::catalog eq "key_proj_dept")
                    and(SystemDict::label eq reviewer)
                }.firstNotNullOf { it.code }
                createKeyProjectReview(projectId, deptCode)
            }
            keyProject.projectEvaluationStatus = "待评估"
            keyProject.updateById()
        }
    }


    @Operation(summary = "创建重点项目信息表")
    //@SaCheckPermission("project-key-project::create")
    @PostMapping
    fun createProjectKeyProject(
        @RequestBody dto: ProjectKeyProjectDTO,
    ) {
        dto.creator = userAccount.realName
        val record = dto.toProjectKeyProject()
        if (queryCount<ProjectKeyProject> {
                where(ProjectKeyProject::digitalInvestmentId eq record.digitalInvestmentId)
            } != 0L) {
            throw ApiException("项目已存在")
        }
        record.projectEvaluationStatus = "未推送"
        record.save()
    }

    @Operation(summary = "修改重点项目信息表")
    //@SaCheckPermission("project-key-project::update")
    @PutMapping("{id}")
    fun updateProjectKeyProject(
        @PathVariable id: String,
        @RequestBody dto: ProjectKeyProjectDTO,
    ) {
        val record = queryOneById<ProjectKeyProject>(id)
            ?: throw NotFoundException("重点项目信息表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除重点项目信息表")
    //@SaCheckPermission("project-key-project::delete")
    @DeleteMapping("{id}")
    fun deleteProjectKeyProject(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectKeyProject>(id)
        if (result == 0) throw NotFoundException("重点项目信息表不存在")
    }

    @Operation(summary = "重点项目信息表导入模板")
    //@SaCheckPermission("project-key-project::create")
    @GetMapping("template.xlsx")
    fun getProjectKeyProjectImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectKeyProjectExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("重点项目信息表导入模板.xlsx")
    }

    @Operation(summary = "批量导入重点项目信息表")
    //@SaCheckPermission("project-key-project::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectKeyProject(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectKeyProjectExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectKeyProjectExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectKeyProjectExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectKeyProject().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectKeyProjectExcelRow::class)
                    .writeWith(createNewTempFile("xlsx")) { flux2 }
            }
            return ExcelImportResultVO(
                totalCount = totalCount,
                successCount = totalCount - failCount,
                failCount = failCount,
                result = file?.downloadVO("导入失败记录.xlsx")
            )
        } finally {
            tempFile.delete()
        }
    }

    @Operation(summary = "批量导出重点项目信息表")
    //@SaCheckPermission("project-key-project::query")
    @GetMapping("export.xlsx")
    fun exportProjectKeyProject(
        @RequestParam(defaultValue = "") fields: Set<String>,
        @Schema(description = "项目内容")
        @RequestParam(defaultValue = "") content: String,
        @Schema(description = "投资方名称")
        @RequestParam(defaultValue = "") investor: String,
        @Schema(description = "产业链")
        @RequestParam(defaultValue = "") industryChain: String,
        @Schema(description = "工业/服务业")
        @RequestParam(defaultValue = "") industryService: String,
        @Schema(description = "项目类别(内外资)")
        @RequestParam(defaultValue = "") investmentType: String,
        @Schema(description = "项目来源")
        @RequestParam(defaultValue = "") projectSource: String,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") projectName: String,
        @Schema(description = "项目所在区县")
        @RequestParam(defaultValue = "") district: String,
        @Schema(description = "项目所在园区")
        @RequestParam(defaultValue = "") park: String,
        @Schema(description = "是否新开工")
        @RequestParam isNewStart: Boolean?,
        @Schema(description = "是否开工")
        @RequestParam isStart: Boolean?,
        @Schema(description = "是否统计入库")
        @RequestParam isStatistics: Boolean?,
        @Schema(description = "发改项目名称")
        @RequestParam(defaultValue = "") projectFgName: String,
        @Schema(description = "是否草稿")
        @RequestParam status: Boolean,
    ): FileDownloadVO {

        val grantedAreas = DataGrantsUtils.grantedAreas
        val wrapper = QueryWrapper()
        if (grantedAreas.isEmpty()) {
            wrapper.and(ProjectKeyProject::id.isNull)
        } else {
            wrapper.and {
                it.or(ProjectKeyProject::district inList grantedAreas)
                it.or(ProjectKeyProject::park inList grantedAreas)
            }
        }
        if (content.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::constructionContent like content)
        }
        if (investor.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::investorName like investor)
        }
        if (industryChain.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::x eq industryChain)
        }
        if (industryService.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::industryCategory eq industryService)
        }
        if (investmentType.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::investmentType eq investmentType)
        }
        if (projectSource.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::projectSource eq projectSource)
        }
        if (projectName.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::projectName like projectName)
        }
        if (park.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::park eq park)
        }
        if (district.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::district eq district)
        }
        if (projectFgName.isNotEmpty()) {
            wrapper.and(ProjectKeyProject::fgName like projectFgName)
        }

        if (isNewStart == true) {
            wrapper.and(ProjectKeyProject::ifNewStart2026 eq true)
        } else if (isNewStart == false) {
            wrapper.and(ProjectKeyProject::ifNewStart2026 eq false)
        }
        if (isStart == true) {
            wrapper.and(ProjectKeyProject::ifStart eq true)
        } else if (isStart == false) {
            wrapper.and(ProjectKeyProject::ifStart eq false)
        }
        if (isStatistics == true) {
            wrapper.and(ProjectKeyProject::ifStorage eq true)
        } else if (isStatistics == false) {
            wrapper.and(ProjectKeyProject::ifStorage eq false)
        }
        if (status) {
            val creator = userAccount.realName
            wrapper.and(ProjectKeyProject::status eq 1)
            wrapper.and(ProjectKeyProject::creator eq creator)
        } else {
            wrapper.and(ProjectKeyProject::status eq 2)
        }
        val file = ExcelWriteUtils(ProjectKeyProjectVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectKeyProjectMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(wrapper)
                        for (record in records) emitter.next(ProjectKeyProjectVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("重点项目信息表导出.xlsx")
    }

    private fun createKeyProjectReview(pid: String, departmentId: String): String {
        val review = ProjectKeyProjectReview()
        review.keyProjectId = pid
        review.status = "待评估"
        review.departmentId = departmentId
        review.save()
        return review.id!!
    }
}
