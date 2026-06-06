@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.mybatisflex.core.activerecord.MapperModel
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_construction_relation", dataSource = "gong-gai")
class ProjectConstructionRelation() : MapperModel<ProjectConstructionRelation> {
    constructor(init: ProjectConstructionRelation.() -> Unit) : this() {
        this.init()
    }

    /**
     * 阶段名称
     */
    @Column("stage", comment = "阶段名称")
    var stage: String? = null


    /**
     * 项目类型
     */
    @Column("project_type", comment = "项目类型")
    var type: String? = null
    /**
     * 事项名称
     */
    @Column("item_name", comment = "事项名称")
    var itemName: String? = null

    @Column("is_basic_process", comment = "是否基础流程")
    var isBasicProcess: Boolean? = null

    @Column("order", comment = "排序")
    var order: Int? = null
}
