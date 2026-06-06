package com.tzdig.framework.model.vo;

import lombok.Data;
import java.util.List;

/**
 * 行业模块展示 VO，用于构建树形下拉选择
 */
@Data
public class TProjIndustryVO {
    /**
     * 行业编码 (对应 code)
     */
    private String id;

    /**
     * 行业名称 (格式: code-name)
     */
    private String name;

    /**
     * 父级编码
     */
    private String pId;

    /**
     * 子级行业列表
     */
    private List<TProjIndustryVO> children;
}
