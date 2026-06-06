package com.tzdig.framework.mybatis.vo;

import cn.idev.excel.annotation.ExcelProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "签约项目统计信息")
public class SignedProjectInfoVO {

    @ExcelProperty("区域名称")
    @Schema(description = "区域名称")
    private String district;

    @ExcelProperty("项目总数")
    @Schema(description = "项目总数")
    private Long projNums;

    @ExcelProperty("项目同比")
    @Schema(description = "项目同比")
    private String projTb;

    @ExcelProperty("总投资（亿元）")
    @Schema(description = "总投资（亿元）")
    private Double ztz;

    @ExcelProperty("总投资同比")
    @Schema(description = "总投资同比")
    private String ztzTb;

    @ExcelProperty("内资项目数")
    @Schema(description = "内资项目数")
    private Long nzProjNum;

    @ExcelProperty("内资投资金额")
    @Schema(description = "内资投资金额")
    private Double nzTz;

    @ExcelProperty("外资项目数")
    @Schema(description = "外资项目数")
    private Long wzProjNum;

    @ExcelProperty("外资投资金额")
    @Schema(description = "外资投资金额")
    private Double wzTz;

    @Schema(description = "区域编码")
    private String districtCode;

    @Schema(description = "去年项目数量")
    private Long lastYearProjNums;

    @Schema(description = "去年总投资")
    private Double lastZtz;

    @Schema(description = "签约日期")
    private String signedDate;

    @Schema(description = "六大产业编码")
    private Integer sixproCode;

    @Schema(description = "项目类型")
    private String projType;

    @Schema(description = "项目名称")
    private String projName;

    @ExcelProperty("年度目标任务数")
    @Schema(description = "年度目标任务数")
    private Long ndmbrws;

    @ExcelProperty("年度完成数")
    @Schema(description = "年度完成数")
    private Long ndwcs;

    @ExcelProperty("年度目标任务完成率")
    @Schema(description = "年度目标任务完成率")
    private String ndmbwcl;
}
