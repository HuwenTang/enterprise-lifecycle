drop table if exists oauth_client_info;
create table oauth_client_info
(
    id          char(20) primary key comment '主键',
    deleted     boolean     not null default false comment '逻辑删除',
    create_time datetime    not null comment '创建时间',
    update_time datetime    not null comment '修改时间',
    name        varchar(32) not null comment '应用名称',
    app_key     char(16)    not null comment '应用密钥',
    secret_key  char(16)    not null comment '应用密钥',
    scopes      text        not null comment '应用签约权限,逗号分隔',
    allow_urls  longtext    not null comment '应用URL,逗号分隔'
) comment 'OAuth2应用接入';
alter table oauth_client_info
    add constraint oauth_client_info_pk unique (app_key);
