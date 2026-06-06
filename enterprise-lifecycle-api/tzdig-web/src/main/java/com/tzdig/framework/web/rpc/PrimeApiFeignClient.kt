package com.tzdig.framework.web.rpc

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.cloud.openfeign.FeignClient

@ConditionalOnProperty("feign.prime-api")
@FeignClient(name = "primeApiFeignClient", url = $$"${feign.prime-api:}", path = "/prime-api")
interface PrimeApiFeignClient {
    //
}
