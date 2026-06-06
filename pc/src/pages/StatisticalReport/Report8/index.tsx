import { Button, DatePicker, TreeSelect, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface ReportDataType {
  name: string;
  investMoney: number;
  district: string;
  zoneName: string;
  investor: string;
  projDesc: string;
  progressRd: string;
}

const Report8 = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [rmb, setRmb] = useState<number>(0);
  const [projType, setProjType] = useState<string>('');
  const [projTypeName, setProjTypeName] = useState<string>('');
  const [tableData, setTableData] = useState<ReportDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [projTypeTreeData, setProjTypeTreeData] = useState<any[]>([]);

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

  // 获取项目类型树数据
  const fetchProjTypeOptions = async () => {
    const buildTreeData = (nodes: any[]): any[] => {
      return (nodes || []).map((item) => {
        const id = item?.id ?? item?.value;
        const name = item?.name ?? item?.label;
        const hasChildren = Array.isArray(item?.children) && item.children.length > 0;
        return {
          title: name || '',
          value: String(id ?? ''),
          key: String(id ?? ''),
          children: hasChildren ? buildTreeData(item.children) : undefined,
        };
      }).filter((item) => item.value !== '');
    };

    try {
      const response = await request('/zsxt-api/tProjType/getProjType', {
        method: 'POST',
        data: {},
      });

      const treeData = Array.isArray(response)
        ? response
        : (Array.isArray(response?.data) ? response.data : []);
      setProjTypeTreeData(buildTreeData(treeData));
    } catch (error) {
      console.error('获取项目类型失败:', error);
      setProjTypeTreeData([]);
    }
  };

  useEffect(() => {
    fetchProjTypeOptions();
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
        projType: projType || undefined,  // 项目类型，如果为空则不传
      };
      
      const response = await request('/zsxt-api/statistics/countProjSigned', {
        method: 'POST',
        data: params,
      });
      
      console.log('Report8 接口返回数据:', response);
      setTableData(response || []);
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
      setTableData([]);  // 确保失败时也清空数据
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

      const response = await request('/zsxt-api/statistics/exportProjSigned', {
        method: 'POST',
        data: {
          currStartDate: `${dateRange[0].format('YYYY-MM')}-01`,
          currEndDate: getLastDayOfMonth(dateRange[1].format('YYYY-MM')),
          rmb: rmb,
          projType: projType || undefined,
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
      const fileName = `新签约产业项目_${dateRange[0].format('YYYYMM')}-${dateRange[1].format('YYYYMM')}.xlsx`;
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
    { title: '项目名称', dataIndex: 'name', key: 'name', align: 'center', width: 200 },
    { title: '总投资', dataIndex: 'investMoney', key: 'investMoney', align: 'center', width: 100 },
    { title: '市区', dataIndex: 'district', key: 'district', align: 'center', width: 120 },
    { title: '园区', dataIndex: 'zoneName', key: 'zoneName', align: 'center', width: 150 },
    { title: '投资方名称', dataIndex: 'investor', key: 'investor', align: 'center', width: 150 },
    { title: '项目简介', dataIndex: 'projDesc', key: 'projDesc', align: 'center', width: 200 },
    { title: '认定进度', dataIndex: 'progressRd', key: 'progressRd', align: 'center', width: 120 },
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
        <TreeSelect
          value={projType || undefined}
          onChange={(value, labelList) => {
            setProjType(value || '');
            const label = Array.isArray(labelList) ? labelList.join('/') : (labelList as any);
            setProjTypeName(label || '');
          }}
          placeholder="项目类型"
          treeData={projTypeTreeData}
          allowClear
          showSearch
          treeNodeFilterProp="title"
          treeDefaultExpandAll
          style={{ width: 300, marginRight: '10px' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
        <Button type="primary" onClick={handleSearch} loading={loading} style={{ marginRight: '10px' }}>查询</Button>
        <Button onClick={() => { setDateRange(null); setRmb(0); setProjType(''); setProjTypeName(''); setTableData([]); }} style={{ marginRight: '10px' }}>重置</Button>
        <Button type="primary" onClick={handleExport}>导出</Button>
      </div>
      <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>
        {dateRange && dateRange[0] && dateRange[1] ? `${dateRange[0].format('YYYY-MM')}至${dateRange[1].format('YYYY-MM')}` : ''}新签约{rmb === 0 ? '' : (rmb === 4 ? '500万-1亿元（不含）' : `${rmbMap[rmb]}以上`)}{projTypeName || ''}产业项目
      </p>
      <Table columns={columns} dataSource={tableData} loading={loading} rowKey="name" bordered pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} />
    </div>
  );
};

export default Report8;
