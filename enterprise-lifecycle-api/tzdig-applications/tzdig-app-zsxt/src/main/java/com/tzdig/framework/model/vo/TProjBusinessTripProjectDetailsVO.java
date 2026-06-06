package com.tzdig.framework.model.vo;

import lombok.Data;

/**
 * 因公出访关联项目详情 VO
 */
@Data
public class TProjBusinessTripProjectDetailsVO {
    /**
     * 项目 ID
     */
    private String id;

    /**
     * 市区
     */
    private String district;

    /**
     * 园区
     */
    private String zoneName;

    /**
     * 镇街
     */
    private String townName;

    /**
     * 项目编码
     */
    private String code;

    /**
     * 项目名称
     */
    private String name;

    /**
     * 投资额
     */
    private Double investMoney;

    /**
     * 类别 (1-内资, 2-外资)
     */
    private Short pType;
}
