package com.tzdig.framework.task

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.tzdig.framework.core.annotation.CustomJob
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.enumerate.CollectionFrequency
import com.tzdig.framework.mongo.entity.FormIndicatorRecord
import com.tzdig.framework.mongo.repository.FormIndicatorRecordRepository
import com.tzdig.framework.mybatis.mapper.prime.FormFileReportMapper
import com.tzdig.framework.mybatis.mapper.prime.FormMonitorIndicatorMapper
import io.swagger.v3.oas.annotations.Operation
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.Month

@Component
class IndicatorScheduleTask(
    private val formIndicatorRecordRepository: FormIndicatorRecordRepository,
    private val formMonitorIndicatorMapper: FormMonitorIndicatorMapper,
    private val fileReportMapper: FormFileReportMapper,
) {
    @Scheduled(cron = "0 30 0 * * ?")
    @Operation(summary = "创建填报指标")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        executeManually(date = LocalDate.now())
    }

    @CustomJob
    @Suppress("unused")
    @Operation(summary = "创建指标填报任务")
    fun newIndicatorTask(date: String) =
        executeManually(date = LocalDate.parse(date))

    fun executeManually(date: LocalDate) {
        val dateTime = date.atStartOfDay()
        Db.tx {
            val cursor = formMonitorIndicatorMapper.selectCursorByQuery(QueryWrapper())
            val monitorIndicatorList = cursor.filter { monitorIndicator ->
                filterFrequency(
                    collectionFrequency = monitorIndicator.collectionFrequency?.let(CollectionFrequency::parse),
                    date = date,
                )
            }.sortedBy { it.collectionFrequency }

            // 查询已存在的记录
            val existingRecords = formIndicatorRecordRepository.findByYearAndMonthAndDayOfMonth(
                year = date.year,
                month = date.monthValue,
                dayOfMonth = date.dayOfMonth,
            ).mapNotNull { it.monitorIndicatorId }

            val records = monitorIndicatorList.mapNotNull { monitorIndicator ->
                // 如果已存在相同 createTime 和 monitorIndicatorId 的记录，则跳过
                if (monitorIndicator.id in existingRecords) {
                    return@mapNotNull null
                }
                FormIndicatorRecord {
                    this.createTime = dateTime
                    this.collectionFrequency = monitorIndicator.collectionFrequency
                    this.supportIndicatorId = monitorIndicator.supportIndicatorId
                    this.monitorIndicatorId = monitorIndicator.id
                    this.department = monitorIndicator.department
                    this.submitted = false
                    this.data = emptyMap()
                }
            }
            if (records.isNotEmpty()) {
                formIndicatorRecordRepository.saveAll(records)
            }
            true
        }
        Db.tx {
            val cursor = fileReportMapper.selectCursorByQuery(QueryWrapper())
            val fileReportList = cursor.filter { fileReport ->
                filterFrequency(
                    collectionFrequency = fileReport.collectionFrequency?.let(CollectionFrequency::parse),
                    date = date,
                )
            }.sortedBy { it.collectionFrequency }

            // 查询已存在的文件报告记录
            val existingRecords = formIndicatorRecordRepository.findByYearAndMonthAndDayOfMonth(
                year = date.year,
                month = date.monthValue,
                dayOfMonth = date.dayOfMonth,
            ).mapNotNull { it.fileReportTaskId }

            val records = fileReportList.mapNotNull { fileReport ->
                // 如果已存在相同 createTime 和 fileReportTaskId 的记录，则跳过
                if (fileReport.id in existingRecords) {
                    return@mapNotNull null
                }
                FormIndicatorRecord {
                    this.createTime = dateTime
                    this.collectionFrequency = fileReport.collectionFrequency
                    this.fileReportTaskId = fileReport.id
                    this.department = fileReport.department
                    this.submitted = false
                    this.data = FormIndicatorRecord.FileReportTaskData("")
                }
            }
            if (records.isNotEmpty()) {
                formIndicatorRecordRepository.saveAll(records)
            }
            true
        }
    }

    private fun filterFrequency(
        collectionFrequency: CollectionFrequency?,
        date: LocalDate,
    ): Boolean = when (collectionFrequency) {
        CollectionFrequency.QUARTERLY ->
            date.month in arrayOf(Month.JANUARY, Month.APRIL, Month.JULY, Month.OCTOBER) && date.dayOfMonth == 1

        CollectionFrequency.MONTHLY ->
            date.dayOfMonth == 1

        CollectionFrequency.WEEKLY ->
            date.dayOfWeek == DayOfWeek.MONDAY

        null -> false
    }
}
