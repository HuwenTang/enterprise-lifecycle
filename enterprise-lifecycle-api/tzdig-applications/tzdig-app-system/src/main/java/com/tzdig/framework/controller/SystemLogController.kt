package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.vo.SystemLogVO
import com.tzdig.framework.mybatis.entity.system.SystemLog
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.mapper.system.SystemLogMapper
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.time.LocalDate

@Tag(name = "系统日志管理")
@RestController
@RequestMapping("system-log")
class SystemLogController(
    private val userService: UserService,
) {
    @Operation(summary = "查询系统日志列表")
    //@SaCheckPermission("system-log::query")
    @GetMapping
    @PageableQuery
    fun listSystemLog(
        @Schema(description = "用户姓名")
        @RequestParam(defaultValue = "") userName: String,
        @Schema(description = "日志名称")
        @RequestParam(defaultValue = "") name: String,
        @Schema(description = "日志类型")
        @RequestParam(required = false) type: SystemLog.Type?,
        @Schema(description = "请求方法")
        @RequestParam(defaultValue = "") method: String,
        @Schema(description = "是否成功")
        @RequestParam(required = false) success: Boolean?,
        @Schema(description = "开始时间")
        @RequestParam(required = false) startTime: LocalDate?,
        @Schema(description = "结束时间")
        @RequestParam(required = false) endTime: LocalDate?,
    ): PageableResult<SystemLogVO> {
        val accounts = if (userName.isEmpty()) null else
            query<UserAccount> { where(UserAccount::realName like userName) }
        if (accounts != null && accounts.isEmpty()) return PageableResult.empty(pageable)
        val page = paginate<SystemLog>(pageable.pageNumber, pageable.pageSize) {
            if (accounts != null) and(SystemLog::userid inList accounts.map { it.id!! })
            if (name.isNotEmpty()) and(SystemLog::name like name)
            if (type != null) and(SystemLog::type eq type)
            if (method.isNotEmpty()) and(SystemLog::method eq method)
            if (success != null) and(SystemLog::success eq success)
            if (startTime != null) and(SystemLog::startTime gt startTime.atStartOfDay())
            if (endTime != null) and(SystemLog::endTime lt endTime.plusDays(1).atStartOfDay())
            orderBy(SystemLog::startTime).desc()
        }.map(::SystemLogVO)
        if (page.records.isNotEmpty()) {
            val userMap = queryListByIds<UserAccount>(page.records.mapNotNull { it.userid })
                .associateBy { it.id }
            page.records.forEach {
                val user = userMap[it.userid]
                it.userName = user?.realName
            }
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询系统日志")
    //@SaCheckPermission("system-log::query")
    @GetMapping("{id}")
    fun getSystemLog(
        @PathVariable id: String,
    ): SystemLogVO {
        val record = queryOneById<SystemLog>(id)
            ?: throw NotFoundException("系统日志不存在")
        return SystemLogVO(record)
    }

    @Operation(summary = "批量导出系统日志")
    //@SaCheckPermission("system-log::query")
    @GetMapping("export.xlsx")
    fun exportSystemLog(
        @Schema(description = "用户姓名")
        @RequestParam(defaultValue = "") userName: String,
        @Schema(description = "日志名称")
        @RequestParam(defaultValue = "") name: String,
        @Schema(description = "日志类型")
        @RequestParam(required = false) type: SystemLog.Type?,
        @Schema(description = "请求方法")
        @RequestParam(defaultValue = "") method: String,
        @Schema(description = "是否成功")
        @RequestParam(required = false) success: Boolean?,
        @Schema(description = "开始时间")
        @RequestParam(required = false) startTime: LocalDate?,
        @Schema(description = "结束时间")
        @RequestParam(required = false) endTime: LocalDate?,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val accounts = if (userName.isEmpty()) null else
            query<UserAccount> { where(UserAccount::realName like userName) }
        val wrapper = with(QueryWrapper()) {
            if (accounts != null) and(SystemLog::userid inList accounts.map { it.id!! })
            if (name.isNotEmpty()) and(SystemLog::name like name)
            if (type != null) and(SystemLog::type eq type)
            if (method.isNotEmpty()) and(SystemLog::method eq method)
            if (success != null) and(SystemLog::success eq success)
            if (startTime != null) and(SystemLog::startTime gt startTime.atStartOfDay())
            if (endTime != null) and(SystemLog::endTime lt endTime.plusDays(1).atStartOfDay())
            orderBy(SystemLog::startTime).desc()
        }
        val file = ExcelWriteUtils(SystemLogVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                if (accounts != null && accounts.isEmpty()) return@writeWith Flux.empty()
                val mapper = mapper<SystemLogMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(wrapper)
                        for (record in records) {
                            val vo = SystemLogVO(record)
                            if (record.userid != null) {
                                val userAccount = userService.getUserAccountById(record.userid!!)
                                vo.userName = userAccount?.realName
                            }
                            emitter.next(vo)
                        }
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("系统日志导出.xlsx")
    }
}
