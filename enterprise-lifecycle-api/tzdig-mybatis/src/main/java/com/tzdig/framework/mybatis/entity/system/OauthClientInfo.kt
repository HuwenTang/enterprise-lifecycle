package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("oauth_client_info")
class OauthClientInfo : BaseModel<OauthClientInfo>() {
    /**
     * 应用名称
     */
    @Column("name", comment = "应用名称")
    var name: String? = null

    /**
     * 应用密钥
     */
    @Column("app_key", comment = "应用密钥")
    var appKey: String? = null

    /**
     * 应用密钥
     */
    @Column("secret_key", comment = "应用密钥")
    var secretKey: String? = null

    /**
     * 应用签约权限,逗号分隔
     */
    @Column("scopes", comment = "应用签约权限,逗号分隔")
    var scopes: String? = null

    /**
     * 应用URL,逗号分隔
     */
    @Column("allow_urls", comment = "应用URL,逗号分隔")
    var allowUrls: String? = null
}
