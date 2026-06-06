import { Button, DatePicker, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';
import * as XLSX from 'xlsx';

interface ReportDataType {
  zoneName: string;
  zoneCode?: string;
  gear?: string;  // A、B、C档
  scorePlus: number;
  fiveTaskCount: number;
  fiveCount: number;
  fivePercent: number | string;
  fiveScore: number;
  tenTaskCount: number;
  tenCount: number;
  tenPercent: number | string;
  tenScore: number;
}

const Report6 = () => {
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

  // 数组求和辅助函数
  const sumNum = (data: ReportDataType[], field: keyof ReportDataType): number => {
    return data.reduce((total, item) => {
      const value = item[field];
      return total + (typeof value === 'number' ? value : 0);
    }, 0);
  };

  // 处理分档数据
  const processGearData = (data: ReportDataType[]): ReportDataType[] => {
    const result: ReportDataType[] = [];
    
    // 处理A、B、C三个档次
    ['A', 'B', 'C'].forEach(gear => {
      const gearData = data.filter(item => item.gear === gear);
      
      if (gearData.length > 0) {
        // 创建该档次的汇总行
        const gearSummary: ReportDataType = {
          zoneName: `${gear}档`,
          zoneCode: gear,
          gear: gear,
          scorePlus: sumNum(gearData, 'scorePlus'),
          fiveTaskCount: sumNum(gearData, 'fiveTaskCount'),
          fiveCount: sumNum(gearData, 'fiveCount'),
          fivePercent: 0,
          fiveScore: 0,
          tenTaskCount: sumNum(gearData, 'tenTaskCount'),
          tenCount: sumNum(gearData, 'tenCount'),
          tenPercent: 0,
          tenScore: 0,
        };
        
        // 计算完成率和得分
        gearSummary.fivePercent = gearSummary.fiveTaskCount === 0 
          ? '0.00' 
          : ((gearSummary.fiveCount * 100) / gearSummary.fiveTaskCount).toFixed(2);
        gearSummary.fiveScore = gearSummary.fiveTaskCount === 0
          ? 0
          : Number(((Number(gearSummary.fivePercent) / 100) * 0.1).toFixed(2));
        
        gearSummary.tenPercent = gearSummary.tenTaskCount === 0 
          ? '0.00' 
          : ((gearSummary.tenCount * 100) / gearSummary.tenTaskCount).toFixed(2);
        gearSummary.tenScore = gearSummary.tenTaskCount === 0
          ? 0
          : Number(((Number(gearSummary.tenPercent) / 100) * 0.3).toFixed(2));
        
        // 添加汇总行和该档次的所有数据
        result.push(gearSummary, ...gearData);
      }
    });
    
    return result;
  };

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
      
      const response = await request('/zsxt-api/statistics/keyZoneScorePlus', {
        method: 'POST',
        data: params,
      });
      
      // 处理数据，添加A、B、C档汇总
      const processedData = processGearData(response || []);
      setTableData(processedData);
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  // 导出Excel
  const handleExport = () => {
    if (!year || !month1 || !month2) {
      message.warning('请先查询数据');
      return;
    }

    if (tableData.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }

    try {
      // 创建工作簿
      const wb = XLSX.utils.book_new();
      const ws: any = {};

      // 定义多层表头
      // 第一层表头
      const header1 = ['重点园区', '重特大项目加分', '', '项目签约(0.4分)', '', '', '', '', '', ''];
      // 第二层表头
      const header2 = ['', '重特大项目签约加分', '', '5亿元项目签约(0.1分)', '', '', '', '10亿元项目签约(0.3分)', '', '', ''];
      // 第三层表头
      const header3 = ['', '得分', '年度目标', '完成数', '完成率', '得分', '年度目标', '完成数', '完成率', '得分'];

      // 准备数据行
      const dataRows = tableData.map(item => [
        item.zoneName,
        item.scorePlus,
        item.fiveTaskCount,
        item.fiveCount,
        typeof item.fivePercent === 'string' 
          ? (item.fivePercent === '0.00' ? '-' : `${item.fivePercent}%`)
          : (item.fivePercent > 0 ? `${item.fivePercent}%` : '-'),
        item.fiveScore,
        item.tenTaskCount,
        item.tenCount,
        typeof item.tenPercent === 'string'
          ? (item.tenPercent === '0.00' ? '-' : `${item.tenPercent}%`)
          : (item.tenPercent > 0 ? `${item.tenPercent}%` : '-'),
        item.tenScore,
      ]);

      // 合并表头和数据
      const allData = [header1, header2, header3, ...dataRows];

      // 将数据转换为工作表
      XLSX.utils.sheet_add_aoa(ws, allData, { origin: 'A1' });

      // 合并单元格
      ws['!merges'] = [
        // 第一层表头合并
        { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } }, // 重点园区 (A1:A3)
        { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } }, // 重特大项目加分 (B1:C1)
        { s: { r: 0, c: 3 }, e: { r: 0, c: 9 } }, // 项目签约(0.4分) (D1:J1)
        
        // 第二层表头合并
        { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } }, // 重特大项目签约加分 (B2:C2)
        { s: { r: 1, c: 3 }, e: { r: 1, c: 6 } }, // 5亿元项目签约(0.1分) (D2:G2)
        { s: { r: 1, c: 7 }, e: { r: 1, c: 9 } }, // 10亿元项目签约(0.3分) (H2:J2)
        
        // 第三层表头合并
        { s: { r: 2, c: 1 }, e: { r: 2, c: 1 } }, // 得分 (B3)
      ];

      // 设置列宽
      ws['!cols'] = [
        { wch: 20 }, // 重点园区
        { wch: 12 }, // 得分
        { wch: 12 }, // 年度目标
        { wch: 12 }, // 完成数
        { wch: 12 }, // 完成率
        { wch: 12 }, // 得分
        { wch: 12 }, // 年度目标
        { wch: 12 }, // 完成数
        { wch: 12 }, // 完成率
        { wch: 12 }, // 得分
      ];

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '重点园区项目签约得分表');

      // 生成文件名
      const fileName = `重点园区项目签约得分表_${year.format('YYYY')}年${month1}月-${month2}月.xlsx`;

      // 导出文件
      XLSX.writeFile(wb, fileName);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  const columns: ColumnsType<ReportDataType> = [
    { title: '重点园区', dataIndex: 'zoneName', key: 'zoneName', align: 'center', width: 200 },
    {
      title: '重特大项目加分',
      align: 'center',
      children: [
        { title: '重特大项目签约加分', align: 'center', children: [
          { title: '得分', dataIndex: 'scorePlus', key: 'scorePlus', align: 'center', width: 80 },
        ]},
      ],
    },
    {
      title: '项目签约(0.4分)',
      align: 'center',
      children: [
        {
          title: '5亿元项目签约(0.1分)',
          align: 'center',
          children: [
            { title: '年度目标', dataIndex: 'fiveTaskCount', key: 'fiveTaskCount', align: 'center', width: 90 },
            { title: '完成数', dataIndex: 'fiveCount', key: 'fiveCount', align: 'center', width: 80 },
            { 
              title: '完成率', 
              dataIndex: 'fivePercent', 
              key: 'fivePercent', 
              align: 'center', 
              width: 90, 
              render: (v: number | string) => {
                if (typeof v === 'string') return v === '0.00' ? '-' : `${v}%`;
                return v > 0 ? `${v}%` : '-';
              }
            },
            { title: '得分', dataIndex: 'fiveScore', key: 'fiveScore', align: 'center', width: 80 },
          ],
        },
        {
          title: '10亿元项目签约(0.3分)',
          align: 'center',
          children: [
            { title: '年度目标', dataIndex: 'tenTaskCount', key: 'tenTaskCount', align: 'center', width: 90 },
            { title: '完成数', dataIndex: 'tenCount', key: 'tenCount', align: 'center', width: 80 },
            { 
              title: '完成率', 
              dataIndex: 'tenPercent', 
              key: 'tenPercent', 
              align: 'center', 
              width: 90, 
              render: (v: number | string) => {
                if (typeof v === 'string') return v === '0.00' ? '-' : `${v}%`;
                return v > 0 ? `${v}%` : '-';
              }
            },
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
        "三比一提升"重点园区项目签约得分表
      </p>
      <Table columns={columns} dataSource={tableData} loading={loading} rowKey="zoneName" bordered pagination={false} scroll={{ x: 1200 }} />
    </div>
  );
};

export default Report6;
