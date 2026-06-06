package com.tzdig.framework.web.rpc

import com.tzdig.framework.mybatis.vo.TProjProjectSignedReq
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody


@ConditionalOnProperty("feign.zsxt-api")
@FeignClient(name = "zsxtApiFrignClient", url = $$"${feign.zsxt-api:}", path = "/zsxt-api")
interface ZsxtApiFrignClient {

    @PostMapping("/tProjProjectSigned/bmpgCallBack")
    fun bmpgCallBack(@RequestBody req: TProjProjectSignedReq)

    @PostMapping("/tProjProjectSigned/kgjgCheckCallBack")
    fun kgjgCheckCallBack(@RequestBody req: TProjProjectSignedReq)

}
