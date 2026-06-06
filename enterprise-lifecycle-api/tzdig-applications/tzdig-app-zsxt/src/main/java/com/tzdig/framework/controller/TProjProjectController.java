package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.IdUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.update.UpdateChain;
import com.tzdig.framework.file.model.vo.FileDownloadVO;
import com.tzdig.framework.model.dto.TProjectDTO;
import com.tzdig.framework.mybatis.entity.view.XmJbxx;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProject;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProject;
import com.tzdig.framework.service.IProjectService;
import com.tzdig.framework.service.ProjectZSCreateService;
import com.tzdig.framework.util.UserInfoUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

@Tag(name = "项目管理")
@RestController
@RequestMapping("tProjProject")
public class TProjProjectController {

    @Resource
    private ITProjProject tProjProjectService;

    @Resource
    private IProjectService projectService;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    @Resource
    private ProjectZSCreateService zsCreateService;


    /**
     * 导出项目列表
     *
     * @param tProjProject 过滤条件
     * @return 下载对象
     */

    @Operation(summary = "导出项目列表")
    @PostMapping("/export")
    public FileDownloadVO exportTProjProject(@RequestBody TProjProject tProjProject) {
        return projectService.export(tProjProject);
    }

    /**
     * 项目列表分页查询
     *
     * @param pageable 分页参数
     * @return 分页结果
     */

    @Operation(summary = "项目列表")
    @PostMapping("/searchProjProject")
    @PageableQuery // 保持原自定义分页注解
    public PageableResult<TProjProject> searchProjProject(Pageable pageable, @RequestBody TProjProject tProjProject) {
        // 1. 构建查询条件 (调用 Service 的统一构建方法)
        // 查询当前人员权限
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);


