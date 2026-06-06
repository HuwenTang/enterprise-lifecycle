package com.tzdig.framework.tzt.service

import com.alibaba.fastjson2.JSONObject
import com.tzdig.framework.tzt.model.DepartmentStaffsResult
import com.tzdig.framework.tzt.model.DepartmentsResult
import com.tzdig.framework.tzt.model.SignatureResult
import com.tzdig.framework.tzt.model.TaskRequest

interface TaizhengtongClient {
    fun getAppToken(): String
    fun getJsApiToken(appToken: String): String
    fun getSignature(jsApiToken: String, url: String): SignatureResult
    fun getUserToken(appToken: String, code: String): String?
    fun getMobile(appToken: String, userToken: String): String?
    fun getTags(appToken: String, staffId: String): MutableSet<String>?
    fun setTags(appToken: String, staffId: String, tags: Set<String>)

    fun fetchDepartments(appToken: String, organizationId: String): DepartmentsResult?
    fun fetchStaffs(appToken: String, organizationId: String): DepartmentStaffsResult?

    fun createTask(appToken: String, taskRequest: TaskRequest): String?
    fun getTaskInfo(appToken: String, taskCode: String): JSONObject?
    fun updateTaskStatus(appToken: String, taskCode: String, staffId: String, status: Int)
    fun deleteTask(appToken: String, taskCode: String)
}
