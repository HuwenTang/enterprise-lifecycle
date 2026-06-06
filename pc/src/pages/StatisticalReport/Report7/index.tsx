import { Button, DatePicker, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface ReportDataType {
  name: string;
  jjsNum: number;
  jjsQyje: number;
  txsNum: number;
  txsQyje: number;
  xhsNum: number;
  xhsQyje: number;
  hlqNum: number;
  hlqQyje: number;
  jyqNum: number;
  jyqQyje: number;
  yygxqNum: number;
  yygxqQyje: number;
  total: number;
  totalQyje: number;
}

const Report7 = () => {
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

  useEffect(() => {
    const now = dayjs();
    const year = now.year();
    let month = now.month();
    if (month === 0) {
      setDateRange([dayjs(`${year - 1}-01`), dayjs(`${year - 1}-12`)]);
    } else {
      setDateRange([dayjs(`${year}-01`), dayjs(`${year}-${month < 10 ? '0' + month : month}`)]);
    }
  }, []);

  useEffect(() => {
    if (dateRange) {
      handleSearch();
    }
  }, [dateRange]);

  const handleSearch = async () => {
    if (!dateRange) {
      message.warning('请选择日期范围');
      return;
    }
    
    setLoading(true);
    try {
      const getLastDayOfMonth = (yearMonth: string) => {
        const date = new Date(yearMonth);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return `${yearMonth}-${lastDay}`;
      };
      
      const params = {
        currStartDate: `${dateRange[0].format('YYYY-MM')}-01`,
        currEndDate: getLastDayOfMonth(dateRange[1].format('YYYY-MM')),
        rmb: rmb,
      };
      
      const response = await request('/zsxt-api/statistics/countSignedProjType', {
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

  // 导出
  const handleExport = async () => {
    if (!dateRange) {
      message.warning('请选择日期范围');
      return;
    }

    try {
      const getLastDayOfMonth = (yearMonth: string) => {
        const date = new Date(yearMonth);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return `${yearMonth}-${lastDay}`;
      };

      const response = await request('/zsxt-api/statistics/exportSignedProjType', {
        method: 'POST',
        data: {
          currStartDate: `${dateRange[0].format('YYYY-MM')}-01`,
          currEndDate: getLastDayOfMonth(dateRange[1].format('YYYY-MM')),
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
      const fileName = `市领导联系服务四重工作产业链项目招引情况_${dateRange[0].format('YYYYMM')}-${dateRange[1].format('YYYYMM')}.xlsx`;
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

  const columns: ColumnsType<ReportDataType> = [
    { title: '重点产业链', dataIndex: 'name', key: 'name', align: 'center', width: 150 },
    {
      title: '靖江市',
      align: 'center',
      children: [
        { title: '个数', dataIndex: 'jjsNum', key: 'jjsNum', align: 'center', width: 80 },
        { title: '投资额', dataIndex: 'jjsQyje', key: 'jjsQyje', align: 'center', width: 100 },
      ],
    },
    {
      title: '泰兴市',
      align: 'center',
      children: [
        { title: '个数', dataIndex: 'txsNum', key: 'txsNum', align: 'center', width: 80 },
        { title: '投资额', dataIndex: 'txsQyje', key: 'txsQyje', align: 'center', width: 100 },
      ],
    },
    {
      title: '兴化市',
      align: 'center',
      children: [
        { title: '个数', dataIndex: 'xhsNum', key: 'xhsNum', align: 'center', width: 80 },
        { title: '投资额', dataIndex: 'xhsQyje', key: 'xhsQyje', align: 'center', width: 100 },
      ],
    },
    {
      title: '海陵区',
      align: 'center',
      children: [
        { title: '个数', dataIndex: 'hlqNum', key: 'hlqNum', align: 'center', width: 80 },
        { title: '投资额', dataIndex: 'hlqQyje', key: 'hlqQyje', align: 'center', width: 100 },
      ],
    },
    {
      title: '姜堰区',
      align: 'center',
      children: [
        { title: '个数', dataIndex: 'jyqNum', key: 'jyqNum', align: 'center', width: 80 },
        { title: '投资额', dataIndex: 'jyqQyje', key: 'jyqQyje', align: 'center', width: 100 },
      ],
    },
    {
      title: '医药高新区（高港区）',
      align: 'center',
      children: [
        { title: '个数', dataIndex: 'yygxqNum', key: 'yygxqNum', align: 'center', width: 80 },
        { title: '投资额', dataIndex: 'yygxqQyje', key: 'yygxqQyje', align: 'center', width: 100 },
      ],
    },
    { title: '总个数', dataIndex: 'total', key: 'total', align: 'center', width: 90 },
    { title: '总投资额', dataIndex: 'totalQyje', key: 'totalQyje', align: 'center', width: 110 },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
          picker="month"
          format="YYYY-MM"
          placeholder={['开始月份', '结束月份']}
          style={{ marginRight: '10px' }}
        />
        <Select value={rmb} onChange={setRmb} options={rmbOptions} placeholder="请下拉选择投资额" style={{ width: 220, marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch} loading={loading} style={{ marginRight: '10px' }}>查询</Button>
        <Button onClick={() => { setDateRange(null); setRmb(0); setTableData([]); }} style={{ marginRight: '10px' }}>重置</Button>
        <Button type="primary" onClick={handleExport}>导出</Button>
      </div>
      <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>
        {dateRange && dateRange[0] && dateRange[1] ? `${dateRange[0].format('YYYY-MM')}至${dateRange[1].format('YYYY-MM')}` : ''}市领导联系服务“四重”工作产业链{rmb === 0 ? '' : (rmb === 4 ? '500万-1亿元（不含）' : `${rmbMap[rmb]}以上`)}项目招引情况
      </p>
      <Table columns={columns} dataSource={tableData} loading={loading} rowKey="name" bordered pagination={false} scroll={{ x: 1400 }} />
    </div>
  );
};

export default Report7;
