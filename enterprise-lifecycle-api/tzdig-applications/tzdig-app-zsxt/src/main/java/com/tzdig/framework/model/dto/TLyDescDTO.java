package com.tzdig.framework.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "留言处理记录 DTO")
public class TLyDescDTO {

    @Schema(description = "主键ID")
    private String id;

    @Schema(description = "留言ID")
    private Long lyId;

    @Schema(description = "处理结果")
    private String descContent;

    @Schema(description = "处理时间")
    private String ct;

    @Schema(description = "处理人")
    private String clEr;
}
