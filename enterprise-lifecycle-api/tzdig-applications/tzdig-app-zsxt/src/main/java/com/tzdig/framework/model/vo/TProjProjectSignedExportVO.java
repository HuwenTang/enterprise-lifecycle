package com.tzdig.framework.model.vo;

import cn.idev.excel.annotation.ExcelProperty;
import lombok.Data;

/**
 * 签约项目导出 VO
 */
@Data
public class TProjProjectSignedExportVO {

    @ExcelProperty("项目名称")
    private String name;

    @ExcelProperty("总投资")
    private Double investMoney;

    @ExcelProperty("市区名")
    private String district;

    @ExcelProperty("园区名")
    private String zoneName;

    @ExcelProperty("项目编码")
    private String code;

    @ExcelProperty("街镇名")
    private String townName;

    @ExcelProperty("项目类别")
    private String pType;

    @ExcelProperty("项目类型")
    private String projType;

    @ExcelProperty("产业大类")
    private String industryFirstName;

    @ExcelProperty("行业编码")
    private String industryName;

    @ExcelProperty("所属行业")
    private String bindustry;

    @ExcelProperty("投资方名称")
    private String investor;

    @ExcelProperty("项目简介")
    private String desc;

    @ExcelProperty("投资方注册地")
    private String investorPlace;

    @ExcelProperty("投资方性质")
    private String investorType;

    @ExcelProperty("项目进度")
    private String progress;

    @ExcelProperty("签约统计日期")
    private String signedStatDate;

    @ExcelProperty("签约日期")
    private String signedDate;

    @ExcelProperty("项目来源")
    private String bresource;

    @ExcelProperty("市级机关名称")
    private String sjjgName;
}
