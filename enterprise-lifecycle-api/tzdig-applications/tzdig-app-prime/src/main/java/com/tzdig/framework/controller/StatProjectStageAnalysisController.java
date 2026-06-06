package com.tzdig.framework.controller;


import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.tzdig.framework.model.vo.ProjectStageCountVo;
import com.tzdig.framework.mybatis.bo.ProjectStatOverviewStatBo;
import com.tzdig.framework.mybatis.dao.ProjectStatDataDAO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//项目备案情况
@Tag(name = "工改项目阶段统计分析")
@RestController
@RequestMapping("stat-project-stage")
public class StatProjectStageAnalysisController {
    @Autowired
    ProjectStatDataDAO projectStatDataDAO;

    @Operation(summary = "项目备案概览")
    @GetMapping("/stage-overview")
    public ProjectStageCountVo stageOverview() {
        List<ProjectStatOverviewStatBo> totalList = projectStatDataDAO.stageOverView();
        Map<String, List<ProjectStatOverviewStatBo>> stageToBoListMap = Maps.newHashMap();
        if (CollectionUtils.isNotEmpty(totalList)) {
            stageToBoListMap = totalList.stream()
                    .collect(Collectors.groupingBy(ProjectStatOverviewStatBo::getStage));
        }
        List<String> stageList = Lists.newArrayList();
        stageList.add("1");
        stageList.add("2");
        stageList.add("3");
        stageList.add("4");
        ProjectStageCountVo projectStageCountVo = new ProjectStageCountVo();
        for (String stage : stageList) {
            List<ProjectStatOverviewStatBo> list = stageToBoListMap.get(stage);
            ProjectStatOverviewStatBo projectStatOverviewStatBo;
            if (CollectionUtils.isNotEmpty(list)) {
                projectStatOverviewStatBo = list.getFirst();
            } else {
                projectStatOverviewStatBo = new ProjectStatOverviewStatBo();
                projectStatOverviewStatBo.setStageCount(0L);
            }

            if ("1".equals(stage)) {
                projectStageCountVo.setStageApprovalCount(projectStatOverviewStatBo.getStageCount());
            } else if ("2".equals(stage)) {
                projectStageCountVo.setStageECCount(projectStatOverviewStatBo.getStageCount());
            } else if ("3".equals(stage)) {
                projectStageCountVo.setStagePermitStageCount(projectStatOverviewStatBo.getStageCount());
            } else if ("4".equals(stage)) {
                projectStageCountVo.setStageCompleted(projectStatOverviewStatBo.getStageCount());
            }
        }
        return projectStageCountVo;
    }

//    @Operation(summary = "项目备案按市区统计")
//    @GetMapping("/stage-division")
//    public List<ProjectStageCountVo> stageDivisionOverview(ProjectStatQo projectStatQo) {
//
//        if (projectStatQo == null || StringUtils.isEmpty(projectStatQo.getMonth())) {
//            throw new NotFoundException("month不能为空");
//        }
//        LocalDateTime monthStart = null;
//        LocalDateTime monthEnd = null;
//        if (!"all".equals(projectStatQo.getMonth())) {
//            LocalDateTime queryDate = LocalDateTime.now();
//            if (projectStatQo != null && StringUtils.isNotBlank(projectStatQo.getMonth())) {
//                queryDate = LocalDateTime.parse(projectStatQo.getMonth() + "-01T00:00:00",
//                        DateTimeFormatter.ISO_LOCAL_DATE_TIME);
//            }
//            monthStart = queryDate.with(TemporalAdjusters.firstDayOfMonth())
//                    .withHour(0)
//                    .withMinute(0)
//                    .withSecond(0)
//                    .withNano(0);
//            monthEnd = queryDate.with(TemporalAdjusters.lastDayOfMonth())
//                    .withHour(23)
//                    .withMinute(59)
//                    .withSecond(59)
//                    .withNano(999_999_999);
//        }
//
//
//        List<ProjectStatOverviewStatBo> totalList = projectStatDataDAO.stageOverViewByTimeRangeGroupByDivision(monthStart, monthEnd);
//        Map<String, List<ProjectStatOverviewStatBo>> divisionMap = Maps.newHashMap();
//        if (CollectionUtils.isNotEmpty(totalList)) {
//            divisionMap = totalList.stream().filter(bo -> {
//                        String division = bo.getAdministrativeDivision();
//                        // 过滤条件：不为 null 且不是空字符串（可根据需求调整）
//                        return division != null && !division.trim().isEmpty();
//                    })
//                    .collect(Collectors.groupingBy(ProjectStatOverviewStatBo::getAdministrativeDivision));
//        }
//
//
//        List<String> divisionList = Lists.newArrayList();
//        divisionList.add(AreaConstant.JINGJIANG_CODE);//靖江市321282000000
//        divisionList.add(AreaConstant.TAIXING_CODE);//泰兴市321283000000
//        divisionList.add(AreaConstant.XINGHUA_CODE);//兴化市321281000000
//        divisionList.add(AreaConstant.HAILING_CODE);//海陵区321202000000
//        divisionList.add(AreaConstant.XINGAO_CODE);//新高区321203000000
//        divisionList.add(AreaConstant.JIANGYAN_CODE);//姜堰区321204000000
//
//

