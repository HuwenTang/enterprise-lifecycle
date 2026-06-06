@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.EnumValue
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("test_enum")
class TestEnum() : BaseModel<TestEnum>() {
    constructor(init: TestEnum.() -> Unit) : this() {
        this.init()
    }

    /**
     * 字段a
     */
    @Column("a_b", comment = "字段a")
    var aB: Int? = null

    /**
     * enumerate
     */
    @Column("en", comment = "enumerate")
    var en: En? = null
    enum class En(@EnumValue val value: String) {
        A("a"),
        B("b"),
    }

    /**
     * 字段b
     */
    @Column("b_c", comment = "字段b")
    var bC: String? = null
}
