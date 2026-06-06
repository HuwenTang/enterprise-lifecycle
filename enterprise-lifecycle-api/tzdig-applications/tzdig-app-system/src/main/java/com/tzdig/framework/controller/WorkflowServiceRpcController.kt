package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowLog
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowNode
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowTransition
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.web.annotation.InternalRpcApi
import com.tzdig.framework.web.exception.ApiException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "工作流管理")
@RestController
@RequestMapping("workflow")
class WorkflowServiceRpcController {
    /**
     * 工作流节点流转
     */
    @Operation(hidden = true)
    @Transactional
    @InternalRpcApi
    @PostMapping("process")
    fun process(
        @RequestParam workflowCode: String,
        @RequestParam currentNodeCode: String,
        @RequestParam result: Boolean,
        @RequestParam content: String,
    ): SystemWorkflowNode? {
        val userAccount = userAccount

        // 查询并验证当前节点配置及权限
        val transition = getWorkflowTransition(workflowCode, currentNodeCode)
        if (transition == null || !userAccount.hasRole(transition.roleId!!)) {
            throw ApiException("当前用户无操作权限")
        }

        // 根据审批结果获取对应的下一节点
        val nextNodeCode = if (result) {
            transition.resolvedNode
                ?: throw ApiException("当前节点未配置审批通过后的节点")
        } else {
            transition.rejectNode
                ?: throw ApiException("当前节点未配置审批拒绝后的节点")
        }

        // 创建审批日志
        SystemWorkflowLog {
            this.workflowCode = workflowCode
            this.userid = userAccount.id!!
            this.userName = userAccount.realName!!
            this.result = result
            this.content = content
            this.nodeCode = currentNodeCode
            this.save()
        }

        // 返回下一个节点的配置信息
        return getWorkflowNode(workflowCode, nextNodeCode)
    }

    private fun getWorkflowTransition(workflowCode: String, currentNode: String) =
        queryOne<SystemWorkflowTransition> {
            and(SystemWorkflowTransition::workflowCode eq workflowCode)
            and(SystemWorkflowTransition::currentNode eq currentNode)
        }

    private fun getWorkflowNode(workflowCode: String, nodeCode: String) =
        queryOne<SystemWorkflowNode> {
            and(SystemWorkflowNode::workflowCode eq workflowCode)
            and(SystemWorkflowNode::code eq nodeCode)
        }
}
