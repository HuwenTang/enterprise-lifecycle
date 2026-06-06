package com.tzdig.framework.model.pojo

data class BmpgCallBackPOJO(
    /**
     * 项目id
     */
    val signedId: String,
    val pgList: List<PgListItem>,
) {
    data class PgListItem(
        /**
         * 项目id
         */
        val signedId: String,
        /**
         * 评估部门
         */
        val pgbm: String,
        /**
         * 评估意见
         */
        val pgyj: String,
        /**
         * 填报人
         */
        val name: String,
        /**
         * 状态
         */
        val status: String,
    )
}
