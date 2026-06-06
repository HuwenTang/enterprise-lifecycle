@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.util.Date

@Table("t_common_manager", comment = "")
class TCommonManager() : BaseModel<TCommonManager>() {
    constructor(init: TCommonManager.() -> Unit) : this() {
        this.init()
    }

    /**
     * 登录名
     */
    @Column("login_name", comment = "登录名")
    var loginName: String? = null

    /**
     * 密码
     */
    @Column("passwd", comment = "密码")
    var passwd: String? = null

    /**
     * 盐
     */
    @Column("salt", comment = "盐")
    var salt: String? = null

    /**
     * 姓名
     */
    @Column("user_name", comment = "姓名")
    var userName: String? = null

    /**
     * 部门编码
     */
    @Column("dept_code", comment = "部门编码")
    var deptCode: String? = null

    /**
     * 部门名称
     */
    @Column("dept_name", comment = "部门名称")
    var deptName: String? = null

    /**
     * 是否管理员,0--非超级管理员,1--超级管理员
     */
    @Column("is_admin", comment = "是否管理员,0--非超级管理员,1--超级管理员")
    var isAdmin: Int? = null

    /**
     * 删除状态 0 表示不可用1 表示可用2 保留用户
     */
    @Column("u_status", comment = "删除状态 0 表示不可用1 表示可用2 保留用户")
    var uStatus: Short? = null

    /**
     * 最后修改时间
     */
    @Column("edit_time", comment = "最后修改时间")
    var editTime: Date? = null

    /**
     * 登录次数
     */
    @Column("login_times", comment = "登录次数")
    var loginTimes: Long? = null

    /**
     * 最后修改人登录名
     */
    @Column("editor", comment = "最后修改人登录名")
    var editor: String? = null

    /**
     * 最后修改人姓名
     */
    @Column("editor_name", comment = "最后修改人姓名")
    var editorName: String? = null

    /**
     * 最后登录时间
     */
    @Column("last_login_time", comment = "最后登录时间")
    var lastLoginTime: Date? = null

    /**
     * IP地址
     */
    @Column("last_ip", comment = "IP地址")
    var lastIp: String? = null

    /**
     * 备注
     */
    @Column("remark", comment = "备注")
    var remark: String? = null

    /**
     * 老项目officeId
     */
    @Column("old_office_id", comment = "老项目officeId")
    var oldOfficeId: String? = null

    /**
     * 部门
     */
    @Column("tzt_dept", comment = "部门")
    var tztDept: String? = null
}
