@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("t_proj_project", comment = "")
open class TProjProject() : BaseModel<TProjProject>() {
    constructor(init: TProjProject.() -> Unit) : this() {
        this.init()
    }

    /**
     * 意向投资项目
     */
    @Column("name", comment = "意向投资项目")
    var name: String? = null

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
     * 市区编码
     */
    @Column("investor_place", comment = "投资方注册地")
    var investorPlace: String? = null


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
     * 园区code
     */
    @Column("town_code", comment = "园区code")
    var townCode: String? = null

    /**
     * 园区名称
     */
    @Column("town_name", comment = "园区名称")
    var townName: String? = null

    /**
     * 1-接洽中 2-已本地考察 3-签约前谈判 4-意向达成 5-签约
     */
    @Column("progress", comment = "1-接洽中 2-已本地考察 3-签约前谈判 4-意向达成 5-签约")
    var progress: String? = null

    /**
     * 项目内容, 大文本框
     */
    @Column("desc", comment = "项目内容, 大文本框")
    var desc: String? = null

    /**
     * 投资方联系人
     */
    @Column("linker", comment = "投资方联系人")
    var linker: String? = null

    /**
     * 投资方联系电话
     */
    @Column("linker_tel", comment = "投资方联系电话")
    var linkerTel: String? = null

    /**
     * 招商人员
     */
    @Column("linker_tz", comment = "招商人员")
    var linkerTz: String? = null

    /**
     * 招商人员电话
     */
    @Column("linker_tz_tel", comment = "招商人员电话")
    var linkerTzTel: String? = null

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
     * 旧表创建人
     */
    @Column("old_create_by", comment = "旧表创建人")
    var oldCreateBy: String? = null

    /**
     * 数据来源 1页面新增 2 填报归入 3 共享认领
     */
    @Column("sjly", comment = "数据来源 1页面新增 2 填报归入 3 共享认领")
    var sjly: Int? = null

    /**
     * 数据状态 1流转至签约项目 2 流转至共享项目
     */
    @Column("sj_status", comment = "数据状态 1流转至签约项目 2 流转至共享项目")
    var sjStatus: Int? = null

    /**
     * 初次对接时间
     */
    @Column("first_time", comment = "初次对接时间")
    var firstTime: String? = null

    /**
     * 厂房类型 1 租赁 2 购买
     */
    @Column("building_type", comment = "厂房类型 1 租赁 2 购买")
    var buildingType: String? = null

    /**
     * 拟用地面积（亩）
     */
    @Column("use_area", comment = "拟用地面积（亩）")
    var useArea: String? = null

    /**
     * 拟租厂房面积（平方米）
     */
    @Column("rent_area", comment = "拟租厂房面积（平方米）")
    var rentArea: String? = null

    /**
     * 拟购厂房面积（平方米）
     */
    @Column("buy_area", comment = "拟购厂房面积（平方米）")
    var buyArea: String? = null

    /**
     * 预计年销量（万元）
     */
    @Column("year_xl", comment = "预计年销量（万元）")
    var yearXl: String? = null

    /**
     * 预计年税收（万元）
     */
    @Column("year_ss", comment = "预计年税收（万元）")
    var yearSs: String? = null

    /**
     * 1 自行接洽 2 市级机关推荐
     */
    @Column("b_resource", comment = "1 自行接洽 2 市级机关推荐")
    var bResource: Int? = null

    /**
     * 市集机关名称
     */
    @Column("sjjg_name", comment = "市集机关名称")
    var sjjgName: String? = null

    /**
     * 是否市级重点项目
     */
    @Column("city_project", comment = "是否市级重点项目")
    var cityProject: Int? = null

    /**
     * 是否省级重点项目
     */
    @Column("provincial_project", comment = "是否省级重点项目")
    var provincialProject: Int? = null

    /**
     * 是否提请协调
     */
    @Column("request_coordination", comment = "是否提请协调")
    var requestCoordination: Int? = null

    /**
     * 是否提请市级协调
     */
    @Column("request_city_coordination", comment = "是否提请市级协调")
    var requestCityCoordination: Int? = null

    /**
     * 提请市级协调事项
     */
    @Column("city_desc", comment = "提请市级协调事项")
    var cityDesc: String? = null

    /**
     * 城市名
     */
    @Column("place_info", comment = "城市名")
    var placeInfo: String? = null

    /**
     * 城市名
     */
    @Column("tzgm", comment = "城市名")
    var tzgm: String? = null

    @Column(isLogicDelete = true)
    public override var deleted: Boolean = false

    /**
     *
     */
    @Column("_status", comment = "")
    var status: String? = null
}
