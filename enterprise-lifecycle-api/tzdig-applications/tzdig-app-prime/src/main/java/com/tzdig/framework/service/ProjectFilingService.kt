package com.tzdig.framework.service

import com.tzdig.framework.model.dto.ProjectNonInvestmentConfirmationDTO

interface ProjectFilingService {

    fun createProject(dto: ProjectNonInvestmentConfirmationDTO)

    fun deleteProjectByCode(projectCode: String)
}
