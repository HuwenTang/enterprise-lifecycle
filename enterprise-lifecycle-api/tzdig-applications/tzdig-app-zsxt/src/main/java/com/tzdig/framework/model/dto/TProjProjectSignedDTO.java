package com.tzdig.framework.model.dto;

import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import lombok.Data;
import java.util.List;

/**
 * 签约项目查询 DTO
 * 包含签约项目列表查询所需的各类筛选条件，支持驼峰命名
 */
@Data
public class TProjProjectSignedDTO {

    /**
     * 总投资额筛选级别 (0, 1, 2)
     */
    private String investMoney;
    /**
     * 投资规模
     */
    private String tzgm;

    /**
     * 历史进度状态
     */
    private String hprogress;

    /**
     * 签约进度状态
     */
    private String progress;

    /**
     * 审核完成状态/其它进度 (r_progress)
     */
    private String rprogress;

    /**
     * 项目名称 (s_name)
     */
    private String name;

    /**
     * 项目编号 (s_code)
     */
    private String code;

    /**
     * 项目类别 (s_p_type)
     */
    private String ptype;

    /**
     * 投资方来源 (s_investor_place)
     */
    private String investorPlace;

    /**
     * 市区编码 / 区县 (s_district)
     */
    private String districtCode;

    /**
     * 园区编码 (s_zone_code)
     */
    private String zoneCode;

    /**
     * 街镇编码 (s_town_code)
     */
    private String townCode;

    /**
     * 行业编码 (s_industry_code)
     */
    private String industryCode;

    /**
     * 项目类型 (s_proj_type)
     */
    private String projType;

    /**
     * 投资方名称 (s_investor)
     */
    private String investor;

    /**
     * 投资方类别 (s_investor_type)
     */
    private String investorType;

    /**
     * 审核状态 (s_check_status)
     */
    private String checkStatus;

    /**
     * 业务产业 (s_b_industry)
     */
    private String bindustry;

    /**
     * 产业大类 (s_industry_first_code)
     */
    private String industryFirstCode;

    /**
     * 备注/描述模糊匹配 (s_remarks)
     */
    private String remark;

    // --- 日期范围筛选 (格式: "yyyy-MM-dd ~ yyyy-MM-dd") ---

    /**
     * 签约统计日期 (s_signed_stat_date)
     */
    private String signedStatDate;

    /**
     * 许可证日期 (s_licence_date)
     */
    private String sLicenceDate;

    /**
     * 开始/开工日期 (s_startdate)
     */
    private String startDateCommit;

    /**
     * 结束/竣工日期 (s_enddate)
     */
    private String completeDate;

    /**
     * 注册统计日期 (s_reg_stat_date)
     */
    private String regStatDate;

    /**
     * 备案统计日期 (s_check_stat_date)
     */
    private String checkStatDate;

    /**
     * 签约日期 (s_signed_date)
     */
    private String sSignedDate;

    /**
     * 报批完成日期 (s_finish_check_date)
     */
    private String finishCheckDate;

    /**
     * 组合报表显示字段
     */
    private List<String> displayFields;
}
