package com.tzdig.framework.mybatis.bo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 项目的市区、园区
 */
@Data
public class InvestDistrictParkBO {
    @Schema(description = "市（区）")
    private String district;
    @Schema(description = "园区")
    private String park;
}
