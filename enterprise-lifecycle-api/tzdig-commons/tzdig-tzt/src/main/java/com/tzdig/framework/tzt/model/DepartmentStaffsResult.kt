package com.tzdig.framework.tzt.model

data class DepartmentStaffsResult(
    val total: Int,
    val hasMore: Boolean,
    val staffs: List<Staff>?,
) {
    data class Staff(
        val id: String,
        val name: String,
        val mobile: String,
        val email: String,
        val orgId: Int,
        val orgName: String,
        val parentId: String,
        val photoResId: String,
        val status: Int,
    )
}
