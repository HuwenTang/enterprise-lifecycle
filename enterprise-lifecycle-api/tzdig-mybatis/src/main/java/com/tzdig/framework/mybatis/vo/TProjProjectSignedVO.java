package com.tzdig.framework.mybatis.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;


@Data
public class TProjProjectSignedVO {

    @Schema(description = "项目ID")
    private String id;

    @Schema(description = "项目名称")
    private String _name;

    @Schema(description = "项目编号")
    private String _code;

    @Schema(description = "区县编码")
    private String district_code;

    @Schema(description = "区县")
    private String district;

    @Schema(description = "园区code")
    private String zone_code;

    @Schema(description = "园区名称")
    private String zone_name;

    @Schema(description = "街镇")
    private String town_code;

    @Schema(description = "街镇名")
    private String town_name;

    @Schema(description = "项目类别, 1-内资,2-外资 默认1")
    private Integer p_type;

    @Schema(description = "总投资额,  内资时单位是亿元,外资时单位是万美元")
    private Double invest_money;

    @Schema(description = "成效情况说明")
    private String cg_remark;

    @Schema(description = "协议利用外资(万美元)")
    private Double foreign_money;

    @Schema(description = "项目类型, t_proj_type")
    private String proj_type;

    @Schema(description = "项目类型, t_proj_type")
    private String proj_type_name;

    @Schema(description = "产业大类(不要显示的) t_proj_industry_first")
    private String industry_first_code;

    @Schema(description = "产业大类名称t_proj_industry_first")
    private String industry_first_name;

    @Schema(description = "行业编码(不要显示的)t_proj_industry")
    private String industry_code;

    @Schema(description = "行业编码(显示的)t_proj_industry")
    private String industry_name;

    @Schema(description = "1-服务业 2-制造业")
    private Integer b_industry;

    @Schema(description = "投资方名称")
    private String investor;

    @Schema(description = "10-央企,20-民营巨头 30-世界500强或跨国公司 40-其它")
    private Integer investor_type;

    @Schema(description = "投资方所在地")
    private String investor_place;

    @Schema(description = "签约日期")
    private Long signed_date;

    @Schema(description = "签约信息统计日期")
    private Long signed_stat_date;

    @Schema(description = "项目简介, 大文本框")
    private String _desc;

    @Schema(description = "备案（核准）项目名称")
    private String check_name;

    @Schema(description = "备案（核准）投资总额（亿元）")
    private Double check_money;

    @Schema(description = "备案（核准）日期")
    private Long check_date;

    @Schema(description = "备案（核准）统计日期")
    private Long check_stat_date;

    @Schema(description = "统一社会信用代码证")
    private String u_code;

    @Schema(description = "注册公司名称")
    private String company_name;

    @Schema(description = "注册资金")
    private Double reg_money;

    @Schema(description = "注册日期")
    private Long reg_date;

    @Schema(description = "注册外资")
    private Double reg_foreign_money;

    @Schema(description = "注册信息统计日期")
    private Long reg_stat_date;

    @Schema(description = "是否涉及固定资产投资项目1-是,2-否")
    private Integer is_fixed_asset;

    @Schema(description = "是否涉及建设用地")
    private Integer is_use_land;

    @Schema(description = "建设用地规划许可证编号")
    private String land_licence;

    @Schema(description = "完成报批日期")
    private Long finish_check_date;

    @Schema(description = "取得许可证日期")
    private Long licence_date;

    @Schema(description = "到账金额")
    private Double received_money;

    @Schema(description = "0已签约   1已注册   5已备案   4完成报批   2已开工   3已竣工")
    private Integer progress;

    @Schema(description = "0-待审核  1-市级审核通过 2-市区审核通过,3-审核不通过  4-保存未提交")
    private Integer check_status;

    @Schema(description = "开工日期")
    private Long start_date_commit;

    @Schema(description = "竣工日期")
    private Long complete_date;

    @Schema(description = "产业关联度")
    private String cy_gl;

