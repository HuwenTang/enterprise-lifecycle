package com.tzdig.framework.controller

import com.tzdig.framework.core.util.urlEncoded
import com.tzdig.framework.service.QichachaService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@Tag(name = "企查查企业查询")
@RestController
@RequestMapping("qichacha")
class QichachaController(private val qichachaService: QichachaService) {

    private val key = "91a2cea3c03111f0b1c0b8cef6b42328"

    private val loginName = "18115909828"

    private val role = "admin"

    private val name = "18115909828"


    @Operation(summary = "获取企查查pc")
    @GetMapping("qichacha-pc")
    fun qichachaPc(
        @RequestParam returnUrl: String,
        response: HttpServletResponse,
    ) {
        val token = qichachaService.generateToken(loginName, role, name, null)
        val url =
            "https://pro-plugin.qcc.com/plugin-login?key=${key}&token=${token.urlEncoded}&returnUrl=${returnUrl}"
        response.sendRedirect(url)
    }

    @Operation(summary = "获取企查查h5")
    @GetMapping("qichacha-h5")
    fun qichachaH5(
        @RequestParam returnUrl: String,
        response: HttpServletResponse,
    ) {
        val token = qichachaService.generateToken(loginName, role, name, null)
        val url =
            "https:///pro-h5.qcc.com/plugin-login?key=${key}&token=${token.urlEncoded}&returnUrl=${returnUrl}"
        response.sendRedirect(url)
    }

}
