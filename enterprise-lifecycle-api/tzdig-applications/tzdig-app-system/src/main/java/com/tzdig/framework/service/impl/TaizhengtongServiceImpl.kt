package com.tzdig.framework.service.impl

import com.mybatisflex.core.logicdelete.LogicDeleteManager
import com.mybatisflex.kotlin.extensions.db.deleteWith
import com.mybatisflex.kotlin.extensions.db.queryListByIds
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.notIn
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.entity.system.UserXOrganization
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.TaizhengtongService
import com.tzdig.framework.tzt.properties.TaizhengtongProperties
import com.tzdig.framework.tzt.service.TaizhengtongClient
import com.tzdig.framework.web.exception.NotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TaizhengtongServiceImpl(
    private val taizhengtongProperties: TaizhengtongProperties,
    private val taizhengtongClient: TaizhengtongClient,
    private val userService: UserService,
) : TaizhengtongService {
    override fun grantForTaizhengtongByTag(appToken: String, userid: String, value: Boolean) {
        val userAccount = queryOneById<UserAccount>(userid)
            ?: throw NotFoundException("用户不存在")
        val staffId = "${taizhengtongProperties.gid}-${userid}"
        val tags = taizhengtongClient.getTags(appToken, staffId)
            ?: throw NotFoundException("用户不存在")
        if (value) {
            tags.add(taizhengtongProperties.staffTagForApp)
        } else {
            tags.remove(taizhengtongProperties.staffTagForApp)
        }
        taizhengtongClient.setTags(appToken, staffId, tags)
        userAccount.grantForTaizhengtong = value
        userAccount.updateById()
        userService.updateCache(userAccount)
    }

    @Transactional
    override fun syncDepartments(appToken: String, organizationId: String) {
        val result = taizhengtongClient.fetchDepartments(appToken, organizationId)
            ?: return
        val nextOrgIds = mutableListOf<String>()
        val parentDept = queryOneById<UserOrganization>(organizationId)!!
        val records = result.departments.map { department ->
            val orgId = department.id.substring(taizhengtongProperties.gid.length + 1)
            val record = queryOneById<UserOrganization>(orgId) ?: UserOrganization { id = orgId }
            record.name = department.name
            record.parentId = organizationId
            record.path = department.ancestorDepartments.reversed()
                .joinToString("/") { it.name } + "/${department.name}"
            record.sort = department.orderNumber
            if (record.cob == null) {
                record.cob = parentDept.cob
            }
            if (department.hasChildren == true)
                nextOrgIds.add(record.id!!)
            record
        }
        if (records.isEmpty()) {
            deleteWith<UserOrganization> {
                (UserOrganization::parentId eq organizationId)
            }
        } else {
            deleteWith<UserOrganization> {
                (UserOrganization::parentId eq organizationId)
                    .and(UserOrganization::id notIn records.map { it.id!! })
            }
            LogicDeleteManager.execWithoutLogicDelete {
                with(records.filter { !it.updateById() }) {
                    if (isNotEmpty()) batchInsert()
                }
            }
        }
        for (nextOrgId in nextOrgIds) {
            syncDepartments(appToken, nextOrgId)
        }
    }

    @Transactional
    override fun syncStaffs(appToken: String, organizationId: String) {
        val result = taizhengtongClient.fetchStaffs(appToken, organizationId)
            ?: return
        val accounts = result.staffs?.run {
            val ids = map { it.id.substring(taizhengtongProperties.gid.length + 1) }
            queryListByIds<UserAccount>(ids)
                .associateBy { it.id }
        } ?: emptyMap()
        val records = result.staffs?.map { staff ->
            val tags = taizhengtongClient.getTags(appToken, staff.id)!!
            val staffId = staff.id.substring(taizhengtongProperties.gid.length + 1)
            val record = with(accounts[staffId] ?: UserAccount()) {
                id = staffId
                realName = staff.name
                mobile = staff.mobile
                if (password == null)
                    password = ""
                grantForTaizhengtong = tags.contains(taizhengtongProperties.staffTagForApp)
                this
            }
            run {
                val x = queryOne<UserXOrganization> {
                    where(UserXOrganization::userid eq record.id)
                    and(UserXOrganization::organizationId eq organizationId)
                } ?: UserXOrganization()
                x.userid = record.id
                x.organizationId = organizationId
                if (x.isAdministrator == null)
                    x.isAdministrator = false
                x.saveOrUpdate()
            }
            record
        }
        if (records.isNullOrEmpty()) {
            deleteWith<UserXOrganization> {
                (UserXOrganization::organizationId eq organizationId)
                    .and(UserXOrganization::isAdministrator eq false)
            }
        } else {
            deleteWith<UserXOrganization> {
                (UserXOrganization::organizationId eq organizationId)
                    .and(UserXOrganization::isAdministrator eq false)
                    .and(UserXOrganization::userid notIn records.map { it.id })
            }
            with(records.filter { !it.updateById() }) {
                if (isNotEmpty()) batchInsert()
            }
        }
    }
}
