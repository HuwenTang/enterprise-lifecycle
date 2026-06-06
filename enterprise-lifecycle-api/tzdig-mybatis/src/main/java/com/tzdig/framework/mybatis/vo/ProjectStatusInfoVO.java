package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "项目状态信息")
public class ProjectStatusInfoVO {

    @Schema(description = "编码")
    private String code;

    @Schema(description = "区域编码")
    private String districtCode;

    @Schema(description = "进度/状态")
    private Integer progress;

    @Schema(description = "项目数量")
    private Long projNums;

    @Schema(description = "投资金额")
    private Double ztz;
}
