package com.tzdig.framework.mybatis.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 项目预评估统计查询请求参数
 */
@Data
@Schema(description = "项目预评估统计查询请求参数")
public class PreEvaluationStatisticsQueryDTO {

    @Schema(description = "年度")
    private Integer year;

    @Schema(description = "产业类型：工业/服务业/其他（其他表示查询空值）")
    private String projectType;

    @Schema(description = "评估状态：未完成/已完成")
    private String evaluationStatus;
}