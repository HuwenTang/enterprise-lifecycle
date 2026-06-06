package com.tzdig.framework.task

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.model.batchUpdateById
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import com.tzdig.framework.mybatis.entity.view.TProjProjectSignedView
import com.tzdig.framework.mybatis.entity.view.XmJbxx
import com.tzdig.framework.mybatis.mapper.prime.ExtZsProjProjectSignedMapper
import com.tzdig.framework.mybatis.mapper.prime.ExtZsProjectOperationMapper
import io.swagger.v3.oas.annotations.Operation
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class SyncZSProjTask(
    private val extZsProjProjectSignedMapper: ExtZsProjProjectSignedMapper,
    private val extZsProjectOperationMapper: ExtZsProjectOperationMapper
) {

    @Transactional
    @Scheduled(cron = "0 10 * * * ?")
    @Operation(summary = "同步数字化招商质态评估表，签约核定表")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun executeQY() {
        val targetList = extZsProjProjectSignedMapper.selectCursorByQuery(QueryWrapper())
            .mapNotNull { target ->
                val record = queryOneById<TProjProjectSignedView>(target.id!!)
                    ?: return@mapNotNull null
                ExtZsProjProjectSigned {
                    id = target.id
                    pType = record.pType
                    investMoney = record.investMoney
                    foreignMoney = record.foreignMoney
                    projType = record.projType
                    bIndustry = record.bIndustry
                    bResource = record.bResource
                    sjjgName = record.sjjgName
                    isKcProj = record.isKcProj
                    kcProjTj = record.kcProjTj
                    isQflp = record.isQflp
                }
            }
        if (targetList.isNotEmpty())
            targetList.batchUpdateById()
    }

    @Transactional
    @Scheduled(cron = "0 10 * * * ?")
    @Operation(summary = "同步数字化招商开工竣工表")
    @DistributedLock(policy = Policy.NON_BLOCKING)
    fun execute() {
        val targetList = extZsProjectOperationMapper.selectCursorByQuery(QueryWrapper())
            .mapNotNull { target ->
                val record = queryOneById<XmJbxx>(target.id!!)
                    ?: return@mapNotNull null
                ExtZsProjectOperation {
                    id = target.id
                    investMoney = (record.investMoney ?: 0).toString()
                    bIndustry =
                        if (record.bIndustry?.toInt() == 1) "服务业" else if (record.bIndustry?.toInt() == 2) "制造业" else null
                    isKcProj = record.isKcProj
                    kcProjTj = record.kcProjTj
                    isQflp = record.isQflp
                }
            }
        if (targetList.isNotEmpty())
            targetList.batchUpdateById()
    }
}
