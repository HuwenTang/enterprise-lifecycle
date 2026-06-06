package com.tzdig.framework.mybatis.dao

import com.mybatisflex.annotation.UseDataSource
import com.tzdig.framework.mybatis.bo.ProjectStageStatBo
import com.tzdig.framework.mybatis.bo.StageOverViewDeptGroupBO
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import java.time.LocalDateTime

@Mapper
@UseDataSource("gong-gai")
interface ProjectConstructionApprovalDAO {
    @Select(
        """
        select pca.project_type projectType , CASE pca.project_type
        WHEN 'ZFTZFWJZLXM1' THEN '政府投资房屋建筑类项目'
        WHEN 'ZFTZJCSSXXGCL2' THEN '政府投资基础设施线性工程类'
        WHEN 'YBSHTZLXM3' THEN '一般社会投资类项目'
        WHEN 'SHTZZXXGCXM4' THEN '社会投资中小型工程项目'
        WHEN 'SHTZDFACRYD5' THEN '社会投资带方案出让用地'
        ELSE '其他'
    END AS  zhProjectType,pca.project_code projectCode,pcap.document_number documentNumber, pcii.item_name itemName,pcr.stage,pcii.create_time createTime
    from project_construction_approval  pca
    LEFT JOIN project_construction_approval_process pcap on pca.project_code= pcap.project_code
    left join project_construction_item_info pcii on pcap.document_number = pcii.document_number
    left join  project_construction_relation pcr on pcr.is_basic_process='是' and pcr.item_name =pcii.item_name  
    where pca.project_code=#{projectCode}
    order by createTime
    """
    )
    fun getProjectStageStatBo(@Param("projectCode") projectCode: String): List<ProjectStageStatBo>

    @Select(
        """
            <script>
            select distinct pcap.document_number
            from project_construction_approval  pca
            LEFT JOIN project_construction_approval_process pcap on pca.project_code= pcap.project_code
            left join project_construction_item_info pcii on pcap.document_number = pcii.document_number
            where pca.project_code=#{projectCode}
                 and pcii.item_name in 
                <foreach collection='itemNameList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
            </script>
             """
    )
    fun getProjectDocumentNumber(
        @Param("projectCode") projectCode: String,
        @Param("itemNameList") itemNameList: MutableList<String>
    ): List<String>

    @Select(
        """
            select item_name
            from project_construction_item_info
            where document_number = #{documentNumber}
            order by create_time desc
            limit 1
             """
    )
    fun getItemNameOfDocumentNumber(@Param("documentNumber") documentNumber: String): String?

    @Select(
        """<script>
        select distinct p.project_code
        from project_construction_item_info i
        join (
            select project_code, document_number, min(create_time) as min_create_time
            from project_construction_approval_process
            group by project_code, document_number
            having min_create_time between #{startTime} and #{endTime}
        ) p on p.document_number = i.document_number
        where i.item_name in
        <foreach collection='itemNameList' item='item' separator=',' open='(' close=')'> #{item} </foreach>
    </script>"""
    )
    fun getProjectCodeByItemNameAndCreateTime(
        @Param("itemNameList") itemNameList: Collection<String>,
        @Param("startTime") startTime: LocalDateTime,
        @Param("endTime") endTime: LocalDateTime,
    ): List<String>

    @Select(
        """
        select i.approval_department             as approvalDepartment,
               count(distinct i.document_number) as documentCount,
               avg(p.duration_seconds)           as avgDuration
        from project_construction_item_info i
                 join (select document_number,
                              timestampdiff(hour, min(create_time), max(create_time)) as duration_seconds
                       from project_construction_approval_process
                       where create_time between #{startTime} and #{endTime}
                       group by document_number) p on i.document_number = p.document_number
        group by i.approval_department
        having avgDuration > 0
        order by i.approval_department;
    """
    )
    fun stageOverViewDeptGroup(
        @Param("startTime") startTime: LocalDateTime,
        @Param("endTime") endTime: LocalDateTime,
    ): List<StageOverViewDeptGroupBO>
}
