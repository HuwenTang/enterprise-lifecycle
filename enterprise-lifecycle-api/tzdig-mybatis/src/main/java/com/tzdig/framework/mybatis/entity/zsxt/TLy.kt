@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("t_ly", comment = "")
class TLy() : BaseModel<TLy>() {
    constructor(init: TLy.() -> Unit) : this() {
        this.init()
    }

    /**
     * 留言ip
     */
    @Column("ip", comment = "留言ip")
    var ip: String? = null

    /**
     * 企业名称
     */
    @Column("com_name", comment = "企业名称")
    var comName: String? = null

    /**
     * 联系人电话
     */
    @Column("phone", comment = "联系人电话")
    var phone: String? = null

    /**
     * 联系人
     */
    @Column("name", comment = "联系人")
    var name: String? = null

    /**
     * 留言内容
     */
    @Column("desc_content", comment = "留言内容")
    var descContent: String? = null

    /**
     * status
     */
    @Column("status", comment = "status")
    var status: Boolean? = null

    /**
     * ct
     */
    @Column("ct", comment = "ct")
    var ct: LocalDateTime? = null

    /**
     * 是否处理，0，1
     */
    @Column("cl_is", comment = "是否处理，0，1")
    var clIs: Int? = null

    /**
     * 处理时间
     */
    @Column("cl_time", comment = "处理时间")
    var clTime: LocalDateTime? = null

    /**
     * 处理人登录名
     */
    @Column("cl_er", comment = "处理人登录名")
    var clEr: String? = null

    /**
     * 处理结果
     */
    @Column("cl_desc", comment = "处理结果")
    var clDesc: String? = null

    /**
     * 分配后的dept_code
     */
    @Column("dept_code", comment = "分配后的dept_code")
    var deptCode: String? = null

    /**
     * 留言来源，1小程序，2pc端
     */
    @Column("ly_type", comment = "留言来源，1小程序，2pc端")
    var lyType: Integer? = null
}
