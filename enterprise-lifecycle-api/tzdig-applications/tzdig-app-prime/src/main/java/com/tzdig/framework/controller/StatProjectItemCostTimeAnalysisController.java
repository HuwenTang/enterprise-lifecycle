package com.tzdig.framework.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.tzdig.framework.model.vo.ProjectItemCountVo;
import com.tzdig.framework.mybatis.bo.ProjectItemBo;
import com.tzdig.framework.mybatis.dao.ProjectStatDataDAO;
import com.tzdig.framework.util.QuarterDateUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

//项目审批
@Tag(name = "工改项目事项时间管理")
@RestController
@RequestMapping("stat-project-item-cost-time")
public class StatProjectItemCostTimeAnalysisController {

    @Autowired
    ProjectStatDataDAO projectStatDataDAO;

    public static BigDecimal calculateAvgCostTime(Long costTime, Long totalCount) {
        // 处理空值和除数为0的情况
        if (costTime == null || totalCount == null || totalCount <= 0) {
            return BigDecimal.ZERO;
        }

        // 转换为BigDecimal，1小时 = 3600秒
        BigDecimal costTimeBig = BigDecimal.valueOf(costTime);
        BigDecimal totalCountBig = BigDecimal.valueOf(totalCount);
        BigDecimal secondsPerHour = BigDecimal.valueOf(3600);

        // 计算：(总秒数 / 总次数) / 3600 = 平均小时数
        return costTimeBig.divide(totalCountBig, 4, RoundingMode.HALF_UP)  // 先保留4位小数避免精度丢失
                .divide(secondsPerHour, 2, RoundingMode.HALF_UP); // 最终保留2位小数
    }

