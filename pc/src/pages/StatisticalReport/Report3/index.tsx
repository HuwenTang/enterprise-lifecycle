import { Button, DatePicker, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface IndustryItem {
  code: string;
  name: string;
  t1: number;  // 个数
  t2: string;  // 占比
  tze: number; // 投资额
}

interface ReportDataType {
  district: string;
  districtCode: string;
  projNums: number;
  ztz: number;
  children: IndustryItem[];
}

const Report3 = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [moneyType, setMoneyType] = useState<string>('0');
  const [tableData, setTableData] = useState<ReportDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const moneyOptions = [
    { value: '0', label: '全部' },
    { value: '4', label: '500万-1亿元（不含）' },
    { value: '1', label: '1亿元(1000万美元)以上' },
    { value: '5', label: '5亿元(3000万美元)以上' },
    { value: '10', label: '10亿元(1亿美元)以上' },
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
        rmb: parseInt(moneyType),
      };
      
      const response = await request('/zsxt-api/statistics/onePlusFourForQx', {
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
      const response = await request('/zsxt-api/statistics/exportOnePlusFourForQx', {
        method: 'POST',
        data: {
          currStartDate: dateRange[0].format('YYYY-MM-DD'),
          currEndDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: parseInt(moneyType),
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
      const fileName = `全市新签约项目分产业汇总表_${dateRange[0].format('YYYYMM')}-${dateRange[1].format('YYYYMM')}.xlsx`;
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

  // 从 children 数组中获取指定 code 的数据
  const getIndustryData = (record: ReportDataType, code: string) => {
    const item = record.children?.find(c => c.code === code);
    return item || { t1: 0, t2: '-', tze: 0 };
  };

  // 占比列的单元格样式
  const percentCellStyle = () => ({
    style: { whiteSpace: 'nowrap' as const }
  });

  const columns: ColumnsType<ReportDataType> = [
    { title: '市(区)', dataIndex: 'district', key: 'district', align: 'center', width: 100, fixed: 'left' },
    { title: '项目总数', dataIndex: 'projNums', key: 'projNums', align: 'center', width: 90 },
    { title: '总投资(亿元)', dataIndex: 'ztz', key: 'ztz', align: 'center', width: 110 },
    {
      title: '其中"大海新晨"产业',
      align: 'center',
      children: [
        {
          title: '大健康产业项目',
          align: 'center',
          children: [
            { title: '生物医药', align: 'center', children: [
              { title: '个数', key: 't0Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.1.1').t1 },
              { title: '占比', key: 't0Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.1.1').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't0Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.1.1').tze },
            ]},
            { title: '健康食品', align: 'center', children: [
              { title: '个数', key: 't1Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.1.2').t1 },
              { title: '占比', key: 't1Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.1.2').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't1Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.1.2').tze },
            ]},
          ],
        },
        {
          title: '海工装备和高技术船舶产业项目',
          align: 'center',
          children: [
            { title: '海工装备和高技术船舶', align: 'center', children: [
              { title: '个数', key: 't2Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.2.1').t1 },
              { title: '占比', key: 't2Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.2.1').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't2Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.2.1').tze },
            ]},
          ],
        },
        {
          title: '新兴产业(新智造、新材料、新能源)',
          align: 'center',
          children: [
            { title: '汽车及零部件', align: 'center', children: [
              { title: '个数', key: 't3Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.1').t1 },
              { title: '占比', key: 't3Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.3.1').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't3Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.1').tze },
            ]},
            { title: '新一代信息技术和智能装备', align: 'center', children: [
              { title: '个数', key: 't4Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.2').t1 },
              { title: '占比', key: 't4Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.3.2').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't4Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.2').tze },
            ]},
            { title: '化工及新材料', align: 'center', children: [
              { title: '个数', key: 't5Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.3').t1 },
              { title: '占比', key: 't5Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.3.3').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't5Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.3').tze },
            ]},
            { title: '金属新材料及制品', align: 'center', children: [
              { title: '个数', key: 't6Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.4').t1 },
              { title: '占比', key: 't6Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.3.4').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't6Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.4').tze },
            ]},
            { title: '新能源', align: 'center', children: [
              { title: '个数', key: 't7Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.5').t1 },
              { title: '占比', key: 't7Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.3.5').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't7Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.3.5').tze },
            ]},
          ],
        },
        {
          title: '晨光力量(未来产业)',
          align: 'center',
          children: [
            { title: '未来产业', align: 'center', children: [
              { title: '个数', key: 't8Num', align: 'center', width: 70, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.4.1').t1 },
              { title: '占比', key: 't8Per', align: 'center', width: 85, onCell: percentCellStyle, render: (_: any, record: ReportDataType) => {
                const val = getIndustryData(record, '1.4.1').t2;
                return val === '-' ? '-' : `${val}%`;
              }},
              { title: '投资额', key: 't8Tze', align: 'center', width: 80, render: (_: any, record: ReportDataType) => getIndustryData(record, '1.4.1').tze },
            ]},
          ],
        },
      ],
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])} picker="month" format="YYYY-MM" placeholder={['开始月份', '结束月份']} style={{ marginRight: '10px' }} />
        <Select value={moneyType} onChange={setMoneyType} options={moneyOptions} placeholder="请下拉选择投资额" style={{ width: 220, marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch} loading={loading} style={{ marginRight: '10px' }}>查询</Button>
        <Button onClick={() => { setDateRange(null); setMoneyType('0'); setTableData([]); }} style={{ marginRight: '10px' }}>重置</Button>
        <Button type="primary" onClick={handleExport}>导出</Button>
      </div>
      <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>全市新签约项目分产业汇总表</p>
      <Table 
        columns={columns} 
        dataSource={tableData} 
        loading={loading} 
        rowKey="districtCode" 
        bordered 
        pagination={false} 
        scroll={{ x: 2400 }}
        expandable={{ childrenColumnName: 'nonExistentField' }} 
        summary={(pageData) => {
          // 汇总计算
          const industryCodes = ['1.1.1', '1.1.2', '1.2.1', '1.3.1', '1.3.2', '1.3.3', '1.3.4', '1.3.5', '1.4.1'];
          const sums: any = {
            projNums: 0,
            ztz: 0,
            industries: {}
          };
          
          // 初始化所有产业数据
          industryCodes.forEach(code => {
            sums.industries[code] = { t1: 0, tze: 0, t2: '-' };
          });
          
          // 汇总基础数据
          pageData.forEach(item => {
            sums.projNums += item.projNums || 0;
            sums.ztz += item.ztz || 0;
            
            // 汇总各产业数据
            industryCodes.forEach(code => {
              const industryData = item.children?.find(c => c.code === code);
              if (industryData) {
                sums.industries[code].t1 += industryData.t1 || 0;
                sums.industries[code].tze += industryData.tze || 0;
              }
            });
          });
          
          // 重新计算全市的占比
          if (sums.projNums > 0) {
            industryCodes.forEach(code => {
              const percentage = ((sums.industries[code].t1 * 100) / sums.projNums).toFixed(2);
              sums.industries[code].t2 = percentage;
            });
          }
          
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="center"><strong>合计</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center"><strong>{sums.projNums}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center"><strong>{sums.ztz.toFixed(2)}</strong></Table.Summary.Cell>
              {industryCodes.map((code, idx) => (
                <>
                  <Table.Summary.Cell key={`${code}-num`} index={3 + idx * 3} align="center">
                    <strong>{sums.industries[code].t1}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell key={`${code}-per`} index={4 + idx * 3} align="center">
                    <strong>{sums.industries[code].t2 === '-' ? '-' : `${sums.industries[code].t2}%`}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell key={`${code}-tze`} index={5 + idx * 3} align="center">
                    <strong>{sums.industries[code].tze.toFixed(2)}</strong>
                  </Table.Summary.Cell>
                </>
              ))}
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default Report3;
