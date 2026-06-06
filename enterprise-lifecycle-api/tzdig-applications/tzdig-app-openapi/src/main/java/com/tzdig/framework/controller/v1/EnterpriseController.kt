package com.tzdig.framework.controller.v1

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.vo.ExtZsProjProjectSignedVO
import com.tzdig.framework.model.vo.ExtZsProjectOperationVO
import com.tzdig.framework.model.vo.ProjectDigitalInvestmentAttractingVO
import com.tzdig.framework.model.vo.ProjectVO
import com.tzdig.framework.mybatis.entity.prime.*
import com.tzdig.framework.mybatis.entity.view.QyxmCyflTjxx
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.ProjectTimeFlowService
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.service.AreaService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import java.time.format.DateTimeFormatter


@Tag(name = "一企来办项目查询")
@RestController
@RequestMapping("v1/project/yqlb")
class EnterpriseController(
    private val projectTimeFlowService: ProjectTimeFlowService,
    private val areaService: AreaService,
) {

    @Operation(summary = "查询企业项目列表")
    @PageableQuery
    @GetMapping
    fun listProject(
        @Schema(description = "USCC")
        @RequestParam(defaultValue = "") uscc: String,
        @Schema(description = "id")
        @RequestParam(required = false) id: String?,
    ): PageableResult<ProjectVO> {
        val page = paginate<ProjectDigitalInvestmentAttracting>(pageable.pageNumber, pageable.pageSize) {
            where(ProjectDigitalInvestmentAttracting::uscc eq uscc)
            if (id != null) {
                where(ProjectDigitalInvestmentAttracting::id eq id)
            }
        }.map(::ProjectVO)
        page.records.forEach { vo ->
            val last = projectTimeFlowService.getTimeFlow(vo.id!!).lastOrNull { it.time != null && it.isPrimary }
            val projectDynamicsTime = last?.time?.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) ?: ""
            val projectDynamicsTitle = last?.title ?: ""
            vo.projectDynamic = "$projectDynamicsTime $projectDynamicsTitle"
        }
        return PageableResult.of(page)
    }


    @Operation(summary = "查询项目时间流")
    @GetMapping("{id}/project-time-flow")
    fun getProjectTimeFlow(@PathVariable id: String) = projectTimeFlowService.getTimeFlow(id)


    @Operation(summary = "查询项目信息表（在谈-竣工）")
    @GetMapping("{id}/info")
    fun getUnderDiscussion(@PathVariable id: String): ProjectDigitalInvestmentAttractingVO {
        val record = queryOneById<ProjectDigitalInvestmentAttracting>(id)
            ?: throw NotFoundException("数字化招商表不存在")
        val district = record.district?.let { areaService.getById(it) }
        val park = record.park?.let { areaService.getById(it) }
        val onlineApprovalIds =
            filter<ProjectInvestmentXOnlineApproval> { ProjectInvestmentXOnlineApproval::investmentId eq id }
                .map { it.onlineApprovalId!! }
        val constructionApprovalIds =
            filter<ProjectInvestmentXConstructionApproval> { ProjectInvestmentXConstructionApproval::investmentId eq id }
                .map { it.constructionApprovalId!! }
        val result = ProjectDigitalInvestmentAttractingVO(
            record = record,
            districtName = district?.name ?: record.district,
            parkName = park?.name ?: record.park
        )
        result.onlineApprovalIds = onlineApprovalIds
        result.constructionApprovalIds = constructionApprovalIds
        return result
    }

    @Operation(summary = "查询质态评估表、签约核定表")
    @GetMapping("{id}/quality-assessment")
    fun getQualityAssessment(
        @PathVariable id: String,
    ): ExtZsProjProjectSignedVO {
        val zsId = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::id eq id)
        }?.investOnlineId
        val record = queryOne<ExtZsProjProjectSigned> {
            where(ExtZsProjProjectSigned::id eq zsId)
        }
            ?: throw NotFoundException("质态评估表、签约核定表不存在")
        val result = ExtZsProjProjectSignedVO(record)
        result.projTypeLabel = filterOne<QyxmCyflTjxx> { QyxmCyflTjxx::cybm eq result.projType }?.cymc
        return result
    }

    @Operation(summary = "查询项目开工竣工表")
    //@SaCheckPermission("ext-zs-project-operation::query")
    @GetMapping("{id}")
    fun getExtZsProjectOperation(
        @PathVariable id: String,
    ): ExtZsProjectOperationVO {
        val digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::id eq id)
        }
        val record = queryOne<ExtZsProjectOperation> {
            where(ExtZsProjectOperation::id eq digitalInvestment?.investOnlineId)
        }
            ?: throw NotFoundException("开工竣工表不存在")
        val result = ExtZsProjectOperationVO(record)
        result.projTypeLabel = filterOne<QyxmCyflTjxx> { QyxmCyflTjxx::cybm eq result.projType }?.cymc
        result.department = digitalInvestment?.sjjgName
        result.pType = digitalInvestment?.investmentFlag
        return result
    }


}
