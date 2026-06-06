package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.dto.ExtZsProjProjectSignedDTO
import com.tzdig.framework.model.dto.ProjectDigitalDataChangelogDTO
import com.tzdig.framework.model.vo.ExtZsProjProjectSignedVO
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.zsxt.TProjType
import com.tzdig.framework.mybatis.mapper.prime.ExtZsProjProjectSignedMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.DataChangeLogService
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux

@Tag(name = "招商平台签约项目质态评估表管理")
@RestController
@RequestMapping("ext-zs-proj-project-signed")
class ExtZsProjProjectSignedController(
    private val dataChangeLogService: DataChangeLogService
) {
    @Operation(summary = "查询招商平台签约项目质态评估表列表")
    //@SaCheckPermission("ext-zs-proj-project-signed::query")
    @GetMapping
    @PageableQuery
    fun listExtZsProjProjectSigned(
        pageable: Pageable,
    ): PageableResult<ExtZsProjProjectSignedVO> {
        val page = paginate<ExtZsProjProjectSigned>(pageable.pageNumber, pageable.pageSize) {
            //TODO
        }.map(::ExtZsProjProjectSignedVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询招商平台签约项目质态评估表")
    //@SaCheckPermission("ext-zs-proj-project-signed::query")
    @GetMapping("{zsid}")
    fun getExtZsProjProjectSigned(
        @PathVariable zsid: String,
    ): ExtZsProjProjectSignedVO {
        val digitalInvestmentId = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::id eq zsid)
        }?.investOnlineId
        val record = queryOne<ExtZsProjProjectSigned> {
            where(ExtZsProjProjectSigned::id eq digitalInvestmentId)
        }
            ?: throw NotFoundException("招商平台签约项目表不存在")
        val result = ExtZsProjProjectSignedVO(record)
        result.projTypeLabel = filterOne<TProjType> { TProjType::code eq result.projType }?.name
        return result
    }

    @Operation(summary = "创建招商平台签约项目质态评估表")
    //@SaCheckPermission("ext-zs-proj-project-signed::create")
    @PostMapping
    fun createExtZsProjProjectSigned(
        @RequestBody dto: ExtZsProjProjectSignedDTO,
    ) {
        dto.toExtZsProjProjectSigned().save()
    }

    @Operation(summary = "部门修改提交签约核定表")
    //@SaCheckPermission("ext-zs-proj-project-signed::update")
    @PutMapping("{id}")
    fun updateExtZsProjProjectSigned(
        @PathVariable id: String,
        @RequestBody dto: ExtZsProjProjectSignedDTO,
    ) {
        val record = queryOneById<ExtZsProjProjectSigned>(id)
            ?: throw NotFoundException("招商平台签约项目表不存在")
        val projectDigitalDataChangelogDTO = ProjectDigitalDataChangelogDTO(
            tableName = "ext_zs_proj_project_signed",
            tableId = id,
            fieldName = "xyzzcl",
            oldValue = record.xyzzcl,
            newValue = dto.xyzzcl,
            author = null,
            changedAt = null,
        )
        dataChangeLogService.createDataChangeLog(projectDigitalDataChangelogDTO)
        dto.into(record).updateById()
    }

    @Operation(summary = "删除招商平台签约项目质态评估表")
    //@SaCheckPermission("ext-zs-proj-project-signed::delete")
    @DeleteMapping("{id}")
    fun deleteExtZsProjProjectSigned(
        @PathVariable id: String,
    ) {
        val result = deleteById<ExtZsProjProjectSigned>(id)
        if (result == 0) throw NotFoundException("招商平台签约项目表不存在")
    }


    @Operation(summary = "批量导出质态评估表")
    //@SaCheckPermission("project-completed-info::query")
    @GetMapping("export.xlsx")
    fun exportExtZsProjProjectSigned(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val list = query<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::isQualityEvaluation eq true)
            join(ProjectDigitalProjectReviewAll::class.java)
                .on(ProjectDigitalProjectReviewAll::digitalInvestmentId eq ProjectDigitalInvestmentAttracting::id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
        }.mapNotNull { it.investOnlineId }
        val queryWrapper = with(QueryWrapper()) {
            where(ExtZsProjProjectSigned::id inList list)
        }
        val file = ExcelWriteUtils(ExtZsProjProjectSignedVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ExtZsProjProjectSignedMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(ExtZsProjProjectSignedVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("质态评估表导出.xlsx")
    }
}
