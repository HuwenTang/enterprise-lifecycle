@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_file", comment = "")
class TFile() : BaseModel<TFile>() {
    constructor(init: TFile.() -> Unit) : this() {
        this.init()
    }

    /**
     * 编码
     */
    @Column("cate_code", comment = "编码")
    var cateCode: String? = null

    /**
     * 名称
     */
    @Column("name", comment = "名称")
    var name: String? = null

    /**
     * 数据主表的主键值
     */
    @Column("main_id", comment = "数据主表的主键值")
    var mainId: String? = null

    /**
     * 路径
     */
    @Column("file_path", comment = "路径")
    var filePath: String? = null

    /**
     * 描述
     */
    @Column("file_desc", comment = "描述")
    var fileDesc: String? = null

    /**
     * creator
     */
    @Column("creator", comment = "creator")
    var creator: String? = null

    /**
     * creator_name
     */
    @Column("creator_name", comment = "creator_name")
    var creatorName: String? = null

    /**
     * 旧表项目名称
     */
    @Column("old_name", comment = "旧表项目名称")
    var oldName: String? = null

    /**
     * 旧表创建人
     */
    @Column("old_create_by", comment = "旧表创建人")
    var oldCreateBy: String? = null
}
