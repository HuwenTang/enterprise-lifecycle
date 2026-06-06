package com.tzdig.framework.tzt.model

data class DepartmentsResult(
    val departments: List<Department>,
) {
    data class Department(
        val id: String,
        val name: String,
        val externalId: String,
        val hasChildren: Boolean?,
        val membersCount: Int?,
        val orderNumber: Int,
        val ancestorDepartments: List<AncestorDepartment>
    )

    data class AncestorDepartment(
        val id: String,
        val name: String,
    )
}
