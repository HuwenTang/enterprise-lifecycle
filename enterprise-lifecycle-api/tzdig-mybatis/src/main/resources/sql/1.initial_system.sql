drop table if exists system_setting;
create table system_setting
(
    id          char(20)              not null comment '主键' primary key,
    deleted     boolean default false not null comment '逻辑删除',
    create_time datetime              not null comment '创建时间',
    update_time datetime              not null comment '修改时间',
    name        varchar(32)           not null comment '配置项',
    value       varchar(512)          not null comment '配置值'
) comment '系统设置';
insert into system_setting
values ('0', false, now(), now(), 'name', ''),
       ('1', false, now(), now(), 'icon', '');

drop table if exists system_dict_catalog;
create table system_dict_catalog
(
    id          char(20)              not null comment '主键' primary key,
    deleted     boolean default false not null comment '逻辑删除',
    create_time datetime              not null comment '创建时间',
    update_time datetime              not null comment '修改时间',
    parent_id   char(20)              null comment '父目录',
    code        varchar(32)           not null comment '代码',
    label       varchar(32)           not null comment '名称'
) comment '枚举字典表目录';

drop table if exists system_dict;
create table system_dict
(
    id          char(20)              not null comment '主键' primary key,
    deleted     boolean default false not null comment '逻辑删除',
    create_time datetime              not null comment '创建时间',
    update_time datetime              not null comment '修改时间',
    catalog     varchar(32)           not null comment '所属目录',
    code        varchar(32)           not null comment '代码',
    label       varchar(32)           not null comment '名称',
    enabled     boolean               not null comment '状态',
    sort        int                   not null comment '排序'
) comment '枚举字典表';
create index system_dict_catalog_index
    on system_dict (catalog);

drop table if exists system_menu;
create table system_menu
(
    id          char(20)              not null comment '主键' primary key,
    deleted     boolean default false not null comment '逻辑删除',
    create_time datetime              not null comment '创建时间',
    update_time datetime              not null comment '修改时间',
    path        varchar(1024)         null comment '页面路径',
    name        varchar(32)           not null comment '目录名称',
    icon        varchar(32)           not null comment '图标',
    parent_id   char(20)              null comment '上级目录',
    sort        int                   not null comment '排序'
) comment '系统目录';

drop table if exists system_menu_x_role;
create table system_menu_x_role
(
    id          char(20)              not null comment '主键' primary key,
    deleted     boolean default false not null comment '逻辑删除',
    create_time datetime              not null comment '创建时间',
    update_time datetime              not null comment '修改时间',
    menu_id     char(20)              not null comment '目录ID',
    role_id     char(20)              not null comment '角色ID'
) comment '目录关联角色';
