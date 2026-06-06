package com.tzdig.framework.controller

import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.task.SyncOrganizationTask
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.dao.CannotAcquireLockException
import org.springframework.web.bind.annotation.*

@Tag(name = "组织管理")
@SaCheckRoot
@RestController
@RequestMapping("organization")
class OrganizationSyncController(
    private val syncOrganizationTask: SyncOrganizationTask,
) {
    @Operation(summary = "同步组织架构")
    @PostMapping("sync")
    fun syncOrganization(): SimpleValueDTO<String> {
        try {
            syncOrganizationTask.syncDepartments()
            return SimpleValueDTO("同步完成。")
        } catch (_: CannotAcquireLockException) {
            return SimpleValueDTO("正在同步中，请稍候...")
        }
    }

    @Operation(summary = "同步部门人员")
    @PostMapping("{organizationId}/sync-staff")
    fun syncOrganizationStaff(
        @Schema(description = "组织ID")
        @PathVariable organizationId: String,
        @Schema(description = "是否同步子部门")
        @RequestParam(defaultValue = "false") recursive: Boolean
    ) {
        syncOrganizationTask.syncStaffs(organizationId, recursive)
    }
}
