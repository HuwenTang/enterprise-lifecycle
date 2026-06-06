package com.tzdig.framework.mongo.entity

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.DayOfWeek
import java.time.LocalDateTime
import java.time.temporal.WeekFields

private val WEEK_FIELDS: WeekFields = WeekFields.of(DayOfWeek.MONDAY, 1)

@Document("form_indicator_record")
class FormIndicatorRecord() {
    constructor(init: FormIndicatorRecord.() -> Unit) : this() {
        this.init()
    }

    @Id
    var id: String? = null

    @Field("create_time", write = Field.Write.ALWAYS)
    var createTime: LocalDateTime? = null
        set(value) {
            if (value == null) {
                field = null
                return
            }
            field = value.toLocalDate().atTime(8, 0)
            year = value.year
            month = value.monthValue
            dayOfMonth = value.dayOfMonth
//            weekOfMonth = value?.get(ChronoField.ALIGNED_WEEK_OF_YEAR)
            quarter = when (month) {
                1, 2, 3 -> 1
                4, 5, 6 -> 2
                7, 8, 9 -> 3
                10, 11, 12 -> 4
                else -> null
            }
            weekOfMonth = value.get(WEEK_FIELDS.weekOfMonth())
        }

    @Field("update_time", write = Field.Write.ALWAYS)
    var updateTime: LocalDateTime? = null

    @Field("year", write = Field.Write.ALWAYS)
    var year: Int? = null
        private set

    @get:Field("month", write = Field.Write.ALWAYS)
    var month: Int? = null
        private set

    @Field("day_of_month", write = Field.Write.ALWAYS)
    var dayOfMonth: Int? = null
        private set

    @Field("week_of_month", write = Field.Write.ALWAYS)
    var weekOfMonth: Int? = null
        private set

    @Field("quarter", write = Field.Write.ALWAYS)
    var quarter: Int? = null
        private set

    /**
     * 收集频次
     */
    @Field("collection_frequency", write = Field.Write.ALWAYS)
    var collectionFrequency: String? = null

    /**
     * 支撑指标
     */
    @Field("support_indicator_id", write = Field.Write.ALWAYS)
    var supportIndicatorId: String? = null

    /**
     * 监测指标
     */
    @Field("monitor_indicator_id", write = Field.Write.ALWAYS)
    var monitorIndicatorId: String? = null

    /**
     * 文件报送任务
     */
    @Field("file_report_task_id")
    var fileReportTaskId: String? = null

    /**
     * 责任部门
     */
    @Field("department", write = Field.Write.ALWAYS)
    var department: String? = null

    /**
     * 是否已填报
     */
    @Field("submitted", write = Field.Write.ALWAYS)
    var submitted: Boolean? = null

    /**
     * 填报数据
     */
    @Field("data", write = Field.Write.ALWAYS)
    var data: Map<String, String>? = null

    class FileReportTaskData(
        file: String,
    ) : HashMap<String, String>() {
        init {
            put("file", file.substringBefore('?').substringBefore('#'))
        }

        var file: String
            get() = get("file") ?: ""
            set(value) {
                put("file", value)
            }
    }
}
