@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.EnumValue
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_digital_project_review_all", comment = "招商项目审核表")
class ProjectDigitalProjectReviewAll() : BaseModel<ProjectDigitalProjectReviewAll>() {
    constructor(init: ProjectDigitalProjectReviewAll.() -> Unit) : this() {
        this.init()
    }

    /**
     * 招商id
     */
    @Column("digital_investment_id", comment = "招商id")
    var digitalInvestmentId: String? = null

    /**
     * 审核步骤
     */
    @Column("step", comment = "审核步骤")
    var step: Step? = null

    enum class Step(@EnumValue val value: String) {
        /**
         * 质态评估
         */
        QUALITY_EVALUATION("1"),

        /**
         * 项目部门审核
         */
        PROJECT_REVIEW("2"),

        /**
         * 项目专班审核
         */
        PROJECT_REVIEW_ZB("3"),

        /**
         * 项目开工部门审核
         */
        PROJECT_START_REVIEW("4"),

        /**
         * 项目竣工审核
         */
        PROJECT_COMPLETION_REVIEW("5"),

        /**
         * 项目开工专班审核
         */
        PROJECT_START_REVIEW_ZB("6"),

        /**
         * 项目新增记分
         */
        ADDITIONAL_SCORE("7"),
    }

    /**
     * 完成状态
     */
    @Column("status", comment = "完成状态")
    var status: String? = null

    /**
     * 审核委办局id
     */
    @Column("cob_id", comment = "审核委办局id")
    var cobId: String? = null

    /**
     * 审核人部门名称
     */
    @Column("dept_name", comment = "审核人部门名称")
    var deptName: String? = null

    /**
     * 审核人名称
     */
    @Column("name", comment = "审核人名称")
    var name: String? = null

    /**
     * 审核结果
     */
    @Column("result", comment = "审核结果")
    var result: String? = null

    /**
     * 审核评价
     */
    @Column("comment", comment = "审核评价")
    var comment: String? = null

    /**
     * 泰政通待办TaskCode
     */
    @Column("task_code", comment = "泰政通待办TaskCode")
    var taskCode: String? = null

    /**
     * 批次
     */
    @Column("batch", comment = "批次")
    var batch: Int? = null

    /**
     * 实际完成投资（亿元）
     */
    @Column("completion_invest_money", comment = "实际完成投资（亿元）")
    var completionInvestMoney: Float? = null

    @Column("score", comment = "流程得分")
    var score: Float? = null

}