    /// /        divisionList.add("321282000000");//靖江市321282000000
    /// /        divisionList.add("321283000000");//泰兴市321283000000
    /// /        divisionList.add("321281000000");//兴化市321281000000
    /// /        divisionList.add("321202000000");//海陵区321202000000
    /// /        divisionList.add("321203000000");//新高区321203000000
    /// /        divisionList.add("321204000000");//姜堰区321204000000
//
//        List<String> stageList = Lists.newArrayList();
//        stageList.add("1");
//        stageList.add("2");
//        stageList.add("3");
//        stageList.add("4");
//
//        List<ProjectStageCountVo> projectStageCountVoList = Lists.newArrayList();
//        for (String division : divisionList) {
//            List<ProjectStatOverviewStatBo> divisionItemList = divisionMap.get(division);
//
//            Map<String, List<ProjectStatOverviewStatBo>> divisionStageMap = Maps.newHashMap();
//            if (CollectionUtils.isNotEmpty(divisionItemList)) {
//                divisionStageMap = divisionItemList.stream()
//                        .collect(Collectors.groupingBy(ProjectStatOverviewStatBo::getStage));
//            }
//            ProjectStageCountVo projectStageCountVo = this.getTempStageData(divisionStageMap, stageList);
//            projectStageCountVo.setDistrict(division);
//            projectStageCountVoList.add(projectStageCountVo);
//        }
//
//
//        return projectStageCountVoList;
//    }
//    @Operation(summary = "项目备案按园区统计")
//    @GetMapping("/stage-park")
//    public List<ProjectStageCountVo> stageparkOverview(ProjectStatQo projectStatQo) {
//        if (projectStatQo == null || StringUtils.isEmpty(projectStatQo.getMonth())) {
//            throw new NotFoundException("month不能为空");
//        }
//        LocalDateTime monthStart = null;
//        LocalDateTime monthEnd = null;
//        if (!"all".equals(projectStatQo.getMonth())) {
//            LocalDateTime queryDate = LocalDateTime.now();
//            if (projectStatQo != null && StringUtils.isNotBlank(projectStatQo.getMonth())) {
//                queryDate = LocalDateTime.parse(projectStatQo.getMonth() + "-01T00:00:00",
//                        DateTimeFormatter.ISO_LOCAL_DATE_TIME);
//            }
//            monthStart = queryDate.with(TemporalAdjusters.firstDayOfMonth())
//                    .withHour(0)
//                    .withMinute(0)
//                    .withSecond(0)
//                    .withNano(0);
//            monthEnd = queryDate.with(TemporalAdjusters.lastDayOfMonth())
//                    .withHour(23)
//                    .withMinute(59)
//                    .withSecond(59)
//                    .withNano(999_999_999);
//        }
//
//        List<ProjectStatOverviewStatBo> totalList = projectStatDataDAO.stageOverViewByTimeRangeGroupByPark(monthStart, monthEnd, projectStatQo.getAdministrativeDivision());
//        Map<String, List<ProjectStatOverviewStatBo>> parkMap = Maps.newHashMap();
//        if (CollectionUtils.isNotEmpty(totalList)) {
//            parkMap = totalList.stream().filter(bo -> {
//                        String park = bo.getPark();
//                        // 过滤条件：不为 null 且不是空字符串（可根据需求调整）
//                        return park != null && !park.trim().isEmpty();
//                    })
//                    .collect(Collectors.groupingBy(ProjectStatOverviewStatBo::getPark));
//        }
//        List<String> stageList = Lists.newArrayList();
//        stageList.add("1");
//        stageList.add("2");
//        stageList.add("3");
//        stageList.add("4");
//
//        List<AreaInfoBo> allAreaInfo = projectStatDataDAO.findAllAreaInfo();
//        Map<String, String> areaNameToCodeMap = allAreaInfo.stream()
//                .collect(Collectors.toMap(
//                        AreaInfoBo::getId,    // 键：区域名称
//                        AreaInfoBo::getName,    // 值：区域编码
//                        (existing, replacement) -> existing  // 名称重复时保留第一个
//                ));
//
//        List<ProjectStageCountVo> projectStageCountVoList = Lists.newArrayList();
//
//        for (Map.Entry<String, List<ProjectStatOverviewStatBo>> entry : parkMap.entrySet()) {
//            String parkKey = entry.getKey(); // 获取园区标识（键）
//            List<ProjectStatOverviewStatBo> projectList = entry.getValue(); // 获取该园区的项目列表（值）
//
//            Map<String, List<ProjectStatOverviewStatBo>> divisionStageMap = Maps.newHashMap();
//            if (CollectionUtils.isNotEmpty(projectList)) {
//                divisionStageMap = projectList.stream()
//                        .collect(Collectors.groupingBy(ProjectStatOverviewStatBo::getStage));
//
//                ProjectStageCountVo projectStageCountVo = this.getTempStageData(divisionStageMap, stageList);
//                projectStageCountVo.setDistrict(projectList.get(0).getAdministrativeDivision());
//                projectStageCountVo.setPark(parkKey);
//                projectStageCountVo.setPark(parkKey);
//
//                projectStageCountVoList.add(projectStageCountVo);
//            }
//
//        }
//        List<ProjectStageCountVo> sortedList = projectStageCountVoList.stream()
//                .sorted(Comparator.comparing(
//                        ProjectStageCountVo::getDistrict,
//                        Comparator.nullsLast(String::compareTo)  // 空值在后
//                ))
//                .collect(Collectors.toList());
//
//        return sortedList;
//    }
}
