package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "重点园区评分信息")
public class KeyZoneScoreVO {

    @Schema(description = "园区编码")
    private String zoneCode;

    @Schema(description = "园区名称")
    private String zoneName;

    @Schema(description = "档位")
    private String gear;

    @Schema(description = "加分")
    private Double scorePlus;

    @Schema(description = "1亿任务数")
    private Long oneTaskCount;

    @Schema(description = "5亿任务数")
    private Long fiveTaskCount;

    @Schema(description = "10亿任务数")
    private Long tenTaskCount;

    @Schema(description = "1亿完成数")
    private Long oneCount;

    @Schema(description = "5亿完成数")
    private Long fiveCount;

    @Schema(description = "10亿完成数")
    private Long tenCount;

    @Schema(description = "1亿完成率")
    private String onePercent;

    @Schema(description = "1亿得分")
    private Double oneScore;

    @Schema(description = "5亿完成率")
    private String fivePercent;

    @Schema(description = "5亿得分")
    private Double fiveScore;

    @Schema(description = "10亿完成率")
    private String tenPercent;

    @Schema(description = "10亿得分")
    private Double tenScore;
}
