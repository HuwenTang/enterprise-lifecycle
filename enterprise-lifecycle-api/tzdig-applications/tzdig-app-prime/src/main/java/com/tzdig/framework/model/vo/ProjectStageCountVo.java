package com.tzdig.framework.model.vo;

import com.tzdig.framework.web.annotation.JsonAreaName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Data
public class ProjectStageCountVo {
    public String id;
    @Schema(description = "市（区）代码")
    public String district;
    @Schema(description = "园区代码")
    public String park;
    @Schema(description = "立项用地规划许可阶段")
    public Long stageApprovalCount = 0L;//立项用地规划许可阶段
    @Schema(description = "工程建设许可和施工许可阶段")
    public Long stageECCount = 0L;//工程建设许可和施工许可阶段
    @Schema(description = "施工许可阶段")
    public Long stagePermitStageCount = 0L;//施工许可阶段
    @Schema(description = "竣工验收阶段")
    public Long stageCompleted = 0L;//竣工验收阶段
    @Schema(description = "children")
    public List<ProjectStageCountVo> children = new LinkedList<>();
    @Schema(description = "市（区）名称")
    private String districtName;
    @Schema(description = "园区")
    private String parkName;

    public ProjectStageCountVo() {
        id = UUID.randomUUID().toString();
    }

    @SuppressWarnings("unused")
    @JsonAreaName
    public String getDistrictName() {
        return district;
    }

    @SuppressWarnings("unused")
    @JsonAreaName
    public String getParkName() {
        return park;
    }
}
