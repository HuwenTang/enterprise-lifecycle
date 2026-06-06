alter table enterprise_economic_info
    drop column revenue_year_2025;
alter table enterprise_economic_info
    add revenue_year_2025 float as (if(
            coalesce(`revenue_quarter_2025_1`, `revenue_quarter_2025_2`, `revenue_quarter_2025_3`,
                     `revenue_quarter_2025_4`) is null, null,
            (((ifnull(`revenue_quarter_2025_1`, 0) + ifnull(`revenue_quarter_2025_2`, 0)) +
              ifnull(`revenue_quarter_2025_3`, 0)) +
             ifnull(`revenue_quarter_2025_4`, 0)))) comment '2025年营收' after revenue_year_2024;

alter table enterprise_economic_info
    drop column output_year_2025;
alter table enterprise_economic_info
    add output_year_2025 float as (if(
            coalesce(`output_quarter_2025_1`, `output_quarter_2025_2`, `output_quarter_2025_3`,
                     `output_quarter_2025_4`) is null, null,
            (((ifnull(`output_quarter_2025_1`, 0) + ifnull(`output_quarter_2025_2`, 0)) +
              ifnull(`output_quarter_2025_3`, 0)) +
             ifnull(`output_quarter_2025_4`, 0)))) comment '2025年营收' after revenue_year_2024;

drop table enterprise_info;
create table enterprise_info
(
    id                               char(20)             not null comment '统一信用代码'
        primary key,
    deleted                          tinyint(1) default 0 not null comment '逻辑删除',
    create_time                      datetime             not null comment '创建时间',
    update_time                      datetime             not null comment '修改时间',
    name                             varchar(128)         not null comment '单位名称',
    industry_code                    varchar(8)           null comment '行业代码',
    administrative_division          varchar(8)           null comment '地址码',
    park                             varchar(32)          null comment '园区',
    is_strategic_emerging_enterprise tinyint(1)           not null comment '是否为战新企业',
    primary_business_activity        varchar(64)          null comment '主要业务活动',
    innovative_cluster               varchar(32)          null comment '8个创新型集群',
    industry_chain                   varchar(32)          null comment '13条产业链',
    by1                              tinyint(1)           not null,
    is_top_industry                  tinyint(1)           not null comment '四上-工业',
    is_top_construction              tinyint(1)           not null comment '四上-建筑业',
    is_top_trade                     tinyint(1)           not null comment '四上-贸易',
    is_top_service                   tinyint(1)           not null comment '四上-服务业'
)
    comment '企业信息';
