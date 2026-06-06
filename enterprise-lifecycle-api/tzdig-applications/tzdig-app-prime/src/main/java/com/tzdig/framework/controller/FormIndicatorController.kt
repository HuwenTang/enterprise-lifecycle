package com.tzdig.framework.controller

import cn.idev.excel.FastExcel
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.queryListByIds
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.enumerate.CollectionFrequency
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.service.S3Service
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.vo.FormIndicatorRecordVO
import com.tzdig.framework.mongo.entity.FormIndicatorRecord
import com.tzdig.framework.mongo.extension.page
import com.tzdig.framework.mongo.pageable.Pageable
import com.tzdig.framework.mongo.pageable.PageableQuery
import com.tzdig.framework.mongo.pageable.PageableResult
import com.tzdig.framework.mongo.repository.FormIndicatorRecordRepository
import com.tzdig.framework.mybatis.entity.prime.FormFileReport
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicator
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicatorField
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.and
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.Month

@Tag(name = "监测指标填报管理")
@RestController
@RequestMapping("form-indicator")
class FormIndicatorController(
    private val mongoTemplate: MongoTemplate,
    private val formIndicatorRecordRepository: FormIndicatorRecordRepository,
    private val s3Service: S3Service,
) {
    @Operation(summary = "查询监测指标填报记录列表")
    @GetMapping
    @PageableQuery
    fun listFormIndicator(
        @Schema(description = "支撑指标")
        @RequestParam(defaultValue = "") supportIndicatorId: String,
        @Schema(description = "监测指标")
        @RequestParam(defaultValue = "") monitorIndicatorId: String,
        @Schema(description = "文件报送任务")
        @RequestParam(defaultValue = "") fileReportTaskId: String,
        @Schema(description = "责任部门")
        @RequestParam(defaultValue = "") department: String,
        @Schema(description = "年度")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "月度")
        @RequestParam(required = false) month: Int?,
        @Schema(description = "周次")
        @RequestParam(required = false) weekOfMonth: Int?,
        @Schema(description = "是否已填报")
        @RequestParam(required = false) submitted: Boolean?,
        pageable: Pageable,
    ): PageableResult<FormIndicatorRecordVO> {
        val criteria = Criteria()
        if (supportIndicatorId.isNotEmpty())
            criteria.and(FormIndicatorRecord::supportIndicatorId).isEqualTo(supportIndicatorId)
        if (monitorIndicatorId.isNotEmpty())
            criteria.and(FormIndicatorRecord::monitorIndicatorId).isEqualTo(monitorIndicatorId)
        if (fileReportTaskId.isNotEmpty())
            criteria.and(FormIndicatorRecord::fileReportTaskId).isEqualTo(fileReportTaskId)
        if (department.isNotEmpty())
            criteria.and(FormIndicatorRecord::department).isEqualTo(department)
        if (year != null)
            criteria.and(FormIndicatorRecord::year).isEqualTo(year)
        if (month != null)
            criteria.and(FormIndicatorRecord::month).isEqualTo(month)
        if (weekOfMonth != null)
            criteria.and(FormIndicatorRecord::weekOfMonth).isEqualTo(weekOfMonth)
        if (submitted != null)
            criteria.and(FormIndicatorRecord::submitted).isEqualTo(submitted)
        val sort = Sort.by(
            Sort.Order.by("create_time").with(Sort.Direction.DESC),
            Sort.Order.by("department").with(Sort.Direction.DESC),
            Sort.Order.by("collection_frequency").with(Sort.Direction.DESC),
        )
        val page = mongoTemplate.page<FormIndicatorRecord>(criteria, pageable.asPageRequest(), sort)
            .map(::FormIndicatorRecordVO)
        if (page.content.isEmpty()) return PageableResult.empty(pageable)
        val monitorIndicators = with(page.content.mapNotNull { it.monitorIndicatorId }) {
            if (isEmpty()) emptyMap()
            else queryListByIds<FormMonitorIndicator>(this)
                .associateBy { it.id }
        }
        val fileReport = with(page.content.mapNotNull { it.fileReportTaskId }) {
            if (isEmpty()) emptyMap()
            else queryListByIds<FormFileReport>(page.content.mapNotNull { it.fileReportTaskId })
                .associateBy { it.id }
        }
        page.content.forEach { recordVO ->
            recordVO.monitorIndicatorName = monitorIndicators[recordVO.monitorIndicatorId]?.indicatorName
            recordVO.fileReportTaskName = fileReport[recordVO.fileReportTaskId]?.taskName
            recordVO.endDate = when (CollectionFrequency.parse(recordVO.collectionFrequency)) {
                CollectionFrequency.WEEKLY -> recordVO.startDate.endOfWeek
                CollectionFrequency.MONTHLY -> recordVO.startDate.endOfMonth
                CollectionFrequency.QUARTERLY -> recordVO.startDate.endOfQuarter
                else -> recordVO.startDate
            }
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询监测指标填报记录")
    @GetMapping("{id}")
    fun getFormIndicator(
        @Schema(description = "填报记录ID")
        @PathVariable id: String,
    ): FormIndicatorRecordVO {
        val record = formIndicatorRecordRepository.findById(id)
            .orElseThrow { NotFoundException("记录不存在") }
        return FormIndicatorRecordVO(record).apply {
            if (fileReportTaskId != null) {
                val file = this.data["file"]
                if (!file.isNullOrEmpty()) {
                    data = FormIndicatorRecord.FileReportTaskData(
                        file = s3Service.getSignedObjectUrl(file) ?: file
                    )
                }
            }
        }.also { recordVO ->
            recordVO.endDate = when (CollectionFrequency.parse(recordVO.collectionFrequency)) {
                CollectionFrequency.WEEKLY -> recordVO.startDate.endOfWeek
                CollectionFrequency.MONTHLY -> recordVO.startDate.endOfMonth
                CollectionFrequency.QUARTERLY -> recordVO.startDate.endOfQuarter
                else -> recordVO.startDate
            }
        }
    }

    @Operation(summary = "填报监测指标记录")
    @PostMapping("{id}")
    fun submitFormIndicatorRecord(
        @PathVariable id: String,
        @Schema(name = "FormIndicatorData")
        @RequestBody data: Map<String, String>,
    ) {
        val record = formIndicatorRecordRepository.findById(id)
            .orElseThrow { ApiException("填报记录不存在") }
        record.updateTime = LocalDateTime.now()
        if (record.fileReportTaskId != null) {
            val file = data["file"]
            if (!file.isNullOrEmpty()) {
                record.data = FormIndicatorRecord.FileReportTaskData(file)
            }
        }
        record.data = data
        record.submitted = true
        formIndicatorRecordRepository.save(record)
    }

    private val LocalDate.endOfQuarter: LocalDate
        get() = when (month) {
            Month.JANUARY, Month.FEBRUARY, Month.MARCH ->
                LocalDate.of(year, Month.MARCH, Month.MARCH.maxLength())

            Month.APRIL, Month.MAY, Month.JUNE ->
                LocalDate.of(year, Month.JUNE, Month.JUNE.maxLength())

            Month.JULY, Month.AUGUST, Month.SEPTEMBER ->
                LocalDate.of(year, Month.SEPTEMBER, Month.SEPTEMBER.maxLength())

            Month.OCTOBER, Month.NOVEMBER, Month.DECEMBER ->
                LocalDate.of(year, Month.DECEMBER, Month.DECEMBER.maxLength())
        }
    private val LocalDate.endOfMonth: LocalDate
        get() = withDayOfMonth(lengthOfMonth())
    private val LocalDate.endOfWeek: LocalDate
        get() {
            var date = plusDays(7L - dayOfWeek.value)
            if (date.month > month) {
                date = LocalDate.of(date.year, month, lengthOfMonth())
            }
            return date
        }


    @Operation(summary = "导出监测指标数据模板")
    @GetMapping("{id}/fields/export")
    fun exportFormMonitorIndicatorFields(
        @PathVariable id: String,
    ): FileDownloadVO {
        val fields = filter<FormMonitorIndicatorField> { FormMonitorIndicatorField::monitorIndicatorId eq id }
        val head = fields.map { it.fieldName }
            .map { listOf(it) }
        val tempFile = createNewTempFile("xlsx")
        FastExcel.write(tempFile)
            .sheet("Sheet")
            .head(head)
            .doWrite(emptyList<Nothing>())
        return tempFile.downloadVO("导入模板.xlsx")
    }

    @Operation(summary = "导入监测指标数据")
    @GetMapping("{id}/data/import")
    fun importFormMonitorIndicatorData(
        @PathVariable id: String,
        @RequestPart file: MultipartFile,
    ): Map<String?, String?> {
        val list = file.inputStream.use { inputStream ->
            FastExcel.read(inputStream)
                .sheet("Sheet")
                .headRowNumber(0)
                .doReadSync<Map<Int, String?>>()
        }
        if (list.size != 2) {
            throw ApiException("请导入正确的数据")
        }
        val head = list[0]
        val data = list[1]
        val keys = head.keys + data.keys
        val result = keys.associate {
            head[it] to data[it]
        }
        val fields = filter<FormMonitorIndicatorField> { FormMonitorIndicatorField::monitorIndicatorId eq id }
        return fields.associate {
            it.id to result[it.fieldName]
        }
    }
}
