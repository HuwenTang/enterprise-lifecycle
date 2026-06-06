import { Button, DatePicker, Select, message } from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const Report2 = () => {
  const [year, setYear] = useState<Dayjs | null>(null);
  const [month1, setMonth1] = useState<string>('01');
  const [month2, setMonth2] = useState<string>('');
  const [reportData, setReportData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // 月份选项
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: i + 1 < 10 ? `0${i + 1}` : `${i + 1}`,
  }));

  // 初始化
  useEffect(() => {
    const now = dayjs();
    const currentYear = now.year();
    let currentMonth = now.month(); // 0-11
    
    if (currentMonth === 0) {
      // 如果是1月，取去年
      setYear(dayjs(`${currentYear - 1}`));
      setMonth2('12');
    } else {
      setYear(dayjs(`${currentYear}`));
      setMonth2(currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`);
    }
  }, []);

  // 当年份和月份初始化后，自动查询
  useEffect(() => {
    if (year && month1 && month2) {
      handleSearch();
    }
  }, [year, month2]);

  // 查询数据
  const handleSearch = async () => {
    if (!year || !month1 || !month2) {
      message.warning('请选择完整的日期范围');
      return;
    }

    setLoading(true);
    try {
      const params = {
        currStartDate: `${year.format('YYYY')}-${month1}-01`,
        currEndDate: getLastDayOfMonth(`${year.format('YYYY')}-${month2}`),
      };
      
      const response = await request('/zsxt-api/statistics/halfYearProjInfo', {
        method: 'POST',
        data: params,
      });
      
      setReportData(response || {});
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置
  const handleReset = () => {
    setYear(null);
    setMonth1('01');
    setMonth2('');
    setReportData({});
  };

  // 导出
  const handleExport = async () => {
    if (!year || !month1 || !month2) {
      message.warning('请先查询数据');
      return;
    }

    if (Object.keys(reportData).length === 0) {
      message.warning('暂无数据可导出');
      return;
    }

    try {
      // 构建文档内容
      const content = `${year.format('YYYY')}年${month1}月至${year.format('YYYY')}年${month2}月，全市累计新签约亿元（1000万美元）以上项目${reportData.xqyxmsOne || ''}个，协议投资额${reportData.xqytzeOne || ''}亿元；5亿元（3000万美元）以上项目${reportData.xqyxmsFive || ''}个，协议投资额${reportData.xqytzeFive || ''}亿元；10亿元（1亿美元）以上项目${reportData.xqyxmsTen || ''}个，协议投资额${reportData.xqytzeTen || ''}亿元。新签约亿元（1000万美元）以上项目中，内资项目${reportData.nzxqyxmsOne || ''}个，协议投资额${reportData.nzxqytzeOne || ''}亿元；外资项目${reportData.wzxqyxmsOne || ''}个，协议投资额${reportData.wzxqytzeOne || ''}亿美元。19个"三比一提升"重点考核园区新签约项目${reportData.keyZoneProjNums || ''}个，协议投资总额${reportData.keyZoneTz || ''}亿元，分别占全市总量的${reportData.keyZoneProjPercent || ''}%和${reportData.keyZoneTzPercent || ''}%。新签约"大海新晨"主导产业体系项目${reportData.onePlusFourProjNums || 0}个，协议投资额${reportData.onePlusFourZtz || 0}亿元，其中，新签约大健康产业项目${reportData.t1 || 0}个，海工装备和高技术船舶产业项目${reportData.t2 || 0}个，新兴产业（新智造、新材料、新能源）${reportData.t3 || 0}个，晨光力量（未来产业）${reportData.t4 || 0}个。`;

      // 创建Word文档
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // 标题
            new Paragraph({
              text: '项目招引信息',
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
              style: 'Heading1',
            }),
            // 内容段落
            new Paragraph({
              children: [
                new TextRun({
                  text: content,
                  size: 32, // 16pt = 32 half-points
                  font: '宋体',
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: {
                firstLine: 720, // 首行缩进2字符 (720 twips = 2字符)
              },
              spacing: {
                line: 360, // 行距
              },
            }),
          ],
        }],
      });

      // 生成并下载文档
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `项目招引信息_${year.format('YYYY')}年${month1}月-${month2}月.docx`);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  // 获取月份最后一天
  const getLastDayOfMonth = (yearMonth: string) => {
    const date = new Date(yearMonth);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return `${yearMonth}-${lastDay}`;
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'auto', padding: '20px' }}>
      {/* 查询条件 */}
      <div style={{ marginBottom: '20px' }}>
        <DatePicker
          value={year}
          onChange={setYear}
          picker="year"
          placeholder="请选择年份"
          style={{ marginRight: '10px' }}
        />
        <Select
          value={month1}
          onChange={setMonth1}
          options={monthOptions}
          placeholder="请选择开始月"
          style={{ width: 120, marginRight: '10px' }}
        />
        <Select
          value={month2}
          onChange={setMonth2}
          options={monthOptions}
          placeholder="请选择结束月"
          style={{ width: 120, marginRight: '10px' }}
        />
        <Button type="primary" onClick={handleSearch} loading={loading} style={{ marginRight: '10px' }}>
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
        项目招引信息
      </p>

      {/* 报表内容 */}
      {Object.keys(reportData).length > 0 && (
        <p style={{ 
          textIndent: '2em', 
          fontSize: '21px', 
          lineHeight: '36px', 
          color: '#000', 
          width: '90%', 
          margin: '0 auto', 
          paddingBottom: '100px',
          fontFamily: 'SimSun, serif'
        }}>
          {year?.format('YYYY')}年{month1}月至{year?.format('YYYY')}年{month2}月，全市累计新签约亿元（1000万美元）以上项目
          <span style={{ color: '#666' }}>{reportData.xqyxmsOne || ''}</span>个，协议投资额
          <span style={{ color: '#666' }}>{reportData.xqytzeOne || ''}</span>亿元；5亿元（3000万美元）以上项目
          <span style={{ color: '#666' }}>{reportData.xqyxmsFive || ''}</span>个，协议投资额
          <span style={{ color: '#666' }}>{reportData.xqytzeFive || ''}</span>亿元；10亿元（1亿美元）以上项目
          <span style={{ color: '#666' }}>{reportData.xqyxmsTen || ''}</span>个，协议投资额
          <span style={{ color: '#666' }}>{reportData.xqytzeTen || ''}</span>亿元。新签约亿元（1000万美元）以上项目中，内资项目
          <span style={{ color: '#666' }}>{reportData.nzxqyxmsOne || ''}</span>个，协议投资额
          <span style={{ color: '#666' }}>{reportData.nzxqytzeOne || ''}</span>亿元；外资项目
          <span style={{ color: '#666' }}>{reportData.wzxqyxmsOne || ''}</span>个，协议投资额
          <span style={{ color: '#666' }}>{reportData.wzxqytzeOne || ''}</span>亿美元。19个"三比一提升"重点考核园区新签约项目
          <span style={{ color: '#666' }}>{reportData.keyZoneProjNums || ''}</span>个，协议投资总额
          <span style={{ color: '#666' }}>{reportData.keyZoneTz || ''}</span>亿元，分别占全市总量的
          <span style={{ color: '#666' }}>{reportData.keyZoneProjPercent || ''}</span>%和
          <span style={{ color: '#666' }}>{reportData.keyZoneTzPercent || ''}</span>%。新签约"大海新晨"主导产业体系项目
          <span style={{ color: '#666' }}>{reportData.onePlusFourProjNums || 0}</span>个，协议投资额
          <span style={{ color: '#666' }}>{reportData.onePlusFourZtz || 0}</span>亿元，其中，新签约大健康产业项目
          <span style={{ color: '#666' }}>{reportData.t1 || 0}</span>个，海工装备和高技术船舶产业项目
          <span style={{ color: '#666' }}>{reportData.t2 || 0}</span>个，新兴产业（新智造、新材料、新能源）
          <span style={{ color: '#666' }}>{reportData.t3 || 0}</span>个，晨光力量（未来产业）
          <span style={{ color: '#666' }}>{reportData.t4 || 0}</span>个。
        </p>
      )}
    </div>
  );
};

export default Report2;
