import { Button, DatePicker, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface ReportDataType {
  district: string;
  districtCode: string;
  projNums: number;
  projTb: string;
  ztz: number;
  ztzTb: string;
  nzProjNum: number;
  nzTz: number;
  wzProjNum: number;
  wzTz: number;
  lastYearProjNums: number;
  lastZtz: number;
  signedDate: string;
  sixproCode: number;
  projType: string;
  projName: string;
  ndmbrws: number;
  ndwcs: number;
  ndmbwcl: string;
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
      // 如果是1月，取去年12月
      setDateRange([dayjs(`${year - 1}-01`), dayjs(`${year - 1}-12`)]);
    } else {
      // 取当年1月到上个月
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
      const params = {
        currStartDate: dateRange[0].format('YYYY-MM-DD'),
        currEndDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
        rmb: rmb,
      };
      
      const response = await request('/zsxt-api/statistics/signedProjectInfo', {
        method: 'POST',
        data: params,
      });
      
      setTableData(response || []);
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置
  const handleReset = () => {
    setDateRange(null);
    setRmb(0);
    setTableData([]);
  };

  // 导出
  const handleExport = async () => {
    if (!dateRange) {
      message.warning('请选择日期范围');
      return;
    }

    try {
      const response = await request('/zsxt-api/statistics/exportSignedProjectInfo', {
        method: 'POST',
        data: {
          currStartDate: dateRange[0].format('YYYY-MM-DD'),
          currEndDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: rmb,
        },
        responseType: 'blob',
      });

      // 创建下载链接
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
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
      align: 'center',
      width: 150,
    },
    {
      title: '项目总数',
      dataIndex: 'projNums',
      key: 'projNums',
      align: 'center',
      width: 100,
    },
    {
      title: '项目同比',
      dataIndex: 'projTb',
      key: 'projTb',
      align: 'center',
      width: 100,
      render: (val: string) => val || '-',
    },
    {
      title: '总投资(亿元)',
      dataIndex: 'ztz',
      key: 'ztz',
      align: 'center',
      width: 120,
    },
    {
      title: '总投资同比',
      dataIndex: 'ztzTb',
      key: 'ztzTb',
      align: 'center',
      width: 120,
      render: (val: string) => val ? `${val}%` : '-',
    },
    {
      title: '内资',
      align: 'center',
      children: [
        {
          title: '项目数',
          dataIndex: 'nzProjNum',
          key: 'nzProjNum',
          align: 'center',
          width: 100,
        },
        {
          title: '金额(亿元)',
          dataIndex: 'nzTz',
          key: 'nzTz',
          align: 'center',
          width: 120,
        },
      ],
    },
    {
      title: '外资',
      align: 'center',
      children: [
        {
          title: '项目数',
          dataIndex: 'wzProjNum',
          key: 'wzProjNum',
          align: 'center',
          width: 100,
        },
        {
          title: '金额(亿美元)',
          dataIndex: 'wzTz',
          key: 'wzTz',
          align: 'center',
          width: 120,
        },
      ],
    },
    {
      title: '年度目标任务数',
      dataIndex: 'ndmbrws',
      key: 'ndmbrws',
      align: 'center',
      width: 150,
    },
    {
      title: '年度目标任务完成率',
      dataIndex: 'ndmbwcl',
      key: 'ndmbwcl',
      align: 'center',
      width: 180,
      render: (val: string) => val || '-',
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'auto', padding: '20px' }}>
      {/* 查询条件 */}
      <div style={{ marginBottom: '20px' }}>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
          picker="month"
          format="YYYY-MM"
          placeholder={['开始月份', '结束月份']}
          style={{ marginRight: '10px' }}
        />
        <Select
          value={rmb}
          onChange={setRmb}
          options={rmbOptions}
          style={{ width: 200, marginRight: '10px' }}
        />
        <Button type="primary" onClick={handleSearch} style={{ marginRight: '10px' }}>
          查询
        </Button>
        <Button onClick={handleReset} style={{ marginRight: '10px' }}>
          重置
        </Button>
        <Button type="primary" onClick={handleExport}>
          导出
        </Button>
      </div>

      {/* 报表标题 */}
      <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>
        {dateRange && `${dateRange[0].format('YYYY-MM')}至${dateRange[1].format('YYYY-MM')}`}
        各市（区）新签约总投资{rmb === 0 ? '' : (rmb === 4 ? '500万-1亿元（不含）' : `${rmbMap[rmb]}以上`)}项目情况表
      </p>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        rowKey={(record) => record.districtCode || record.district}
        bordered
        pagination={false}
        scroll={{ x: 1400 }}
      />
    </div>
  );
};

export default Report1;
