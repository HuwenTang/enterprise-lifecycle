package com.tzdig.framework.service.impl

import com.tzdig.framework.model.dto.ProjectDigitalDataChangelogDTO
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.service.DataChangeLogService
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class DataChangeLogServiceImpl : DataChangeLogService {
    override fun createDataChangeLog(dto: ProjectDigitalDataChangelogDTO) {
        dto.author = userAccount.realName
        dto.changedAt = LocalDateTime.now()
        val record = dto.toProjectDigitalDataChangelog()
        record.save()
    }
}
