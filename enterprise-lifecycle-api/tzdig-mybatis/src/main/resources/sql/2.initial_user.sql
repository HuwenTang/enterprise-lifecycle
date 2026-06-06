drop table if exists user_organization;
create table user_organization
(
    id          char(32)              not null comment '主键' primary key,
    deleted     boolean default false not null comment '逻辑删除',
    create_time datetime              not null comment '创建时间',
    update_time datetime              not null comment '修改时间',
    name        varchar(64)           not null comment '组织名称',
    parent_id   char(32)              null comment '父级组织ID',
    sort        int                   not null comment '排序',
    cob         varchar(32)           null comment '所属委办局'
) comment '组织架构';
insert into user_organization
values ('0', false, now(), now(), '泰州市', null, 0, null);

drop table if exists user_role;
create table user_role
(
    id              char(20)   not null comment '主键' primary key,
    deleted         boolean             default false not null comment '逻辑删除',
    create_time     datetime   not null comment '创建时间',
    update_time     datetime   not null comment '修改时间',
    name            varchar(8) not null comment '名称',
    system_role     boolean    not null default false comment '是否为系统角色',
    organization_id char(32)   null comment '关联组织'
) comment '用户角色';
insert into user_role
values ('00', false, now(), now(), '缺省角色', true, null),
       ('01', false, now(), now(), '超级管理员', true, null);

drop table if exists user_account;
create table user_account
(
    id                     char(32)              not null comment '主键' primary key,
    deleted                boolean default false not null comment '逻辑删除',
    create_time            datetime              not null comment '创建时间',
    update_time            datetime              not null comment '修改时间',
    mobile                 varchar(16)           not null comment '手机号',
    password               char(40)              not null comment 'sha1(id+sha1(密码))',
    real_name              varchar(32)           not null comment '真实姓名',
    grant_for_taizhengtong boolean               not null comment '泰政通授权',
    role                   text                  not null comment '角色ID,逗号分隔',
    last_login_time        datetime              null comment '上次登录时间'
) comment '用户账号';
insert into user_account
values ('00', false, now(), now(),
        'admin', '4391caaa032844e3fea58563d1d27df1fef5325a',
        '超级管理员', false, '01', null);

drop table if exists user_x_organization;
create table user_x_organization
(
    id               char(20)              not null comment '主键' primary key,
    deleted          boolean default false not null comment '逻辑删除',
    create_time      datetime              not null comment '创建时间',
    update_time      datetime              not null comment '修改时间',
    userid           char(32)              not null comment '用户ID',
    organization_id  char(32)              not null comment '组织ID',
    is_administrator boolean               not null comment '是否为组织管理员'
) comment '用户关联组织';
insert user_x_organization
values ('00', false, now(), now(),
        '00', '0', true);

drop table if exists user_permission;
create table user_permission
(
    id          char(20)              not null comment '主键' primary key,
    deleted     boolean default false not null comment '逻辑删除',
    create_time datetime              not null comment '创建时间',
    update_time datetime              not null comment '修改时间',
    code        varchar(64)           not null comment '权限代码',
    description varchar(64)           not null comment '权限说明'
) comment '数据权限';

drop table if exists user_x_permission;
create table user_x_permission
(
    id              char(20)              not null comment '主键' primary key,
    deleted         boolean default false not null comment '逻辑删除',
    create_time     datetime              not null comment '创建时间',
    update_time     datetime              not null comment '修改时间',
    userid          char(32)              not null comment '用户ID',
    permission_code varchar(64)           not null comment '权限代码'
) comment '用户数据权限';
