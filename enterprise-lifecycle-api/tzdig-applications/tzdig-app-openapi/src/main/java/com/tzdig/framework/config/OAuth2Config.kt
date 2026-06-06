package com.tzdig.framework.config

import cn.dev33.satoken.oauth2.config.SaOAuth2ServerConfig
import cn.dev33.satoken.oauth2.consts.GrantType
import cn.dev33.satoken.oauth2.data.loader.SaOAuth2DataLoader
import cn.dev33.satoken.oauth2.data.model.loader.SaClientModel
import cn.dev33.satoken.oauth2.function.SaOAuth2NotLoginViewFunction
import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.mybatis.entity.system.OauthClientInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration

@Configuration
class OAuth2Config : SaOAuth2DataLoader {
    override fun getClientModel(clientId: String): SaClientModel? {
        val clientInfo = filterOne<OauthClientInfo> { OauthClientInfo::appKey eq clientId }
            ?: return null
        // if (clientInfo.allowUrls?.contains('*') == true) return null
        return SaClientModel()
            .setClientId(clientInfo.appKey)
            .setClientSecret(clientInfo.secretKey)
            .setContractScopes(clientInfo.scopes!!.split(','))
            .setAllowRedirectUris(clientInfo.allowUrls!!.split(','))
            .addAllowGrantTypes(GrantType.authorization_code)
            .addAllowGrantTypes(GrantType.client_credentials)
    }

    @Autowired
    fun configOAuth2Server(config: SaOAuth2ServerConfig) {
        config.notLoginView = SaOAuth2NotLoginViewFunction {
            "<script>location.href='/login?redirect='+encodeURIComponent(location.href)</script>"
        }
    }
}
