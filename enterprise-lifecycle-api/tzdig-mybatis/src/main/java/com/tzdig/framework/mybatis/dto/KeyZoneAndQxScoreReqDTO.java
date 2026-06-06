package com.tzdig.framework.mybatis.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "重点园区和区县评分请求参数")
public class KeyZoneAndQxScoreReqDTO {

    @Schema(description = "开始日期")
    private String startDate;

    private String currStartDate;

    private String currEndDate;

    @Schema(description = "结束日期")
    private String endDate;

    @Schema(description = "年度")
    private Integer year;

    @Schema(description = "开始月份")
    private Integer startMonth;

    @Schema(description = "结束月份")
    private Integer endMonth;

    @Schema(description = "投资金额条件：1-1亿，5-5亿，10-10亿")
    private Integer rmb;

    @Schema(description = "外资金额条件")
    private Integer dollar;

    @Schema(description = "部门编码")
    private String deptCode;

    @Schema(description = "区域编码")
    private String districtCode;
}
