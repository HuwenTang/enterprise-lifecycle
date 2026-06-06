package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Schema(description = "项目信息")
public class ProjectInfoVO {

    @Schema(description = "区域编码")
    private String districtCode;

    @Schema(description = "区域名称")
    private String district;

    @Schema(description = "项目数量")
    private Long projNums;

    @Schema(description = "投资金额")
    private Double ztz;

    @Schema(description = "状态子项")
    private List<ProjectStatusInfoVO> children = new ArrayList<>();
}
