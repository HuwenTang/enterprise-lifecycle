@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import org.bouncycastle.util.Longs

@Table("t_proj_share_project", comment = "")
class TProjShareProject() : BaseModel<TProjShareProject>() {
    constructor(init: TProjShareProject.() -> Unit) : this() {
        this.init()
    }

    /**
     * 投资方名称
     */
    @Column("investor", comment = "投资方名称")
    var investor: String? = null

    /**
     * 项目类别, 1-内资,2-外资 默认1
     */
    @Column("p_type", comment = "项目类别, 1-内资,2-外资 默认1")
    var pType: Short? = null

    /**
     * 投资金额
     */
    @Column("invest_money", comment = "投资金额")
    var investMoney: String? = null

    /**
     * 区县
     */
    @Column("district", comment = "区县")
    var district: String? = null

    /**
     * 市区编码
     */
    @Column("district_code", comment = "市区编码")
    var districtCode: String? = null

    /**
     * 园区code
     */
    @Column("zone_code", comment = "园区code")
    var zoneCode: String? = null

    /**
     * 园区名称
     */
    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    /**
     * 1 无任何状态  2流转至再谈项目
     */
    @Column("progress", comment = "1 无任何状态  2流转至再谈项目")
    var progress: String? = null

    /**
     * 项目内容, 大文本框
     */
    @Column("_desc", comment = "项目内容, 大文本框")
    var desc: String? = null

    /**
     * 创建人的id,前端界面不管理,插入时用登录人帐号赋值
     */
    @Column("creator_id", comment = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")
    var creatorId: String? = null

    /**
     * 创建人姓名
     */
    @Column("creator_name", comment = "创建人姓名")
    var creatorName: String? = null


    /**
     * 1 填报归入 2 再谈归入
     */
    @Column("sjly", comment = "1 填报归入 2 再谈归入")
    var sjly: Int? = null

    /**
     * 归入原因
     */
    @Column("remark", comment = "归入原因")
    var remark: String? = null

    /**
     * 洽谈进度
     */
    @Column("qtjd", comment = "洽谈进度")
    var qtjd: String? = null
}