    @Operation(summary = "项目审批概览")
    @GetMapping("/item-overview")
    public ProjectItemCountVo itemOverview() {
        LocalDateTime startTime = QuarterDateUtil.getCurrentQuarterStart();
        LocalDateTime endTime = QuarterDateUtil.getCurrentQuarterEnd();

        List<ProjectItemBo> totalList = projectStatDataDAO.queryProjectItemInfo(startTime, endTime);

        Map<String, Long> rsData = Maps.newHashMap();
        for (ProjectItemBo item : totalList) {
            rsData.put(item.getItemName(), item.getItemCount());
        }
        //施工图审查
        //环评
        //施工许可
        List<String> itemNames = Lists.newArrayList();
        itemNames.add("施工图审查");
        itemNames.add("环评");
        itemNames.add("能评");
        itemNames.add("施工许可");

        ProjectItemCountVo projectItemCountVo = new ProjectItemCountVo();
        for (String itemName : itemNames) {
            Long count = rsData.get(itemName);
            if (count != null) {
                if ("施工图审查".equals(itemName)) {
                    projectItemCountVo.setDrawingReviewCount(count);
                } else if ("环评".equals(itemName)) {
                    projectItemCountVo.setEnvAssessmentCount(count);
                } else if ("能评".equals(itemName)) {
                    projectItemCountVo.setEnergyAssessmentCount(count);
                } else if ("施工许可".equals(itemName)) {
                    projectItemCountVo.setConstructionPermitsCount(count);
                }
            }
        }
        return projectItemCountVo;
    }

//    @Operation(summary = "项目审批统计")
//    @GetMapping("/division-stat")
//    public List<ProjectDivisionItemCostVo> itemDivisionStat(ProjectItemStatQo projectItemStatQo) {
//        String year = projectItemStatQo.getYear();
//        String quarter = projectItemStatQo.getQuarter();
//        if (StringUtils.isEmpty(year)) {
//            year = LocalDateTime.now().getYear() + "";
//        }
//        if (StringUtils.isEmpty(quarter)) {
//            throw new NotFoundException("选择的季度不能为空");
//        }
//        LocalDateTime startTime = QuarterDateUtil.getQuarterStart(year, quarter);
//        LocalDateTime endTime = QuarterDateUtil.getQuarterEnd(year, quarter);
//
////        List<String> divisionList = Lists.newArrayList();
////        divisionList.add("321282000000");//靖江市321282000000
////        divisionList.add("321283000000");//泰兴市321283000000
////        divisionList.add("321281000000");//兴化市321281000000
////        divisionList.add("321202000000");//海陵区321202000000
////        divisionList.add("321203000000");//新高区321203000000
////        divisionList.add("321204000000");//姜堰区321204000000
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
//        List<String> itemNames = Lists.newArrayList();
//        itemNames.add("施工图审查");
//        itemNames.add("环评");
//        itemNames.add("能评");
//        itemNames.add("施工许可");
//
//        List<ProjectIteamNameCostTimeBo> projectIteamNameCostTimeBos = projectStatDataDAO.queryProjectIteamNameCostTimeByDateRange(startTime, endTime);
//        Map<String, List<ProjectIteamNameCostTimeBo>> divisionMap = Maps.newHashMap();
//        if (CollectionUtils.isNotEmpty(projectIteamNameCostTimeBos)) {
//            divisionMap = projectIteamNameCostTimeBos.stream().filter(bo -> {
//                        String administrativeDivision = bo.getAdministrativeDivision();
//                        return administrativeDivision != null && !administrativeDivision.trim().isEmpty();
//                    })
//                    .collect(Collectors.groupingBy(ProjectIteamNameCostTimeBo::getAdministrativeDivision));
//        }
//
//        List<ProjectDivisionItemCostVo> projectStageCountVos = Lists.newArrayList();
//        for (String division : divisionList) {
//            ProjectDivisionItemCostVo projectDivisionItemCostVo = new ProjectDivisionItemCostVo();
//            projectDivisionItemCostVo.setAdministrativeDivision(division);
//            projectDivisionItemCostVo.setDivisionTxt(this.convetDivisionToTxt(division));
//
//            List<ProjectIteamNameCostTimeBo> temp1 = divisionMap.get(division);
//            if (CollectionUtils.isNotEmpty(temp1)) {
//                Map<String, List<ProjectIteamNameCostTimeBo>> itemMap = Maps.newHashMap();
//
//                itemMap = temp1.stream().filter(bo -> {
//                            String temp = bo.getItemName();
//                            return temp != null && !temp.trim().isEmpty();
//                        })
//                        .collect(Collectors.groupingBy(ProjectIteamNameCostTimeBo::getItemName));
//
//                for (String itemName : itemNames) {
//                    List<ProjectIteamNameCostTimeBo> list = itemMap.get(itemName);
//                    Long statusFinshCount = 0L;
//                    Long statusApplyCount = 0L;
//                    Long costTime = 0L;
//                    if (CollectionUtils.isNotEmpty(list)) {
//                        for (ProjectIteamNameCostTimeBo projectIteamNameCostTimeBo : list) {
//                            if ("1".equals(projectIteamNameCostTimeBo.getDocStatus())) {
//                                statusFinshCount += projectIteamNameCostTimeBo.getItemCount();
//                            } else {
//                                statusApplyCount += projectIteamNameCostTimeBo.getItemCount();
//                            }
//                            costTime += projectIteamNameCostTimeBo.getSpendTime();
//                        }
//                    }
//                    Long totalCount = statusFinshCount + statusApplyCount;
//                    BigDecimal avgCostTime = calculateAvgCostTime(costTime, totalCount);
//
//
//                    if ("施工图审查".equals(itemName)) {
//                        projectDivisionItemCostVo.setDrawingReviewFinishCount(statusFinshCount);
//                        projectDivisionItemCostVo.setDrawingReviewSubmitCount(statusApplyCount);
//                        projectDivisionItemCostVo.setAvgDrawingReviewCostTime(avgCostTime);
//
//                    } else if ("环评".equals(itemName)) {
//                        projectDivisionItemCostVo.setEnvAssessmentFinishCount(statusFinshCount);
//                        projectDivisionItemCostVo.setEnvAssessmentSubmitCount(statusApplyCount);
//                        projectDivisionItemCostVo.setAvgEnvAssessmentCostTime(avgCostTime);
//                    } else if ("能评".equals(itemName)) {
//
//                        projectDivisionItemCostVo.setEnergyAssessmentFinishCount(statusFinshCount);
//                        projectDivisionItemCostVo.setEnergyAssessmentSubmitCount(statusApplyCount);
//                        projectDivisionItemCostVo.setAvgEnergyAssessmentCostTime(avgCostTime);
//
//                    } else if ("施工许可".equals(itemName)) {
//                        projectDivisionItemCostVo.setConstructionPermitsCount(totalCount);
////                        projectDivisionItemCostVo.setConstructionPermitsSubmitCount(statusApplyCount);
////                        projectDivisionItemCostVo.setAvgConstructionPermitsCostTime(avgCostTime);
//                    }
//                }
//
//            }
//
//            projectStageCountVos.add(projectDivisionItemCostVo);
//        }
//
//        return projectStageCountVos;
//    }
//
////    @Operation(summary = "项目审批园区统计")
////    @GetMapping("/park-stat")
////    public List<ProjectDivisionItemCostVo> itemParkStat(ProjectItemStatQo projectItemStatQo) {
////        String year = projectItemStatQo.getYear();
////        String quarter = projectItemStatQo.getQuarter();
////        if (StringUtils.isEmpty(year)) {
////            year = LocalDateTime.now().getYear() + "";
////        }
////        if (StringUtils.isEmpty(quarter)) {
////            throw new NotFoundException("选择的季度不能为空");
////        }
////        LocalDateTime startTime = QuarterDateUtil.getQuarterStart(year, quarter);
////        LocalDateTime endTime = QuarterDateUtil.getQuarterEnd(year, quarter);
////
////
////        List<String> itemNames = Lists.newArrayList();
////        itemNames.add("施工图审查");
////        itemNames.add("环评");
////        itemNames.add("能评");
////        itemNames.add("施工许可");
////
////        List<ProjectIteamNameCostTimeBo> projectIteamNameCostTimeBos = projectStatDataDAO.queryParkIteamNameCostTimeByDateRange(startTime, endTime, projectItemStatQo.getAdministrativeDivision());
////
////        Map<String, List<ProjectIteamNameCostTimeBo>> parkDataMap = Maps.newHashMap();
////        if (CollectionUtils.isNotEmpty(projectIteamNameCostTimeBos)) {
////            parkDataMap = projectIteamNameCostTimeBos.stream().filter(bo -> {
////                        String park = bo.getPark();
////                        return park != null && !park.trim().isEmpty();
////                    })
////                    .collect(Collectors.groupingBy(ProjectIteamNameCostTimeBo::getPark));
////        }
////
////        List<AreaInfoBo> allAreaInfo = projectStatDataDAO.findAllAreaInfo();
////        Map<String, String> areaNameToCodeMap = allAreaInfo.stream()
////                .collect(Collectors.toMap(
////                        AreaInfoBo::getId,    // 键：区域名称
////                        AreaInfoBo::getName,    // 值：区域编码
////                        (existing, replacement) -> existing  // 名称重复时保留第一个
////                ));
////
////        List<ProjectDivisionItemCostVo> projectStageCountVos = Lists.newArrayList();
////        for (Map.Entry<String, List<ProjectIteamNameCostTimeBo>> entry : parkDataMap.entrySet()) {
////            String parkKey = entry.getKey(); // 获取园区标识（键）
////            List<ProjectIteamNameCostTimeBo> projectList = entry.getValue(); // 获取该园区的项目列表（值）
////            ProjectDivisionItemCostVo projectDivisionItemCostVo = new ProjectDivisionItemCostVo();
////            projectDivisionItemCostVo.setPark(parkKey);
////            projectDivisionItemCostVo.setParkTxt(areaNameToCodeMap.get(parkKey));
////            if (StringUtils.isEmpty(projectDivisionItemCostVo.getParkTxt())) {
////                projectDivisionItemCostVo.setParkTxt(projectDivisionItemCostVo.getPark());//如果为空则设置为原来的park
////            }
////            if (CollectionUtils.isNotEmpty(projectList)) {
////
////                projectDivisionItemCostVo.setAdministrativeDivision(projectList.get(0).getAdministrativeDivision());
////                projectDivisionItemCostVo.setDivisionTxt(this.convetDivisionToTxt(projectDivisionItemCostVo.getAdministrativeDivision()));
////
////                Map<String, List<ProjectIteamNameCostTimeBo>> itemMap = Maps.newHashMap();
////
////                itemMap = projectList.stream().filter(bo -> {
////                            String temp = bo.getItemName();
////                            return temp != null && !temp.trim().isEmpty();
////                        })
////                        .collect(Collectors.groupingBy(ProjectIteamNameCostTimeBo::getItemName));
////
////                for (String itemName : itemNames) {
////                    List<ProjectIteamNameCostTimeBo> list = itemMap.get(itemName);
////                    Long statusFinshCount = 0L;
////                    Long statusApplyCount = 0L;
////                    Long costTime = 0L;
////                    if (CollectionUtils.isNotEmpty(list)) {
////                        for (ProjectIteamNameCostTimeBo projectIteamNameCostTimeBo : list) {
////                            if ("1".equals(projectIteamNameCostTimeBo.getDocStatus())) {
////                                statusFinshCount += projectIteamNameCostTimeBo.getItemCount();
////                            } else {
////                                statusApplyCount += projectIteamNameCostTimeBo.getItemCount();
////                            }
////                            costTime += projectIteamNameCostTimeBo.getSpendTime();
////                        }
////                    }
////                    Long totalCount = statusFinshCount + statusApplyCount;
////                    BigDecimal avgCostTime = calculateAvgCostTime(costTime, totalCount);
////
////
////                    if ("施工图审查".equals(itemName)) {
////                        projectDivisionItemCostVo.setDrawingReviewFinishCount(statusFinshCount);
////                        projectDivisionItemCostVo.setDrawingReviewSubmitCount(statusApplyCount);
////                        projectDivisionItemCostVo.setAvgDrawingReviewCostTime(avgCostTime);
////
////                    } else if ("环评".equals(itemName)) {
////                        projectDivisionItemCostVo.setEnvAssessmentFinishCount(statusFinshCount);
////                        projectDivisionItemCostVo.setEnvAssessmentSubmitCount(statusApplyCount);
////                        projectDivisionItemCostVo.setAvgEnvAssessmentCostTime(avgCostTime);
////                    } else if ("能评".equals(itemName)) {
////
////                        projectDivisionItemCostVo.setEnergyAssessmentFinishCount(statusFinshCount);
////                        projectDivisionItemCostVo.setEnergyAssessmentSubmitCount(statusApplyCount);
////                        projectDivisionItemCostVo.setAvgEnergyAssessmentCostTime(avgCostTime);
////
////                    } else if ("施工许可".equals(itemName)) {
////                        projectDivisionItemCostVo.setConstructionPermitsCount(totalCount);
//////                        projectDivisionItemCostVo.setConstructionPermitsSubmitCount(statusApplyCount);
//////                        projectDivisionItemCostVo.setAvgConstructionPermitsCostTime(avgCostTime);
////                    }
////                }
////
////            }
////
////            projectStageCountVos.add(projectDivisionItemCostVo);
////
////        }
////        List<ProjectDivisionItemCostVo> sortedList = projectStageCountVos.stream()
////                .sorted(Comparator.comparing(
////                        ProjectDivisionItemCostVo::getAdministrativeDivision,
//                        Comparator.nullsLast(String::compareTo)  // 空值在后
//                ))
//                .collect(Collectors.toList());
//
//        return sortedList;
//    }
}
