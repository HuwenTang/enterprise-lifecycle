package com.tzdig.framework.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "留言 DTO")
public class TLyDTO {

    @Schema(description = "主键ID")
    private String id;

    @Schema(description = "留言IP")
    private String ip;

    @Schema(description = "企业名称")
    private String comName;

    @Schema(description = "联系人电话")
    private String phone;

    @Schema(description = "联系人")
    private String name;

    @Schema(description = "留言内容")
    private String descContent;

    @Schema(description = "状态")
    private Boolean status;

    @Schema(description = "创建时间")
    private String ct;

    @Schema(description = "是否处理：0-未处理 1-已处理")
    private Integer clIs;

    @Schema(description = "处理时间")
    private String clTime;

    @Schema(description = "处理人登录名")
    private String clEr;

    @Schema(description = "处理结果")
    private String clDesc;

    @Schema(description = "分配后的部门编码")
    private String deptCode;

    @Schema(description = "留言来源：1-小程序 2-PC端")
    private Integer lyType;

    @Schema(description = "留言开始时间")
    private String beginTime;

    @Schema(description = "留言结束时间")
    private String endTime;
}
