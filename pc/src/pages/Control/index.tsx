import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Button, DatePicker, Space } from 'antd';
import { MessageOutlined, ShoppingOutlined, CheckCircleOutlined, FileTextOutlined, SignatureOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import { history, request } from '@umijs/max';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

const Control = () => {
  const [stats, setStats] = useState({
    messageCount: 0,
    investmentCount: 0,
    projectAuditCount: 0,
  });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [rmb, setRmb] = useState<number>(1); // 全局金额筛选（用于初始查询）
  const [rmbType, setRmbType] = useState<number>(0); // 全局金额筛选 tab（已弃用，保留向后兼容）
  const [quantityRmbType, setQuantityRmbType] = useState<number>(0); // 签约项目数量统计：0: 1亿以上, 1: 5亿以上
  const [amountRmbType, setAmountRmbType] = useState<number>(0); // 签约项目金额统计：0: 1亿以上, 1: 5亿以上
  const [districtRmbType, setDistrictRmbType] = useState<number>(0); // 各市区完成情况：0: 1亿以上, 1: 5亿以上
  const [parkRmbType, setParkRmbType] = useState<number>(0); // 各园区完成情况：0: 1亿以上, 1: 5亿以上
  const [chartData, setChartData] = useState<any[]>([]);
  const [parkChartData, setParkChartData] = useState<any[]>([]);
  const [trendChartData, setTrendChartData] = useState<any[]>([]);
  const [trendType, setTrendType] = useState<'quantity' | 'amount'>('quantity'); // 趋势分析类型：数量或金额
  const [industryChartData, setIndustryChartData] = useState<any[]>([]); // 产业分布数据
  const [loading, setLoading] = useState(false);
  const chartDataRef = useRef<any[]>([]);

  const handleNavigate = (path: string) => {
    history.push(path);
  };

  const performQuery = useCallback(async (range: [dayjs.Dayjs, dayjs.Dayjs], rmbValue: number) => {
    setLoading(true);
    try {
      const params = {
        currStartDate: range[0].format('YYYY-MM-DD'),
        currEndDate: range[1].endOf('month').format('YYYY-MM-DD'),
        rmb: rmbValue,
      };
      
      const response = await request('/zsxt-api/statistics/signedProjectInfo', {
        method: 'POST',
        data: params,
      });
      
      const data = response || [];
      chartDataRef.current = data;
      setChartData(data);
      // 初始化图表
      setTimeout(() => {
        renderQuantityChart(data);
        renderAmountChart(data);
        renderDistrictChart(data);
      }, 100);

      // 同时查询园区数据
      try {
        const parkParams = {
          startDate: params.currStartDate,
          endDate: params.currEndDate,
          rmb: params.rmb,
        };
        const parkResponse = await request('/zsxt-api/statistics/signedProjectInfoYq', {
          method: 'POST',
          data: parkParams,
        });
        const parkData = parkResponse || [];
        setParkChartData(parkData);
        setTimeout(() => {
          renderParkChart(parkData);
        }, 100);
      } catch (error) {
        console.error('查询园区数据失败:', error);
      }

      // 同时查询趋势分析数据
      try {
        const trendParams = {
          currStartDate: params.currStartDate,
          currEndDate: params.currEndDate,
        };
        const trendResponse = await request('/zsxt-api/statistics/countSignedProjQyqs', {
          method: 'POST',
          data: trendParams,
        });
        const trendData = trendResponse || [];
        setTrendChartData(trendData);
        setTimeout(() => {
          renderTrendChart(trendData, 'quantity');
        }, 100);
      } catch (error) {
        console.error('查询趋势分析数据失败:', error);
      }

      // 同时查询产业分布数据
      try {
        const industryParams = {
          currStartDate: params.currStartDate,
          currEndDate: params.currEndDate,
        };
        const industryResponse = await request('/zsxt-api/statistics/countSignedProjCyfb', {
          method: 'POST',
          data: industryParams,
        });
        const industryData = industryResponse || [];
        setIndustryChartData(industryData);
        setTimeout(() => {
          renderIndustryChart(industryData);
        }, 100);
      } catch (error) {
        console.error('查询产业分布数据失败:', error);
      }
    } catch (error) {
      console.error('查询失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQuery = async () => {
    if (!dateRange) {
      return;
    }
    await performQuery(dateRange, rmb);
  };

  // 初始化默认日期范围
  useEffect(() => {
    const now = dayjs();
    const year = now.year();
    let month = now.month(); // 0-11
    
    let startDate, endDate;
    if (month === 0) {
      startDate = dayjs(`${year - 1}-01`);
      endDate = dayjs(`${year - 1}-12`);
    } else {
      startDate = dayjs(`${year}-01`);
      endDate = dayjs(`${year}-${month < 10 ? '0' + month : month}`);
    }
    
    setDateRange([startDate, endDate]);

    // 获取待办任务统计数据
    const fetchStats = async () => {
      try {
        const [messageRes, investRes, auditRes] = await Promise.all([
          request('/zsxt-api/statistics/todoMessageCount', { method: 'POST' }),
          request('/zsxt-api/statistics/investCompanyCount', { method: 'POST' }),
          request('/zsxt-api/statistics/pendingReviewCount', { method: 'POST' }),
        ]);
        
        setStats({
          messageCount: typeof messageRes === 'object' ? messageRes?.count || 0 : messageRes || 0,
          investmentCount: typeof investRes === 'object' ? investRes?.count || 0 : investRes || 0,
          projectAuditCount: typeof auditRes === 'object' ? auditRes?.count || 0 : auditRes || 0,
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    };

    fetchStats();
  }, []);

  // 当日期范围初始化后，自动查询
  useEffect(() => {
    if (dateRange) {
      performQuery(dateRange, rmb);
    }
  }, [dateRange, rmb]);

  // 监听窗口 resize 事件，重新调整图表大小
  useEffect(() => {
    const handleResize = () => {
      const quantityChart = echarts.getInstanceByDom(document.getElementById('quantityChart') as HTMLElement);
      if (quantityChart) {
        quantityChart.resize();
      }

      const amountChart = echarts.getInstanceByDom(document.getElementById('amountChart') as HTMLElement);
      if (amountChart) {
        amountChart.resize();
      }

      const districtChart = echarts.getInstanceByDom(document.getElementById('districtChart') as HTMLElement);
      if (districtChart) {
        districtChart.resize();
      }

      const parkChart = echarts.getInstanceByDom(document.getElementById('parkChart') as HTMLElement);
      if (parkChart) {
        parkChart.resize();
      }

      const trendChart = echarts.getInstanceByDom(document.getElementById('trendChart') as HTMLElement);
      if (trendChart) {
        trendChart.resize();
      }

      const industryChart = echarts.getInstanceByDom(document.getElementById('industryChart') as HTMLElement);
      if (industryChart) {
        industryChart.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const queryAndRenderChart = async (range: [dayjs.Dayjs, dayjs.Dayjs], rmbValue: number, chartType: 'quantity' | 'amount' | 'district') => {
    try {
      const params = {
        currStartDate: range[0].format('YYYY-MM-DD'),
        currEndDate: range[1].endOf('month').format('YYYY-MM-DD'),
        rmb: rmbValue,
      };
      
      const response = await request('/zsxt-api/statistics/signedProjectInfo', {
        method: 'POST',
        data: params,
      });
      
      const data = response || [];
      
      // 只渲染指定的图表
      if (chartType === 'quantity') {
        renderQuantityChart(data);
      } else if (chartType === 'amount') {
        renderAmountChart(data);
      } else if (chartType === 'district') {
        renderDistrictChart(data);
      }
    } catch (error) {
      console.error('查询失败:', error);
    }
  };

  const handleQuantityRmbTypeChange = (type: number) => {
    setQuantityRmbType(type);
    const rmbValue = type === 0 ? 1 : 5;
    if (dateRange) {
      queryAndRenderChart(dateRange, rmbValue, 'quantity');
    }
  };

  const handleAmountRmbTypeChange = (type: number) => {
    setAmountRmbType(type);
    const rmbValue = type === 0 ? 1 : 5;
    if (dateRange) {
      queryAndRenderChart(dateRange, rmbValue, 'amount');
    }
  };

  const handleDistrictRmbTypeChange = (type: number) => {
    setDistrictRmbType(type);
    const rmbValue = type === 0 ? 1 : 5;
    if (dateRange) {
      queryAndRenderChart(dateRange, rmbValue, 'district');
    }
  };

  const queryAndRenderParkChart = async (range: [dayjs.Dayjs, dayjs.Dayjs], rmbValue: number) => {
    try {
      const params = {
        startDate: range[0].format('YYYY-MM-DD'),
        endDate: range[1].endOf('month').format('YYYY-MM-DD'),
        rmb: rmbValue,
      };
      
      const response = await request('/zsxt-api/statistics/signedProjectInfoYq', {
        method: 'POST',
        data: params,
      });
      
      const data = response || [];
      setParkChartData(data);
      renderParkChart(data);
    } catch (error) {
      console.error('查询园区数据失败:', error);
    }
  };

  const handleParkRmbTypeChange = (type: number) => {
    setParkRmbType(type);
    const rmbValue = type === 0 ? 1 : 5;
    if (dateRange) {
      queryAndRenderParkChart(dateRange, rmbValue);
    }
  };

  const queryAndRenderTrendChart = async (range: [dayjs.Dayjs, dayjs.Dayjs], type: 'quantity' | 'amount') => {
    try {
      const params = {
        currStartDate: range[0].format('YYYY-MM-DD'),
        currEndDate: range[1].endOf('month').format('YYYY-MM-DD'),
      };
      
      const response = await request('/zsxt-api/statistics/countSignedProjQyqs', {
        method: 'POST',
        data: params,
      });
      
      const data = response || [];
      setTrendChartData(data);
      renderTrendChart(data, type);
    } catch (error) {
      console.error('查询趋势分析数据失败:', error);
    }
  };

  const handleTrendTypeChange = (type: 'quantity' | 'amount') => {
    setTrendType(type);
    if (dateRange) {
      queryAndRenderTrendChart(dateRange, type);
    }
  };

  const handleReset = () => {
    setDateRange(null);
    setRmb(1);
    setRmbType(0);
    setQuantityRmbType(0);
    setAmountRmbType(0);
    setDistrictRmbType(0);
    setParkRmbType(0);
    setChartData([]);
    setParkChartData([]);
    setTrendChartData([]);
    setTrendType('quantity');
  };

  const renderQuantityChart = (data: any[]) => {
    const quantityChartDom = document.getElementById('quantityChart') as HTMLElement;
    if (quantityChartDom) {
      const quantityChart = echarts.getInstanceByDom(quantityChartDom);
      if (quantityChart) {
        quantityChart.dispose();
      }
      const chart = echarts.init(quantityChartDom);
      const filteredData = data.filter((item: any) => item.district !== '全市');
      const districts = filteredData.map((item: any) => item.district);
      const projNums = filteredData.map((item: any) => item.projNums || 0);
      
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '10%', right: '5%', bottom: '10%', top: '5%', containLabel: true },
        xAxis: { 
          type: 'category', 
          data: districts,
          axisLabel: { 
            fontSize: 11, 
            interval: 0,
            width: 60,
            overflow: 'truncate',
            ellipsis: '...',
          },
        },
        yAxis: { 
          type: 'value',
          splitLine: { lineStyle: { color: '#f0f0f0' } },
        },
        series: [
          {
            data: projNums,
            type: 'bar',
            itemStyle: { color: '#1890ff' },
            barWidth: '50%',
          },
        ],
      });
    }
  };

  const renderAmountChart = (data: any[]) => {
    const amountChartDom = document.getElementById('amountChart') as HTMLElement;
    if (amountChartDom) {
      const amountChart = echarts.getInstanceByDom(amountChartDom);
      if (amountChart) {
        amountChart.dispose();
      }
      const chart = echarts.init(amountChartDom);
      const filteredData = data.filter((item: any) => item.district !== '全市');
      const districts = filteredData.map((item: any) => item.district);
      const ztz = filteredData.map((item: any) => item.ztz || 0);
      
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '10%', right: '5%', bottom: '10%', top: '5%', containLabel: true },
        xAxis: { 
          type: 'category', 
          data: districts,
          axisLabel: { 
            fontSize: 11, 
            interval: 0,
            width: 60,
            overflow: 'truncate',
            ellipsis: '...',
          },
        },
        yAxis: { 
          type: 'value',
          splitLine: { lineStyle: { color: '#f0f0f0' } },
        },
        series: [
          {
            data: ztz,
            type: 'bar',
            itemStyle: { color: '#52c41a' },
            barWidth: '50%',
          },
        ],
      });
    }
  };

  const renderDistrictChart = (data: any[]) => {
    const districtChartDom = document.getElementById('districtChart') as HTMLElement;
    if (districtChartDom) {
      // 过滤掉全市数据
      const filteredData = data.filter((item: any) => item.district !== '全市');
      // 找到最大值用于计算条形宽度
      const maxValue = Math.max(
        ...filteredData.map((item: any) => Math.max(item.projNums || 0, item.ndmbrws || 0))
      );
      
      const html = `
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div style="display: flex; gap: 10px; margin-bottom: 10px; padding-left: 80px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 12px; height: 12px; background-color: #1890ff;"></div>
              <span style="font-size: 12px;">完成数</span>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 12px; height: 12px; background-color: #d9d9d9;"></div>
              <span style="font-size: 12px;">目标数</span>
            </div>
          </div>
          <div style="flex: 1; overflow-y: scroll; padding-right: 0;">
            ${filteredData.map((item: any) => {
              const projNums = item.projNums || 0;
              const ndmbrws = item.ndmbrws || 0;
              const projNumsWidth = (projNums / maxValue) * 100;
              const ndmbwsWidth = (ndmbrws / maxValue) * 100;
              const label = item.district.length > 10 ? item.district.substring(0, 10) + '...' : item.district;
              return `
                <div style="display: flex; align-items: center; margin-bottom: 12px; gap: 8px; padding-right: 8px;">
                  <div style="width: 70px; text-align: right; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.district}">${label}</div>
                  <div style="flex: 1; position: relative; height: 20px; border-radius: 2px;">
                    <div style="position: absolute; height: 100%; background-color: #d9d9d9; width: ${ndmbwsWidth}%; border-radius: 2px; z-index: 0;"></div>
                    <div style="position: absolute; height: 100%; background-color: #1890ff; width: ${projNumsWidth}%; border-radius: 2px; z-index: 1;"></div>
                  </div>
                  <div style="width: 35px; text-align: right; font-size: 12px; flex-shrink: 0; color: #000; font-weight: bold;">${projNums}</div>
                  <div style="width: 30px; text-align: right; font-size: 12px; flex-shrink: 0;">${ndmbrws}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      districtChartDom.innerHTML = html;
    }
  };

  const renderParkChart = (data: any[]) => {
    const parkChartDom = document.getElementById('parkChart') as HTMLElement;
    if (parkChartDom) {
      // 过滤掉全市数据（检查 park 和 district 字段）
      const filteredData = data.filter((item: any) => {
        const name = item.park || item.district;
        return name !== '全市';
      });
      // 找到最大值用于计算条形宽度
      const maxValue = Math.max(
        ...filteredData.map((item: any) => Math.max(item.projNums || 0, item.ndmbrws || 0))
      );
      
      const html = `
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div style="display: flex; gap: 10px; margin-bottom: 10px; padding-left: 80px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 12px; height: 12px; background-color: #1890ff;"></div>
              <span style="font-size: 12px;">完成数</span>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 12px; height: 12px; background-color: #d9d9d9;"></div>
              <span style="font-size: 12px;">目标数</span>
            </div>
          </div>
          <div style="flex: 1; overflow-y: scroll; padding-right: 0;">
            ${filteredData.map((item: any) => {
              const projNums = item.projNums || 0;
              const ndmbrws = item.ndmbrws || 0;
              const projNumsWidth = (projNums / maxValue) * 100;
              const ndmbwsWidth = (ndmbrws / maxValue) * 100;
              const parkName = item.park || item.district;
              const label = parkName.length > 10 ? parkName.substring(0, 10) + '...' : parkName;
              return `
                <div style="display: flex; align-items: center; margin-bottom: 12px; gap: 8px; padding-right: 8px;">
                  <div style="width: 70px; text-align: right; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${parkName}">${label}</div>
                  <div style="flex: 1; position: relative; height: 20px; border-radius: 2px;">
                    <div style="position: absolute; height: 100%; background-color: #d9d9d9; width: ${ndmbwsWidth}%; border-radius: 2px; z-index: 0;"></div>
                    <div style="position: absolute; height: 100%; background-color: #1890ff; width: ${projNumsWidth}%; border-radius: 2px; z-index: 1;"></div>
                  </div>
                  <div style="width: 35px; text-align: right; font-size: 12px; flex-shrink: 0; color: #000; font-weight: bold;">${projNums}</div>
                  <div style="width: 30px; text-align: right; font-size: 12px; flex-shrink: 0;">${ndmbrws}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      parkChartDom.innerHTML = html;
    }
  };

  const renderTrendChart = (data: any[], type: 'quantity' | 'amount') => {
    const trendChartDom = document.getElementById('trendChart') as HTMLElement;
    if (trendChartDom) {
      const trendChart = echarts.getInstanceByDom(trendChartDom);
      if (trendChart) {
        trendChart.dispose();
      }
      const chart = echarts.init(trendChartDom);
      
      // 按日期排序数据
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.signedDate || a.qyqDate || a.date || '').getTime();
        const dateB = new Date(b.signedDate || b.qyqDate || b.date || '').getTime();
        return dateA - dateB;
      });
      
      const dates = sortedData.map((item: any) => {
        const date = item.signedDate || item.qyqDate || item.date || '';
        return date.substring(0, 7); // 显示 YYYY-MM 格式
      });
      
      let values: number[] = [];
      if (type === 'quantity') {
        values = sortedData.map((item: any) => item.qyqNum || item.projNums || 0);
      } else {
        values = sortedData.map((item: any) => item.qyqZtz || item.ztz || 0);
      }
      
      // 根据数据量动态计算 interval，确保标签不重叠
      let interval = 0;
      if (dates.length > 6) {
        interval = Math.ceil(dates.length / 6) - 1;
      }
      
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '10%', right: '5%', bottom: '15%', top: '5%', containLabel: true },
        xAxis: { 
          type: 'category', 
          data: dates,
          axisLabel: { 
            fontSize: 11, 
            interval: interval,
            rotate: 45,
          },
        },
        yAxis: { 
          type: 'value',
          splitLine: { lineStyle: { color: '#f0f0f0' } },
        },
        series: [
          {
            data: values,
            type: 'line',
            smooth: false,
            itemStyle: { color: '#1890ff' },
            areaStyle: { color: 'rgba(24, 144, 255, 0.2)' },
            lineStyle: { width: 2 },
          },
        ],
      });
    }
  };

  const renderIndustryChart = (data: any[]) => {
    const industryChartDom = document.getElementById('industryChart') as HTMLElement;
    if (industryChartDom) {
      const industryChart = echarts.getInstanceByDom(industryChartDom);
      if (industryChart) {
        industryChart.dispose();
      }
      const chart = echarts.init(industryChartDom);
      
      // 转换数据为饼图格式
      const pieData = data.map((item: any) => ({
        name: item.projName || item.cyzl || item.industry || '其他',
        value: item.projNums || 0,
      }));
      
      chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { 
          orient: 'vertical', 
          left: 'left',
          textStyle: { fontSize: 11 },
        },
        series: [
          {
            name: '项目数',
            type: 'pie',
            radius: ['40%', '70%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              fontSize: 11,
            },
          },
        ],
      });
    }
  };

  return (
    <PageContainer style={{ padding: '0' }}>
      <div style={{ background: '#f5f7f9', minHeight: '100vh' }}>
        {/* 统计时间选择 */}
        <div style={{ padding: '10px', background: '#fff', marginBottom: '10px' }}>
          <Space wrap>
            <span>统计时间：</span>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              placeholder={['开始月份', '结束月份']}
            />
            <Button type="primary" onClick={handleQuery} loading={loading}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        {/* 待办任务和快捷入口 - 固定高度 220px */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '10px', height: '220px' }}>
          {/* 待办任务 - 40% */}
          <div style={{ flex: '0 0 calc(40% - 5px)', background: '#fff', padding: '10px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>待办任务</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: 'calc(100% - 40px)', marginTop: '10px', gap: '10px' }}>
              {/* 留言数量 */}
              <div
                style={{
                  width: 'calc(33% - 7px)',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #feefee, #fbfbfc)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => handleNavigate('/message')}
              >
                <p style={{ margin: '0', fontSize: '12px', textIndent: '0px' }}>留言数量</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', textIndent: '0px' }}>{stats.messageCount}</p>
                <MessageOutlined style={{ position: 'absolute', fontSize: '50px', right: '10px', bottom: '10px', color: 'rgba(255, 107, 107, 0.3)' }} />
              </div>

              {/* 投资意向数 */}
              <div
                style={{
                  width: 'calc(33% - 7px)',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #c7ebff, #f8fdfe)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => handleNavigate('/intention')}
              >
                <p style={{ margin: '0', fontSize: '12px', textIndent: '0px' }}>投资意向数</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', textIndent: '0px' }}>{stats.investmentCount}</p>
                <ShoppingOutlined style={{ position: 'absolute', fontSize: '50px', right: '10px', bottom: '10px', color: 'rgba(24, 144, 255, 0.3)' }} />
              </div>

              {/* 项目待审核 */}
              <div
                style={{
                  width: 'calc(33% - 7px)',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #c7fff7, #f8fbfe)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => handleNavigate('/project-audit')}
              >
                <p style={{ margin: '0', fontSize: '12px', textIndent: '0px' }}>项目待审核</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', textIndent: '0px' }}>{stats.projectAuditCount}</p>
                <CheckCircleOutlined style={{ position: 'absolute', fontSize: '50px', right: '10px', bottom: '10px', color: 'rgba(19, 194, 194, 0.3)' }} />
              </div>
            </div>
          </div>

          {/* 快捷入口 - 60% */}
          <div style={{ flex: '0 0 calc(60% - 5px)', background: '#fff', padding: '10px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>快捷入口</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'space-around', justifyContent: 'space-between', width: '100%', height: 'calc(100% - 40px)', marginTop: '10px' }}>
              {/* 在谈项目填报 */}
              <div
                style={{
                  width: 'calc(33.33% - 7px)',
                  height: '100%',
                  background: '#ecfefc',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => handleNavigate('/xmgl9')}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FileTextOutlined style={{ fontSize: '22px', marginRight: '8px', color: '#1890ff' }} />
                  <span>在谈项目填报</span>
                </div>
                <span style={{ fontSize: '16px', color: '#999' }}>→</span>
              </div>

              {/* 签约项目填报 */}
              <div
                style={{
                  width: 'calc(33.33% - 7px)',
                  height: '100%',
                  background: '#fceceb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => handleNavigate('/xmgl10')}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SignatureOutlined style={{ fontSize: '22px', marginRight: '8px', color: '#ff7a45' }} />
                  <span>签约项目填报</span>
                </div>
                <span style={{ fontSize: '16px', color: '#999' }}>→</span>
              </div>

              {/* 共享项目认领 */}
              <div
                style={{
                  width: 'calc(33.33% - 7px)',
                  height: '100%',
                  background: '#e6f6fe',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  boxSizing: 'border-box',
                }}
                onClick={() => handleNavigate('/project-share')}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ShareAltOutlined style={{ fontSize: '22px', marginRight: '8px', color: '#52c41a' }} />
                  <span>共享项目认领</span>
                </div>
                <span style={{ fontSize: '16px', color: '#999' }}>→</span>
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 - 根据权限显示不同内容 */}
        
        {/* 权限级别 1 或 2: 显示签约项目数量统计、趋势分析、产业分布 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '10px', height: '250px' }}>
          {/* 签约项目数量统计 - 40% */}
          <div style={{ flex: '0 0 calc(40% - 5px)', background: '#fff', padding: '10px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>签约项目数量统计</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button 
                  size="small"
                  type={quantityRmbType === 0 ? 'primary' : 'default'}
                  onClick={() => handleQuantityRmbTypeChange(0)}
                >
                  1亿以上
                </Button>
                <Button 
                  size="small"
                  type={quantityRmbType === 1 ? 'primary' : 'default'}
                  onClick={() => handleQuantityRmbTypeChange(1)}
                >
                  5亿以上
                </Button>
              </div>
            </div>
            <div id="quantityChart" style={{ width: '100%', height: 'calc(100% - 40px)', background: '#fafafa', borderRadius: '4px' }}></div>
          </div>

          {/* 右侧两个图表 - 60% */}
          <div style={{ flex: '0 0 calc(60% - 5px)', display: 'flex', gap: '10px' }}>
            {/* 签约项目趋势分析 */}
            <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>签约项目趋势分析</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <Button 
                    size="small" 
                    type={trendType === 'quantity' ? 'primary' : 'default'}
                    onClick={() => handleTrendTypeChange('quantity')}
                  >
                    数量
                  </Button>
                  <Button 
                    size="small" 
                    type={trendType === 'amount' ? 'primary' : 'default'}
                    onClick={() => handleTrendTypeChange('amount')}
                  >
                    金额
                  </Button>
                </div>
              </div>
              <div id="trendChart" style={{ width: '100%', height: 'calc(100% - 40px)', background: '#fafafa', borderRadius: '4px' }}></div>
            </div>

            {/* 签约项目产业分布 */}
            <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>签约项目产业分布</span>
              </div>
              <div id="industryChart" style={{ width: '100%', height: 'calc(100% - 40px)', background: '#fafafa', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>

        {/* 签约项目金额统计和市区/园区完成情况 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '10px', height: '250px' }}>
          {/* 签约项目金额统计 - 40% */}
          <div style={{ flex: '0 0 calc(40% - 5px)', background: '#fff', padding: '10px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>签约项目金额统计</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button 
                  size="small"
                  type={amountRmbType === 0 ? 'primary' : 'default'}
                  onClick={() => handleAmountRmbTypeChange(0)}
                >
                  1亿以上
                </Button>
                <Button 
                  size="small"
                  type={amountRmbType === 1 ? 'primary' : 'default'}
                  onClick={() => handleAmountRmbTypeChange(1)}
                >
                  5亿以上
                </Button>
              </div>
            </div>
            <div id="amountChart" style={{ width: '100%', height: 'calc(100% - 40px)', background: '#fafafa', borderRadius: '4px' }}></div>
          </div>

          {/* 右侧两个进度表 - 60% */}
          <div style={{ flex: '0 0 calc(60% - 5px)', display: 'flex', gap: '10px' }}>
            {/* 各市区签约项目完成情况 */}
            <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>各市区签约项目完成情况</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <Button 
                    size="small"
                    type={districtRmbType === 0 ? 'primary' : 'default'}
                    onClick={() => handleDistrictRmbTypeChange(0)}
                  >
                    1亿以上
                  </Button>
                  <Button 
                    size="small"
                    type={districtRmbType === 1 ? 'primary' : 'default'}
                    onClick={() => handleDistrictRmbTypeChange(1)}
                  >
                    5亿以上
                  </Button>
                </div>
              </div>
              <div id="districtChart" style={{ width: '100%', height: 'calc(100% - 40px)', background: '#fafafa', borderRadius: '4px', overflowY: 'auto' }}></div>
            </div>

            {/* 各园区签约项目完成情况 */}
            <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '5px solid #1c7ce4' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>各园区签约项目完成情况</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <Button 
                    size="small"
                    type={parkRmbType === 0 ? 'primary' : 'default'}
                    onClick={() => handleParkRmbTypeChange(0)}
                  >
                    1亿以上
                  </Button>
                  <Button 
                    size="small"
                    type={parkRmbType === 1 ? 'primary' : 'default'}
                    onClick={() => handleParkRmbTypeChange(1)}
                  >
                    5亿以上
                  </Button>
                </div>
              </div>
              <div id="parkChart" style={{ width: '100%', height: 'calc(100% - 40px)', background: '#fafafa', borderRadius: '4px', overflowY: 'auto' }}></div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Control;
