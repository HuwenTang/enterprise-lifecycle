package com.tzdig.framework.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.common.ConditionTypeEnum;
import com.tzdig.framework.mybatis.dto.HalfYearProjectReqDTO;
import com.tzdig.framework.mybatis.dto.KeyZoneAndQxScoreReqDTO;
import com.tzdig.framework.mybatis.dto.StatisticsSignedProjectReqDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TBizZone;
import com.tzdig.framework.mybatis.entity.zsxt.TCommonDept;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import com.tzdig.framework.mybatis.entity.zsxt.TProjType;
import com.tzdig.framework.mybatis.mapper.zsxt.*;
import com.tzdig.framework.mybatis.vo.*;
import com.tzdig.framework.service.IStatisticsService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;


@Service
public class StatisticsServiceImpl implements IStatisticsService {

    @Resource
    private TProjProjectSignedMapper signedMapper;

    @Resource
    private TCommonDeptMapper deptMapper;

    @Resource
    private TBizZoneMapper zoneMapper;

    @Resource
    private TProjTypeMapper projTypeMapper;

    @Resource
    private StatisticsMapper statisticsMapper;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public List<SignedProjectInfoVO> statisticsSignedProjectInfo(StatisticsSignedProjectReqDTO reqDTO) {
        Integer rmb = 0;
        Integer doller = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            doller = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            doller = e.getDollar();
        }


        // 处理日期
        LocalDate currStartDate = LocalDate.parse(reqDTO.getCurrStartDate(), DATE_FORMATTER);
        LocalDate currEndDate = LocalDate.parse(reqDTO.getCurrEndDate(), DATE_FORMATTER);
        LocalDate lastYearStartDate = reqDTO.getLastYearStartDate() != null ? LocalDate.parse(reqDTO.getLastYearStartDate(), DATE_FORMATTER) : currStartDate.minusYears(1);
        LocalDate lastYearEndDate = reqDTO.getLastYearEndDate() != null ? LocalDate.parse(reqDTO.getLastYearEndDate(), DATE_FORMATTER) : currEndDate.minusYears(1);

        // 调用mapper获取数据
        List<SignedProjectInfoVO> records = statisticsMapper.statisticsSignedProjectInfo(null, currStartDate, currEndDate, lastYearStartDate, lastYearEndDate, rmb, doller);

