package com.tzdig.framework.tzt.model

data class TaskRequest(
    val orgId: String,
    val staffIds: List<String>,
    val appCategoryName: String,
    val thirdUniCode: String,
    val subject: String,
    val descriptionType: String = "2",
    val descriptionKVs: List<DescriptionKV>,
    val cardLink: String,
    val pcCardLink: String,
    val statusTagNo: String,
    val statusTagYes: String,
) {
    data class DescriptionKV(
        val key: String,
        val value: String,
    )
}
