package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_project")
class TProjProject() : BaseModel<TProjProject>() {
    constructor(init: TProjProject.() -> Unit) : this() {
        this.init()
    }

    @Column("name", comment = "意向投资项目")
    var name: String? = null

    @Column("investor", comment = "投资方名称")
    var investor: String? = null

    @Column("p_type", comment = "项目类别, 1-内资,2-外资 默认1")
    var pType: Int? = null

    @Column("invest_money", comment = "投资金额")
    var investMoney: String? = null

    @Column("district", comment = "区县")
    var district: String? = null

    @Column("district_code", comment = "市区编码")
    var districtCode: String? = null

    @Column("zone_code", comment = "园区code")
    var zoneCode: String? = null

    @Column("zone_name", comment = "园区名称")
    var zoneName: String? = null

    @Column("progress", comment = "1-接洽中 2-已本地考察 3-签约前谈判 4-意向达成 5-签约")
    var progress: String? = null

    @Column("desc", comment = "项目内容, 大文本框")
    var desc: String? = null

    @Column("linker", comment = "投资方联系人")
    var linker: String? = null

    @Column("linker_tel", comment = "投资方联系电话")
    var linkerTel: String? = null

    @Column("linker_tz", comment = "招商人员")
    var linkerTz: String? = null

    @Column("linker_tz_tel", comment = "招商人员电话")
    var linkerTzTel: String? = null

    @Column("creator_id", comment = "创建人的id")
    var creatorId: Int? = null

    @Column("creator_name", comment = "创建人姓名")
    var creatorName: String? = null

    @Column("status", comment = "状态")
    var status: Int? = null

    @Column("old_create_by", comment = "旧表创建人")
    var oldCreateBy: String? = null

    @Column("sjly", comment = "数据来源 1页面新增 2 填报归入 3 共享认领")
    var sjly: Int? = null

    @Column("sj_status", comment = "数据状态 1流转至签约项目 2 流转至共享项目")
    var sjStatus: Int? = null

    @Column("first_time", comment = "初次对接时间")
    var firstTime: String? = null

    @Column("building_type", comment = "厂房类型 1 租赁 2 购买")
    var buildingType: String? = null

    @Column("use_area", comment = "拟用地面积（亩）")
    var useArea: String? = null

    @Column("rent_area", comment = "拟租厂房面积（平方米）")
    var rentArea: String? = null

    @Column("buy_area", comment = "拟购厂房面积（平方米）")
    var buyArea: String? = null

    @Column("year_xl", comment = "预计年销量（万元）")
    var yearXl: String? = null

    @Column("year_ss", comment = "预计年税收（万元）")
    var yearSs: String? = null

    @Column("b_resource", comment = "1 自行接洽 2 市级机关推荐")
    var bResource: Int? = null

    @Column("sjjg_name", comment = "市集机关名称")
    var sjjgName: String? = null
}
