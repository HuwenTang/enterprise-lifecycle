package com.tzdig.framework.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ProjectItemCountVo {

    //施工图审查
    //环评
    //施工许可
    @Schema(description = "施工图审查数量")
    private Long drawingReviewCount = 0L;//施工图审查数量
    @Schema(description = "环评数量")
    private Long envAssessmentCount = 0L;//环评数量
    @Schema(description = "能评数量")
    private Long energyAssessmentCount = 0L;//环评数量
    @Schema(description = "施工许可数量")
    private Long constructionPermitsCount = 0L;//施工许可
}
