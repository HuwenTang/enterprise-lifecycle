package com.tzdig.framework.service

interface TaizhengtongService {
    fun grantForTaizhengtongByTag(appToken: String, userid: String, value: Boolean)
    fun syncDepartments(appToken: String, organizationId: String)
    fun syncStaffs(appToken: String, organizationId: String)
}
