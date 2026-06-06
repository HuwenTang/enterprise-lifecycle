@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("t_biz_zone", comment = "")
class TBizZone() : BaseModel<TBizZone>() {
    constructor(init: TBizZone.() -> Unit) : this() {
        this.init()
    }

    /**
     * 名称
     */
    @Column("_name", comment = "名称")
    var name: String? = null

    /**
     * 上级园区
     */
    @Column("p_id", comment = "上级园区")
    var pId: String? = null

    /**
     * 001
     */
    @Column("_code", comment = "001")
    var code: String? = null

    /**
     * 上级编码
     */
    @Column("p_code", comment = "上级编码")
    var pCode: String? = null

    /**
     * 区县
     */
    @Column("district", comment = "区县")
    var district: String? = null

    /**
     * 区县编码
     */
    @Column("district_code", comment = "区县编码")
    var districtCode: String? = null

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
     * 中心点坐标
     */
    @Column("center", comment = "中心点坐标")
    var center: String? = null

    /**
     * order_idx
     */
    @Column("order_idx", comment = "order_idx")
    var orderIdx: Short? = null

    /**
     * 面积(亩)
     */
    @Column("mj", comment = "面积(亩)")
    var mj: BigDecimal? = null

    /**
     * 可供租用楼栋面积
     */
    @Column("build_mj", comment = "可供租用楼栋面积")
    var buildMj: String? = null

    /**
     * 可供开发土地面积(亩)
     */
    @Column("land_mj", comment = "可供开发土地面积(亩)")
    var landMj: String? = null

    /**
     * 1-国家级,3-省级,6-市级 9-其它
     */
    @Column("grade", comment = "1-国家级,3-省级,6-市级 9-其它")
    var grade: Short? = null

    /**
     * 区域范围坐标
     */
    @Column("polygon", comment = "区域范围坐标")
    var polygon: String? = null

    /**
     * 描述
     */
    @Column("_desc", comment = "描述")
    var desc: String? = null

    /**
     * 企业 数量
     */
    @Column("company_count", comment = "企业 数量")
    var companyCount: Int? = null

    /**
     * 规上企业数量
     */
    @Column("large_company", comment = "规上企业数量")
    var largeCompany: Int? = null

    /**
     * 500强企业数量
     */
    @Column("g_500", comment = "500强企业数量")
    var g500: Int? = null

    /**
     * 央企国企数量
     */
    @Column("central_count", comment = "央企国企数量")
    var centralCount: Int? = null

    /**
     * 上市公司数量
     */
    @Column("stock_count", comment = "上市公司数量")
    var stockCount: Int? = null

    /**
     * 高新技术企业数量
     */
    @Column("tech_count", comment = "高新技术企业数量")
    var techCount: Int? = null

    /**
     * 规划图
     */
    @Column("img_gh", comment = "规划图")
    var imgGh: String? = null

    /**
     * 形象图
     */
    @Column("img_xx", comment = "形象图")
    var imgXx: String? = null

    /**
     * 主导产业
     */
    @Column("main_industry", comment = "主导产业")
    var mainIndustry: String? = null

    /**
     * 特色
     */
    @Column("feature", comment = "特色")
    var feature: String? = null

    /**
     * 是否有食堂  1-有 0-无 默认0
     */
    @Column("has_canteen", comment = "是否有食堂  1-有 0-无 默认0")
    var hasCanteen: String? = null

    /**
     * 是否有班车  1-有 0-无 默认0
     */
    @Column("has_bus", comment = "是否有班车  1-有 0-无 默认0")
    var hasBus: String? = null

    /**
     * 是否有仓库  1-有 0-无 默认0
     */
    @Column("has_storehouse", comment = "是否有仓库  1-有 0-无 默认0")
    var hasStorehouse: String? = null

    /**
     * 仓库面积描述
     */
    @Column("storehouse_area", comment = "仓库面积描述")
    var storehouseArea: String? = null

    /**
     * 仓库价格说明
     */
    @Column("storehouse_price", comment = "仓库价格说明")
    var storehousePrice: String? = null

    /**
     * 距高铁站距离
     */
    @Column("dis_railway", comment = "距高铁站距离")
    var disRailway: String? = null

    /**
     * 距机场距离
     */
    @Column("dis_airport", comment = "距机场距离")
    var disAirport: String? = null

