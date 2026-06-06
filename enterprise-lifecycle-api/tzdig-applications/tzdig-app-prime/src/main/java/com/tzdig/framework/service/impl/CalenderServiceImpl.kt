package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.mybatis.entity.system.SystemCalendar
import com.tzdig.framework.service.CalenderService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime


@Service
class CalenderServiceImpl : CalenderService {
    override fun minusWorkdays(time: LocalDateTime, workdays: Int): LocalDateTime {
        check(workdays > 0)
        var result = if (time.toLocalDate().isWorkday()) time
        else time.withHour(0).withMinute(0).withSecond(0).withNano(0)
        repeat(workdays) {
            do {
                result = result.minusDays(1)
            } while (!result.toLocalDate().isWorkday())
        }
        return result
    }

    override fun getWorkdaysBetween(startDate: LocalDate): Long {
        // 返回指定日期到今天的所有工作日数量
        val currentDate = LocalDate.now()
        var date = startDate

        var count = 0L
        while (date.isBefore(currentDate)) {
            if (date.isWorkday()) {
                count++
            }
            date = date.plusDays(1)
        }
        return count
    }

    private fun LocalDate.isWorkday(): Boolean {
        val calendar = filterOne<SystemCalendar> { SystemCalendar::date eq this }
        return calendar?.attr == SystemCalendar.Attr.WORKDAY
    }
}
