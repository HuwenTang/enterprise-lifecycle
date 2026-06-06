package com.tzdig.framework.mybatis.vo;

import com.tzdig.framework.mybatis.entity.zsxt.TProjPgyj;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;
import java.util.List;


/**
 * <p>政策</p>
 *
 * @author jy.zhu
 * @since 2024/10/16 19:09:23
 */
@Data
public class TProjProjectSignedReq {

    @Schema(description = "项目id")
    private Integer id;

    private String qrCode;

    private String qrKey;

    @Schema(description = "项目名称")
    private String name;

    @Schema(description = "项目编号")
    private String code;

    @Schema(description = "区县编码")
    private String districtCode;

    @Schema(description = "区县")

    private String district;

    @Schema(description = "园区code")

    private String zoneCode;

    @Schema(description = "园区名称")

    private String zoneName;

    @Schema(description = "街镇")

    private String townCode;

    @Schema(description = "街镇名")

    private String townName;

    @Schema(description = "项目类别, 1-内资,2-外资 默认1")

    private Integer pType;

    @Schema(description = "总投资额,  内资时单位是亿元,外资时单位是万美元")

    private Double investMoney;

    @Schema(description = "协议利用外资(万美元)")

    private Double foreignMoney;

    @Schema(description = "项目类型, t_proj_type")

    private String projType;

    @Schema(description = "产业大类(不要显示的) t_proj_industry_first")

    private String industryFirstCode;

    @Schema(description = "产业大类名称t_proj_industry_first")

    private String industryFirstName;

    @Schema(description = "行业编码(不要显示的)t_proj_industry")

    private String industryCode;

    @Schema(description = "行业编码(显示的)t_proj_industry")

    private String industryName;

    @Schema(description = "1-服务业 2-制造业")

    private Integer bIndustry;

    @Schema(description = "投资方名称")

    private String investor;

    @Schema(description = "10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它")

    private Integer investorType;

    @Schema(description = "投资方地址")

    private String investorPlace;

    @Schema(description = "签约日期")

    private Date signedDate;

    @Schema(description = "签约信息统计日期")

    private Date signedStatDate;

    @Schema(description = "项目简介, 大文本框")

    private String desc;

    @Schema(description = "备案（核准）项目名称")

    private String checkName;

    @Schema(description = "备案（核准）投资总额（亿元）")

    private Double checkMoney;

    @Schema(description = "备案（核准）日期")

    private Date checkDate;

    @Schema(description = "备案（核准）统计日期")

    private Date checkStatDate;

    @Schema(description = "统一社会信用代码证")

    private String uCode;

    @Schema(description = "注册公司名称")

    private String companyName;

    @Schema(description = "注册资金")

    private Double regMoney;

    @Schema(description = "注册日期")

    private Date regDate;

    @Schema(description = "")

    private Double regForeignMoney;

    @Schema(description = "注册信息统计日期：")

    private Date regStatDate;

    @Schema(description = "是否涉及固定资产投资项目1-是,2-否")

    private Integer isFixedAsset;

    @Schema(description = "是否涉及建设用地")

    private Integer isUseLand;

    @Schema(description = "建设用地规划许可证编号")

    private String landLicence;

    @Schema(description = "完成报批日期")

    private Date finishCheckDate;

    @Schema(description = "取得许可证日期")

    private Date licenceDate;

    @Schema(description = "到账金额")

    private Double receivedMoney;

    @Schema(description = "0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工  ")

    private Integer progress;

    @Schema(description = "0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交")

    private Integer checkStatus;

    @Schema(description = "开工日期")

    private Date startDateCommit;

    @Schema(description = "竣工日期")

    private Date completeDate;

    @Schema(description = "投资方联系人")

    private String linker;

    @Schema(description = "投资方联系电话")

    private String linkerTel;

    @Schema(description = "招商人员")

    private String linkerTz;

    @Schema(description = "招商人员电话")

    private String linkerTzTel;

    @Schema(description = "创建时间, 不用管理, 插入时自动赋值")

    private Date createTime;

    @Schema(description = "创建人的id,前端界面不管理,插入时用登录人帐号赋值")

    private Integer creatorId;

    @Schema(description = "创建人姓名")

    private String creatorName;

    @Schema(description = "创建人的部门编码")

    private String creatorDept;

    @Schema(description = "最后一次审核结果描述")

    private String lastCheckDesc;

    @Schema(description = "实际投入资金规模（亿元）")

    private Double actualInvest;

    @Schema(description = "开工认定编码")

    private String startCode;

    @Schema(description = "实际建成产能")

    private Double actualOutput;

    @Schema(description = "累计实际投入资金规模（亿元")

    private Double sumActualInvest;

    @Schema(description = "修改时间")

    private Date updateTime;

    @Schema(description = "修改人")

    private String updateId;

    @Schema(description = "老项目创建人id")

    private String oldCreateBy;

    @Schema(description = "老项目修改人id ")

    private String oldUpdateBy;

    @Schema(description = "老项目的主键ID")

    private String oldId;

    @Schema(description = "是否为六大产业项目")

    private Integer isSixpro;

    @Schema(description = "六大产业项目编码")

    private String sixproCode;

    @Schema(description = "备注")

    private String remarks;

    @Schema(description = "1-正常，2-删除")

    private Integer status;

    @Schema(description = "排序")

    private Integer orderIdx;

    private String beginTime;

    private String endTime;

    private Integer year;

    private Integer type;

    private Integer beginMonth;

    private Integer endMonth;

    private Integer level;

    private String descType;

    private Long signedId;

    private List<TProjPgyj> pgList;
    /**
     * 条件 1亿/5亿/10亿
     */
    private Integer rmb;

    private Integer rmb1;

    private Integer rmb2;

    private Integer doller;

    private Integer doller1;

    private Integer doller2;
    /**
     * 当前开始时间
     */
    private String currStartDate;
    /**
     * 当前结束时间
     */
    private String currEndDate;
    /**
     * 去年同期开始时间
     */
    private String lastYearStartDate;
    /**
     * 去年同期结束时间
     */
    private String lastYearEndDate;

    private String deptCode;

    private Integer isListed;

    private String isKcProj;

    @Schema(description = "1-服务业 2-制造业")

    private Integer industry;
}