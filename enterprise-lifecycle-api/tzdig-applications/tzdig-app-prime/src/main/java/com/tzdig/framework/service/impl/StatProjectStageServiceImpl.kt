package com.tzdig.framework.service.impl

import com.tzdig.framework.model.vo.ProjectStageCountVo
import com.tzdig.framework.mybatis.bo.ProjectStatOverviewStatBo
import com.tzdig.framework.service.StatProjectStageService
import org.springframework.stereotype.Service

@Service
class StatProjectStageServiceImpl : StatProjectStageService {
    override fun getTempStageData(
        district: String,
        park: String,
        divisionStageMap: Map<String, List<ProjectStatOverviewStatBo>>,
        stageList: List<String>,
    ): ProjectStageCountVo = with(ProjectStageCountVo()) {
        this.district = district
        this.park = park
        for (stage in stageList) {
            val list = divisionStageMap[stage]
            val projectStatOverviewStatBo = list?.firstOrNull()
                ?: ProjectStatOverviewStatBo().apply { stageCount = 0L }
            when (stage) {
                "1" -> stageApprovalCount = projectStatOverviewStatBo.stageCount
                "2" -> stageECCount = projectStatOverviewStatBo.stageCount
                "3" -> stagePermitStageCount = projectStatOverviewStatBo.stageCount
                "4" -> stageCompleted = projectStatOverviewStatBo.stageCount
            }
        }
        this
    }
}
