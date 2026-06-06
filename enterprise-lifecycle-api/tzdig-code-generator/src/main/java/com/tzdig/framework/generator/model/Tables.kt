package com.tzdig.framework.generator.model

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.BaseMapper
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.likeRaw
import com.tzdig.framework.generator.properties.Configuration

@Table("information_schema.tables")
class Tables {
    interface Mapper : BaseMapper<Tables>

    @Column("table_schema")
    var tableSchema: String? = null

    @Column("table_name")
    var tableName: String? = null

    @Column("table_comment")
    var tableComment: String? = null

    companion object {
        fun getTables(tableNameList: List<String>) =
            if (tableNameList.isEmpty()) emptyList()
            else query<Tables> {
                where(Tables::tableSchema eq Configuration.mysql.schema)
                and { wrapper ->
                    tableNameList.forEach { wrapper.or(Tables::tableName likeRaw it) }
                }
            }
    }
}