        if (CollUtil.isNotEmpty(records)) {
            // 计算出全市汇总
            SignedProjectInfoVO cityTotal = calculateCityTotal(records, "全市", "3212");
            records.add(cityTotal);
        }
        return records;
    }

    @Override
    public List<SignedProjectInfoVO> statisticsSignedProjectInfoYq(StatisticsSignedProjectReqDTO reqDTO) {
        // 查询当前人员权限
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(getUserAccount().getId());
        Integer rmb = 0;
        Integer doller = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            doller = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            doller = e.getDollar();
        }

        // 处理日期
        LocalDate currStartDate = LocalDate.parse(reqDTO.getStartDate(), DATE_FORMATTER);
        LocalDate currEndDate = LocalDate.parse(reqDTO.getEndDate(), DATE_FORMATTER);
        LocalDate lastYearStartDate = reqDTO.getLastYearStartDate() != null ? LocalDate.parse(reqDTO.getLastYearStartDate(), DATE_FORMATTER) : currStartDate.minusYears(1);
        LocalDate lastYearEndDate = reqDTO.getLastYearEndDate() != null ? LocalDate.parse(reqDTO.getLastYearEndDate(), DATE_FORMATTER) : currEndDate.minusYears(1);

        // 调用mapper获取数据
        List<SignedProjectInfoVO> records = statisticsMapper.statisticsSignedProjectInfoYq(zoneCodes.get(0), currStartDate, currEndDate, lastYearStartDate, lastYearEndDate, rmb, doller);

        if (CollUtil.isNotEmpty(records)) {
            // 计算出全市（区）汇总
            SignedProjectInfoVO cityTotal = calculateCityTotal(records, "全市（区）", zoneCodes.get(0) != null ? zoneCodes.get(0) : "3212");
            records.add(cityTotal);
        }
        return records;
    }

    @Override
    public HalfYearProjectInfoVO statisticsHalfYearProjInfo(HalfYearProjectReqDTO reqDTO) {
        String currStartDate = reqDTO.getCurrStartDate();
        String currEndDate = reqDTO.getCurrEndDate();

        ConditionTypeEnum e = ConditionTypeEnum.ONE_HUNDRED_MILLION;

        // 调用statisticsXmzyxx查询获取全市汇总数据
        HalfYearProjectInfoVO result = statisticsMapper.statisticsXmzyxx(currStartDate, currEndDate);


        // 4 重点园区1亿（1000万美元）项目数量
        KeyZoneProjInfoVO fourthDto = statisticsMapper.statisticsKeyZoneProjInfo(currStartDate, currEndDate, e.getRmb(), e.getDollar());
        if (fourthDto != null) {
            long keyZoneProjNums = (fourthDto.getNzProjNums() != null ? fourthDto.getNzProjNums() : 0) + (fourthDto.getWzProjNums() != null ? fourthDto.getWzProjNums() : 0);
            double keyZoneTz = Math.round(((fourthDto.getNzTz() != null ? fourthDto.getNzTz() : 0) + (fourthDto.getWzTz() != null ? fourthDto.getWzTz() : 0)) * 100.0) / 100.0;
            result.setKeyZoneProjNums(keyZoneProjNums);
            result.setKeyZoneTz(keyZoneTz);

            // 重点园区项目占比
            if (result.getXqyxmsOne() != null && result.getXqyxmsOne() > 0) {
                result.setKeyZoneProjPercent(String.format("%.2f", (double) keyZoneProjNums / result.getXqyxmsOne() * 100));
            } else {
                result.setKeyZoneProjPercent("0.00");
            }
            if (result.getXqytzeOne() != null && result.getXqytzeOne() > 0) {
                result.setKeyZoneTzPercent(String.format("%.2f", keyZoneTz / result.getXqytzeOne() * 100));
            } else {
                result.setKeyZoneTzPercent("0.00");
            }
        }

        // 5 统计全市1+4产业数据
        // 将sixCodeList转换为Map，key为行业代码
        Map<String, SignedProjectInfoVO> sixCodeMap = new HashMap<>();
        List<SignedProjectInfoVO> sixCodeList = statisticsMapper.statisticsSixCode(LocalDate.parse(currStartDate, DATE_FORMATTER), LocalDate.parse(currEndDate, DATE_FORMATTER), e.getRmb(), e.getDollar());
        for (SignedProjectInfoVO vo : sixCodeList) {
            sixCodeMap.put(vo.getProjType(), vo);
        }

        long onePlusFourProjNums = 0;
        double onePlusFourZtz = 0;
        long t1 = 0, t2 = 0, t3 = 0, t4 = 0;

        // 行业代码01-04对应t1-t4
        String[] industryCodes = {"1.1", "1.2", "1.3", "1.4"};
        for (int i = 0; i < industryCodes.length; i++) {
            SignedProjectInfoVO temp = sixCodeMap.get(industryCodes[i]);
            if (temp != null && temp.getProjNums() != null) {
                onePlusFourProjNums += temp.getProjNums();
                onePlusFourZtz += temp.getZtz() != null ? temp.getZtz() : 0;
                if (i == 0) t1 = temp.getProjNums();
                else if (i == 1) t2 = temp.getProjNums();
                else if (i == 2) t3 = temp.getProjNums();
                else if (i == 3) t4 = temp.getProjNums();
            }
        }

        result.setOnePlusFourProjNums(onePlusFourProjNums);
        result.setOnePlusFourZtz(Double.parseDouble(String.format("%.2f", onePlusFourZtz)));
        result.setT1(t1);
        result.setT2(t2);
        result.setT3(t3);
        result.setT4(t4);

        return result;
    }

    @Override
    public List<KeyZoneScoreVO> statisticsKeyZoneScorePlus(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getCurrStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getCurrEndDate(), DATE_FORMATTER);
        Integer year = reqDTO.getYear() != null ? reqDTO.getYear() : startDate.getYear();
        Integer startMonth = reqDTO.getStartMonth() != null ? reqDTO.getStartMonth() : startDate.getMonthValue();
        Integer endMonth = reqDTO.getEndMonth() != null ? reqDTO.getEndMonth() : endDate.getMonthValue();

        // 从数据库查询重点园区的加分项
        List<KeyZoneScoreVO> scorePlusList = statisticsMapper.statisticsKeyZoneScorePlus(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), year, startMonth, endMonth);
        Map<String, KeyZoneScoreVO> scorePlusMap = new HashMap<>();
        for (KeyZoneScoreVO scoreData : scorePlusList) {
            scorePlusMap.put(scoreData.getZoneCode(), scoreData);
        }

        // 获取任务数和完成数
        List<KeyZoneScoreVO> taskList = statisticsMapper.statisticsKeyZoneCompleteProjNums(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), year);
        Map<String, KeyZoneScoreVO> taskMap = new HashMap<>();
        for (KeyZoneScoreVO taskData : taskList) {
            taskMap.put(taskData.getZoneCode(), taskData);
        }

        List<TBizZone> keyZones = zoneMapper.selectListByQuery(com.mybatisflex.core.query.QueryWrapper.create().eq("key_zone", true).eq("deleted", false));

        List<KeyZoneScoreVO> result = new ArrayList<>();

        for (TBizZone zone : keyZones) {
            KeyZoneScoreVO vo = new KeyZoneScoreVO();
            vo.setZoneCode(zone.getDeptCode());
            vo.setZoneName(zone.getName());
            vo.setGear(zone.getGear() != null ? zone.getGear().toString() : null);

            // 设置加分项
            KeyZoneScoreVO scoreData = scorePlusMap.get(zone.getDeptCode());
            if (scoreData != null) {
                vo.setScorePlus(scoreData.getScorePlus());
            }

            // 合并任务数和完成情况数据
            KeyZoneScoreVO taskData = taskMap.get(zone.getDeptCode());
            if (taskData != null) {
                vo.setOneTaskCount(taskData.getOneTaskCount());
                vo.setFiveTaskCount(taskData.getFiveTaskCount());
                vo.setTenTaskCount(taskData.getTenTaskCount());
                vo.setOneCount(taskData.getOneCount());
                vo.setFiveCount(taskData.getFiveCount());
                vo.setTenCount(taskData.getTenCount());

                // 计算完成率和得分
                // 1亿完成率
                double oneRate = taskData.getOneTaskCount() == null || taskData.getOneTaskCount() == 0 ? 0d : (double) taskData.getOneCount() / taskData.getOneTaskCount();
                vo.setOnePercent(String.format("%.2f", oneRate * 100d));
                vo.setOneScore(0d);

                // 5亿完成率
                double fiveRate = taskData.getFiveTaskCount() == null || taskData.getFiveTaskCount() == 0 ? 0d : (double) taskData.getFiveCount() / taskData.getFiveTaskCount();
                vo.setFivePercent(String.format("%.2f", fiveRate * 100d));
                vo.setFiveScore(Double.valueOf(String.format("%.2f", fiveRate * 0.1d)));

                // 10亿完成率
                double tenRate = taskData.getTenTaskCount() == null || taskData.getTenTaskCount() == 0 ? 0d : (double) taskData.getTenCount() / taskData.getTenTaskCount();
                vo.setTenPercent(String.format("%.2f", tenRate * 100d));
                vo.setTenScore(Double.valueOf(String.format("%.2f", tenRate * 0.3d)));
            }

            result.add(vo);
        }

        return result;
    }

    @Override
    public Map<String, KeyZoneScoreVO> statisticsKeyZoneCompleteProjNums(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getCurrStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getCurrEndDate(), DATE_FORMATTER);
        Integer year = reqDTO.getYear() != null ? reqDTO.getYear() : startDate.getYear();

        List<KeyZoneScoreVO> list = statisticsMapper.statisticsKeyZoneCompleteProjNums(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), year);
        Map<String, KeyZoneScoreVO> result = new HashMap<>();
        for (KeyZoneScoreVO vo : list) {
            result.put(vo.getZoneCode(), vo);
        }
        return result;
    }

    @Override
    public List<QxScoreVO> statisticsQxScorePlus(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getCurrStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getCurrEndDate(), DATE_FORMATTER);
        Integer year = reqDTO.getYear() != null ? reqDTO.getYear() : startDate.getYear();
        Integer startMonth = reqDTO.getStartMonth() != null ? reqDTO.getStartMonth() : startDate.getMonthValue();
        Integer endMonth = reqDTO.getEndMonth() != null ? reqDTO.getEndMonth() : endDate.getMonthValue();

        // 从数据库查询区县的加分项
        List<QxScoreVO> scorePlusList = statisticsMapper.statisticsQxScorePlus(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), year, startMonth, endMonth);
        Map<String, QxScoreVO> scorePlusMap = new HashMap<>();
        for (QxScoreVO scoreData : scorePlusList) {
            scorePlusMap.put(scoreData.getDistrictCode(), scoreData);
        }

        // 获取任务数和完成数
        List<QxScoreVO> taskDataList = statisticsMapper.statisticsQxCompleteProjNums(startDate, endDate, year);
        Map<String, QxScoreVO> taskMap = new HashMap<>();
        for (QxScoreVO taskData : taskDataList) {
            taskMap.put(taskData.getDistrictCode(), taskData);
        }

        // 获取所有区县
        List<TCommonDept> depts = deptMapper.selectListByQuery(
                com.mybatisflex.core.query.QueryWrapper.create()
                        .isNotNull("dept_code")
                        .eq("dept_level", 2)
                        .eq("dept_status", true)
                        .eq("deleted", false)
        );

        List<QxScoreVO> result = new ArrayList<>();

        for (TCommonDept dept : depts) {
            QxScoreVO vo = new QxScoreVO();
            vo.setDistrictCode(dept.getDeptCode());
            vo.setDistrict(dept.getDeptName());

            // 设置加分项
            QxScoreVO scoreData = scorePlusMap.get(dept.getDeptCode());
            if (scoreData != null) {
                vo.setScorePlus(scoreData.getScorePlus());
            }

            // 合并任务数和完成情况数据
            QxScoreVO taskData = taskMap.get(dept.getDeptCode());
            if (taskData != null) {
                vo.setOneTaskCount(taskData.getOneTaskCount());
                vo.setFiveTaskCount(taskData.getFiveTaskCount());
                vo.setTenTaskCount(taskData.getTenTaskCount());
                vo.setOneCount(taskData.getOneCount());
                vo.setFiveCount(taskData.getFiveCount());
                vo.setTenCount(taskData.getTenCount());

                // 计算完成率和得分
                // 1亿完成率
                double oneRate = taskData.getOneTaskCount() == null || taskData.getOneTaskCount() == 0 ? 0d : (double) taskData.getOneCount() / taskData.getOneTaskCount();
                vo.setOnePercent(String.format("%.2f", oneRate * 100d));
                vo.setOneScore(0d);

                // 5亿完成率
                double fiveRate = taskData.getFiveTaskCount() == null || taskData.getFiveTaskCount() == 0 ? 0d : (double) taskData.getFiveCount() / taskData.getFiveTaskCount();
                vo.setFivePercent(String.format("%.2f", fiveRate * 100d));
                vo.setFiveScore(Double.valueOf(String.format("%.2f", fiveRate * 0.1d)));

                // 10亿完成率
                double tenRate = taskData.getTenTaskCount() == null || taskData.getTenTaskCount() == 0 ? 0d : (double) taskData.getTenCount() / taskData.getTenTaskCount();
                vo.setTenPercent(String.format("%.2f", tenRate * 100d));
                vo.setTenScore(Double.valueOf(String.format("%.2f", tenRate * 0.3d)));
            }

            result.add(vo);
        }

        return result;
    }

    @Override
    public Map<String, QxScoreVO> statisticsQxCompleteProjNums(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getCurrStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getCurrEndDate(), DATE_FORMATTER);
        Integer year = reqDTO.getYear() != null ? reqDTO.getYear() : startDate.getYear();

        List<QxScoreVO> taskDataList = statisticsMapper.statisticsQxCompleteProjNums(startDate, endDate, year);
        Map<String, QxScoreVO> result = new HashMap<>();
        for (QxScoreVO taskData : taskDataList) {
            result.put(taskData.getDistrictCode(), taskData);
        }

        return result;
    }

    @Override
    public Map<String, ProjectInfoVO> statisticsProjectInfo(KeyZoneAndQxScoreReqDTO reqDTO) {
        List<ProjectInfoVO> list = statisticsProjectInfoList(reqDTO);
        Map<String, ProjectInfoVO> result = new HashMap<>();
        for (ProjectInfoVO vo : list) {
            result.put(vo.getDistrictCode(), vo);
        }
        return result;
    }

    @Override
    public List<ProjectInfoVO> statisticsProjectInfoList(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getEndDate(), DATE_FORMATTER);
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }

        return statisticsMapper.statisticsProjectInfo(startDate, endDate, rmb, dollar);
    }

    @Override
    public List<ProjectInfoVO> statisticsProjectStatusInfo(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getCurrStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getCurrEndDate(), DATE_FORMATTER);
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }

        // 获取父级数据（项目总览）
        List<ProjectInfoVO> parent = statisticsMapper.statisticsProjectInfoList(startDate, endDate, rmb, dollar);
        // 按状态统计
        List<ProjectStatusInfoVO> childrenList = statisticsMapper.statisticsProjectStatusInfo(startDate, endDate, rmb, dollar);
        Map<String, ProjectStatusInfoVO> children = new HashMap<>();
        for (ProjectStatusInfoVO vo : childrenList) {
            children.put(vo.getCode(), vo);
        }

        // 项目状态：1, 2, 4, 5
        int[] statuses = {1, 5, 4, 2};
        for (ProjectInfoVO entry : parent) {
            String districtCode = entry.getDistrictCode();
            for (int status : statuses) {
                ProjectStatusInfoVO t = children.get(String.format("%s_%s", districtCode, status));
                if (t == null) {
                    t = new ProjectStatusInfoVO();
                    t.setProgress(status);
                    t.setProjNums(0L);
                    t.setDistrictCode(districtCode);
                    t.setZtz(0d);
                }
                entry.getChildren().add(t);
            }
        }
        return parent;
    }

    @Override
    public Map<String, SignedProjectInfoVO> statisticsSixCode(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getEndDate(), DATE_FORMATTER);
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }

        List<SignedProjectInfoVO> list = statisticsMapper.statisticsSixCode(startDate, endDate, rmb, dollar);
        Map<String, SignedProjectInfoVO> result = new HashMap<>();
        for (SignedProjectInfoVO vo : list) {
            result.put(vo.getProjType(), vo);
        }
        return result;
    }

    @Override
    public Map<String, SignedProjectInfoVO> statisticProjForQxMap(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = reqDTO.getStartDate() != null ? LocalDate.parse(reqDTO.getStartDate(), DATE_FORMATTER) : null;
        LocalDate endDate = reqDTO.getEndDate() != null ? LocalDate.parse(reqDTO.getEndDate(), DATE_FORMATTER) : null;
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }
        List<SignedProjectInfoVO> list = statisticsMapper.statisticProjForQxMap(startDate, endDate, rmb, dollar);
        Map<String, SignedProjectInfoVO> result = new HashMap<>();
        for (SignedProjectInfoVO vo : list) {
            result.put(vo.getDistrictCode(), vo);
        }
        return result;
    }

    @Override
    public List<OnePlusFourVo> statisticsOnePlusFourForQx(KeyZoneAndQxScoreReqDTO reqDTO) {
        LocalDate startDate = LocalDate.parse(reqDTO.getCurrStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getCurrEndDate(), DATE_FORMATTER);
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }

        // 获取各区县项目总量和总投资
        List<SignedProjectInfoVO> projectList = statisticsMapper.statisticProjForQxMap(startDate, endDate, rmb, dollar);
        Map<String, SignedProjectInfoVO> projectMapQx = new HashMap<>();
        for (SignedProjectInfoVO vo : projectList) {
            projectMapQx.put(vo.getDistrictCode(), vo);
        }

        // 获取各区县1+4项目数量和总投资
        List<SignedProjectInfoVO> onePlusFourList = statisticsMapper.statisticsOnePlusFourForQx(startDate, endDate, rmb, dollar);
        Map<String, SignedProjectInfoVO> onePlusFourQx = new HashMap<>();
        for (SignedProjectInfoVO vo : onePlusFourList) {
            onePlusFourQx.put(vo.getProjType(), vo);
        }

        // 获取所有区县
        List<TCommonDept> areas = deptMapper.selectListByQuery(
                com.mybatisflex.core.query.QueryWrapper.create()
                        .isNotNull("dept_code")
                        .ne("dept_code", "")
                        .eq("dept_level", 2)
                        .eq("deleted", false)
        );

        // 获取所有产业分类 (level = 2)
        List<TProjType> industries = projTypeMapper.selectListByQuery(
                com.mybatisflex.core.query.QueryWrapper.create()
                        .eq("level", 2)
                        .eq("deleted", false)
        );

        List<OnePlusFourVo> records = new ArrayList<>();
        for (TCommonDept area : areas) {
            OnePlusFourVo vo = new OnePlusFourVo();
            vo.setDistrictCode(area.getDeptCode());
            vo.setDistrict(area.getDeptName());

            SignedProjectInfoVO dto = projectMapQx.get(area.getDeptCode());
            if (dto != null) {
                vo.setProjNums(dto.getProjNums() != null ? dto.getProjNums() : 0);
                vo.setZtz(dto.getZtz() != null ? dto.getZtz() : 0.0);
            } else {
                vo.setProjNums(0);
                vo.setZtz(0.0);
            }

            // 设置产业
            for (TProjType industry : industries) {
                OnePlusFourVo.OnePlusFourClassify t = new OnePlusFourVo.OnePlusFourClassify();
                t.setCode(industry.getCode());
                t.setName(industry.getName());

                SignedProjectInfoVO temp = onePlusFourQx.get(String.format("%s_%s", area.getDeptCode(), industry.getCode()));
                if (temp != null) {
                    t.setT1(temp.getProjNums() != null ? temp.getProjNums() : 0);
                    t.setTze(temp.getZtz() != null ? temp.getZtz() : 0.0);
                    t.setT2(vo.getProjNums() == 0 ? "-" : String.format("%.2f", (double) t.getT1() / vo.getProjNums() * 100));
                } else {
                    t.setT1(0);
                    t.setTze(0.0);
                    t.setT2("-");
                }
                vo.getChildren().add(t);
            }
            records.add(vo);
        }
        return records;
    }

    /**
     * 计算全市汇总
     */
    private SignedProjectInfoVO calculateCityTotal(List<SignedProjectInfoVO> records, String districtName, String districtCode) {
        SignedProjectInfoVO info = new SignedProjectInfoVO();
        info.setDistrict(districtName);
        info.setDistrictCode(districtCode);

        // 项目总数
        long projectNums = records.stream().filter(r -> r.getProjNums() != null).mapToLong(SignedProjectInfoVO::getProjNums).sum();
        // 去年项目总数
        long lastProjectNums = records.stream().filter(r -> r.getLastYearProjNums() != null).mapToLong(SignedProjectInfoVO::getLastYearProjNums).sum();
        // 总投资
        double ztz = records.stream().filter(r -> r.getZtz() != null).mapToDouble(SignedProjectInfoVO::getZtz).sum();
        // 去年总投资
        double lastZtz = records.stream().filter(r -> r.getLastZtz() != null).mapToDouble(SignedProjectInfoVO::getLastZtz).sum();
        // 年度目标任务数
        long ndmbrws = records.stream().filter(r -> r.getNdmbrws() != null).mapToLong(SignedProjectInfoVO::getNdmbrws).sum();

        info.setProjNums(projectNums);
        info.setProjTb(lastProjectNums == 0L ? "-" : String.format("%.2f", (double) (projectNums - lastProjectNums) / lastProjectNums * 100));
        info.setZtz(Double.parseDouble(String.format("%.2f", ztz)));
        info.setZtzTb(lastZtz == 0.0 ? "-" : String.format("%.2f", (ztz - lastZtz) / lastZtz * 100));

        // 内资项目数
        info.setNzProjNum(records.stream().filter(r -> r.getNzProjNum() != null).mapToLong(SignedProjectInfoVO::getNzProjNum).sum());
        // 内资投资金额
        info.setNzTz(Double.parseDouble(String.format("%.2f", records.stream().filter(r -> r.getNzTz() != null).mapToDouble(SignedProjectInfoVO::getNzTz).sum())));
        // 外资项目数量
        info.setWzProjNum(records.stream().filter(r -> r.getWzProjNum() != null).mapToLong(SignedProjectInfoVO::getWzProjNum).sum());
        // 外资投资金额
        info.setWzTz(Double.parseDouble(String.format("%.2f", records.stream().filter(r -> r.getWzTz() != null).mapToDouble(SignedProjectInfoVO::getWzTz).sum())));

        info.setNdmbrws(ndmbrws);
        info.setNdmbwcl(ndmbrws == 0L ? "-" : String.format("%.2f", (double) projectNums / ndmbrws * 100));

        return info;
    }

    /**
     * 人民币转万美元
     */
    private int convertRmbToDollar(int rmb) {
        switch (rmb) {
            case 1:
                return 1000;
            case 5:
                return 3000;
            case 10:
                return 10000;
            default:
                return 3000;
        }
    }

    @Override
    public List<SignedCylVo> countSignedProjType(StatisticsSignedProjectReqDTO reqDTO) {
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }
        return statisticsMapper.countSignedProjType(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), rmb, dollar);
    }

    @Override
    public List<ProjSignedDetailVo> countProjSigned(StatisticsSignedProjectReqDTO reqDTO) {
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }
        return statisticsMapper.countProjSigned(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), rmb, dollar, reqDTO.getProjType());
    }

    @Override
    public List<ProjectInfoVO> statisticsProjectStatusInfoQx(KeyZoneAndQxScoreReqDTO reqDTO) {
        // 查询当前人员权限
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(getUserAccount().getId());
        LocalDate startDate = LocalDate.parse(reqDTO.getStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getEndDate(), DATE_FORMATTER);
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }

        // 获取父级数据（项目总览）
        List<ProjectInfoVO> parent = statisticsMapper.statisticsProjectInfoListYq(startDate, endDate, rmb, dollar,zoneCodes.get(0));
        // 按状态统计
        List<ProjectStatusInfoVO> childrenList = statisticsMapper.statisticsProjectStatusInfoYq(startDate, endDate, rmb, dollar,zoneCodes.get(0));
        Map<String, ProjectStatusInfoVO> children = new HashMap<>();
        for (ProjectStatusInfoVO vo : childrenList) {
            children.put(vo.getCode(), vo);
        }

        // 项目状态：1, 2, 4, 5
        int[] statuses = {1, 5, 4, 2};
        for (ProjectInfoVO entry : parent) {
            String districtCode = entry.getDistrictCode();
            for (int status : statuses) {
                ProjectStatusInfoVO t = children.get(String.format("%s_%s", districtCode, status));
                if (t == null) {
                    t = new ProjectStatusInfoVO();
                    t.setProgress(status);
                    t.setProjNums(0L);
                    t.setDistrictCode(districtCode);
                    t.setZtz(0d);
                }
                entry.getChildren().add(t);
            }
        }
        return parent;
    }

    @Override
    public List<OnePlusFourVo> statisticsOnePlusFourForQxYq(KeyZoneAndQxScoreReqDTO reqDTO) {
        // 查询当前人员权限
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(getUserAccount().getId());
        LocalDate startDate = LocalDate.parse(reqDTO.getStartDate(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(reqDTO.getEndDate(), DATE_FORMATTER);
        Integer rmb = 0;
        Integer dollar = 0;
        ConditionTypeEnum e = null;
        if (reqDTO.getRmb() == 4) {
            rmb = 4;
            dollar = 50;
        } else {
            // 获取条件 1亿/5亿/10亿
            rmb = reqDTO.getRmb() == null ? 0 : reqDTO.getRmb();
            e = rmb == 0 ? ConditionTypeEnum.NULL_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
            if (e == null) {
                e = ConditionTypeEnum.NULL_HUNDRED_MILLION;
            }
            dollar = e.getDollar();
        }

        String deptCode = zoneCodes.get(0);

        // 获取各园区项目总量和总投资
        List<SignedProjectInfoVO> projectList = statisticsMapper.statisticProjForQxMapYq(startDate, endDate, rmb, dollar, deptCode);
        Map<String, SignedProjectInfoVO> projectMapQx = new HashMap<>();
        for (SignedProjectInfoVO vo : projectList) {
            projectMapQx.put(vo.getDistrictCode(), vo);
        }

        // 获取各园区1+4项目数量和总投资
        List<SignedProjectInfoVO> onePlusFourList = statisticsMapper.statisticsOnePlusFourForQxYq(startDate, endDate, rmb, dollar, deptCode);
        Map<String, SignedProjectInfoVO> onePlusFourQx = new HashMap<>();
        for (SignedProjectInfoVO vo : onePlusFourList) {
            onePlusFourQx.put(vo.getProjType(), vo);
        }

        // 获取所有产业分类 (level = 2)
        List<TProjType> industries = projTypeMapper.selectListByQuery(
                com.mybatisflex.core.query.QueryWrapper.create()
                        .eq("level", 2)
                        .eq("deleted", false)
        );

        List<OnePlusFourVo> records = new ArrayList<>();
        for (SignedProjectInfoVO zoneDto : projectList) {
            OnePlusFourVo vo = new OnePlusFourVo();
            vo.setDistrictCode(zoneDto.getDistrictCode());
            vo.setDistrict(zoneDto.getDistrict());
            vo.setProjNums(zoneDto.getProjNums() != null ? zoneDto.getProjNums() : 0);
            vo.setZtz(zoneDto.getZtz() != null ? zoneDto.getZtz() : 0.0);

            // 设置产业
            for (TProjType industry : industries) {
                OnePlusFourVo.OnePlusFourClassify t = new OnePlusFourVo.OnePlusFourClassify();
                t.setCode(industry.getCode());
                t.setName(industry.getName());

                SignedProjectInfoVO temp = onePlusFourQx.get(String.format("%s_%s", zoneDto.getDistrictCode(), industry.getCode()));
                if (temp != null) {
                    t.setT1(temp.getProjNums() != null ? temp.getProjNums() : 0);
                    t.setTze(temp.getZtz() != null ? temp.getZtz() : 0.0);
                    t.setT2(vo.getProjNums() == 0 ? "-" : String.format("%.2f", (double) t.getT1() / vo.getProjNums() * 100));
                } else {
                    t.setT1(0);
                    t.setTze(0.0);
                    t.setT2("-");
                }
                vo.getChildren().add(t);
            }
            records.add(vo);
        }
        return records;
    }

    @Override
    public List<SignedProjectInfoVO> countSignedProjQyqs(KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsMapper.countSignedProjQyqs(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), reqDTO.getDistrictCode());
    }

    @Override
    public List<SignedProjectInfoVO> countSignedProjCyfb(KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsMapper.countSignedProjCyfb(reqDTO.getCurrStartDate(), reqDTO.getCurrEndDate(), reqDTO.getDistrictCode());
    }

    @Override
    public long countPendingReview() {
        // 查询当前人员权限
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(getUserAccount().getId());
        List<String> townCodes = signedMapper.getTownCodesByUserId(getUserAccount().getId());
        String deptCode = null;
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            deptCode = zoneCodes.get(0);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            deptCode = townCodes.get(0);
        }
        // 签约待审核
        long signedCount = statisticsMapper.countPendingReviewSigned(deptCode);
        return signedCount;
    }
}
