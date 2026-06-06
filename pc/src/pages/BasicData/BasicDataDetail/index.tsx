import { primeApi } from '@/services/api';
import { ListGdpStatisticalDataRequest } from '@/services/apis';
import { useNavigate } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import { Card, message, Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './DescriptionsStyle.css';
import styles2 from './pm.module.css';
import useStyles from './style.style';

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const breadcrumbList = [
    { path: '', breadcrumbName: 'GDP' },
    { path: '/gdp/basic-data-detail', breadcrumbName: '分市区基础数据' },
  ];

  interface ProjectData {
    key: string;
    stage: string;
  }

  const TitleCom: React.FC<{ text: string }> = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ marginRight: 8 }}>{text}</span>
    </div>
  );

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  const id = searchParams.get('id') || '';
  const name = searchParams.get('name') || '';

  const columns = [
    {
      title: <TitleCom text={'统计项目'} />,
      dataIndex: 'industry',
      key: 'industry',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      title: <TitleCom text={'泰州市'} />,
      dataIndex: 'tzs',
      key: 'tzs',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => (
        <span style={{ textAlign: 'center' }} title={text}>
          {text || '-'}
        </span>
      ),
    },
    {
      title: <TitleCom text={'海陵区'} />,
      dataIndex: 'hlq',
      key: 'hlq',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => (
        <span style={{ textAlign: 'center' }} title={text}>
          {text || '-'}
        </span>
      ),
    },
    {
      title: <TitleCom text={'医药高新区（高港区）'} />,
      dataIndex: 'yygxq',
      key: 'yygxq',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => (
        <span style={{ textAlign: 'center' }} title={text}>
          {text || '-'}
        </span>
      ),
    },
    {
      title: <TitleCom text={'姜堰区'} />,
      dataIndex: 'jyq',
      key: 'jyq',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => (
        <span style={{ textAlign: 'center' }} title={text}>
          {text || '-'}
        </span>
      ),
    },
    {
      title: <TitleCom text={'兴化市'} />,
      dataIndex: 'xhs',
      key: 'xhs',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => (
        <span style={{ textAlign: 'center' }} title={text}>
          {text || '-'}
        </span>
      ),
    },
    {
      title: <TitleCom text={'靖江市'} />,
      dataIndex: 'jjs',
      key: 'jjs',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => (
        <span style={{ textAlign: 'center' }} title={text}>
          {text || '-'}
        </span>
      ),
    },
    {
      title: <TitleCom text={'泰兴市'} />,
      dataIndex: 'txs',
      key: 'txs',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => (
        <span style={{ textAlign: 'center' }} title={text}>
          {text || '-'}
        </span>
      ),
    },
  ];

  // 加载所有数据
  const fetchData = async (params: ListGdpStatisticalDataRequest) => {
    setLoading(true);
    try {
      const data = await primeApi.listGdpStatisticalData(params);
      let list = data.records || [];
      let arr = [];
      let areaArr = [
        { text: '泰州市', code: 'tzs' },
        { text: '海陵区', code: 'hlq' },
        { text: '医药高新区（高港区）', code: 'yygxq' },
        { text: '姜堰区', code: 'jyq' },
        { text: '兴化市', code: 'xhs' },
        { text: '靖江市', code: 'jjs' },
        { text: '泰兴市', code: 'txs' },
      ];
      for (let idx = 0; idx < list.length; idx++) {
        let industry = list[idx].industry;
        let index = -1;
        index = arr.length > 0 ? arr.findIndex((item) => item.industry === industry) : -1;
        let code = areaArr.filter((item2) => item2.text === list[idx].area)[0].code;
        let obj: any = {};
        if (index > -1) {
          obj = arr[index];
          obj[code] = list[idx].industrialGrowthStatistics;
          arr[index] = obj;
        } else {
          obj = {
            key: arr.length + 1,
            industry: list[idx].industry,
          };
          obj[code] = list[idx].industrialGrowthStatistics;
          arr.push(obj);
        }
      }
      const tableData: ProjectData[] = arr;
      setDataSource(tableData);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({
      recordId: id,
      page: 1,
      size: 10000,
    });
  }, []);
  return (
    <PageContainer
      style={{
        minWidth: '1200px',
        height: '90vh',
        overflow: 'scroll',
        scrollbarWidth: 'none',
        backgroundImage: 'url(/mg/bg.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        padding: '0 120px 0',
      }}
      breadcrumb={{
        routes: breadcrumbList,
        itemRender: (route, params, routes) => {
          // Handle breadcrumb click
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
            <span>{route.title}</span>
          ) : (
            <a
              onClick={() => {
                navigate(-1);
              }}
            >
              {route.title}
            </a>
          );
        },
      }}
      title={false}
      className={styles.pageHeader}
    >
      <Card>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <h2>{name || ''}</h2>
        </div>
        <Table
          columns={columns}
          rowKey={(record) => record.key}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          bordered
          size="middle"
          className={styles2.benchtable}
        />
      </Card>
    </PageContainer>
  );
};
export default QaState;
