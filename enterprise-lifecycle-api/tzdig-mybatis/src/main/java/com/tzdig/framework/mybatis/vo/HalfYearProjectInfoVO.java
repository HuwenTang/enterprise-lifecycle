package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "半年项目招引信息")
public class HalfYearProjectInfoVO {

    @Schema(description = "项目总数")
    private Long projNums;

    @Schema(description = "项目同比")
    private String projTb;

    @Schema(description = "总投资（亿元）")
    private Double ztz;

    @Schema(description = "总投资同比")
    private String ztzTb;

    @Schema(description = "内资项目数")
    private Long nzProjNum;

    @Schema(description = "内资投资金额")
    private Double nzTz;

    @Schema(description = "外资项目数量")
    private Long wzProjNum;

    @Schema(description = "外资投资金额")
    private Double wzTz;

    @Schema(description = "10亿元（1亿美元）项目数量")
    private Long projNumsForTen;

    @Schema(description = "10亿元（1亿美元）投资总额")
    private Double ztzForTen;

    @Schema(description = "5亿项目百分比")
    private String fivePercent;

    @Schema(description = "10亿项目百分比")
    private String tenPercent;

    @Schema(description = "重点园区 5亿（3000万美元）项目数量")
    private Long keyZoneProjNums;

    @Schema(description = "重点园区 5亿（3000万美元）总投资")
    private Double keyZoneTz;

    @Schema(description = "重点园区 5亿（3000万美元）项目数量 / 全市项目占比")
    private String keyZoneProjPercent;

    @Schema(description = "重点园区 5亿（3000万美元）总投资 / 全市项目占比")
    private String keyZoneTzPercent;

    @Schema(description = "1+4项目总数量")
    private Long onePlusFourProjNums;

    @Schema(description = "1+4项目总投资")
    private Double onePlusFourZtz;

    @Schema(description = "累计新签约亿元（1000万美元）项目数")
    private Long xqyxmsOne;

    @Schema(description = "累计新签约亿元（1000万美元）投资额")
    private Double xqytzeOne;

    @Schema(description = "累计新签约5亿元（3000万美元）项目数")
    private Long xqyxmsFive;

    @Schema(description = "累计新签约5亿元（3000万美元）投资额")
    private Double xqytzeFive;

    @Schema(description = "累计新签约10亿元（1亿美元）项目数")
    private Long xqyxmsTen;

    @Schema(description = "累计新签约10亿元（1亿美元）投资额")
    private Double xqytzeTen;

    @Schema(description = "累计新签约亿元（1000万美元）内资项目数")
    private Long nzxqyxmsOne;

    @Schema(description = "累计新签约亿元（1000万美元）内资投资额")
    private Double nzxqytzeOne;

    @Schema(description = "累计新签约亿元（1000万美元）外资项目数")
    private Long wzxqyxmsOne;

    @Schema(description = "累计新签约亿元（1000万美元）外资投资额")
    private Double wzxqytzeOne;

    @Schema(description = "产业分类1数量")
    private Long t1;

    @Schema(description = "产业分类2数量")
    private Long t2;

    @Schema(description = "产业分类3数量")
    private Long t3;

    @Schema(description = "产业分类4数量")
    private Long t4;
}