    /**
     * 距港口距离
     */
    @Column("dis_port", comment = "距港口距离")
    var disPort: String? = null

    /**
     * 能源价格描述
     */
    @Column("energy_price", comment = "能源价格描述")
    var energyPrice: String? = null

    /**
     * 环保价格描述
     */
    @Column("environment_price", comment = "环保价格描述")
    var environmentPrice: String? = null

    /**
     * 联系人
     */
    @Column("invest_linker", comment = "联系人")
    var investLinker: String? = null

    /**
     * 投资电话
     */
    @Column("invest_tel", comment = "投资电话")
    var investTel: String? = null

    /**
     * 投资电话
     */
    @Column("invest_tel2", comment = "投资电话")
    var investTel2: String? = null

    /**
     * 投资联系方式
     */
    @Column("link_info", comment = "投资联系方式")
    var linkInfo: String? = null

    /**
     * 地价
     */
    @Column("land_price", comment = "地价")
    var landPrice: String? = null

    /**
     * 物业费价格
     */
    @Column("propety_price", comment = "物业费价格")
    var propetyPrice: BigDecimal? = null

    /**
     * 办公楼租赁费
     */
    @Column("rent_price", comment = "办公楼租赁费")
    var rentPrice: BigDecimal? = null

    /**
     * 品牌/荣誉
     */
    @Column("range_desc", comment = "品牌/荣誉")
    var rangeDesc: String? = null

    /**
     * video_url
     */
    @Column("video_url", comment = "video_url")
    var videoUrl: String? = null

    /**
     * 准入门槛
     */
    @Column("entry_desc", comment = "准入门槛")
    var entryDesc: String? = null

    /**
     * 招商政策
     */
    @Column("policy", comment = "招商政策")
    var policy: String? = null

    /**
     * 项目配套
     */
    @Column("project_support", comment = "项目配套")
    var projectSupport: String? = null

    /**
     * 公共配套
     */
    @Column("public_support", comment = "公共配套")
    var publicSupport: String? = null

    /**
     * 生活配套
     */
    @Column("life_support", comment = "生活配套")
    var lifeSupport: String? = null

    /**
     * 1-正常 其它
     */
    @Column("_status", comment = "1-正常 其它")
    var status: Short? = null

    /**
     * 是否推荐 1 是 2否
     */
    @Column("sftj", comment = "是否推荐 1 是 2否")
    var sftj: Boolean? = null

    /**
     * 传真号码
     */
    @Column("czhm", comment = "传真号码")
    var czhm: String? = null

    /**
     * 网址
     */
    @Column("website", comment = "网址")
    var website: String? = null

    /**
     * 邮箱
     */
    @Column("mailbox", comment = "邮箱")
    var mailbox: String? = null

    /**
     * 邮编
     */
    @Column("postal_code", comment = "邮编")
    var postalCode: String? = null

    /**
     * 地址
     */
    @Column("address", comment = "地址")
    var address: String? = null

    /**
     * 产业code
     */
    @Column("industry_code", comment = "产业code")
    var industryCode: String? = null

    /**
     * 产业名称
     */
    @Column("industry_name", comment = "产业名称")
    var industryName: String? = null

    /**
     * 名片
     */
    @Column("logo", comment = "名片")
    var logo: String? = null

    /**
     * 介绍视频
     */
    @Column("video", comment = "介绍视频")
    var video: String? = null

    /**
     * 园区详细介绍
     */
    @Column("info", comment = "园区详细介绍")
    var info: String? = null

    /**
     * 重点园区 1 重点 2 非重点
     */
    @Column("key_zone", comment = "重点园区 1 重点 2 非重点")
    var keyZone: Boolean? = null

    /**
     * 档位 ABC
     */
    @Column("gear", comment = "档位 ABC")
    var gear: String? = null

    /**
     * 展示父编码
     */
    @Column("show_code", comment = "展示父编码")
    var showCode: String? = null

    /**
     * 1
     */
    @Column("status_show", comment = "1")
    var statusShow: Boolean? = null

    /**
     * 附件名称
     */
    @Column("file_name", comment = "附件名称")
    var fileName: String? = null

    /**
     * 原编号
     */
    @Column("old_code", comment = "原编号")
    var oldCode: String? = null
}
