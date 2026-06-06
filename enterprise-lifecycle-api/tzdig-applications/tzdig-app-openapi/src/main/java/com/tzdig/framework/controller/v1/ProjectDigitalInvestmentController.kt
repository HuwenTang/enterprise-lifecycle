package com.tzdig.framework.controller.v1

import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.tzdig.framework.file.service.FileService
import com.tzdig.framework.file.service.S3Service
import com.tzdig.framework.model.dto.ExtZsProjProjectSignedDTO
import com.tzdig.framework.model.dto.ExtZsProjectOperationDTO
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import com.tzdig.framework.service.ProjectReviewService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "招商项目审批管理")
@RestController
@RequestMapping("v1/quality-evaluation")
class ProjectDigitalInvestmentController(
    private val projectReviewService: ProjectReviewService,
    private val fileService: FileService,
    private val s3Service: S3Service
) {
    @Operation(summary = "创建/更新质态评估表")
    //@SaCheckPermission("ext-zs-proj-project-signed::create")
    @PostMapping
    fun createExtZsProjProjectSigned(
        @RequestBody dto: ExtZsProjProjectSignedDTO,
    ) {
        if (queryOneById<ExtZsProjProjectSigned>(dto.id) == null) {
            projectReviewService.createQualityEvaluationTask(dto)
        } else {
            dto.toExtZsProjProjectSigned().updateById()
        }
    }

    @Operation(summary = "创建/更新项目审核")
    //@SaCheckPermission("ext-zs-proj-project-signed::create")
    @PostMapping("project-review")
    fun createProjectReview(
        @RequestBody dto: ExtZsProjProjectSignedDTO,
    ) {
        projectReviewService.createProjectReviewTask(dto)
    }

    @Operation(summary = "删除质态评估表")
    //@SaCheckPermission("ext-zs-proj-project-signed::delete")
    @DeleteMapping("{id}")
    fun deleteExtZsProjProjectSigned(
        @PathVariable id: String,
    ) {
        val result = deleteById<ExtZsProjProjectSigned>(id)
        //删除关联的质态评估

        if (result == 0) throw NotFoundException("招商平台签约项目表不存在")
    }

    @Operation(summary = "查询市级预警")
    @GetMapping("warning")
    fun listWarning(
        @RequestParam(defaultValue = "") digitalInvestmentId: String,
    ) = projectReviewService.generateWarning(digitalInvestmentId)

    @Operation(summary = "开工审批")
    @PostMapping("start-approval")
    fun startApproval(
        @RequestBody dto: ExtZsProjectOperationDTO,
    ) {
        projectReviewService.createStartApproval(dto)
    }

    @Operation(summary = "竣工审批")
    @PostMapping("completion-approval")
    fun completionApproval(
        @RequestBody dto: ExtZsProjectOperationDTO,
    ) {
        projectReviewService.createProjectCompletionReview(dto)
    }
}
