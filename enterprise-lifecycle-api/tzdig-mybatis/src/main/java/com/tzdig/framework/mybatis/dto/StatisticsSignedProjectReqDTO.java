package com.tzdig.framework.mybatis.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "签约项目统计请求参数")
public class StatisticsSignedProjectReqDTO {

    @Schema(description = "投资金额条件：1-1亿，5-5亿，10-10亿")
    @NotNull(message = "投资金额条件不能为空")
    private Integer rmb;

    @Schema(description = "当前统计开始日期")
    @NotNull(message = "开始日期不能为空")
    private String currStartDate;

    @Schema(description = "当前统计结束日期")
    @NotNull(message = "结束日期不能为空")
    private String currEndDate;

    @Schema(description = "去年同期开始日期")
    private String lastYearStartDate;

    @Schema(description = "当前统计结束日期")
    @NotNull(message = "结束日期不能为空")
    private String EndDate;

    @Schema(description = "去年同期开始日期")
    private String StartDate;


    @Schema(description = "去年同期结束日期")
    private String lastYearEndDate;

    @Schema(description = "年度")
    private Integer year;

    @Schema(description = "部门编码")
    private String deptCode;

    @Schema(description = "区域编码")
    private String districtCode;

    @Schema(description = "项目类型：1-内资，2-外资")
    private Integer pType;

    @Schema(description = "级别")
    private Integer level;

    @Schema(description = "类型")
    private Integer type;

    @Schema(description = "项目类型编码")
    private String projType;
}
