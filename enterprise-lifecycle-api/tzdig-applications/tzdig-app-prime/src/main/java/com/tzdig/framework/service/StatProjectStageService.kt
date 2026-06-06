package com.tzdig.framework.service

import com.tzdig.framework.model.vo.ProjectStageCountVo
import com.tzdig.framework.mybatis.bo.ProjectStatOverviewStatBo

interface StatProjectStageService {
    fun getTempStageData(
        district: String,
        park: String,
        divisionStageMap: Map<String, List<ProjectStatOverviewStatBo>>,
        stageList: List<String>,
    ): ProjectStageCountVo
}
