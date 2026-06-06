import { PageContainer } from '@ant-design/pro-components';
import { Button, DatePicker, Select, Table, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

const { RangePicker } = DatePicker;

interface ChildItem {
  code: string | null;
  districtCode: string;
  progress: number;
  projNums: number;
  ztz: number;
}

interface ReportDataType {
  district: string;
  districtCode: string;
  projNums: number;
  ztz: number;
  children?: ChildItem[];
  // 转换后的字段
  qyje?: number;
  projNums0?: number;
  qyje0?: number;
  projNums1?: number;
  qyje1?: number;
  projNums2?: number;
  qyje2?: number;
  projNums3?: number;
  qyje3?: number;
}

const Report3 = () => {
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

  // 初始化默认日期范围
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
      const response = await request('/zsxt-api/statistics/statisticsProjectStatusInfoQx', {
        method: 'POST',
        data: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: rmb,
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
            qyje: item.ztz, // 总投资就是金额
          };
          
          // 根据progress映射children数据到对应字段
          if (item.children && Array.isArray(item.children)) {
            item.children.forEach((child: ChildItem) => {
              switch(child.progress) {
                case 1: // 注册
                  transformed.projNums0 = child.projNums;
                  transformed.qyje0 = child.ztz;
                  break;
                case 2: // 备案
                  transformed.projNums1 = child.projNums;
                  transformed.qyje1 = child.ztz;
                  break;
                case 4: // 开工
                  transformed.projNums2 = child.projNums;
                  transformed.qyje2 = child.ztz;
                  break;
                case 5: // 竣工
                  transformed.projNums3 = child.projNums;
                  transformed.qyje3 = child.ztz;
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

  const handleExport = async () => {
    if (!dateRange) {
      message.warning('请选择日期范围');
      return;
    }

    try {
      const response = await request('/zsxt-api/statistics/exportStatisticsProjectStatusInfoQx', {
        method: 'POST',
        data: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].endOf('month').format('YYYY-MM-DD'),
          rmb: rmb,
        },
        responseType: 'blob',
      });

      // 创建下载链接
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 生成文件名
      const fileName = `新签约项目进度情况表_${dateRange[0].format('YYYYMM')}-${dateRange[1].format('YYYYMM')}.xlsx`;
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
    {
      title: '市(区)',
      dataIndex: 'district',
      key: 'district',
      width: 200,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '新签约项目',
      children: [
        {
          title: '个数',
          dataIndex: 'projNums',
          key: 'projNums',
          width: 100,
          align: 'center',
        },
        {
          title: '金额(亿元)',
          dataIndex: 'qyje',
          key: 'qyje',
          width: 120,
          align: 'center',
        },
      ],
    },
    {
      title: '其中',
      children: [
        {
          title: '注册',
          children: [
            {
              title: '个数',
              dataIndex: 'projNums0',
              key: 'projNums0',
              width: 100,
              align: 'center',
            },
            {
              title: '金额(亿元)',
              dataIndex: 'qyje0',
              key: 'qyje0',
              width: 120,
              align: 'center',
            },
          ],
        },
        {
          title: '备案',
          children: [
            {
              title: '个数',
              dataIndex: 'projNums1',
              key: 'projNums1',
              width: 100,
              align: 'center',
            },
            {
              title: '金额(亿元)',
              dataIndex: 'qyje1',
              key: 'qyje1',
              width: 120,
              align: 'center',
            },
          ],
        },
        {
          title: '开工',
          children: [
            {
              title: '个数',
              dataIndex: 'projNums2',
              key: 'projNums2',
              width: 100,
              align: 'center',
            },
            {
              title: '金额(亿元)',
              dataIndex: 'qyje2',
              key: 'qyje2',
              width: 120,
              align: 'center',
            },
          ],
        },
        {
          title: '竣工',
          children: [
            {
              title: '个数',
              dataIndex: 'projNums3',
              key: 'projNums3',
              width: 100,
              align: 'center',
            },
            {
              title: '金额(亿元)',
              dataIndex: 'qyje3',
              key: 'qyje3',
              width: 120,
              align: 'center',
            },
          ],
        },
      ],
    },
  ];

  return (
    <PageContainer
      style={{
        width: '100%',
        height: '90vh',
        overflow: 'auto',
      }}
    >
      <div style={{ background: '#fff', padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Space>
            <RangePicker
              picker="month"
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
              format="YYYY-MM"
            />
            <Select
              value={rmb}
              onChange={(value) => setRmb(value)}
              style={{ width: 200 }}
              options={rmbOptions}
            />
            <Button type="primary" onClick={handleSearch} loading={loading}>
              查询
            </Button>
            <Button onClick={handleExport}>导出</Button>
          </Space>
        </div>

        <p style={{ textAlign: 'center', lineHeight: '50px', fontSize: '24px', fontWeight: 'bold' }}>
          {dateRange && dateRange[0] && dateRange[1] && (
            <span>{dateRange[0].format('YYYY-MM')}至{dateRange[1].format('YYYY-MM')}</span>
          )}
          全市新签约项目进度情况表
        </p>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey="district"
          bordered
          scroll={{ x: 1400 }}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} align="center">合计</Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  {tableData.reduce((sum, item) => sum + item.projNums, 0)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="center">
                  {tableData.reduce((sum, item) => sum + (item.qyje || 0), 0).toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="center">
                  {tableData.reduce((sum, item) => sum + (item.projNums0 || 0), 0)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="center">
                  {tableData.reduce((sum, item) => sum + (item.qyje0 || 0), 0).toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="center">
                  {tableData.reduce((sum, item) => sum + (item.projNums1 || 0), 0)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="center">
                  {tableData.reduce((sum, item) => sum + (item.qyje1 || 0), 0).toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="center">
                  {tableData.reduce((sum, item) => sum + (item.projNums2 || 0), 0)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="center">
                  {tableData.reduce((sum, item) => sum + (item.qyje2 || 0), 0).toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} align="center">
                  {tableData.reduce((sum, item) => sum + (item.projNums3 || 0), 0)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10} align="center">
                  {tableData.reduce((sum, item) => sum + (item.qyje3 || 0), 0).toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </PageContainer>
  );
};

export default Report3;
