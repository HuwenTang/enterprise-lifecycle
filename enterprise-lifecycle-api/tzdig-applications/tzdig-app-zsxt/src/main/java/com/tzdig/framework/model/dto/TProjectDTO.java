package com.tzdig.framework.model.dto;

import lombok.Data;

/**
 * 项目相关的交互 DTO
 * 包含转共享、转签约等操作所需的各类前端传参
 */
@Data
public class TProjectDTO {

    /**
     * 项目 ID
     */
    private Long id;

    /**
     * 反馈意见 / 弃权原因
     */
    private String fqyy;

    /**
     * 项目类别 (1-内资, 2-外资)
     */
    private Integer pType;

    /**
     * 投资金额 (invest_money1)
     */
    private Double investMoney;

    /**
     * 市区编码
     */
    private String districtCode;

    /**
     * 区县
     */
    private String district;

    /**
     * 园区名称
     */
    private String zoneName;

    /**
     * 园区编码
     */
    private String zoneCode;

    /**
     * 项目描述 / 内容
     */
    private String desc;

    /**
     * 投资方名称
     */
    private String investor;

    /**
     * 项目类型
     */
    private String projType;

    /**
     * 审核状态 / 流程状态
     */
    private Integer checkStatus;
}
