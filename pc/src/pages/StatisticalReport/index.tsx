import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Card, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

interface ReportDataType {
  xh: string;
  name: string;
  url: string;
}

const StatisticalReport = () => {
  const navigate = useNavigate();

  // 报表数据
  const [tableData] = useState<ReportDataType[]>([
    {
      xh: '1',
      name: '各市（区）新签约总投资项目情况表',
      url: '/statistical-report/detail1',
    },
    {
      xh: '2',
      name: '项目招引信息',
      url: '/statistical-report/detail2',
    },
    {
      xh: '3',
      name: '全市新签约项目分产业汇总表',
      url: '/statistical-report/detail3',
    },
    {
      xh: '4',
      name: '全市新签约项目进度情况表',
      url: '/statistical-report/detail4',
    },
    {
      xh: '5',
      name: '"三比一提升"市（区）项目签约得分表',
      url: '/statistical-report/detail5',
    },
    {
      xh: '6',
      name: '"三比一提升"重点园区项目签约得分表',
      url: '/statistical-report/detail6',
    },
    {
      xh: '7',
      name: '市领导联系服务"四重"工作产业链项目招引情况表',
      url: '/statistical-report/detail7',
    },
    {
      xh: '8',
      name: '产业链项目明细表',
      url: '/statistical-report/detail8',
    },
  ]);

  // 打开报表 - 下钻到具体报表页面
  const handleOpenReport = (record: ReportDataType) => {
    // 跳转到对应的报表详情页面
    navigate(record.url);
  };

  // 表格列配置
  const columns: ColumnsType<ReportDataType> = [
    {
      title: '报表编码',
      dataIndex: 'xh',
      key: 'xh',
      width: 120,
      align: 'center',
    },
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ReportDataType) => (
        <span
          style={{
            color: '#0f74a8',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
          onClick={() => handleOpenReport(record)}
        >
          {text}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      style={{
        width: '100%',
        height: '90vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
      }}
      content="欢迎使用统计报表（市级）模块"
    >
      <Card 
        title="统计报表" 
        bordered={false}
        style={{ margin: '20px' }}
      >
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="xh"
          bordered
          pagination={false}
        />
      </Card>
    </PageContainer>
  );
};

export default StatisticalReport;
