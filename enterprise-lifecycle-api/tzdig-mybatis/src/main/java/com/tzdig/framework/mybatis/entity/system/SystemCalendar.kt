@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.EnumValue
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate

@Table("system_calendar", comment = "日历")
class SystemCalendar() : BaseModel<SystemCalendar>() {
    constructor(init: SystemCalendar.() -> Unit) : this() {
        this.init()
    }

    /**
     * 日期
     */
    @Column("date", comment = "日期")
    var date: LocalDate? = null

    /**
     * 年
     */
    @Column("year", comment = "年")
    var year: Int? = null

    /**
     * 月
     */
    @Column("month", comment = "月")
    var month: Int? = null

    /**
     * 日
     */
    @Column("day", comment = "日")
    var day: Int? = null

    /**
     * 星期
     */
    @Column("weekday", comment = "星期")
    var weekday: Weekday? = null

    enum class Weekday(@EnumValue val value: String) {
        SUN("Sun."),
        MON("Mon."),
        TUE("Tue."),
        WED("Wed."),
        THU("Thu."),
        FRI("Fri."),
        SAT("Sat."),
    }

    /**
     * 属性
     */
    @Column("attr", comment = "属性")
    var attr: Attr? = null

    enum class Attr(@EnumValue val value: String) {
        WORKDAY("WORKDAY"),
        WEEKEND("WEEKEND"),
        VOCATION("VOCATION"),
    }
}
