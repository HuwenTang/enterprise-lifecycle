package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "签约项目类型统计")
public class SignedCylVo {

    @Schema(description = "名称")
    private String name;

    @Schema(description = "靖江市项目数")
    private Integer jjsNum;

    @Schema(description = "靖江市签约金额")
    private Double jjsQyje;

    @Schema(description = "泰兴市项目数")
    private Integer txsNum;

    @Schema(description = "泰兴市签约金额")
    private Double txsQyje;

    @Schema(description = "兴化市项目数")
    private Integer xhsNum;

    @Schema(description = "兴化市签约金额")
    private Double xhsQyje;

    @Schema(description = "海陵区项目数")
    private Integer hlqNum;

    @Schema(description = "海陵区签约金额")
    private Double hlqQyje;

    @Schema(description = "姜堰区项目数")
    private Integer jyqNum;

    @Schema(description = "姜堰区签约金额")
    private Double jyqQyje;

    @Schema(description = "医药高新区项目数")
    private Integer yygxqNum;

    @Schema(description = "医药高新区签约金额")
    private Double yygxqQyje;

    @Schema(description = "合计项目数")
    private Integer total;

    @Schema(description = "合计签约金额")
    private Double totalQyje;
}