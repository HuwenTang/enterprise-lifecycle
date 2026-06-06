package com.tzdig.framework.web.rpc

import com.tzdig.framework.mybatis.entity.system.SystemWorkflowNode
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@ConditionalOnProperty("feign.system-api")
@FeignClient(name = "systemApiFeignClient", url = $$"${feign.system-api:}", path = "/system-api")
interface SystemApiFeignClient {
    //
    @PostMapping("workflow/process")
    fun process(
        @RequestParam workflowCode: String,
        @RequestParam currentNodeCode: String,
        @RequestParam result: Boolean,
        @RequestParam content: String,
    ): SystemWorkflowNode?
}
