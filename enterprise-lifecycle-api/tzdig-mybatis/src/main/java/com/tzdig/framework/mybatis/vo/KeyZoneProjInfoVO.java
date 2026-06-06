package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "重点园区项目信息")
public class KeyZoneProjInfoVO {

    @Schema(description = "内资项目数")
    private Long nzProjNums;

    @Schema(description = "外资项目数")
    private Long wzProjNums;

    @Schema(description = "内资投资金额")
    private Double nzTz;

    @Schema(description = "外资投资金额")
    private Double wzTz;
}
