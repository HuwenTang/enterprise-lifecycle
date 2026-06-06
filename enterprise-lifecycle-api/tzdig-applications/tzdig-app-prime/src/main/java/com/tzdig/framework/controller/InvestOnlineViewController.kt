package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.times
import com.mybatisflex.kotlin.extensions.sql.times
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.model.vo.QyxmCyflTjxxVO
import com.tzdig.framework.mybatis.bo.InvestOnlineBO
import com.tzdig.framework.mybatis.bo.ResultBO
import com.tzdig.framework.mybatis.bo.TotalBO
import com.tzdig.framework.mybatis.bo.TotalMoneyBO
import com.tzdig.framework.mybatis.dao.InvestOnlineZjDAO
import com.tzdig.framework.mybatis.entity.view.*
import com.tzdig.framework.security.annotation.CheckAreaGrants
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.InvestOnlineService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal

@Tag(name = "数字化招商")
@RestController
@RequestMapping("invest-online")
class InvestOnlineViewController(
    private val investOnlineZjDAO: InvestOnlineZjDAO,
    private val investOnlineService: InvestOnlineService
) {
    @Operation(summary = "查询地区在谈项目情况")
    @GetMapping("get-ztxm-area")
    fun getZtxmTjxxAreaViews(@RequestParam year: Int): ZtxmTjxx {
        val areaCode = investOnlineService.getAreaCode()
        val resultList = if (areaCode.isEmpty()) emptyList()
        else query<ZtxmTjxx> {
            and(ZtxmTjxx::year eq year)
            and(ZtxmTjxx::deptCode inList areaCode)
        }
        return ZtxmTjxx {
            xmzsl = resultList.sumOf { it.xmzsl ?: 0 }
            xmzje = resultList.sumOf { it.xmzje ?: BigDecimal.valueOf(0) }
            nzsl = resultList.sumOf { it.nzsl ?: BigDecimal.valueOf(0) }
            nzje = resultList.sumOf { it.nzje ?: BigDecimal.valueOf(0) }
            wzsl = resultList.sumOf { it.wzsl ?: BigDecimal.valueOf(0) }
            wzje = resultList.sumOf { it.wzje ?: BigDecimal.valueOf(0) }
            byxzje = resultList.sumOf { it.byxzje ?: BigDecimal.valueOf(0) }
            byzqysl = resultList.sumOf { it.byzqysl ?: BigDecimal.valueOf(0) }
            byxzsl = resultList.sumOf { it.byxzsl ?: BigDecimal.valueOf(0) }.minus(byzqysl ?: BigDecimal.valueOf(0))
        }
    }

    @Operation(summary = "查询地区签约项目情况")
    @GetMapping("get-qyxm-area")
    fun getQyxmTjxxAreaViews(@RequestParam year: Int): QyxmTjxx {
        val areaCode = investOnlineService.getAreaCode()
        val resultList = if (areaCode.isEmpty()) emptyList()
        else query<QyxmTjxx> {
            and(QyxmTjxx::year eq year)
            and(QyxmTjxx::deptCode inList areaCode)
        }
        return QyxmTjxx {
            xmzsl = resultList.sumOf { it.xmzsl ?: 0 }
            xmzje = resultList.sumOf { it.xmzje ?: 0.0 }
            nzsl = resultList.sumOf { it.nzsl ?: 0 }
            nzje = resultList.sumOf { it.nzje ?: 0.0 }
            wzsl = resultList.sumOf { it.wzsl ?: 0 }
            wzje = resultList.sumOf { it.wzje ?: 0.0 }
            byxzsl = resultList.sumOf { it.byxzsl ?: 0 }
            byxzje = resultList.sumOf { it.byxzje ?: 0.0 }
        }
    }

    @Deprecated("", level = DeprecationLevel.HIDDEN)
    @CheckAreaGrants(AreaConstant.TAIZHOU_CODE)
    @Operation(summary = "查询全市项目行业分布")
    @GetMapping("get-qyxm-cyfl-1")
    fun getQyxmCyflTjxxViews1(@RequestParam("year") year: Int): List<QyxmCyflTjxx111>? {
        return query<QyxmCyflTjxx111> {
            select(
                QyxmCyflTjxx111::year,
                QyxmCyflTjxx111::cybm,
                QyxmCyflTjxx111::cymc,
                QyxmCyflTjxx111::xmsl,
                QyxmCyflTjxx111::xmje,
            )
            select(QueryMethods.round(QyxmCyflTjxx111::slzb.times(100), 2).`as`(QyxmCyflTjxx111::slzb))
            where(QyxmCyflTjxx111::year eq year)
        }
    }

    @Operation(summary = "查询地区项目行业分布")
    @GetMapping("get-qyxm-cyfl")
    fun getQyxmCyflTjxxViews(@RequestParam year: Int): List<QyxmCyflTjxxVO> {
        val areaCode = investOnlineService.getAreaCode()
        val resultList = if (areaCode.isEmpty()) emptyList()
        else
            query<QyxmCyflTjxx> {
                select(
                    QyxmCyflTjxx::year,
                    QyxmCyflTjxx::cybm,
                    QyxmCyflTjxx::cymc
                )
                select(
                    QueryMethods.sum(QyxmCyflTjxx::xmsl).`as`(QyxmCyflTjxx::xmsl.name),
                    QueryMethods.sum(QyxmCyflTjxx::xmje).`as`(QyxmCyflTjxx::xmje.name)
                )
                select(
                    QueryMethods.round(QueryMethods.sum(QyxmCyflTjxx::slzb).times(100), 2).`as`(QyxmCyflTjxx::slzb.name)
                )
                where(QyxmCyflTjxx::year eq year)
                and(QyxmCyflTjxx::deptCode inList areaCode)
                groupBy(QyxmCyflTjxx::year)
                groupBy(QyxmCyflTjxx::cybm)
                groupBy(QyxmCyflTjxx::cymc)

            }.map { QyxmCyflTjxxVO(it) }
        return resultList
    }

    @Deprecated("", level = DeprecationLevel.HIDDEN)
    @CheckAreaGrants(AreaConstant.TAIZHOU_CODE)
    @Operation(summary = "查询全市签约项目规模", hidden = true)
    @GetMapping("get-qyxm-gm")
    fun getQyxmGmTjxxViewsExcel(@RequestParam("year") year: Int): List<QyxmGmTjxx111> {
        return filter<QyxmGmTjxx111> { QyxmGmTjxx111::year eq year }
    }

    @Operation(summary = "查询地区签约项目规模")
    @GetMapping("get-qyxm-gm-area")
    fun getQyxmGmTjxxAreaViews(@RequestParam year: Int): QyxmGmTjxx {
        val areaCode = investOnlineService.getAreaCode()
        val resultList = if (areaCode.isEmpty()) emptyList()
        else query<QyxmGmTjxx> {
            and(QyxmGmTjxx::year eq year)
            and(QyxmGmTjxx::deptCode inList areaCode)
        }
        return QyxmGmTjxx {
            nzzsl = resultList.sumOf { it.nzzsl ?: 0 }
            nzzje = resultList.sumOf { it.nzzje ?: 0.0 }
            nzsl1 = resultList.sumOf { it.nzsl1 ?: 0 }
            nzje1 = resultList.sumOf { it.nzje1 ?: 0.0 }
            nzsl2 = resultList.sumOf { it.nzsl2 ?: 0 }
            nzje2 = resultList.sumOf { it.nzje2 ?: 0.0 }
            nzsl3 = resultList.sumOf { it.nzsl3 ?: 0 }
            nzje3 = resultList.sumOf { it.nzje3 ?: 0.0 }
            nzsl4 = resultList.sumOf { it.nzsl4 ?: 0 }
            nzje4 = resultList.sumOf { it.nzje4 ?: 0.0 }
            wzzsl = resultList.sumOf { it.wzzsl ?: 0 }
            wzzje = resultList.sumOf { it.wzzje ?: 0.0 }
            wzsl1 = resultList.sumOf { it.wzsl1 ?: 0 }
            wzje1 = resultList.sumOf { it.wzje1 ?: 0.0 }
            wzsl2 = resultList.sumOf { it.wzsl2 ?: 0 }
            wzje2 = resultList.sumOf { it.wzje2 ?: 0.0 }
            wzsl3 = resultList.sumOf { it.wzsl3 ?: 0 }
            wzje3 = resultList.sumOf { it.wzje3 ?: 0.0 }
            wzsl4 = resultList.sumOf { it.wzsl4 ?: 0 }
            wzje4 = resultList.sumOf { it.wzje4 ?: 0.0 }
        }
    }

    @Operation(summary = "查询地区在谈项目规模")
    @GetMapping("get-ztxm-gm-area")
    fun getZtxmGmTjxxAreaViews(@RequestParam year: Int): ZtxmGmTjxx {
        val areaCode = investOnlineService.getAreaCode()
        val resultList = if (areaCode.isEmpty()) emptyList()
        else query<ZtxmGmTjxx> {
            and(ZtxmGmTjxx::year eq year)
            and(ZtxmGmTjxx::deptCode inList areaCode)
        }
        return ZtxmGmTjxx {
            nzzsl = resultList.sumOf { it.nzzsl ?: BigDecimal.valueOf(0) }
            nzzje = resultList.sumOf { it.nzzje ?: BigDecimal.valueOf(0) }
            nzsl1 = resultList.sumOf { it.nzsl1 ?: BigDecimal.valueOf(0) }
            nzje1 = resultList.sumOf { it.nzje1 ?: BigDecimal.valueOf(0) }
            nzsl2 = resultList.sumOf { it.nzsl2 ?: BigDecimal.valueOf(0) }
            nzje2 = resultList.sumOf { it.nzje2 ?: BigDecimal.valueOf(0) }
            nzsl3 = resultList.sumOf { it.nzsl3 ?: BigDecimal.valueOf(0) }
            nzje3 = resultList.sumOf { it.nzje3 ?: BigDecimal.valueOf(0) }
            nzsl4 = resultList.sumOf { it.nzsl4 ?: BigDecimal.valueOf(0) }
            nzje4 = resultList.sumOf { it.nzje4 ?: BigDecimal.valueOf(0) }
            wzzsl = resultList.sumOf { it.wzzsl ?: BigDecimal.valueOf(0) }
            wzzje = resultList.sumOf { it.wzzje ?: BigDecimal.valueOf(0) }
            wzsl1 = resultList.sumOf { it.wzsl1 ?: BigDecimal.valueOf(0) }
            wzje1 = resultList.sumOf { it.wzje1 ?: BigDecimal.valueOf(0) }
            wzsl2 = resultList.sumOf { it.wzsl2 ?: BigDecimal.valueOf(0) }
            wzje2 = resultList.sumOf { it.wzje2 ?: BigDecimal.valueOf(0) }
            wzsl3 = resultList.sumOf { it.wzsl3 ?: BigDecimal.valueOf(0) }
            wzje3 = resultList.sumOf { it.wzje3 ?: BigDecimal.valueOf(0) }
            wzsl4 = resultList.sumOf { it.wzsl4 ?: BigDecimal.valueOf(0) }
            wzje4 = resultList.sumOf { it.wzje4 ?: BigDecimal.valueOf(0) }
        }
    }

    @Operation(summary = "查询签约项目月度趋势变化")
    @GetMapping("get-qyxm-ydqs")
    fun getQyxmYdqsTjxxViews(@RequestParam("year") year: Int): List<ResultBO> {
        val monthList = (1..12)
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return monthList.mapNotNull { month ->
                investOnlineZjDAO.getQyxmYdqs(year, month)
            }
        }
        val areaCode = investOnlineService.getAreaCode(grantedAreas)
        return monthList.mapNotNull { month ->
            if (areaCode.isEmpty()) null
            else investOnlineZjDAO.getQyxmYdqsArea(year, month, areaCode)
        }
    }

    @Operation(summary = "查询在谈项目月度趋势变化")
    @GetMapping("get-ztxm-ydqs")
    fun getZtxmYdqsTjxxViews(@RequestParam("year") year: Int): List<ResultBO> {
        val monthList = (1..12)
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return monthList.mapNotNull { month ->
                investOnlineZjDAO.getZtxmYdqs(year, month)
            }
        }
        val areaCode = investOnlineService.getAreaCode(grantedAreas)
        return monthList.mapNotNull { month ->
            if (areaCode.isEmpty()) null
            else investOnlineZjDAO.getZtxmYdqsArea(year, month, areaCode)
        }
    }

    @SaIgnore
    @Operation(summary = "查询签约项目镇街板块情况总和")
    @GetMapping("get-qyxm-zj-total")
    fun getQyxmZjTotalViews(@RequestParam("year") year: Int): List<TotalBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getQyxmZjTotal(year)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getQyxmAreaTotal(year, areaCode)
    }

    @Operation(summary = "查询签约内资项目镇街板块情况总和")
    @GetMapping("get-qyxm-zj-nz")
    fun getQyxmZjNzViews(@RequestParam("year") year: Int): List<InvestOnlineBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getQyxmZjNz(year)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getQyxmAreaNz(year, areaCode)
    }

    @Operation(summary = "查询签约外资项目镇街板块情况总和")
    @GetMapping("get-qyxm-zj-wz")
    fun getQyxmZjWzViews(@RequestParam("year") year: Int): List<InvestOnlineBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getQyxmZjWz(year)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getQyxmAreaWz(year, areaCode)
    }

    @Operation(summary = "查询在谈项目镇街板块情况总和")
    @GetMapping("get-ztxm-zj-total")
    fun getZtxmZjTotalViews(@RequestParam("year") year: Int): List<TotalBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getZtxmZjTotal(year)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getZtxmAreaTotal(year, areaCode)
    }

    @Operation(summary = "查询在谈内资项目镇街板块情况总和")
    @GetMapping("get-ztxm-zj-nz")
    fun getZtxmZjNzViews(@RequestParam("year") year: Int): List<InvestOnlineBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getZtxmZjNz(year)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getZtxmAreaNz(year, areaCode)
    }

    @Operation(summary = "查询在谈外资项目镇街板块情况总和")
    @GetMapping("get-ztxm-zj-wz")
    fun getZtxmZjWzViews(@RequestParam("year") year: Int): List<InvestOnlineBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getZtxmZjWz(year)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getZtxmAreaWz(year, areaCode)
    }

    @Operation(summary = "查询签约项目总数总金额统计表")
    @GetMapping("get-qyxm-total")
    fun getQyxmTotalViews(@RequestParam("year") year: Int, @RequestParam("month") month: Int): List<TotalMoneyBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getQyxmZjTotalByYear(year, month)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getQyxmZjAreaTotalByYear(year, month, areaCode)
    }

    @Operation(summary = "查询在谈项目总数总金额统计表")
    @GetMapping("get-ztxm-total")
    fun getZtxmTotalViews(@RequestParam("year") year: Int, @RequestParam("month") month: Int): List<TotalMoneyBO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (AreaConstant.TAIZHOU_CODE in grantedAreas) {
            return investOnlineZjDAO.getZtxmZjTotalByYear(year, month)
        }
        val areaCode = investOnlineService.getAllAreaCode(grantedAreas)
        return investOnlineZjDAO.getZtxmZjAreaTotalByYear(year, month, areaCode)
    }

    @Operation(summary = "查询地区签约项目进展情况")
    @GetMapping("get-qyxm-jz-area")
    fun getQyxmJzTjxxCountyViews(@RequestParam("year") year: Int): QyxmJzTjxx {
        val areaCode = investOnlineService.getAreaCode()
        val resultList = if (areaCode.isEmpty()) emptyList()
        else query<QyxmJzTjxx> {
            and(QyxmJzTjxx::year eq year)
            and(QyxmJzTjxx::deptCode inList areaCode)
        }
        return QyxmJzTjxx {
            yqysl = resultList.sumOf { it.yqysl ?: 0 }
            yqyje = resultList.sumOf { it.yqyje ?: 0.0 }
            yzcsl = resultList.sumOf { it.yzcsl ?: 0 }
            yzcje = resultList.sumOf { it.yzcje ?: 0.0 }
            ybasl = resultList.sumOf { it.ybasl ?: 0 }
            ybaje = resultList.sumOf { it.ybaje ?: 0.0 }
            wcbpsl = resultList.sumOf { it.wcbpsl ?: 0 }
            wcbpje = resultList.sumOf { it.wcbpje ?: 0.0 }
            ykgsl = resultList.sumOf { it.ykgsl ?: 0 }
            ykgje = resultList.sumOf { it.ykgje ?: 0.0 }
            yjgsl = resultList.sumOf { it.yjgsl ?: 0 }
            yjgje = resultList.sumOf { it.yjgje ?: 0.0 }
        }
    }
}
