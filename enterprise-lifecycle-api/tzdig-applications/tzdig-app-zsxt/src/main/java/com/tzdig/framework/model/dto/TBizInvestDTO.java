package com.tzdig.framework.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "招商投资信息 DTO")
public class TBizInvestDTO {

    @Schema(description = "主键ID")
    private String id;

    @Schema(description = "投资公司")
    private String companyName;

    @Schema(description = "园区ID")
    private Long zoneId;

    @Schema(description = "园区编码")
    private String zoneCode;

    @Schema(description = "园区名称")
    private String zoneName;

    @Schema(description = "行业编码")
    private String industryCode;

    @Schema(description = "行业名称")
    private String industryName;

    @Schema(description = "联系人")
    private String linker;

    @Schema(description = "联系电话")
    private String linkerTel;

    @Schema(description = "填表时间")
    private String ct;

    @Schema(description = "用户IP地址")
    private String ip;

    @Schema(description = "投资说明")
    private String investDesc;

    @Schema(description = "园区电话")
    private String zoneTel;

    @Schema(description = "状态：0-待审核 1-审核通过 2-不通过")
    private Integer status;

    @Schema(description = "是否反馈")
    private Integer feebackIs;

    @Schema(description = "来源：1-PC 2-APP")
    private Integer ly;

    private String beginTime;
    private String endTime;
}
