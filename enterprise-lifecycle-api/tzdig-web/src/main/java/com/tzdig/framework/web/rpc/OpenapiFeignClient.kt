package com.tzdig.framework.web.rpc

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@ConditionalOnProperty("feign.open-api")
@FeignClient(name = "openapiFeignClient", url = $$"${feign.open-api:}", path = "/openapi")
interface OpenapiFeignClient {

    @PostMapping("/v1/project/construction-approval/{onlineApprovalId}/x-investment-online/{investOnlineId}")
    fun addProjectGgApprovalBind(
        @PathVariable("onlineApprovalId") onlineApprovalId: String,
        @PathVariable("investOnlineId") investOnlineId: String,
    )

    @DeleteMapping("/v1/project/construction-approval/{onlineApprovalId}/x-investment-online/{investOnlineId}")
    fun removeProjectGgApprovalBind(
        @PathVariable("onlineApprovalId") onlineApprovalId: String,
        @PathVariable("investOnlineId") investOnlineId: String,
    )

    @PostMapping("/v1/project/online-approval/{onlineApprovalId}/x-investment-online/{investOnlineId}")
    fun addSignedProjectOnlineApprovalBind(
        @PathVariable("onlineApprovalId") onlineApprovalId: String,
        @PathVariable("investOnlineId") investOnlineId: String,
    )

    @DeleteMapping("/v1/project/online-approval/{onlineApprovalId}/x-investment-online/{investOnlineId}")
    fun removeSignedProjectOnlineApprovalBind(
        @PathVariable("onlineApprovalId") onlineApprovalId: String,
        @PathVariable("investOnlineId") investOnlineId: String,
    )

    @PostMapping("/v1/quality-evaluation", consumes = ["application/json"], produces = [MediaType.TEXT_PLAIN_VALUE])
    fun createQualityEvaluation(@RequestBody dto: String)

    @PostMapping("/v1/project/online-approval", consumes = ["application/json"])
    fun createOrUpdateProjectOnlineApproval(
        @RequestBody dto: String
    )

    @PostMapping(
        "/v1/project/construction-approval", consumes = ["application/json"])
    fun createOrUpdateProjectConstructionApproval(
        @RequestBody dto: String
    )

    @PostMapping(
        "/v1/quality-evaluation/project-review",
        consumes = ["application/json"],
        produces = [MediaType.TEXT_PLAIN_VALUE]
    )
    fun createProjectReview(
        @RequestBody dto: String
    )

    @DeleteMapping("/v1/quality-evaluation/{id}")
    fun deleteExtZsProjProjectSigned(
        @PathVariable id: String
    )

    @PostMapping(
        "/v1/quality-evaluation/start-approval",
        consumes = ["application/json"],
        produces = [MediaType.TEXT_PLAIN_VALUE]
    )
    fun startApproval(
        @RequestBody dto: String
    )

    @PostMapping(
        "/v1/quality-evaluation/completion-approval",
        consumes = ["application/json"],
        produces = [MediaType.TEXT_PLAIN_VALUE]
    )
    fun completionApproval(
        @RequestBody dto: String
    )

}
