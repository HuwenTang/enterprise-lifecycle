drop table if exists project_online_approval_info;
create table project_online_approval_info
(
    id                      char(24)              not null comment '主键' primary key,
    deleted                 boolean default false not null comment '逻辑删除',
    create_time             datetime              not null comment '创建时间',
    update_time             datetime              not null comment '修改时间',
    online_approval_id      varchar(24)           not null comment '在线审批ID',
    row_id                  smallint              not null comment '行ID',
    implementing_subject    varchar(64)           not null comment '实施主体',
    undertaking_department  varchar(64)           not null comment '承办部门',
    administrative_division varchar(64)           not null comment '部门区划',
    approval_item           varchar(64)           not null comment '审批事项',
    approval_status         varchar(64)           not null comment '办理状态及时间'
) comment '在线审批信息';

drop table if exists project_online_approval_info_detail;
create table project_online_approval_info_detail
(
    id                           char(20)              not null comment '主键' primary key,
    deleted                      boolean default false not null comment '逻辑删除',
    create_time                  datetime              not null comment '创建时间',
    update_time                  datetime              not null comment '修改时间',
    online_approval_info_id      char(20)              not null comment '在线审批信息ID',
    handling_process             varchar(64)           not null comment '办理环节',
    handling_date                date                  not null comment '办理日期',
    handling_department          varchar(64)           not null comment '办理部门',
    administrative_division      varchar(64)           not null comment '部门区划',
    internal_handling_department varchar(64)           not null comment '内部办理科室',
    other_handling_department    varchar(64)           not null comment '其他办理科室',
    remark                       varchar(64)           not null comment '备注'
) comment '在线审批信息详情';
