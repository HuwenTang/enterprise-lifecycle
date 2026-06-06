package com.tzdig.framework.mongo.repository

import com.tzdig.framework.mongo.entity.FormIndicatorRecord
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface FormIndicatorRecordRepository : MongoRepository<FormIndicatorRecord, String> {
    fun findByYearAndMonthAndDayOfMonth(year: Int, month: Int, dayOfMonth: Int): List<FormIndicatorRecord>
}