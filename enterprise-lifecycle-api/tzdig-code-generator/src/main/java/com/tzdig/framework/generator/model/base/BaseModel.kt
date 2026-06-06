package com.tzdig.framework.generator.model.base

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Id
import com.mybatisflex.annotation.KeyType
import com.mybatisflex.core.activerecord.MapperModel
import com.mybatisflex.core.keygen.KeyGenerators
import java.time.LocalDateTime

abstract class BaseModel<T : BaseModel<T>> : MapperModel<T> {
    @Id(comment = "主键", keyType = KeyType.Generator, value = KeyGenerators.flexId)
    var id: String? = null

    @Column(comment = "逻辑删除", onInsertValue = "false", isLogicDelete = true)
    protected open var deleted: Boolean = false

    @Column(comment = "创建时间", onInsertValue = "NOW()")
    var createTime: LocalDateTime? = null

    @Column(comment = "修改时间", onInsertValue = "NOW()", onUpdateValue = "NOW()")
    var updateTime: LocalDateTime? = null
}
