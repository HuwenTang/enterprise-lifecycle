import { Button, DatePicker, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

interface ReportDataType {
  district: string;
  scorePlus: number;
  oneTaskCount: number;
  oneCount: number;
  onePercent: number;
  oneScore: number;
  fiveTaskCount: number;
  fiveCount: number;
  fivePercent: number;
  fiveScore: number;
  tenTaskCount: number;
  tenCount: number;
  tenPercent: number;
  tenScore: number;
}

const Report5 = () => {
  const [year, setYear] = useState<Dayjs | null>(null);
  const [month1, setMonth1] = useState<string>('01');
  const [month2, setMonth2] = useState<string>('');
  const [tableData, setTableData] = useState<ReportDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: i + 1 < 10 ? `0${i + 1}` : `${i + 1}`,
  }));

  useEffect(() => {
    const now = dayjs();
    const currentYear = now.year();
    let currentMonth = now.month();
    if (currentMonth === 0) {
      setYear(dayjs(`${currentYear - 1}`));
      setMonth2('12');
    } else {
      setYear(dayjs(`${currentYear}`));
      setMonth2(currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`);
    }
  }, []);

  useEffect(() => {
    if (year && month1 && month2) {
      handleSearch();
    }
  }, [year, month2]);

  const handleSearch = async () => {
    if (!year || !month1 || !month2) {
      message.warning('请选择完整的日期范围');
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
        currStartDate: `${year.format('YYYY')}-${month1}-01`,
        currEndDate: getLastDayOfMonth(`${year.format('YYYY')}-${month2}`),
      };
      
      const response = await request('/zsxt-api/statistics/qxScorePlus', {
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
    if (!year || !month1 || !month2) {
      message.warning('请选择完整的日期范围');
      return;
    }

    try {
      const getLastDayOfMonth = (yearMonth: string) => {
        const date = new Date(yearMonth);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return `${yearMonth}-${lastDay}`;
      };

      const response = await request('/zsxt-api/statistics/exportQxScore', {
        method: 'POST',
        data: {
          currStartDate: `${year.format('YYYY')}-${month1}-01`,
          currEndDate: getLastDayOfMonth(`${year.format('YYYY')}-${month2}`),
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
      const fileName = `市区项目签约得分表_${year.format('YYYY')}年${month1}月-${month2}月.xlsx`;
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
    { title: '市(区)', dataIndex: 'district', key: 'district', align: 'center', width: 120 },
    {
      title: '重特大项目加分',
      align: 'center',
      children: [
        { title: '重特大项目签约加分', align: 'center', children: [
          { title: '得分', dataIndex: 'scorePlus', key: 'scorePlus', align: 'center', width: 160 },
        ]},
      ],
    },
    {
      title: '项目签约(0.4分)',
      align: 'center',
      children: [
        {
          title: '1亿元项目签约',
          align: 'center',
          children: [
            { title: '年度目标', dataIndex: 'oneTaskCount', key: 'oneTaskCount', align: 'center', width: 90 },
            { title: '完成数', dataIndex: 'oneCount', key: 'oneCount', align: 'center', width: 80 },
            { title: '完成率', dataIndex: 'onePercent', key: 'onePercent', align: 'center', width: 90, render: (v: number) => `${v}%` },
            { title: '得分', dataIndex: 'oneScore', key: 'oneScore', align: 'center', width: 80 },
          ],
        },
        {
          title: '5亿元项目签约(0.1分)',
          align: 'center',
          children: [
            { title: '年度目标', dataIndex: 'fiveTaskCount', key: 'fiveTaskCount', align: 'center', width: 90 },
            { title: '完成数', dataIndex: 'fiveCount', key: 'fiveCount', align: 'center', width: 80 },
            { title: '完成率', dataIndex: 'fivePercent', key: 'fivePercent', align: 'center', width: 90, render: (v: number) => `${v}%` },
            { title: '得分', dataIndex: 'fiveScore', key: 'fiveScore', align: 'center', width: 80 },
          ],
        },
        {
          title: '10亿元项目签约(0.3分)',
          align: 'center',
          children: [
            { title: '年度目标', dataIndex: 'tenTaskCount', key: 'tenTaskCount', align: 'center', width: 90 },
            { title: '完成数', dataIndex: 'tenCount', key: 'tenCount', align: 'center', width: 80 },
            { title: '完成率', dataIndex: 'tenPercent', key: 'tenPercent', align: 'center', width: 90, render: (v: number) => `${v}%` },
            { title: '得分', dataIndex: 'tenScore', key: 'tenScore', align: 'center', width: 80 },
          ],
        },
      ],
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <DatePicker value={year} onChange={setYear} picker="year" placeholder="请选择年份" style={{ marginRight: '10px' }} />
        <Select value={month1} onChange={setMonth1} options={monthOptions} placeholder="请选择开始月" style={{ width: 120, marginRight: '10px' }} />
        <Select value={month2} onChange={setMonth2} options={monthOptions} placeholder="请选择结束月" style={{ width: 120, marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch} loading={loading} style={{ marginRight: '10px' }}>查询</Button>
        <Button onClick={() => { setYear(null); setMonth1('01'); setMonth2(''); setTableData([]); }} style={{ marginRight: '10px' }}>重置</Button>
        <Button type="primary" onClick={handleExport}>导出</Button>
      </div>
      <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>
        "三比一提升"市（区）项目签约得分表
      </p>
      <Table 
        columns={columns} 
        dataSource={tableData} 
        loading={loading} 
        rowKey="district" 
        bordered 
        pagination={false} 
        scroll={{ x: 1200 }}
        summary={(pageData) => {
          // 汇总计算
          const sums = {
            scorePlus: 0,
            oneTaskCount: 0,
            oneCount: 0,
            oneScore: 0,
            fiveTaskCount: 0,
            fiveCount: 0,
            fiveScore: 0,
            tenTaskCount: 0,
            tenCount: 0,
            tenScore: 0,
          };

          pageData.forEach(item => {
            sums.scorePlus += item.scorePlus || 0;
            sums.oneTaskCount += item.oneTaskCount || 0;
            sums.oneCount += item.oneCount || 0;
            sums.oneScore += item.oneScore || 0;
            sums.fiveTaskCount += item.fiveTaskCount || 0;
            sums.fiveCount += item.fiveCount || 0;
            sums.fiveScore += item.fiveScore || 0;
            sums.tenTaskCount += item.tenTaskCount || 0;
            sums.tenCount += item.tenCount || 0;
            sums.tenScore += item.tenScore || 0;
          });

          // 计算完成率和得分 - 按照特殊逻辑
          // index 4: 1亿元完成率 = (完成数 * 100 / 年度目标)
          const onePercent = sums.oneTaskCount > 0 ? ((sums.oneCount * 100) / sums.oneTaskCount).toFixed(2) + '%' : '-';
          // index 5: 1亿元得分 = (完成数 / 年度目标) * 0.1
          const oneScoreCalc = sums.oneTaskCount > 0 ? ((sums.oneCount / sums.oneTaskCount) * 0.1).toFixed(2) : '-';
          
          // index 8: 5亿元完成率 = (完成数 * 100 / 年度目标)
          const fivePercent = sums.fiveTaskCount > 0 ? ((sums.fiveCount * 100) / sums.fiveTaskCount).toFixed(2) + '%' : '-';
          // index 9: 5亿元得分 = (完成数 / 年度目标) * 0.3
          const fiveScoreCalc = sums.fiveTaskCount > 0 ? ((sums.fiveCount / sums.fiveTaskCount) * 0.3).toFixed(2) : '-';
          
          // index 12: 10亿元完成率 = (完成数 * 100 / 年度目标)
          const tenPercent = sums.tenTaskCount > 0 ? ((sums.tenCount * 100) / sums.tenTaskCount).toFixed(2) + '%' : '-';
          // index 13: 10亿元得分 = 直接累加各市区得分
          const tenScoreCalc = sums.tenScore.toFixed(2);

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="center"><strong>全市</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center"><strong>{sums.scorePlus.toFixed(2)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center"><strong>{sums.oneTaskCount}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center"><strong>{sums.oneCount}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center"><strong>{onePercent}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center"><strong>{oneScoreCalc}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center"><strong>{sums.fiveTaskCount}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center"><strong>{sums.fiveCount}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center"><strong>{fivePercent}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center"><strong>{fiveScoreCalc}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={10} align="center"><strong>{sums.tenTaskCount}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={11} align="center"><strong>{sums.tenCount}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={12} align="center"><strong>{tenPercent}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={13} align="center"><strong>{tenScoreCalc}</strong></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default Report5;
