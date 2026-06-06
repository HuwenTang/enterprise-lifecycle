package com.tzdig.framework.service;

import com.tzdig.framework.mybatis.dto.HalfYearProjectReqDTO;
import com.tzdig.framework.mybatis.dto.KeyZoneAndQxScoreReqDTO;
import com.tzdig.framework.mybatis.dto.StatisticsSignedProjectReqDTO;
import com.tzdig.framework.mybatis.vo.*;

import java.util.List;
import java.util.Map;

public interface IStatisticsService {

    List<SignedProjectInfoVO> statisticsSignedProjectInfo(StatisticsSignedProjectReqDTO reqDTO);

    List<SignedProjectInfoVO> statisticsSignedProjectInfoYq(StatisticsSignedProjectReqDTO reqDTO);

    HalfYearProjectInfoVO statisticsHalfYearProjInfo(HalfYearProjectReqDTO reqDTO);

    List<KeyZoneScoreVO> statisticsKeyZoneScorePlus(KeyZoneAndQxScoreReqDTO reqDTO);

    Map<String, KeyZoneScoreVO> statisticsKeyZoneCompleteProjNums(KeyZoneAndQxScoreReqDTO reqDTO);

    List<QxScoreVO> statisticsQxScorePlus(KeyZoneAndQxScoreReqDTO reqDTO);

    Map<String, QxScoreVO> statisticsQxCompleteProjNums(KeyZoneAndQxScoreReqDTO reqDTO);

    Map<String, ProjectInfoVO> statisticsProjectInfo(KeyZoneAndQxScoreReqDTO reqDTO);

    List<ProjectInfoVO> statisticsProjectInfoList(KeyZoneAndQxScoreReqDTO reqDTO);

    List<ProjectInfoVO> statisticsProjectStatusInfo(KeyZoneAndQxScoreReqDTO reqDTO);

    Map<String, SignedProjectInfoVO> statisticsSixCode(KeyZoneAndQxScoreReqDTO reqDTO);

    Map<String, SignedProjectInfoVO> statisticProjForQxMap(KeyZoneAndQxScoreReqDTO reqDTO);

    List<OnePlusFourVo> statisticsOnePlusFourForQx(KeyZoneAndQxScoreReqDTO reqDTO);

    List<SignedCylVo> countSignedProjType(StatisticsSignedProjectReqDTO reqDTO);

    List<ProjSignedDetailVo> countProjSigned(StatisticsSignedProjectReqDTO reqDTO);

    List<ProjectInfoVO> statisticsProjectStatusInfoQx(KeyZoneAndQxScoreReqDTO reqDTO);

    List<OnePlusFourVo> statisticsOnePlusFourForQxYq(KeyZoneAndQxScoreReqDTO reqDTO);

    List<SignedProjectInfoVO> countSignedProjQyqs(KeyZoneAndQxScoreReqDTO reqDTO);

    List<SignedProjectInfoVO> countSignedProjCyfb(KeyZoneAndQxScoreReqDTO reqDTO);

    long countPendingReview();
}
