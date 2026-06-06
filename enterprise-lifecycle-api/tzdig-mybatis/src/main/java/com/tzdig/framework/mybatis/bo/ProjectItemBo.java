package com.tzdig.framework.mybatis.bo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ProjectItemBo {
    @Schema(description = "事项名称")
    private String itemName;//事项名称

    @Schema(description = "数量")
    private Long itemCount;//数量
}
