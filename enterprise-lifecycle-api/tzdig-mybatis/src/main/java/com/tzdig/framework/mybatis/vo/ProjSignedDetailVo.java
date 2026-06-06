package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "签约项目明细")
public class ProjSignedDetailVo {

    @Schema(description = "项目名称")
    private String name;

    @Schema(description = "总投资")
    private Double investMoney;

    @Schema(description = "市区")
    private String district;

    @Schema(description = "园区")
    private String zoneName;

    @Schema(description = "投资方名称")
    private String investor;

    @Schema(description = "项目简介")
    private String projDesc;

    @Schema(description = "认定进度")
    private String progressRd;
}