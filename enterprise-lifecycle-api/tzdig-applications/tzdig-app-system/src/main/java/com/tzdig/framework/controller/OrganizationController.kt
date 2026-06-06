package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.all
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryListByIds
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.model.dto.OrganizationDTO
import com.tzdig.framework.model.vo.CascadeVO
import com.tzdig.framework.model.vo.KVPairList
import com.tzdig.framework.model.vo.KVPairVO
import com.tzdig.framework.model.vo.OrganizationVO
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "组织管理")
@RestController
@RequestMapping("organization")
class OrganizationController(
    private val userService: UserService,
) {
    @Operation(summary = "组织架构树")
    @GetMapping("cascade")
    fun cascadeOrganization(): List<CascadeVO<String>> {
        val orgList = if (userAccount.hasRole(SystemRole.ROOT)) {
            all<UserOrganization>()
        } else if (userAccount.hasRole(SystemRole.USER_ADMIN) && DataGrantsUtils.hasAnyGrantedArea(
                AreaConstant.TAIZHOU_CODE,
                AreaConstant.JINGJIANG_CODE,
                AreaConstant.TAIXING_CODE,
                AreaConstant.XINGHUA_CODE,
                AreaConstant.HAILING_CODE,
                AreaConstant.JIANGYAN_CODE,
                AreaConstant.XINGAO_CODE,
            )
        ) {
            val baseOrgId = when {
                DataGrantsUtils.hasGrantedArea(AreaConstant.TAIZHOU_CODE) -> DeptConstant.ROOT
                DataGrantsUtils.hasGrantedArea(AreaConstant.JINGJIANG_CODE) -> DeptConstant.JINGJIANG_CODE
                DataGrantsUtils.hasGrantedArea(AreaConstant.TAIXING_CODE) -> DeptConstant.TAIXING_CODE
                DataGrantsUtils.hasGrantedArea(AreaConstant.XINGHUA_CODE) -> DeptConstant.XINGHUA_CODE
                DataGrantsUtils.hasGrantedArea(AreaConstant.HAILING_CODE) -> DeptConstant.HAILING_CODE
                DataGrantsUtils.hasGrantedArea(AreaConstant.JIANGYAN_CODE) -> DeptConstant.JIANGYAN_CODE
                DataGrantsUtils.hasGrantedArea(AreaConstant.XINGAO_CODE) -> DeptConstant.XINGAO_CODE
                else -> return emptyList()
            }
            val lowerOrg = userService.getLowerOrganizationIds(baseOrgId)
            val upperOrg = userService.getUpperOrganizationIds(baseOrgId)
            val orgIds = (lowerOrg + upperOrg).toSet()
            if (orgIds.isEmpty()) return emptyList()
            queryListByIds(orgIds)
        } else {
            val cobs = userService.getCobsByUserid(userAccount.id!!)
            if (cobs.isEmpty()) return emptyList()
            val orgList = filter<UserOrganization> { UserOrganization::cob inList cobs }
            val upper = cobs.flatMap { userService.getUpperOrganizationIds(it) }
            if (upper.isEmpty()) orgList
            else {
                filter<UserOrganization> { UserOrganization::id inList upper } + orgList
            }
        }
        val list = orgList
            .distinctBy { it.id }
            .sortedBy { it.sort }
            .map { it.parentId to CascadeVO(it.id, it.name!!) }
        list.groupBy { it.first }
            .forEach { (parentId, pairs) ->
                val pair = list.find { it.second.value == parentId } ?: return@forEach
                pair.second.children = pairs.map { it.second }
            }
        return list.filter { it.first == null }.map { it.second }
    }

    @Operation(summary = "获取组织架构")
    @SaCheckRoot
    @GetMapping
    @PageableQuery
    fun getOrganization(
        @Schema(description = "搜索关键词：组织名称")
        @RequestParam("q", defaultValue = "") keyword: String,
        @Schema(description = "父级组织ID")
        @RequestParam(defaultValue = "") parentId: String,
    ): PageableResult<OrganizationVO> {
        val page = paginate<UserOrganization>(pageable.pageNumber, pageable.pageSize) {
            if (keyword.isNotEmpty()) and(UserOrganization::name like keyword)
            if (parentId.isNotEmpty()) and(UserOrganization::parentId like parentId)
            orderBy(UserOrganization::sort).asc()
        }.map(::OrganizationVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "新增组织架构")
    @SaCheckRoot
    @PostMapping
    fun createOrganization(
        @RequestBody dto: OrganizationDTO,
    ) {
        dto.toUserOrganization().save()
    }

    @Operation(summary = "修改组织架构")
    @SaCheckRoot
    @PutMapping("{id}")
    fun updateOrganization(
        @Schema(description = "组织ID")
        @PathVariable id: String,
        @RequestBody dto: OrganizationDTO,
    ) {
        val organization = userService.getUserOrganizationById(id)
            ?: throw NotFoundException("组织架构不存在")
        if (organization.parentId == null) {
            throw ApiException("根组织不允许修改")
        }
        userService.getUserOrganizationById(dto.parentId)
            ?: throw NotFoundException("父级组织不存在")
        dto.into(organization).updateById()
        userService.updateCache(organization)
    }

    @Operation(summary = "删除组织架构")
    @SaCheckRoot
    @DeleteMapping("{id}")
    fun deleteOrganization(
        @Schema(description = "组织ID")
        @PathVariable id: String,
    ) {
        val organization = userService.getUserOrganizationById(id)
            ?: throw NotFoundException("组织架构不存在")
        if (organization.parentId == null) {
            throw ApiException("根组织不允许删除")
        }
        organization.removeById()
        userService.removeCache(organization)
    }

    @Operation(summary = "全部委办局列表")
    @GetMapping("cob")
    fun allCob(): KVPairList<String> {
        val list = filter<UserOrganization> { UserOrganization::id eq UserOrganization::cob }
        return list.map {
            KVPairVO(it.id!!, it.name!!)
        }
    }
}