        QueryWrapper queryWrapper = projectService.buildQueryWrapper(tProjProject);
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            queryWrapper.in("zone_code", zoneCodes);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            queryWrapper.in("town_code", townCodes);
        }
        // 判断是否是驻外机构
        String orgCode = UserInfoUtil.getOrgCode();
        if (ObjectUtils.isNotEmpty(orgCode)) {
            queryWrapper.in("investor_place", orgCode);
        }

        // 2. 执行分页查询, Page 对象传递 pageNumber 及 pageSize
        Page<TProjProject> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjProject> resultPage = tProjProjectService.page(page, queryWrapper);

        // 3. 返回封装结果
        return PageableResult.of(resultPage);
    }

    /**
     * 删除项目
     *
     * @param id 项目 ID
     */

    @Operation(summary = "删除项目")
    @DeleteMapping("/deleteTProjProject/{id}")
    public void deleteTProjProject(@PathVariable("id") String id) {
        TProjProject entity = tProjProjectService.getById(id);
        entity.setStatus("2");
        entity.setDeleted(true);
        tProjProjectService.updateById(entity);
    }

    /**
     * 查看项目
     *
     * @param id 项目 ID
     */

    @Operation(summary = "查看项目")
    @GetMapping("{id}")
    public TProjProject getTProjProjectById(@PathVariable("id") String id) {
        return tProjProjectService.getById(id);
    }

    /**
     * 保存或更新项目（原 updateOrSaveProjProj 逻辑）
     * 提取自老系统：根据是否有 id（或者等于0）决定新增还是修改。
     * 新增时，自动提取当前登录人补充 creator_id 和 creator_name
     */

    @Operation(summary = "保存或更新项目")
    @PostMapping("/updateOrSaveProjProj")
    public void updateOrSaveProjProj(@RequestBody TProjProject tProjProject) {
        if (ObjectUtils.isEmpty(tProjProject.getId())) {
            tProjProject.setId(String.valueOf(IdUtil.getSnowflakeNextId()));
            tProjProject.setCreatorId(getUserAccount().getId());
            tProjProject.setCreatorName(getUserAccount().getRealName());
            tProjProjectService.save(tProjProject);

        } else {
            // 使用 UpdateChain 精准更新前端传入的 20 多个字段（支持更新为 null，且不影响数据库中其他默认值）
            UpdateChain.of(TProjProject.class).set(TProjProject::getName, tProjProject.getName()).set(TProjProject::getInvestor, tProjProject.getInvestor()).set(TProjProject::getPType, tProjProject.getPType()).set(TProjProject::getInvestMoney, tProjProject.getInvestMoney()).set(TProjProject::getBuildingType, tProjProject.getBuildingType()).set(TProjProject::getBuyArea, tProjProject.getBuyArea()).set(TProjProject::getCityDesc, tProjProject.getCityDesc()).set(TProjProject::getCityProject, tProjProject.getCityProject()).set(TProjProject::getDesc, tProjProject.getDesc()).set(TProjProject::getDistrict, tProjProject.getDistrict()).set(TProjProject::getInvestorPlace, tProjProject.getInvestorPlace()).set(TProjProject::getPlaceInfo, tProjProject.getPlaceInfo()).set(TProjProject::getDistrictCode, tProjProject.getDistrictCode()).set(TProjProject::getFirstTime, tProjProject.getFirstTime()).set(TProjProject::getProgress, tProjProject.getProgress()).set(TProjProject::getProvincialProject, tProjProject.getProvincialProject()).set(TProjProject::getRentArea, tProjProject.getRentArea()).set(TProjProject::getRequestCityCoordination, tProjProject.getRequestCityCoordination()).set(TProjProject::getSjly, tProjProject.getSjly()).set(TProjProject::getUseArea, tProjProject.getUseArea()).set(TProjProject::getYearSs, tProjProject.getYearSs()).set(TProjProject::getYearXl, tProjProject.getYearXl()).set(TProjProject::getZoneCode, tProjProject.getZoneCode()).set(TProjProject::getZoneName, tProjProject.getZoneName()).where(TProjProject::getId).eq(tProjProject.getId()).update();
        }
        // 同步全生命周期
        zsCreateService.createZS(toXmJbxx(tProjProject));
    }

    /**
     * 转共享项目（原 toShare 逻辑）
     * 提取自老系统：更新当前项目状态，并将数据流转至共享项目库。
     */

    @Operation(summary = "转共享")
    @PostMapping("/toShare")
    public Boolean toShare(@RequestBody TProjectDTO dto) {
        return projectService.toShare(dto);
    }

    /**
     * TProjProject 转换为 XmJbxx
     * 根据SQL对应关系转换对应值
     *
     * @param tProjProject 招商项目实体
     * @return XmJbxx 项目基本信息
     */
    private XmJbxx toXmJbxx(TProjProject tProjProject) {
        XmJbxx xmJbxx = new XmJbxx();
        xmJbxx.setXmid(tProjProject.getId());
        // 所属板块 <- zone_name
        xmJbxx.setSsbk(tProjProject.getZoneName());
        // 项目属性 = '招商项目'
        xmJbxx.setXmsx("招商项目");
        // 项目内容 <- desc
        xmJbxx.setXmnr(tProjProject.getDesc());
        // 投资标识: p_type=1 则 '内资', 否则 '外资'
        xmJbxx.setTzbs(tProjProject.getPType() != null && tProjProject.getPType() == 1 ? "内资" : "外资");
        // 总投资额 <- invest_money (保留两位小数)
        if (tProjProject.getInvestMoney() != null) {
            try {
                xmJbxx.setInvestMoney(Math.round(Double.parseDouble(tProjProject.getInvestMoney()) * 100.0) / 100.0);
            } catch (NumberFormatException e) {
                xmJbxx.setInvestMoney(null);
            }
        }
        // 当前进度 = '在谈'
        xmJbxx.setDqjd("在谈");
        // 入库时间 <- create_time (通过反射或service获取，此处暂用null)
        // xmJbxx.setRksj(tProjProject.getCreateTime());
        // 项目评级: 同投资标识
        xmJbxx.setXmpj(tProjProject.getPType() != null && tProjProject.getPType() == 1 ? "内资" : "外资");
        // 项目进度描述 <- progress
        xmJbxx.setProgress(tProjProject.getProgress());
        // 到位资金总额(外资): p_type=2 时 invest_money/10000
        if (tProjProject.getPType() != null && tProjProject.getPType() == 2 && tProjProject.getInvestMoney() != null) {
            xmJbxx.setWzzje(Double.parseDouble(tProjProject.getInvestMoney()) / 10000.0);
        }
        // 年内到账资金(内资): p_type=1 时 invest_money
        if (tProjProject.getPType() != null && tProjProject.getPType() == 1 && tProjProject.getInvestMoney() != null) {
            xmJbxx.setNzzje(Double.parseDouble(tProjProject.getInvestMoney()));
        }
        // 项目名称 <- name
        xmJbxx.setProjectName(tProjProject.getName());
        // 区县 <- district
        xmJbxx.setDistrict(tProjProject.getDistrict());
        // 园区名称 <- zone_name
        xmJbxx.setPark(tProjProject.getZoneName());
        // 投资方名称 <- investor
        xmJbxx.setInvestor(tProjProject.getInvestor());
        // 项目简介 <- desc
        xmJbxx.setDesc(tProjProject.getDesc());
        // 资源来源 <- b_resource
        if (tProjProject.getBResource() != null) {
            xmJbxx.setBResource(tProjProject.getBResource());
        }
        // 市集机关名称 <- sjjg_name
        xmJbxx.setSjjgName(tProjProject.getSjjgName());
        // 状态 <- _status
        // xmJbxx.setStatus(tProjProject.getStatus());
        // 建筑类型: building_type=1 则 '租赁', =2 则 '购买'
        if (tProjProject.getBuildingType() != null) {
            if ("1".equals(tProjProject.getBuildingType())) {
                xmJbxx.setBuildingType("租赁");
            } else if ("2".equals(tProjProject.getBuildingType())) {
                xmJbxx.setBuildingType("购买");
            }
        }
        // 使用面积 <- use_area
        xmJbxx.setUseArea(tProjProject.getUseArea());
        // 租赁面积 <- rent_area
        xmJbxx.setRentArea(tProjProject.getRentArea());
        // 购买面积 <- buy_area
        xmJbxx.setBuyArea(tProjProject.getBuyArea());
        // 年度销量 <- year_xl
        xmJbxx.setYearXl(tProjProject.getYearXl());
        // 年度税收 <- year_ss
        xmJbxx.setYearSs(tProjProject.getYearSs());
        // 初次接洽时间 <- first_time
        xmJbxx.setFirstTime(tProjProject.getFirstTime());
        return xmJbxx;
    }
}
