package com.tzdig.framework.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "招商需求留言板 DTO")
public class BizInvestDemandDTO {

    @Schema(description = "主键ID")
    private Long id;

    // ========== 地理区域字段 ==========
    @Schema(description = "市区编码")
    private String districtCode;

    @Schema(description = "市区名称")
    private String districtName;

    @Schema(description = "园区编码")
    private String zoneCode;

    @Schema(description = "园区名称")
    private String zoneName;

    @Schema(description = "镇街编码")
    private String townCode;

    @Schema(description = "镇街名称")
    private String townName;

    @Schema(description = "战区编码")
    private String warZoneCode;

    @Schema(description = "战区名称")
    private String warZoneName;

    // ========== 需求内容字段 ==========
    @Schema(description = "需求标题")
    private String title;

    @Schema(description = "需求内容")
    private String content;

    @Schema(description = "期望解决时间")
    private String expectTime;

    // ========== 联系人字段 ==========
    @Schema(description = "联系人")
    private String linkerName;

    @Schema(description = "联系方式")
    private String linkerTel;

    @Schema(description = "附件IDs")
    private String fileIds;

    @Schema(description = "附件信息JSON")
    private String fileJson;

    // ========== 状态与审核字段 ==========
    @Schema(description = "状态: 0-待审核 1-已审核 2-已答复")
    private Integer status;

    @Schema(description = "审核人ID")
    private String auditId;

    @Schema(description = "审核人姓名")
    private String auditName;

    @Schema(description = "审核时间")
    private LocalDateTime auditTime;

    @Schema(description = "审核时间字符串")
    private String auditTimeStr;

    @Schema(description = "审核意见")
    private String auditRemark;

    // ========== 答复字段 ==========
    @Schema(description = "答复人ID")
    private String replyId;

    @Schema(description = "答复人姓名")
    private String replyName;

    @Schema(description = "答复时间")
    private LocalDateTime replyTime;

    @Schema(description = "答复时间字符串")
    private String replyTimeStr;

    @Schema(description = "答复内容")
    private String replyContent;

    // ========== 系统字段 ==========
    @Schema(description = "创建人ID")
    private String creatorId;

    @Schema(description = "创建人姓名")
    private String creatorName;

    @Schema(description = "来源: 1-PC 2-APP")
    private Integer ly;

    @Schema(description = "驻外机构编码")
    private String zjbCode;

    // ========== 查询条件字段 ==========
    private String startTime;
    private String endTime;

    private String filePath;

    private String place;

}