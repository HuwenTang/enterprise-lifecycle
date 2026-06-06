package com.tzdig.framework.service

import com.tzdig.framework.model.dto.ProjectDigitalDataChangelogDTO

interface DataChangeLogService {

    fun createDataChangeLog(dto: ProjectDigitalDataChangelogDTO)
}
