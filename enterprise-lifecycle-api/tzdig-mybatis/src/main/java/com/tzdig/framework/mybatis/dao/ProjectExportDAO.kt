package com.tzdig.framework.mybatis.dao

import org.apache.ibatis.annotations.Mapper

@Mapper
interface ProjectExportDAO {
//
//    @Select(
//        """<script>
//        select project_digital_investment_attracting.sjjg_name          as sjjgName,
//       project_name                                  as projectName,
//       case when current_project_progress=1 then '在谈'
//       when current_project_progress=2 then '签约'
//       when current_project_progress=3 then '注册'
//       when current_project_progress=4 then '备案'
//       when current_project_progress=5 then '报批'
//       when current_project_progress=6 then '开工'
//       when current_project_progress=7 then '竣工'
//       end as status,
//       project_content                               as projectDesc,
//       investor           as investor,
//       project_rating                                as projectRating,
//       investment_amount                             as investmentAmount,
//       COALESCE(a2.name, CAST(project_digital_investment_attracting.district AS CHAR))           as city,
//       COALESCE(a1.name, CAST(project_digital_investment_attracting.park AS CHAR)) AS park,
//       actual_signing_time       as signDate,
//       signing_time                                  as signStatDate,
//       project_type                                  as projectType,
//       is_kc_proj         as kc,
//       is_qflp            as qflp,
//       applied_land_area       as applyLand,
//       project_category                              as projectCategory,
//       zl_land_area       as leaseArea,
//       planned_total_investment                      as plannedInvestment,
//       fixed_asset_investment                                  as fixedAssetsInvestment,
//       yq_cz   as expectedAnnualOutput,
//       yq_kpxs as yqKpxs,
//       yq_ss   as yqSs,
//       start_confirm_date                                 as startDate,
//       end_confirm_date                                      as endDate
//from enterprise_lifecycle.project_digital_investment_attracting
//
//         LEFT join system_area a1 on project_digital_investment_attracting.park = a1.id
//         LEFT join system_area a2 on project_digital_investment_attracting.district = a2.id
//where project_digital_investment_attracting.deleted = 0
// AND (district IN
//    <foreach collection='grantArea' item='item' separator=',' open='(' close=')'> #{item} </foreach>
//or park IN
//    <foreach collection='grantArea' item='item' separator=',' open='(' close=')'> #{item} </foreach>
//)
//        <if test="projectName != null and projectName != ''">
//            AND project_name LIKE CONCAT('%', #{projectName}, '%')
//        </if>
//        <if test="projectCode != null and projectCode != ''">
//            AND project_code = #{projectCode}
//        </if>
//        <if test="projectCode != null and projectCode != ''">
//            AND project_code = #{projectCode}
//        </if>
//        <if test="currentProjectProgress != null and currentProjectProgress.size() > 0">
//            AND current_project_progress IN
//            <foreach item="status" collection="currentProjectProgress" open="(" separator="," close=")">
//                <!-- 如果列表里是字符串代表的数字，可能需要转换，或者直接传数字列表 -->
//                #{status}
//            </foreach>
//        </if>
//        <if test="projectContent != null and projectContent != ''">
//            AND project_content LIKE CONCAT('%', #{projectContent}, '%')
//        </if>
//        <if test="attractorUnit != null and attractorUnit != ''">
//            AND attractor_unit LIKE CONCAT('%', #{attractorUnit}, '%')
//        </if>
//        <if test="park != null and park != ''">
//            AND park = #{park}
//        </if>
//        <if test="year != null">
//            AND signing_time &gt;= STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d')
//            AND signing_time &lt; DATE_ADD(STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d'), INTERVAL 1 YEAR)
//            AND (project_digital_investment_attracting.check_status = 1 AND current_project_progress = 2 OR current_project_progress != 2)
//        </if>
//         <if test="industryOrService != null and industryOrService != ''">
//            AND project_type = #{industryOrService}
//        </if>
//         <if test="startApprovalStatus != null">
//            AND start_approval_status = #{startApprovalStatus}
//        </if>
//         <if test="applyTime1 != null">
//            <!-- 假设申请时间字段为 apply_time，需根据实际字段名调整 -->
//            AND apply_time &gt;= #{applyTime1}
//        </if>
//
//        <if test="applyTime2 != null">
//            AND apply_time &lt;= #{applyTime2}
//        </if>
//</script>
//  """
//    )
//    fun getProjectInfoData(
//        param: ProjectDigitalInvestmentAttractingParam,
////        @Param("grantArea") grantArea: Set<String>,
//    ): List<ProjectPOJO>
//
//
//
//    @Select(
//        """<script>
//        select project_digital_investment_attracting.sjjg_name          as sjjgName,
//       project_name                                  as projectName,
//       CASE audit_status
//            WHEN 0 THEN '无审核'
//            WHEN 1 THEN '部门审核中'
//            WHEN 2 THEN '部门审核通过'
//            WHEN 3 THEN '部门审核退回'
//            WHEN 4 THEN '专班审核中'
//            WHEN 5 THEN '专班审核通过'
//            WHEN 6 THEN '专班审核退回'
//            WHEN 7 THEN '审核不通过'
//            WHEN 8 THEN '通过不计分'
//            ELSE '未知状态'
//        END                               as status,
//       project_content                               as projectDesc,
//       ext_zs_proj_project_signed.investor           as investor,
//       project_rating                                as projectRating,
//       investment_amount                             as investmentAmount,
//       ext_zs_proj_project_signed.district           as city,
//       COALESCE(system_area.name, CAST(project_digital_investment_attracting.park AS CHAR)) AS park,
//       ext_zs_proj_project_signed.signed_date        as signDate,
//       signing_time                                  as signStatDate,
//       project_type                                  as projectType,
//       ext_zs_proj_project_signed.is_kc_proj         as kc,
//       ext_zs_proj_project_signed.is_qflp            as qflp,
//       project_category                              as projectCategory,
//       sq_land_area                                  as applyLand,
//       ext_zs_proj_project_signed.zl_land_area       as leaseArea,
//       planned_total_investment                      as plannedInvestment,
//       fixed_invest                                  as fixedAssetsInvestment,
//       project_digital_investment_attracting.yq_cz   as expectedAnnualOutput,
//       project_digital_investment_attracting.yq_kpxs as yqKpxs,
//       project_digital_investment_attracting.yq_ss   as yqSs
//from enterprise_lifecycle.project_digital_investment_attracting
//         join ext_zs_proj_project_signed
//              on project_digital_investment_attracting.invest_online_id = ext_zs_proj_project_signed.id
//         LEFT join system_area on project_digital_investment_attracting.park = system_area.id
//where project_digital_investment_attracting.Id in (select distinct digital_investment_id
//                                                   from enterprise_lifecycle.project_digital_project_review_all
//                                                   where step = 2)
//  and project_digital_investment_attracting.deleted = 0
//  and is_project_review = 1
//  and project_digital_investment_attracting.source = '市级机关推荐'
//  and ext_zs_proj_project_signed.sjjg_name not like ''
//  AND (
//    current_project_progress != '2'
//        OR (current_project_progress = '2' AND project_digital_investment_attracting.check_status = 1)
//    )
//        <if test="projectCode != null and projectCode != ''">
//            AND project_code = #{projectCode}
//        </if>
//        <if test="projectName != null and projectName != ''">
//            AND project_name LIKE CONCAT('%', #{projectName}, '%')
//        </if>
//        <if test="currentProjectProgress != null and currentProjectProgress.size() > 0">
//            AND audit_status IN
//            <foreach item="status" collection="currentProjectProgress" open="(" separator="," close=")">
//                <!-- 如果列表里是字符串代表的数字，可能需要转换，或者直接传数字列表 -->
//                #{status}
//            </foreach>
//        </if>
//        <if test="projectContent != null and projectContent != ''">
//            AND project_content LIKE CONCAT('%', #{projectContent}, '%')
//        </if>
//        <if test="attractorUnit != null and attractorUnit != ''">
//            AND attractor_unit LIKE CONCAT('%', #{attractorUnit}, '%')
//        </if>
//        <if test="year != null">
//        AND signing_time &gt;= STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d')
//        AND signing_time &lt; DATE_ADD(STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d'), INTERVAL 1 YEAR)
//        AND (project_digital_investment_attracting.check_status = 1 AND current_project_progress = 2 OR current_project_progress != 2)
//        </if>
//         <if test="industryOrService != null and industryOrService != ''">
//            AND project_type = #{industryOrService}
//        </if>
//         <if test="applyTime1 != null">
//            <!-- 假设申请时间字段为 apply_time，需根据实际字段名调整 -->
//            AND apply_time &gt;= #{applyTime1}
//        </if>
//
//        <if test="applyTime2 != null">
//            AND apply_time &lt;= #{applyTime2}
//        </if>
//</script>
//  """
//    )
//    fun getProjectExportData(param: ProjectDigitalInvestmentAttractingParam): List<ProjectQYPOJO>
//
//    @Select(
//        """<script>
//SELECT
//    p1.project_name                          AS projectName,
//    t2.name                                  AS city,
//    COALESCE(t1.name, CAST(p1.park AS CHAR)) AS park,
//    p2_min.create_time                       AS createTime,
//    p1.project_type                          AS projectType,
//    p1.source                                AS source,
//    p1.sjjg_name                             AS sjjgName,
//    CASE
//        WHEN p1.audit_status_kaigong = 1 THEN '部门审核中'
//        WHEN p1.audit_status_kaigong = 2 THEN '部门审核通过'
//        WHEN p1.audit_status_kaigong = 3 THEN '部门审核退回'
//        WHEN p1.audit_status_kaigong = 4 THEN '专班审核中'
//        WHEN p1.audit_status_kaigong = 5 THEN '专班审核通过'
//        WHEN p1.audit_status_kaigong = 6 THEN '专班审核退回'
//        WHEN p1.audit_status_kaigong = 7 THEN '审核不通过'
//        WHEN p1.audit_status_kaigong = 8 THEN '通过不计分'
//        ELSE '无'
//    END                                      AS projectAuditStatus,
//    p1.project_content                       AS projectDesc,
//    e1.investor                              AS investor,
//    p1.project_rating                        AS projectRating,
//    p1.investment_amount                     AS investmentAmount,
//    p1.signing_time                          AS signStatDate,
//    e1.is_kc_proj                            AS kc,
//    e1.is_qflp                               AS qflp,
//    p1.project_category                      AS projectCategory,
//    p1.planned_total_investment              AS plannedTotalInvestment,
//    fixed_invest                          AS fixedInvest,
//    p1.yq_cz                                 AS expectedOutput,
//    p1.yq_kpxs                               AS expectedInvoiceSales,
//    p1.yq_ss                                 AS expectedTax
//FROM project_digital_investment_attracting p1
//         LEFT JOIN system_area t1 ON p1.park = t1.id
//         LEFT JOIN system_area t2 ON p1.district = t2.id
//         JOIN ext_zs_project_operation e1 ON p1.invest_online_id = e1.id
//    -- 关键：关联每个 digital_investment_id 对应 step=4 的最小 create_time 记录
//         LEFT JOIN (
//    SELECT
//        digital_investment_id,
//        MIN(create_time) AS create_time
//    FROM project_digital_project_review_all
//    WHERE step = 4 AND deleted = 0
//    GROUP BY digital_investment_id
//) p2_min ON p1.id = p2_min.digital_investment_id
//WHERE p1.audit_status_kaigong != 0
//  AND p1.deleted = 0
//   AND (district IN
//    <foreach collection='grantArea' item='item' separator=',' open='(' close=')'> #{item} </foreach>
//or park IN
//    <foreach collection='grantArea' item='item' separator=',' open='(' close=')'> #{item} </foreach>
//)
//  AND EXISTS (
//    SELECT 1
//    FROM project_digital_project_review_all p2x
//    WHERE p2x.digital_investment_id = p1.id
//      AND p2x.step = 4
//      AND p2x.deleted = 0
//)
//        <if test="projectCode != null and projectCode != ''">
//            AND p1.project_code = #{projectCode}
//        </if>
//        <if test="projectName != null and projectName != ''">
//            AND p1.project_name LIKE CONCAT('%', #{projectName}, '%')
//        </if>
//        <if test="projectContent != null and projectContent != ''">
//            AND p1.project_content LIKE CONCAT('%', #{projectContent}, '%')
//        </if>
//        <if test="attractorUnit != null and attractorUnit != ''">
//            AND p1.attractor_unit LIKE CONCAT('%', #{attractorUnit}, '%')
//        </if>
//        <if test="year != null">
//        AND p1.signing_time &gt;= STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d')
//        AND p1.signing_time &lt; DATE_ADD(STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d'), INTERVAL 1 YEAR)
//        AND (p1.check_status = 1 AND p1.current_project_progress = 2 OR p1.current_project_progress != 2)
//        </if>
//         <if test="industryOrService != null and industryOrService != ''">
//            AND p1.project_type = #{industryOrService}
//        </if>
//         <if test="startApprovalStatus != null">
//            AND p1.audit_status_kaigong = #{startApprovalStatus}
//        </if>
//         <if test="applyTime1 != null">
//            <!-- 申请时间字段为 apply_time -->
//            AND p1.apply_time &gt;= #{applyTime1}
//        </if>
//
//        <if test="applyTime2 != null">
//            AND p1.apply_time &lt;= #{applyTime2}
//        </if>
//</script>
//"""
//    )
//    fun getProjectKGExportData(param: ProjectDigitalInvestmentAttractingParam): List<ProjectKGPOJO>
//
//
//
//
//    @Select(
//        """<script>
//        select project_digital_investment_attracting.sjjg_name          as sjjgName,
//       project_name                                  as projectName,
//       case when current_project_progress=1 then '在谈'
//       when current_project_progress=2 then '签约'
//       when current_project_progress=3 then '注册'
//       when current_project_progress=4 then '备案'
//       when current_project_progress=5 then '报批'
//       when current_project_progress=6 then '开工'
//       when current_project_progress=7 then '竣工'
//       end as status,
//       project_content                               as projectDesc,
//       investor           as investor,
//       project_rating                                as projectRating,
//       investment_amount                             as investmentAmount,
//       COALESCE(a2.name, CAST(project_digital_investment_attracting.district AS CHAR))           as city,
//       COALESCE(a1.name, CAST(project_digital_investment_attracting.park AS CHAR)) AS park,
//       actual_signing_time       as signDate,
//       signing_time                                  as signStatDate,
//       project_type                                  as projectType,
//       is_kc_proj         as kc,
//       is_qflp            as qflp,
//       applied_land_area       as applyLand,
//       project_category                              as projectCategory,
//       zl_land_area       as leaseArea,
//       planned_total_investment                      as plannedInvestment,
//       fixed_asset_investment                                  as fixedAssetsInvestment,
//       yq_cz   as expectedAnnualOutput,
//       yq_kpxs as yqKpxs,
//       yq_ss   as yqSs,
//       start_confirm_date                                 as startDate,
//       end_confirm_date                                      as endDate
//from enterprise_lifecycle.project_digital_investment_attracting
//
//         LEFT join system_area a1 on project_digital_investment_attracting.park = a1.id
//         LEFT join system_area a2 on project_digital_investment_attracting.district = a2.id
//where project_digital_investment_attracting.deleted = 0
// AND (district IN
//    <foreach collection='grantArea' item='item' separator=',' open='(' close=')'> #{item} </foreach>
//or park IN
//    <foreach collection='grantArea' item='item' separator=',' open='(' close=')'> #{item} </foreach>
//)
//AND EXISTS (
//    SELECT 1
//    FROM project_digital_project_review_all p2x
//    WHERE p2x.digital_investment_id = project_digital_investment_attracting.id
//      AND p2x.step = 5
//      AND p2x.deleted = 0
//)      <if test="projectCode != null and projectCode != ''">
//            AND project_code = #{projectCode}
//        </if>
//        <if test="projectName != null and projectName != ''">
//            AND project_name LIKE CONCAT('%', #{projectName}, '%')
//        </if>
//        <if test="currentProjectProgress != null and currentProjectProgress.size() > 0">
//            AND current_project_progress IN
//            <foreach item="status" collection="currentProjectProgress" open="(" separator="," close=")">
//                <!-- 如果列表里是字符串代表的数字，可能需要转换，或者直接传数字列表 -->
//                #{status}
//            </foreach>
//        </if>
//        <if test="projectContent != null and projectContent != ''">
//            AND project_content LIKE CONCAT('%', #{projectContent}, '%')
//        </if>
//        <if test="attractorUnit != null and attractorUnit != ''">
//            AND attractor_unit LIKE CONCAT('%', #{attractorUnit}, '%')
//        </if>
//        <if test="park != null and park != ''">
//            AND park = #{park}
//        </if>
//        <if test="year != null">
//            AND signing_time &gt;= STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d')
//            AND signing_time &lt; DATE_ADD(STR_TO_DATE(CONCAT(#{year}, '-01-01'), '%Y-%m-%d'), INTERVAL 1 YEAR)
//            AND (project_digital_investment_attracting.check_status = 1 AND current_project_progress = 2 OR current_project_progress != 2)
//        </if>
//         <if test="startApprovalStatus != null">
//            AND start_approval_status = #{startApprovalStatus}
//        </if>
//         <if test="applyTime1 != null">
//            <!-- 假设申请时间字段为 apply_time，需根据实际字段名调整 -->
//            AND apply_time &gt;= #{applyTime1}
//        </if>
//
//        <if test="applyTime2 != null">
//            AND apply_time &lt;= #{applyTime2}
//        </if>
//</script>
//  """
//    )
//    fun getProjectJGExportData(param: ProjectDigitalInvestmentAttractingParam): List<ProjectJGPOJO>
}
