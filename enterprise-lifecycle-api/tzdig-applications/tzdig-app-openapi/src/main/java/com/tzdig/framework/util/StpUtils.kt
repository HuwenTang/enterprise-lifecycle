package com.tzdig.framework.util

import cn.dev33.satoken.context.SaHolder
import cn.dev33.satoken.oauth2.consts.SaOAuth2Consts.Param
import cn.dev33.satoken.oauth2.template.SaOAuth2Util

object StpUtils {
    val accessToken: String
        get() = SaHolder.getRequest().getParam(Param.access_token)

    val loginId: String
        get() = SaOAuth2Util.getLoginIdByAccessToken(accessToken) as String

    val clientToken: String
        get() = SaHolder.getRequest().getParam(Param.client_token)

    val clientId: String
        get() = SaOAuth2Util.getClientToken(clientToken).clientId
}
