package com.tzdig.framework.mybatis.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "半年项目招引信息请求参数")
public class HalfYearProjectReqDTO {

    @Schema(description = "当前统计开始日期")
    @NotNull(message = "开始日期不能为空")
    private String currStartDate;

    @Schema(description = "当前统计结束日期")
    @NotNull(message = "结束日期不能为空")
    private String currEndDate;

    @Schema(description = "去年同期开始日期")
    private String lastYearStartDate;

    @Schema(description = "去年同期结束日期")
    private String lastYearEndDate;

    @Schema(description = "年度")
    private Integer year;

    @Schema(description = "开始月份")
    private Integer startMonth;

    @Schema(description = "结束月份")
    private Integer endMonth;

    private Integer rmb;
}
