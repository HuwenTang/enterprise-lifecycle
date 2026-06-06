package com.tzdig.framework.mybatis.mapper.zsxt;

import com.mybatisflex.core.BaseMapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import com.tzdig.framework.mybatis.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface StatisticsMapper extends BaseMapper<TProjProjectSigned> {

    List<SignedProjectInfoVO> statisticsSignedProjectInfo(@Param("districtCode") String districtCode, @Param("currStartDate") LocalDate currStartDate, @Param("currEndDate") LocalDate currEndDate, @Param("lastYearStartDate") LocalDate lastYearStartDate, @Param("lastYearEndDate") LocalDate lastYearEndDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<SignedProjectInfoVO> statisticsSignedProjectInfoYq(@Param("deptCode") String deptCode, @Param("currStartDate") LocalDate currStartDate, @Param("currEndDate") LocalDate currEndDate, @Param("lastYearStartDate") LocalDate lastYearStartDate, @Param("lastYearEndDate") LocalDate lastYearEndDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<TProjProjectSigned> queryProjectsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<TProjProjectSigned> queryProjectsByDistrictAndDateRange(@Param("districtCode") String districtCode, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<TProjProjectSigned> queryProjectsByZoneAndDateRange(@Param("zoneCode") String zoneCode, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<ProjectInfoVO> statisticsProjectInfo(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<ProjectInfoVO> statisticsProjectInfoList(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<ProjectStatusInfoVO> statisticsProjectStatusInfo(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<SignedProjectInfoVO> statisticsSixCode(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<SignedProjectInfoVO> statisticProjForQxMap(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<SignedProjectInfoVO> statisticsOnePlusFourForQx(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<SignedProjectInfoVO> statisticProjForQxMapYq(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar, @Param("deptCode") String deptCode);

    List<SignedProjectInfoVO> statisticsOnePlusFourForQxYq(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar, @Param("deptCode") String deptCode);

    Map<String, Object> statisticsHalfYearProjIncFirst(@Param("startDate") String startDate, @Param("endDate") String endDate);

    Map<String, Object> statisticsHalfYearProjIncSec(@Param("startDate") String startDate, @Param("endDate") String endDate);

    HalfYearProjectInfoVO statisticsXmzyxx(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate);

    KeyZoneProjInfoVO statisticsKeyZoneProjInfo(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<QxScoreVO> statisticsQxCompleteProjNums(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("year") Integer year);

    List<QxScoreVO> statisticsQxScorePlus(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate, @Param("year") Integer year, @Param("startMonth") Integer startMonth, @Param("endMonth") Integer endMonth);

    List<KeyZoneScoreVO> statisticsKeyZoneScorePlus(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate, @Param("year") Integer year, @Param("startMonth") Integer startMonth, @Param("endMonth") Integer endMonth);

    List<KeyZoneScoreVO> statisticsKeyZoneCompleteProjNums(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate, @Param("year") Integer year);

    List<SignedCylVo> countSignedProjType(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar);

    List<ProjSignedDetailVo> countProjSigned(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar, @Param("projType") String projType);

    List<ProjectInfoVO> statisticsProjectInfoListYq(@Param("startDate") LocalDate currStartDate, @Param("endDate") LocalDate currEndDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar, @Param("deptCode") String deptCode);

    List<ProjectStatusInfoVO> statisticsProjectStatusInfoYq(@Param("startDate") LocalDate currStartDate, @Param("endDate") LocalDate currEndDate, @Param("rmb") Integer rmb, @Param("dollar") Integer dollar, @Param("deptCode") String deptCode);

    List<SignedProjectInfoVO> countSignedProjQyqs(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate, @Param("districtCode") String districtCode);

    List<SignedProjectInfoVO> countSignedProjCyfb(@Param("currStartDate") String currStartDate, @Param("currEndDate") String currEndDate, @Param("districtCode") String districtCode);

    long countPendingReviewSigned(@Param("deptCode") String deptCode);

    long countPendingReviewFill(@Param("deptCode") String deptCode);
}
