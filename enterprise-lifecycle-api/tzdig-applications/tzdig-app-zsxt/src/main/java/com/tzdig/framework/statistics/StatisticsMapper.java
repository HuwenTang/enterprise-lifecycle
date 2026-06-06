//package com.tzdig.framework.statistics;
//
//import com.qry.statistics.fifth.ProjectInfo;
//import com.qry.statistics.fifth.ProjectStatusInfo;
//import com.qry.statistics.fourth.KeyZoneAndQxScoreReq;
//import com.qry.statistics.fourth.KeyZoneScoreVo;
//import com.qry.statistics.fourth.QxScoreVo;
//import com.qry.statistics.second.SignedIncDto;
//import com.qry.statistics.second.SignedProjectInc;
//import com.qry.statistics.second.SignedProjectInfoDto;
//import org.apache.ibatis.annotations.MapKey;
//import org.apache.ibatis.annotations.Param;
//
//import java.util.List;
//import java.util.Map;
//
///**
// * 统计Mapper
// */
//public interface StatisticsMapper {
//
//    /**
//     * 统计各市（区）新签约总投资${rmb}亿元（${dollar}万美元）以上项目情况表
//     * @param req 前端条件
//     * @param rmb 总投资亿元
//     * @param dollar 外资多少万美元
//     */
//    List<SignedProjectInfo> statisticsSignedProjectInfo(@Param("req") SignedProjectInfoReq req,@Param("rmb") int rmb,
//                                                       @Param("dollar") int dollar);
//
//    /**
//     * 统计年度的任务
//     *
//     * @param year 当前年度
//     * @param sfqx sfqx 是否区县 1-区县任务 2-重点园区任务
//     */
//    ProjectTask sumTaskForYear(@Param("year") String year, @Param("sfqx") int sfqx);
//
//
//    /**
//     * 半年项目招引信息(投资5亿元或者3000万美元)
//     */
//    SignedIncDto statisticsHalfYearProjIncFirst(@Param("startDate") String startDate, @Param("endDate") String endDate);
//
//
//    /**
//     * 半年项目招引信息(投资10亿元或者1亿美元)
//     */
//    SignedIncDto statisticsHalfYearProjIncSec(@Param("startDate") String startDate, @Param("endDate") String endDate);
//
//    /**
//     * 统计重点园区5亿（3000万美元）的项目
//     */
//    SignedIncDto statisticsKeyZoneProjInfo(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("rmb") int rmb, @Param("dollar") int dollar);
//
//    /**
//     * 统计全市的项目情况
//     */
//    SignedProjectInfoDto statisticsSignedProjectInfoTz(@Param("startDate") String startDate, @Param("endDate") String endDate);
//
//    /**
//     * 统计全市1+4
//     */
//    @MapKey("code")
//    Map<String, SignedProjectInfoDto> statisticsSixCode(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("rmb") int rmb, @Param("dollar") int dollar);
//
//
//    /**
//     * 统计各个区县的项目数量和投资额
//     */
//    @MapKey("districtCode")
//    Map<String, SignedProjectInfoDto> statisticProjForQxMap(@Param("startDate") String startDate,
//                                                            @Param("endDate") String endDate,
//                                                            @Param("rmb") int rmb,
//                                                            @Param("dollar") int dollar);
//
//    /**
//     * 统计各区县1+4 项目数量和投资额
//     */
//    @MapKey("code")
//    Map<String, SignedProjectInfoDto> statisticsOnePlusFourForQx(@Param("startDate") String startDate,
//                                                                 @Param("endDate") String endDate,
//                                                                 @Param("rmb") int rmb,
//                                                                 @Param("dollar") int dollar);
//
//
//    /**
//     * 统计重点园区加分
//     */
//    List<KeyZoneScoreVo> statisticsKeyZoneScorePlus(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("year") int year, @Param("startMonth") int startMonth, @Param("endMonth") int endMonth);
//
//    /**
//     * 统计园区年度任务以及完成数
//     */
//    @MapKey("zoneCode")
//    Map<String, KeyZoneScoreVo> statisticsKeyZoneCompleteProjNums(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("year") int year);
//
//    /**
//     * 统计区县重大加分项
//     */
//    List<QxScoreVo> statisticsQxScorePlus(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("year") int year, @Param("startMonth") int startMonth, @Param("endMonth") int endMonth);
//
//
//    /**
//     * 统计区县年度任务以及完成数
//     */
//    @MapKey("districtCode")
//    Map<String, QxScoreVo> statisticsQxCompleteProjNums(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("year") int year);
//
//    /**
//     * 按照区划统计项目的数量和金额
//     */
//    @MapKey("districtCode")
//    Map<String, ProjectInfo> statisticsProjectInfo(@Param("startDate") String startDate,
//                                                   @Param("endDate") String endDate,
//                                                   @Param("rmb") Integer rmb,
//                                                   @Param("dollar") Integer dollar);
//
//    List<ProjectInfo> statisticsProjectInfoList(@Param("startDate") String startDate,
//                                                   @Param("endDate") String endDate,
//                                                   @Param("rmb") Integer rmb,
//                                                   @Param("dollar") Integer dollar);
//
//
//    /**
//     * 按照区划和状态统计项目的数量和金额
//     */
//    @MapKey("code")
//    Map<String, ProjectStatusInfo> statisticsProjectStatusInfo(@Param("startDate") String startDate,
//                                                                    @Param("endDate") String endDate,
//                                                                    @Param("rmb") Integer rmb,
//                                                                    @Param("dollar") Integer dollar);
//
//
//
//    List<SignedProjectInfo> countSignedProj(@Param("req") KeyZoneAndQxScoreReq req);
//
//    @MapKey("signedDate")
//    Map<String, SignedProjectInfo> countSignedProjQyqs(@Param("req") KeyZoneAndQxScoreReq req);
//
//
//    List<SignedProjectInfo> countSignedProjCyfb(@Param("req") KeyZoneAndQxScoreReq req);
//
//    List<QxScoreVo> countSignedProjZoneTask(@Param("req") KeyZoneAndQxScoreReq req);
//
//    List<QxScoreVo> countSignedProjSqTask(@Param("req") KeyZoneAndQxScoreReq req);
//
//    List<SignedProjectInc> statisticsXmzyxx(@Param("currStartDate") String currStartDate,@Param("currEndDate") String currEndDate);
//
//    List<SignedCylVo> countSignedProjType(@Param("req") KeyZoneAndQxScoreReq req);
//
//    List<ProjSignedDetailVo> countProjSigned(@Param("req") KeyZoneAndQxScoreReq req);
//
//    List<SignedProjectInfo> statisticsSignedProjectInfoYq(@Param("req") SignedProjectInfoReq req,@Param("rmb") int rmb,
//                                                          @Param("dollar") int dollar);
//    @MapKey("districtCode")
//    Map<String, SignedProjectInfoDto> statisticProjForQxMapYq(@Param("startDate") String startDate,
//                                                              @Param("endDate") String endDate,
//                                                              @Param("rmb") int rmb,
//                                                              @Param("dollar") int dollar,@Param("deptCode") String deptCode);
//    @MapKey("code")
//    Map<String, SignedProjectInfoDto> statisticsOnePlusFourForQxYq(@Param("startDate") String startDate,
//                                                                   @Param("endDate") String endDate,
//                                                                   @Param("rmb") int rmb,
//                                                                   @Param("dollar") int dollar,@Param("deptCode") String deptCode);
//
//    List<ProjectInfo> statisticsProjectInfoListYq(@Param("startDate") String startDate,
//                                                  @Param("endDate") String endDate,
//                                                  @Param("rmb") Integer rmb,
//                                                  @Param("dollar") Integer dollar,@Param("deptCode") String deptCode);
//    @MapKey("code")
//    Map<String, ProjectStatusInfo> statisticsProjectStatusInfoYq(@Param("startDate") String startDate,
//                                                                 @Param("endDate") String endDate,
//                                                                 @Param("rmb") Integer rmb,
//                                                                 @Param("dollar") Integer dollar,@Param("deptCode") String deptCode);
//}
