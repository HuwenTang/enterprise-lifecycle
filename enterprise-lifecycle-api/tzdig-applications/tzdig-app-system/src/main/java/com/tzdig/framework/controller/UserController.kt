package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckRole
import cn.dev33.satoken.annotation.SaMode
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.core.util.sha1
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.model.dto.ResetPasswordDTO
import com.tzdig.framework.model.vo.UserVO
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.entity.system.UserXOrganization
import com.tzdig.framework.mybatis.entity.system.UserXRole
import com.tzdig.framework.mybatis.mapper.prime.LhbForeignInvestmentProjectsMapper
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.TaizhengtongService
import com.tzdig.framework.tzt.model.SignatureResult
import com.tzdig.framework.tzt.service.TaizhengtongClient
import com.tzdig.framework.web.annotation.Log
import com.tzdig.framework.web.annotation.LogType
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux

@Tag(name = "用户管理")
@SaCheckRole(SystemRole.ROOT, SystemRole.USER_ADMIN, mode = SaMode.OR)
@RestController
@RequestMapping("user")
class UserController(
    private val userService: UserService,
    private val taizhengtongClient: TaizhengtongClient,
    private val taizhengtongService: TaizhengtongService,
) {
    @Operation(summary = "用户列表")
    @GetMapping
    @PageableQuery
    fun listUser(
        @Schema(description = "姓名")
        @RequestParam(defaultValue = "") name: String,
        @Schema(description = "手机号")
        @RequestParam(defaultValue = "") mobile: String,
        @Schema(description = "组织ID")
        @RequestParam(defaultValue = "") organizationId: String,
        @Schema(description = "角色ID")
        @RequestParam(defaultValue = SystemRole.DEFAULT) roleId: String,
        @Schema(description = "是否授权泰政通")
        @RequestParam(required = false) grantForTaizhengtong: Boolean?,
    ): PageableResult<UserVO> {
        val isRoot = userAccount.hasRole(SystemRole.ROOT)
        val isAdmin = userAccount.hasRole(SystemRole.USER_ADMIN)
        val xo = when {
            isRoot && organizationId.isNotEmpty() -> {
                val organizationIds = userService.getLowerOrganizationIds(organizationId)
                filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
            }

            (isAdmin && DataGrantsUtils.hasAnyGrantedArea(
                AreaConstant.TAIZHOU_CODE,
                AreaConstant.JINGJIANG_CODE,
                AreaConstant.TAIXING_CODE,
                AreaConstant.XINGHUA_CODE,
                AreaConstant.HAILING_CODE,
                AreaConstant.JIANGYAN_CODE,
                AreaConstant.XINGAO_CODE,
            )) -> {
                var baseOrgId = when {
                    DataGrantsUtils.hasGrantedArea(AreaConstant.TAIZHOU_CODE) -> DeptConstant.ROOT
                    DataGrantsUtils.hasGrantedArea(AreaConstant.JINGJIANG_CODE) -> DeptConstant.JINGJIANG_CODE
                    DataGrantsUtils.hasGrantedArea(AreaConstant.TAIXING_CODE) -> DeptConstant.TAIXING_CODE
                    DataGrantsUtils.hasGrantedArea(AreaConstant.XINGHUA_CODE) -> DeptConstant.XINGHUA_CODE
                    DataGrantsUtils.hasGrantedArea(AreaConstant.HAILING_CODE) -> DeptConstant.HAILING_CODE
                    DataGrantsUtils.hasGrantedArea(AreaConstant.JIANGYAN_CODE) -> DeptConstant.JIANGYAN_CODE
                    DataGrantsUtils.hasGrantedArea(AreaConstant.XINGAO_CODE) -> DeptConstant.XINGAO_CODE
                    else -> ""
                }
                val exclude = userService.getUpperOrganizationIds(baseOrgId)
                if (organizationId !in exclude)
                    baseOrgId = organizationId
                val organizationIds = userService.getLowerOrganizationIds(baseOrgId)
                filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
            }

            !isRoot -> {
                val cobs = userService.getCobsByUserid(userAccount.id!!)
                if (cobs.isEmpty()) {
                    return PageableResult.empty(pageable)
                }
                var organizationIds = filter<UserOrganization> { UserOrganization::cob inList cobs }.map { it.id!! }
                if (organizationId.isEmpty() || organizationId !in organizationIds) {
                    filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
                } else {
                    organizationIds = userService.getLowerOrganizationIds(organizationId)
                    filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
                }
            }

            else -> null
        }
        if (xo != null && xo.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val xr = if (roleId.isEmpty() || roleId == SystemRole.DEFAULT) null
        else filter<UserXRole> { UserXRole::roleId eq roleId }
        if (xr != null && xr.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val page = paginate<UserAccount>(pageable.pageNumber, pageable.pageSize) {
            if (xo != null) and(UserAccount::id inList xo.map { it.userid!! })
            if (xr != null) and(UserAccount::id inList xr.map { it.userid!! })
            if (grantForTaizhengtong != null) and(UserAccount::grantForTaizhengtong eq grantForTaizhengtong)
            if (name.isNotEmpty()) and(UserAccount::realName like name)
            if (mobile.isNotEmpty()) and(UserAccount::mobile like mobile)
            orderBy(UserAccount::createTime).desc()
        }.map(::UserVO)
        return PageableResult.of(page)
    }

//    @Operation(summary = "用户管理导出")
//    @PutMapping("export")
//    fun exportUser(
//        @Schema(description = "姓名")
//        @RequestParam(defaultValue = "") name: String,
//        @Schema(description = "手机号")
//        @RequestParam(defaultValue = "") mobile: String,
//        @Schema(description = "组织ID")
//        @RequestParam(defaultValue = "") organizationId: String,
//        @Schema(description = "角色ID")
//        @RequestParam(defaultValue = SystemRole.DEFAULT) roleId: String,
//        @Schema(description = "是否授权泰政通")
//        @RequestParam(required = false) grantForTaizhengtong: Boolean?,
//    ){
//        val isRoot = userAccount.hasRole(SystemRole.ROOT)
//        val isAdmin = userAccount.hasRole(SystemRole.USER_ADMIN)
//        val xo = when {
//            isRoot && organizationId.isNotEmpty() -> {
//                val organizationIds = userService.getLowerOrganizationIds(organizationId)
//                filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
//            }
//
//            (isAdmin && DataGrantsUtils.hasAnyGrantedArea(
//                AreaConstant.TAIZHOU_CODE,
//                AreaConstant.JINGJIANG_CODE,
//                AreaConstant.TAIXING_CODE,
//                AreaConstant.XINGHUA_CODE,
//                AreaConstant.HAILING_CODE,
//                AreaConstant.JIANGYAN_CODE,
//                AreaConstant.XINGAO_CODE,
//            )) -> {
//                var baseOrgId = when {
//                    DataGrantsUtils.hasGrantedArea(AreaConstant.TAIZHOU_CODE) -> DeptConstant.ROOT
//                    DataGrantsUtils.hasGrantedArea(AreaConstant.JINGJIANG_CODE) -> DeptConstant.JINGJIANG_CODE
//                    DataGrantsUtils.hasGrantedArea(AreaConstant.TAIXING_CODE) -> DeptConstant.TAIXING_CODE
//                    DataGrantsUtils.hasGrantedArea(AreaConstant.XINGHUA_CODE) -> DeptConstant.XINGHUA_CODE
//                    DataGrantsUtils.hasGrantedArea(AreaConstant.HAILING_CODE) -> DeptConstant.HAILING_CODE
//                    DataGrantsUtils.hasGrantedArea(AreaConstant.JIANGYAN_CODE) -> DeptConstant.JIANGYAN_CODE
//                    DataGrantsUtils.hasGrantedArea(AreaConstant.XINGAO_CODE) -> DeptConstant.XINGAO_CODE
//                    else -> ""
//                }
//                val exclude = userService.getUpperOrganizationIds(baseOrgId)
//                if (organizationId !in exclude)
//                    baseOrgId = organizationId
//                val organizationIds = userService.getLowerOrganizationIds(baseOrgId)
//                filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
//            }
//
//            !isRoot -> {
//                val cobs = userService.getCobsByUserid(userAccount.id!!)
//                if (cobs.isEmpty()) {
//                    emptyList()
//                }
//                var organizationIds = filter<UserOrganization> { UserOrganization::cob inList cobs }.map { it.id!! }
//                if (organizationId.isEmpty() || organizationId !in organizationIds) {
//                    filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
//                } else {
//                    organizationIds = userService.getLowerOrganizationIds(organizationId)
//                    filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
//                }
//            }
//
//            else -> null
//        }
//        if (xo != null && xo.isEmpty()) {
//            return PageableResult.empty(pageable)
//        }
//        val xr = if (roleId.isEmpty() || roleId == SystemRole.DEFAULT) null
//        else filter<UserXRole> { UserXRole::roleId eq roleId }
//        if (xr != null && xr.isEmpty()) {
//            return PageableResult.empty(pageable)
//        }
//        val queryWrapper = QueryScope().apply {
//            if (xo != null) and(UserAccount::id inList xo.map { it.userid!! })
//            if (xr != null) and(UserAccount::id inList xr.map { it.userid!! })
//            if (grantForTaizhengtong != null) and(UserAccount::grantForTaizhengtong eq grantForTaizhengtong)
//            if (name.isNotEmpty()) and(UserAccount::realName like name)
//            if (mobile.isNotEmpty()) and(UserAccount::mobile like mobile)
//            orderBy(UserAccount::createTime).desc()
//        }
//        val file = ExcelWriteUtils(::class)
//            .writeWith(createNewTempFile("xlsx"), fields) {
//                val mapper = mapper<LhbForeignInvestmentProjectsMapper>()
//                Flux.create { emitter ->
//                    Db.tx {
//                        val records = mapper.selectCursorByQuery(queryWrapper)
//                        for (record in records) emitter.next(LhbForeignInvestmentProjectsVO(record))
//                        emitter.complete()
//                        true
//                    }
//                }
//            }
//        return file.downloadVO("外资利润再投资项目统计表导出.xlsx")
//    }
//
//

    @Log("用户管理/授权", type = LogType.UPDATE)
    @Operation(summary = "泰政通授权")
    @PutMapping("{userid}/grantForTaizhengtong")
    fun grantForTaizhengtong(
        @Schema(description = "用户ID")
        @PathVariable userid: String,
        @RequestBody dto: SimpleValueDTO<Boolean>,
    ) {
        val appToken = taizhengtongClient.getAppToken()
        taizhengtongService.grantForTaizhengtongByTag(appToken, userid, dto.value)
    }

    @Log("用户管理/授权", type = LogType.UPDATE)
    @Operation(summary = "泰政通批量授权")
    @PutMapping("/grantForTaizhengtong/batch")
    fun grantForTaizhengtongBatch(
        @Schema(description = "用户ID")
        @RequestParam userMobiles: List<String>,
    ) {
        val appToken = taizhengtongClient.getAppToken()
        val userIds = filter<UserAccount> {
            UserAccount::mobile inList userMobiles
        }.mapNotNull { it.id }
        userIds.forEach {
            taizhengtongService.grantForTaizhengtongByTag(appToken, it, true)
        }
    }

    @Operation(summary = "JSAPI签名")
    @GetMapping("jsapiSign")
    fun getJsApiSignature(
        @RequestParam url: String,
    ): SignatureResult {
        val appToken = taizhengtongClient.getAppToken()
        val jsapi = taizhengtongClient.getJsApiToken(appToken)
        return taizhengtongClient.getSignature(jsapi, url)
    }

    @Log("用户管理/重置密码", type = LogType.UPDATE)
    @Operation(summary = "重置密码")
    @PutMapping("{id}/password")
    fun resetPassword(
        @PathVariable id: String,
        @RequestBody dto: ResetPasswordDTO,
    ) {
        val userAccount = userService.getUserAccountById(id)
            ?: throw NotFoundException("用户不存在")
        userAccount.password = "${userAccount.id}+${dto.password}".toByteArray().sha1()
        userAccount.updateById()
        userService.updateCache(userAccount)
    }
}
