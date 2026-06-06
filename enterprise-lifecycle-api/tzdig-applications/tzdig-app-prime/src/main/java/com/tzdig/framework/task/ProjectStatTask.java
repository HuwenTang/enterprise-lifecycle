package com.tzdig.framework.task;

import com.google.common.collect.Sets;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.row.Db;
import com.tzdig.framework.core.annotation.CustomJob;
import com.tzdig.framework.mybatis.bo.InvestDistrictParkBO;
import com.tzdig.framework.mybatis.bo.ProjectStageStatBo;
import com.tzdig.framework.mybatis.dao.ProjectConstructionApprovalDAO;
import com.tzdig.framework.mybatis.dao.ProjectStatDataDAO;
import com.tzdig.framework.mybatis.entity.prime.*;
import com.tzdig.framework.mybatis.mapper.prime.ProjectConstructionApprovalProcessMapper;
import com.tzdig.framework.mybatis.mapper.prime.ProjectInvestmentXConstructionApprovalMapper;
import com.tzdig.framework.mybatis.mapper.prime.StatProjectItemCostTimeMapper;
import com.tzdig.framework.mybatis.mapper.prime.StatProjectStageMapper;
import com.tzdig.framework.service.ProjectConstructionApprovalService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.cursor.Cursor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class ProjectStatTask {
    private static final List<String> itemNameList = new ArrayList<>(7);

    static {
        //施工图审查：  施工图设计文件审查
        itemNameList.add("施工图设计文件审查");
        //环评：   辐射建设项目环境影响评价文件审批、建设项目环境影响评价文件审批（不含入海排污口设置审批，不含辐射建设项目）
        itemNameList.add("辐射建设项目环境影响评价文件审批");
        itemNameList.add("建设项目环境影响评价文件审批（不含入海排污口设置审批，不含辐射建设项目）");
        //能评：  固定资产投资项目节能审查（发改委）、固定资产投资项目节能审查（工信部）
        itemNameList.add("固定资产投资项目节能审查（发改委）");
        itemNameList.add("固定资产投资项目节能审查（工信部）");
        //施工许可： 建筑工程施工许可证的发放、建筑工程施工许可证的发放(含质量、安全监督手续）
        itemNameList.add("建筑工程施工许可证的发放");
        itemNameList.add("建筑工程施工许可证的发放(含质量、安全监督手续）");
    }

    @Autowired
    private ProjectInvestmentXConstructionApprovalMapper projectInvestmentXConstructionApprovalMapper;
    @Autowired
    private ProjectConstructionApprovalDAO projectConstructionApprovalDAO;
    @Autowired
    private ProjectStatDataDAO projectStatDataDAO;
    @Autowired
    private StatProjectStageMapper statProjectStageMapper;
    @Autowired
    private StatProjectItemCostTimeMapper statProjectItemCostTimeMapper;
    @Autowired
    private ProjectConstructionApprovalProcessMapper projectConstructionApprovalProcessMapper;
    @Autowired
    private ProjectConstructionApprovalService projectConstructionApprovalService;

    @Transactional
    @Operation(summary = "统计项目备案审批信息")
    @Scheduled(cron = "0 30 7,13 * * ?")
    public void statProjectInfo() {
        log.info("开始统计项目统计信息");
        statProjectStage();
        statProjectItemCostTime();
        log.info("完成统计项目统计信息");
    }

    @CustomJob
    public void statProjectStage() {
        //项目所处阶段统计
        val statProjectStageRecords = new HashMap<String, StatProjectStage>();
        Db.tx(() -> {
            try (val dataList = projectInvestmentXConstructionApprovalMapper.selectCursorByQuery(new QueryWrapper())) {
                for (val projectInvestmentXConstructionApproval : dataList) {
                    ProjectConstructionApproval approvalInfo = projectConstructionApprovalService.getProjectConstructionApprovalById(projectInvestmentXConstructionApproval.getConstructionApprovalId());
                    if (approvalInfo == null) continue;

                    String stage = projectConstructionApprovalService.getProjectConstructionApprovalStage(approvalInfo.getProjectCode()) + "";
                    String stageTxt = this.convertTxt(stage);

                    InvestDistrictParkBO projectBelong = projectStatDataDAO.queryDistrictParkUseInvestmentId(projectInvestmentXConstructionApproval.getInvestmentId());//市区园区信息
                    List<ProjectStageStatBo> projectStageStatBoList = projectConstructionApprovalDAO.getProjectStageStatBo(approvalInfo.getProjectCode());
                    List<ProjectStageStatBo> result1 = projectStageStatBoList.stream()
                            .filter(temp -> temp.getStage() != null && temp.getStage().equals(stageTxt))
//                        .sorted(Comparator.comparing(ProjectStageStatBo::getCreateTime))
                            .toList();
                    LocalDateTime stageTime = CollectionUtils.isNotEmpty(result1) ? result1.getFirst().getCreateTime() : null;
                    val record = new StatProjectStage();
                    record.setConstructionApprovalId(projectInvestmentXConstructionApproval.getConstructionApprovalId());
                    record.setProjectCode(approvalInfo.getProjectCode());
                    record.setDistrict(projectBelong != null ? projectBelong.getDistrict() : null);
                    record.setPark(projectBelong != null ? projectBelong.getPark() : null);
                    record.setStage(stage);
                    record.setStageCreateTime(stageTime);
                    statProjectStageRecords.put(projectInvestmentXConstructionApproval.getConstructionApprovalId(), record);
                }
                projectStatDataDAO.truncateTableStatProjectStage();
                statProjectStageMapper.insertBatch(statProjectStageRecords.values(), 1000);
                return true;
            } catch (IOException e) {
                log.error("统计项目申报信息 error:{}", e.getMessage(), e);
                return false;
            }
        });
    }

    @CustomJob
    public void statProjectItemCostTime() {
        //项目步骤审批时间
        val statProjectItemCostTimeRecords = new HashMap<String, StatProjectItemCostTime>();
        Db.tx(() -> {
            try (Cursor<ProjectInvestmentXConstructionApproval> dataList = projectInvestmentXConstructionApprovalMapper.selectCursorByQuery(new QueryWrapper())) {
                for (val projectInvestmentXConstructionApproval : dataList) {
                    ProjectConstructionApproval projectInfo = projectConstructionApprovalService.getProjectConstructionApprovalById(projectInvestmentXConstructionApproval.getConstructionApprovalId());
                    if (projectInfo == null) continue;

                    List<String> docNumberList = projectConstructionApprovalDAO.getProjectDocumentNumber(projectInfo.getProjectCode(), itemNameList);
                    if (docNumberList.isEmpty()) continue;

                    QueryWrapper queryWrapper = new QueryWrapper();
                    queryWrapper.in(ProjectConstructionApprovalProcess::getDocumentNumber, docNumberList);
                    List<ProjectConstructionApprovalProcess> rsList = projectConstructionApprovalProcessMapper.selectListByQuery(queryWrapper);
                    if (rsList.isEmpty()) continue;

                    InvestDistrictParkBO projectBelong = projectStatDataDAO.queryDistrictParkUseInvestmentId(projectInvestmentXConstructionApproval.getInvestmentId());//市区园区信息
                    Map<String, List<ProjectConstructionApprovalProcess>> docNumberMap = rsList.stream().collect(Collectors.groupingBy(ProjectConstructionApprovalProcess::getDocumentNumber));
                    for (Map.Entry<String, List<ProjectConstructionApprovalProcess>> entry : docNumberMap.entrySet()) {
                        String documentNumber = entry.getKey(); // 获取文档编号（键）
                        String hashKey = projectInvestmentXConstructionApproval.getConstructionApprovalId() + ':' + documentNumber;
                        if (statProjectItemCostTimeRecords.containsKey(hashKey)) {
                            log.warn("重复的key: {}", hashKey);
                        }
                        List<ProjectConstructionApprovalProcess> processes = entry.getValue(); // 获取对应的流程列表（值）
                        String itemName = projectConstructionApprovalDAO.getItemNameOfDocumentNumber(documentNumber);
                        itemName = this.convertItemNameToShowData(itemName);

                        LocalDateTime startTime = null;
                        long spendTime = 0L;
                        String status = "0";//未完成
                        if (!processes.isEmpty()) {
                            // 按时间正序排序（从早到晚）
                            processes.sort(Comparator.comparing(ProjectConstructionApprovalProcess::getFinishTime));
                            @NotNull ProjectConstructionApprovalProcess startData = processes.getFirst();
                            @NotNull ProjectConstructionApprovalProcess endData = processes.getLast();
                            if (startData.getFinishTime() != null) {
                                startTime = startData.getFinishTime();
                            }
                            if (startTime != null && endData.getFinishTime() != null) {
                                spendTime = ChronoUnit.SECONDS.between(startTime, endData.getFinishTime());
                            }
                            Set<String> statusSet = Sets.newHashSet();
                            for (ProjectConstructionApprovalProcess process : processes) {
                                statusSet.add(process.getStatus());
                            }
                            if (statusSet.contains("办结")) {
                                status = "1";
                            }
                        }

                        StatProjectItemCostTime record = new StatProjectItemCostTime();
                        record.setConstructionApprovalId(projectInvestmentXConstructionApproval.getConstructionApprovalId());
                        record.setProjectCode(projectInfo.getProjectCode());
                        if (projectBelong != null) {
                            record.setDistrict(projectBelong.getDistrict());
                            record.setPark(projectBelong.getPark());
                        }
                        record.setDocumentNumber(documentNumber);
                        record.setItemName(itemName);
                        record.setDocStatus(status);
                        record.setSpendTime(spendTime);
                        record.setStartTime(startTime);
                        statProjectItemCostTimeRecords.put(hashKey, record);
                    }
                }
                projectStatDataDAO.truncateTableStatProjectItemCostTime();
                statProjectItemCostTimeMapper.insertBatch(statProjectItemCostTimeRecords.values(), 1000);
                return true;
            } catch (IOException e) {
                log.error("统计项目申报信息 error:{}", e.getMessage(), e);
                return false;
            }
        });
    }

    private String convertItemNameToShowData(String itemName) {
        if (StringUtils.isEmpty(itemName)) {
            return null;
        }
        return switch (itemName) {
            case "施工图设计文件审查" -> "施工图审查";
            case "辐射建设项目环境影响评价文件审批",
                 "建设项目环境影响评价文件审批（不含入海排污口设置审批，不含辐射建设项目）" -> "环评";
            case "固定资产投资项目节能审查（发改委）", "固定资产投资项目节能审查（工信部）" -> "能评";
            case "建筑工程施工许可证的发放", "建筑工程施工许可证的发放(含质量、安全监督手续）" -> "施工许可";
            default -> null;
        };
    }

    private String convertTxt(String stage) {
        if (StringUtils.isEmpty(stage)) {
            return null;
        }
        return switch (stage) {
            case "4" -> "竣工验收阶段";
            case "3" -> "施工许可阶段";
            case "2" -> "工程建设许可阶段";
            case "1" -> "立项用地规划许可阶段";
            default -> "0";
        };
    }
}
