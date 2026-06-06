@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDeptScore
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectDeptScoreDTO(
    @param:Schema(description = "部门名称")
    val deptName: String?,
    @param:Schema(description = "部门id")
    val deptId: String?,
    @param:Schema(description = "部门分类")
    val deptClass: String?,
    @param:Schema(description = "年度")
    val year: Int?,
    @param:Schema(description = "计分")
    val score: Float?,
    @param:Schema(description = "实际得分（未被缩减过的）")
    val actualScore: Float?,
    @param:Schema(description = "签约得分")
    val signScore: Float?,
    @param:Schema(description = "实际签约得分")
    val actualSignScore: Float?,
    @param:Schema(description = "开工得分")
    val startScore: Float?,
    @param:Schema(description = "实际开工得分")
    val actualStartScore: Float?,
) {
    fun toProjectDeptScore(): ProjectDeptScore =
        ProjectDeptScore {
            into(this)
        }

    fun into(record: ProjectDeptScore): ProjectDeptScore {
        record.deptName = deptName
        record.deptId = deptId
        record.deptClass = deptClass
        record.year = year
        record.score = score
        record.actualScore = actualScore
        record.signScore = signScore
        record.actualSignScore = actualSignScore
        record.startScore = startScore
        record.actualStartScore = actualStartScore
        return record
    }
}
