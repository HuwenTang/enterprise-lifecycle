package com.tzdig.framework.mybatis.bo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ProjectIteamNameCostTimeBo {
    @Schema(description = "项目地址-行政区划")
    private String administrativeDivision;
    @Schema(description = "项目地址-园区")
    private String park;
    @Schema(description = "办件编号")
    private String documentNumber;
    @Schema(description = "事项名称")
    private String itemName;
    @Schema(description = "办件状态")
    private String docStatus;
    @Schema(description = "事项数量")
    private Long itemCount;
    @Schema(description = "花费时间")
    private Long spendTime;
}
