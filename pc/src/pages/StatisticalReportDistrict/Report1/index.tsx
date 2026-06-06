import { PageContainer } from '@ant-design/pro-components';
import { Button, DatePicker, Select, Table, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface ReportDataType {
  district: string;
  projNums: number;
  projTb: number;
  ztz: number;
  ztzTb: number;
  nzProjNum: number;
  nzTz: number;
  wzProjNum: number;
  wzTz: number;
  ndmbrws: number;
  ndmbwcl: number;
}

const Report1 = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [rmb, setRmb] = useState<number>(0);
  const [tableData, setTableData] = useState<ReportDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const rmbOptions = [
    { label: '全部', value: 0 },
    { label: '500万-1亿元（不含）', value: 4 },
    { label: '1亿元(1千万美元)以上', value: 1 },
    { label: '5亿元(3千万美元)以上', value: 5 },
    { label: '10亿元(1亿美元)以上', value: 10 },
  ];

  const rmbMap: Record<number, string> = {
    0: '全部',
    4: '500万-1亿元（不含）',
    1: '1亿元(1千万美元)',
    5: '5亿元(3千万美元)',
    10: '10亿元(1亿美元)',
  };

  // 初始化默认日期范围（当年1月到上个月）
  useEffect(() => {
    const now = dayjs();
    const year = now.year();
    let month = now.month(); // 0-11
    
    if (month === 0) {
      setDateRange([dayjs(`${year - 1}-01`), dayjs(`${year - 1}-12`)]);
    } else {
      setDateRange([dayjs(`${year}-01`), dayjs(`${year}-${month < 10 ? '0' + month : month}`)]);
    }
  }, []);

  // 当日期范围初始化后，自动查询
  useEffect(() => {
    if (dateRange) {
      handleSearch();
    }
  }, [dateRange]);

  // 查询数据
  const handleSearch = async () => {
    if (!dateRange) {
      message.warning('请选择日期范围');
      return;
    }

    setLoading(true);
    try {
      const response = await request('/zsxt-api/statistics/signedProjectInfoYq', {
        method: 'POST',
        data: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: rmb,
        },
      });

      if (response && Array.isArray(response)) {
        setTableData(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setTableData(response.data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // 导出
  const handleExport = async () => {
    if (!dateRange) {
      message.warning('请选择日期范围');
      return;
    }

    try {
      const response = await request('/zsxt-api/statistics/exportSignedProjectInfoYq', {
        method: 'POST',
        data: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: rmb,
        },
        responseType: 'blob',
      });

      // 创建下载链接
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 生成文件名
      const fileName = `新签约项目情况表_${dateRange[0].format('YYYYMM')}-${dateRange[1].format('YYYYMM')}.xlsx`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  // 表格列配置
  const columns: ColumnsType<ReportDataType> = [
    {
      title: '市(区)',
      dataIndex: 'district',
      key: 'district',
      width: 150,
      align: 'center',
    },
    {
      title: '项目总数',
      dataIndex: 'projNums',
      key: 'projNums',
      width: 100,
      align: 'center',
    },
    {
      title: '项目同比',
      dataIndex: 'projTb',
      key: 'projTb',
      width: 100,
      align: 'center',
      render: (val: number) => `${val}%`,
    },
    {
      title: '总投资(亿元)',
      dataIndex: 'ztz',
      key: 'ztz',
      width: 120,
      align: 'center',
    },
    {
      title: '总投资同比',
      dataIndex: 'ztzTb',
      key: 'ztzTb',
      width: 110,
      align: 'center',
      render: (val: number) => `${val}%`,
    },
    {
      title: '内资',
      children: [
        {
          title: '项目数',
          dataIndex: 'nzProjNum',
          key: 'nzProjNum',
          width: 100,
          align: 'center',
        },
        {
          title: '金额(亿元)',
          dataIndex: 'nzTz',
          key: 'nzTz',
          width: 120,
          align: 'center',
        },
      ],
    },
    {
      title: '外资',
      children: [
        {
          title: '项目数',
          dataIndex: 'wzProjNum',
          key: 'wzProjNum',
          width: 100,
          align: 'center',
        },
        {
          title: '金额(亿美元)',
          dataIndex: 'wzTz',
          key: 'wzTz',
          width: 120,
          align: 'center',
        },
      ],
    },
    {
      title: '年度目标任务数',
      dataIndex: 'ndmbrws',
      key: 'ndmbrws',
      width: 140,
      align: 'center',
    },
    {
      title: '年度目标任务完成率',
      dataIndex: 'ndmbwcl',
      key: 'ndmbwcl',
      width: 160,
      align: 'center',
      render: (val: number) => `${val}%`,
    },
  ];

  return (
    <PageContainer
      style={{
        width: '100%',
        height: '90vh',
        overflow: 'auto',
      }}
    >
      <div style={{ background: '#fff', padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Space>
            <RangePicker
              picker="month"
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
              format="YYYY-MM"
            />
            <Select
              value={rmb}
              onChange={(value) => setRmb(value)}
              style={{ width: 200 }}
              options={rmbOptions}
            />
            <Button type="primary" onClick={handleSearch} loading={loading}>
              查询
            </Button>
            <Button onClick={handleExport}>导出</Button>
          </Space>
        </div>

        <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>
          {dateRange && dateRange[0] && dateRange[1] && (
            <span>{dateRange[0].format('YYYY-MM')}至{dateRange[1].format('YYYY-MM')}</span>
          )}
          新签约总投资{rmb === 0 ? '' : (rmb === 4 ? '500万-1亿元（不含）' : `${rmbMap[rmb]}以上`)}项目情况表
        </p>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey="district"
          bordered
          scroll={{ x: 1400 }}
          pagination={false}
        />
      </div>
    </PageContainer>
  );
};

export default Report1;