    @Schema(description = "投资方联系人")
    private String linker;

    @Schema(description = "投资方联系电话")
    private String linker_tel;

    @Schema(description = "招商人员")
    private String linker_tz;

    @Schema(description = "招商人员电话")
    private String linker_tz_tel;

//    @Schema(description = "创建人的id")
//    private String creator_id;

    @Schema(description = "创建人姓名")
    private String creator_name;

    @Schema(description = "创建人的部门编码")
    private String creator_dept;

    @Schema(description = "最后一次审核结果描述")
    private String last_check_desc;

    @Schema(description = "实际投入资金规模（亿元）")
    private Double actual_invest;

    @Schema(description = "开工认定编码")
    private String start_code;

    @Schema(description = "实际建成产能")
    private Double actual_output;

    @Schema(description = "累计实际投入资金规模（亿元）")
    private Double sum_actual_invest;

    @Schema(description = "修改人")
    private Long update_id;

    @Schema(description = "老项目创建人id")
    private String old_create_by;

    @Schema(description = "老项目修改人id")
    private String old_update_by;

    @Schema(description = "老项目的主键ID")
    private String old_id;

    @Schema(description = "是否为六大产业项目")
    private Integer is_sixpro;

    @Schema(description = "六大产业项目编码")
    private String sixpro_code;

    @Schema(description = "备注")
    private String remarks;

    @Schema(description = "排序")
    private Integer order_idx;

    @Schema(description = "签约金额（外资已根据汇率转换）")
    private Double qyje;

    @Schema(description = "开工确认 1：是 0：否")
    private String kgqr;

    @Schema(description = "竣工确认 1：是 0：否")
    private String jgqr;

    @Schema(description = "项目评级")
    private String proj_level;

    @Schema(description = "是否为新引进企业")
    private Integer is_new;

    @Schema(description = "是否为世界500强或全球专业领域行业龙头企业")
    private Integer is_world;

    @Schema(description = "是否为国内500强或国内行业排名前100企业")
    private Integer is_china;

    @Schema(description = "是否为上市公司或上市辅导期企业")
    private Integer is_listed;

    @Schema(description = "是否为独角兽企业")
    private Integer is_unicorn;

    @Schema(description = "已投资项目对属地政府亩均税收（万元）")
    private String mujun_tax;

    @Schema(description = "主要客户")
    private String main_customer;

    @Schema(description = "计划总投资（万元）")
    private String plan_total;

    @Schema(description = "注册资本（万元）")
    private String zhuce_money;

    @Schema(description = "计划开工时间")
    private Long plan_start_date;

    @Schema(description = "计划竣工时间")
    private Long plan_end_date;

    @Schema(description = "项目使用主要原、辅材料")
    private String project_material;

    @Schema(description = "主要流程工艺")
    private String main_process;

    @Schema(description = "是否为新供地项目")
    private String is_newproject;

    @Schema(description = "是否科创项目")
    private String is_kc_proj;

    @Schema(description = "是否qflp外资项目")
    private String is_qflp;

    @Schema(description = "是否高新企业")
    private String is_gxjs;

    @Schema(description = "特殊行业")
    private String tshy;

    @Schema(description = "准入限制")
    private String zrxz;

    @Schema(description = "两高项目")
    private String lgxm;

    @Schema(description = "重金属排放")
    private String zjspf;

    @Schema(description = "成效情况")
    private String cxqk;

    @Schema(description = "租赁面积")
    private String zl_land_area;

    @Schema(description = "科创项目认定条件")
    private String kc_proj_tj;

    @Schema(description = "科创项目分类")
    private String kc_proj_type;

    @Schema(description = "是否需要融资")
    private String is_rzxq;

    @Schema(description = "融资金额")
    private String rz_money;

    @Schema(description = "折算用地")
    private String zl_land_area_zs;

    @Schema(description = "预期年产值")
    private String yq_cz1;

    @Schema(description = "项目选址位置")
    private String project_address;

