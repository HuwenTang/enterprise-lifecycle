import { Button, DatePicker, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface ProgressItem {
  code: string | null;
  districtCode: string;
  progress: number;  // 1:注册, 2:备案, 4:完成报批, 5:开工
  projNums: number;
  ztz: number;
}

interface ReportDataType {
  district: string;
  districtCode: string;
  projNums: number;
  ztz: number;
  children: ProgressItem[];
}

const Report4 = () => {
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
      const params = {
        currStartDate: dateRange[0].format('YYYY-MM-DD'),
        currEndDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
        rmb: rmb,
      };
      
      const response = await request('/zsxt-api/statistics/projectStatusInfo', {
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
      const response = await request('/zsxt-api/statistics/exportProjectStatusInfo', {
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
      const fileName = `全市新签约项目进度情况表_${dateRange[0].format('YYYYMM')}-${dateRange[1].format('YYYYMM')}.xlsx`;
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

  // 从 children 数组中获取指定进度的数据
  // 注册: progress=1, 备案: progress=5, 完成报批: progress=4, 开工: progress=2
  const getProgressData = (record: ReportDataType, progress: number) => {
    const item = record.children?.find(c => c.progress === progress);
    return item || { projNums: 0, ztz: 0 };
  };

  const columns: ColumnsType<ReportDataType> = [
    { title: '市(区)', dataIndex: 'district', key: 'district', align: 'center', width: 120 },
    {
      title: '新签约项目',
      align: 'center',
      children: [
        { title: '个数', dataIndex: 'projNums', key: 'projNums', align: 'center', width: 80 },
        { title: '金额(亿元)', dataIndex: 'ztz', key: 'ztz', align: 'center', width: 100, render: (v: number) => v?.toFixed(2) || '0.00' },
      ],
    },
    {
      title: '其中',
      align: 'center',
      children: [
        {
          title: '注册',
          align: 'center',
          children: [
            { title: '个数', key: 'projNums0', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getProgressData(record, 1).projNums },
            { title: '金额(亿元)', key: 'qyje0', align: 'center', width: 100, render: (_: any, record: ReportDataType) => getProgressData(record, 1).ztz?.toFixed(2) || '0.00' },
          ],
        },
        {
          title: '备案',
          align: 'center',
          children: [
            { title: '个数', key: 'projNums1', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getProgressData(record, 5).projNums },
            { title: '金额(亿元)', key: 'qyje1', align: 'center', width: 100, render: (_: any, record: ReportDataType) => getProgressData(record, 5).ztz?.toFixed(2) || '0.00' },
          ],
        },
        {
          title: '完成报批',
          align: 'center',
          children: [
            { title: '个数', key: 'projNums2', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getProgressData(record, 4).projNums },
            { title: '金额(亿元)', key: 'qyje2', align: 'center', width: 100, render: (_: any, record: ReportDataType) => getProgressData(record, 4).ztz?.toFixed(2) || '0.00' },
          ],
        },
        {
          title: '开工',
          align: 'center',
          children: [
            { title: '个数', key: 'projNums3', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getProgressData(record, 2).projNums },
            { title: '金额(亿元)', key: 'qyje3', align: 'center', width: 100, render: (_: any, record: ReportDataType) => getProgressData(record, 2).ztz?.toFixed(2) || '0.00' },
          ],
        },
      ],
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
          picker="month"
          format="YYYY-MM"
          style={{ marginRight: '10px' }}
        />
        <Select value={rmb} onChange={setRmb} options={rmbOptions} style={{ width: 200, marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch} loading={loading} style={{ marginRight: '10px' }}>查询</Button>
        <Button onClick={() => { setDateRange(null); setRmb(0); setTableData([]); }} style={{ marginRight: '10px' }}>重置</Button>
        <Button type="primary" onClick={handleExport}>导出</Button>
      </div>
      <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>
        {dateRange && `${dateRange[0].format('YYYY-MM')}至${dateRange[1].format('YYYY-MM')}`}全市新签约项目进度情况表
      </p>
      <Table 
        columns={columns} 
        dataSource={tableData} 
        loading={loading} 
        rowKey="districtCode" 
        bordered 
        pagination={false} 
        scroll={{ x: 1000 }}
        expandable={{ childrenColumnName: 'nonExistentField' }}
        summary={(pageData) => {
          // 汇总计算
          const sums = {
            projNums: 0,
            ztz: 0,
            progress1: { projNums: 0, ztz: 0 },  // 注册 (progress=1)
            progress5: { projNums: 0, ztz: 0 },  // 备案 (progress=5)
            progress4: { projNums: 0, ztz: 0 },  // 完成报批 (progress=4)
            progress2: { projNums: 0, ztz: 0 },  // 开工 (progress=2)
          };

          pageData.forEach(item => {
            sums.projNums += item.projNums || 0;
            sums.ztz += item.ztz || 0;

            // 汇总各进度数据 - 根据 progress 值匹配
            item.children?.forEach(child => {
              if (child.progress === 1) {
                sums.progress1.projNums += child.projNums || 0;
                sums.progress1.ztz += child.ztz || 0;
              } else if (child.progress === 5) {
                sums.progress5.projNums += child.projNums || 0;
                sums.progress5.ztz += child.ztz || 0;
              } else if (child.progress === 4) {
                sums.progress4.projNums += child.projNums || 0;
                sums.progress4.ztz += child.ztz || 0;
              } else if (child.progress === 2) {
                sums.progress2.projNums += child.projNums || 0;
                sums.progress2.ztz += child.ztz || 0;
              }
            });
          });

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="center"><strong>合计</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center"><strong>{sums.projNums}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center"><strong>{sums.ztz.toFixed(2)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center"><strong>{sums.progress1.projNums}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center"><strong>{sums.progress1.ztz.toFixed(2)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center"><strong>{sums.progress5.projNums}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center"><strong>{sums.progress5.ztz.toFixed(2)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center"><strong>{sums.progress4.projNums}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center"><strong>{sums.progress4.ztz.toFixed(2)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center"><strong>{sums.progress2.projNums}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={10} align="center"><strong>{sums.progress2.ztz.toFixed(2)}</strong></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default Report4;
