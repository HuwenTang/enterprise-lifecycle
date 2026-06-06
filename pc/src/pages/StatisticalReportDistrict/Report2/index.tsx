import { PageContainer } from '@ant-design/pro-components';
import { Button, DatePicker, Select, Table, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface ChildItem {
  code: string;
  name: string;
  t1: number;
  t2: string;
  tze: number;
}

interface ReportDataType {
  district: string;
  districtCode: string;
  projNums: number;
  ztz: number;
  children?: ChildItem[];
  // 转换后的字段
  t0Num?: number; t0Per?: string; t0Tze?: number;
  t1Num?: number; t1Per?: string; t1Tze?: number;
  t2Num?: number; t2Per?: string; t2Tze?: number;
  t3Num?: number; t3Per?: string; t3Tze?: number;
  t4Num?: number; t4Per?: string; t4Tze?: number;
  t5Num?: number; t5Per?: string; t5Tze?: number;
  t6Num?: number; t6Per?: string; t6Tze?: number;
  t7Num?: number; t7Per?: string; t7Tze?: number;
  t8Num?: number; t8Per?: string; t8Tze?: number;
}

const Report2 = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [moneyType, setMoneyType] = useState<string>('0');
  const [tableData, setTableData] = useState<ReportDataType[]>([]);
  const [loading, setLoading] = useState(false);

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
      const response = await request('/zsxt-api/statistics/onePlusFourForQxYq', {
        method: 'POST',
        data: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: moneyType,
        },
      });

      // 转换数据结构
      const transformData = (data: any[]): ReportDataType[] => {
        return data.map(item => {
          const transformed: any = {
            district: item.district,
            districtCode: item.districtCode,
            projNums: item.projNums,
            ztz: item.ztz,
          };
          
          // 根据code映射children数据到对应字段
          if (item.children && Array.isArray(item.children)) {
            item.children.forEach((child: ChildItem) => {
              switch(child.code) {
                case '1.1.1': // 生物医药
                  transformed.t0Num = child.t1;
                  transformed.t0Per = child.t2;
                  transformed.t0Tze = child.tze;
                  break;
                case '1.1.2': // 健康食品
                  transformed.t1Num = child.t1;
                  transformed.t1Per = child.t2;
                  transformed.t1Tze = child.tze;
                  break;
                case '1.2.1': // 海工装备和高技术船舶
                  transformed.t2Num = child.t1;
                  transformed.t2Per = child.t2;
                  transformed.t2Tze = child.tze;
                  break;
                case '1.3.1': // 汽车及零部件
                  transformed.t3Num = child.t1;
                  transformed.t3Per = child.t2;
                  transformed.t3Tze = child.tze;
                  break;
                case '1.3.2': // 新一代信息技术和智能装备
                  transformed.t4Num = child.t1;
                  transformed.t4Per = child.t2;
                  transformed.t4Tze = child.tze;
                  break;
                case '1.3.3': // 化工及新材料
                  transformed.t5Num = child.t1;
                  transformed.t5Per = child.t2;
                  transformed.t5Tze = child.tze;
                  break;
                case '1.3.4': // 金属新材料及制品
                  transformed.t6Num = child.t1;
                  transformed.t6Per = child.t2;
                  transformed.t6Tze = child.tze;
                  break;
                case '1.3.5': // 新能源
                  transformed.t7Num = child.t1;
                  transformed.t7Per = child.t2;
                  transformed.t7Tze = child.tze;
                  break;
                case '1.4.1': // 未来产业
                  transformed.t8Num = child.t1;
                  transformed.t8Per = child.t2;
                  transformed.t8Tze = child.tze;
                  break;
              }
            });
          }
          
          return transformed;
        });
      };

      if (response && Array.isArray(response)) {
        setTableData(transformData(response));
      } else if (response?.data && Array.isArray(response.data)) {
        setTableData(transformData(response.data));
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

  const handleReset = () => {
    setDateRange(null);
    setMoneyType('0');
    setTableData([]);
  };

  const handleExport = async () => {
    if (!dateRange) {
      message.warning('请选择日期范围');
      return;
    }

    try {
      const response = await request('/zsxt-api/statistics/exportOnePlusFourForQxYq', {
        method: 'POST',
        data: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: moneyType,
        },
        responseType: 'blob',
      });

      // 创建下载链接
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 生成文件名
      const fileName = `新签约项目分产业汇总表_${dateRange[0].format('YYYYMM')}-${dateRange[1].format('YYYYMM')}.xlsx`;
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
    { title: '市(区)', dataIndex: 'district', key: 'district', width: 120, align: 'center', fixed: 'left' },
    { title: '项目总数', dataIndex: 'projNums', key: 'projNums', width: 100, align: 'center' },
    { title: '总投资(亿元)', dataIndex: 'ztz', key: 'ztz', width: 120, align: 'center' },
    {
      title: '其中"大海新晨"产业',
      children: [
        {
          title: '大健康产业项目',
          children: [
            {
              title: '生物医药',
              children: [
                { title: '个数', dataIndex: 't0Num', key: 't0Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't0Per', key: 't0Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't0Tze', key: 't0Tze', width: 90, align: 'center' },
              ],
            },
            {
              title: '健康食品',
              children: [
                { title: '个数', dataIndex: 't1Num', key: 't1Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't1Per', key: 't1Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't1Tze', key: 't1Tze', width: 90, align: 'center' },
              ],
            },
          ],
        },
        {
          title: '海工装备和高技术船舶产业项目',
          children: [
            {
              title: '海工装备和高技术船舶',
              children: [
                { title: '个数', dataIndex: 't2Num', key: 't2Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't2Per', key: 't2Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't2Tze', key: 't2Tze', width: 90, align: 'center' },
              ],
            },
          ],
        },
        {
          title: '新兴产业(新智造、新材料、新能源)',
          children: [
            {
              title: '汽车及零部件',
              children: [
                { title: '个数', dataIndex: 't3Num', key: 't3Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't3Per', key: 't3Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't3Tze', key: 't3Tze', width: 90, align: 'center' },
              ],
            },
            {
              title: '新一代信息技术和智能装备',
              children: [
                { title: '个数', dataIndex: 't4Num', key: 't4Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't4Per', key: 't4Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't4Tze', key: 't4Tze', width: 90, align: 'center' },
              ],
            },
            {
              title: '化工及新材料',
              children: [
                { title: '个数', dataIndex: 't5Num', key: 't5Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't5Per', key: 't5Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't5Tze', key: 't5Tze', width: 90, align: 'center' },
              ],
            },
            {
              title: '金属新材料及制品',
              children: [
                { title: '个数', dataIndex: 't6Num', key: 't6Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't6Per', key: 't6Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't6Tze', key: 't6Tze', width: 90, align: 'center' },
              ],
            },
            {
              title: '新能源',
              children: [
                { title: '个数', dataIndex: 't7Num', key: 't7Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't7Per', key: 't7Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't7Tze', key: 't7Tze', width: 90, align: 'center' },
              ],
            },
          ],
        },
        {
          title: '晨光力量(未来产业)',
          children: [
            {
              title: '未来产业',
              children: [
                { title: '个数', dataIndex: 't8Num', key: 't8Num', width: 70, align: 'center' },
                { title: '占比', dataIndex: 't8Per', key: 't8Per', width: 70, align: 'center' },
                { title: '投资额', dataIndex: 't8Tze', key: 't8Tze', width: 90, align: 'center' },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <PageContainer style={{ width: '100%', height: '90vh', overflow: 'auto' }}>
      <div style={{ background: '#fff', padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Space>
            <RangePicker picker="month" value={dateRange} onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])} format="YYYY-MM" />
            <Select value={moneyType} onChange={setMoneyType} style={{ width: 220 }} placeholder="请下拉选择投资额">
              <Select.Option value="0">全部</Select.Option>
              <Select.Option value="4">500万-1亿元（不含）</Select.Option>
              <Select.Option value="1">1亿元(1000万美元)以上</Select.Option>
              <Select.Option value="5">5亿元(3000万美元)以上</Select.Option>
              <Select.Option value="10">10亿元(1亿美元)以上</Select.Option>
            </Select>
            <Button type="primary" onClick={handleSearch} loading={loading}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
            <Button onClick={handleExport}>导出</Button>
          </Space>
        </div>
        <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>新签约项目分产业汇总表</p>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey="district"
          bordered
          scroll={{ x: 2500 }}
          pagination={false}
          summary={() => {
            const sums: any = {};
            const fields = ['projNums', 'ztz', 't0Num', 't0Tze', 't1Num', 't1Tze', 't2Num', 't2Tze', 't3Num', 't3Tze', 't4Num', 't4Tze', 't5Num', 't5Tze', 't6Num', 't6Tze', 't7Num', 't7Tze', 't8Num', 't8Tze'];
            fields.forEach(field => {
              sums[field] = tableData.reduce((sum, item) => sum + ((item as any)[field] || 0), 0);
              if (field.includes('Tze') || field === 'ztz') sums[field] = sums[field].toFixed(2);
            });
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} align="center">合计</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center">{sums.projNums}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">{sums.ztz}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">{sums.t0Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="center">{sums.t0Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={6} align="center">{sums.t1Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={7} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={8} align="center">{sums.t1Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={9} align="center">{sums.t2Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={10} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={11} align="center">{sums.t2Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={12} align="center">{sums.t3Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={13} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={14} align="center">{sums.t3Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={15} align="center">{sums.t4Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={16} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={17} align="center">{sums.t4Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={18} align="center">{sums.t5Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={19} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={20} align="center">{sums.t5Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={21} align="center">{sums.t6Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={22} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={23} align="center">{sums.t6Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={24} align="center">{sums.t7Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={25} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={26} align="center">{sums.t7Tze}</Table.Summary.Cell>
                  <Table.Summary.Cell index={27} align="center">{sums.t8Num}</Table.Summary.Cell>
                  <Table.Summary.Cell index={28} align="center">-</Table.Summary.Cell>
                  <Table.Summary.Cell index={29} align="center">{sums.t8Tze}</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Report2;
