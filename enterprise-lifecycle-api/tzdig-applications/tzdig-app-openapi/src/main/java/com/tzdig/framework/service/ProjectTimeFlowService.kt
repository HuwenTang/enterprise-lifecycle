package com.tzdig.framework.service

import com.tzdig.framework.model.vo.ProjectTimeFlowVO

interface ProjectTimeFlowService {
    fun getTimeFlow(id: String): List<ProjectTimeFlowVO>
}