    private String project_content;

    @Schema(description = "申请用地面积（亩）")
    private String sq_land_area;

    @Schema(description = "行业是否属于高新技术产业分类目录")
    private String is_gx;

    @Schema(description = "是否为高技术项目")
    private String is_gjs;

    @Schema(description = "是否为国家工业战略性新兴产业")
    private String is_gyzl;

    @Schema(description = "容积率")
    private String far;

    @Schema(description = "预期开票销售（万元）")
    private String yq_kpxs;

    @Schema(description = "预期税收（万元）")
    private String yq_ss;

    @Schema(description = "预期用工人数（人）")
    private String yq_worker;

    @Schema(description = "固定资产投资占比（%）")
    private String fixed_percent;

    @Schema(description = "投资强度（万元/千平方米）")
    private String invest_level;

    @Schema(description = "预期亩均税收（万元/千平方米）")
    private String yq_mjtax;

    @Schema(description = "是否有产生废水和挥发性有机废水排放")
    private String is_waterpf;

    @Schema(description = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    private String is_wuran;

    @Schema(description = "总能耗")
    private String total_use;

    @Schema(description = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    private String is_yanfa;

    @Schema(description = "项目是否拥有相关有效发明专利")
    private String is_zhuanli;

    @Schema(description = "是否拟列入重点活动签约项目库")
    private String is_important;

    @Schema(description = "是否为招商会项目")
    private String is_zsh;

    @Schema(description = "招商会名称")
    private String zsh_name;

    @Schema(description = "预计年销售（万元）")
    private String yj_year;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "是否为瞪羚企业")
    private Integer is_gazelle;

    @Schema(description = "是否为专精特新企业")
    private Integer is_specialized;

    @Schema(description = "设备投资（万元）")
    private String device_invest;

    @Schema(description = "固定资产投资（万元）")
    private String fixed_invest;

    @Schema(description = "1 自行接洽 2 市级机关推荐")
    private Integer b_resource;

    @Schema(description = "市集机关名称")
    private String sjjg_name;

    @Schema(description = "企业联系人")
    private String qy_linker;

    @Schema(description = "联系电话")
    private String qy_phone;

    @Schema(description = "申请用地年")
    private String sq_land_year;

    @Schema(description = "预期产值")
    private String yq_cz;

    @Schema(description = "自评价等级 优良一般")
    private String zpj_level;

    @Schema(description = "重点项目类型")
    private String import_proj_type;

    @Schema(description = "计划总投资第一期")
    private String plan_total1;

    @Schema(description = "计划总投资第二期")
    private String plan_total2;

    @Schema(description = "是否重点项目")
    private String is_import_proj;

    @Schema(description = "风险投资方名称")
    private String fx_name;

    @Schema(description = "预期开票销售（第一年）")
    private String yq_kpxs1;

    @Schema(description = "预期开票销售（第二年）")
    private String yq_kpxs2;

    @Schema(description = "预期开票销售（第三年）")
    private String yq_kpxs3;

    @Schema(description = "预期税收（第一年）")
    private String yq_ss1;

    @Schema(description = "预期税收（第二年）")
    private String yq_ss2;

    @Schema(description = "预期税收（第三年）")
    private String yq_ss3;

    @Schema(description = "预期亩均税收（第一年）")
    private String yq_mjtax1;

    @Schema(description = "预期亩均税收（第二年）")
    private String yq_mjtax2;

    @Schema(description = "预期亩均税收（第三年）")
    private String yq_mjtax3;

    @Schema(description = "开工状态日期")
    private Long start_stat_date;

    @Schema(description = "竣工状态日期")
    private Long complete_stat_date;

    @Schema(description = "完成报批状态日期")
    private Long finish_check_stat_date;

    private String xyzzcl;
    private String kgzzcl;
    private String rczzcl;
    private String kczzcl;
    private String jgzzcl;
    private String kccl;
    private String ztpgzzcl;
}
