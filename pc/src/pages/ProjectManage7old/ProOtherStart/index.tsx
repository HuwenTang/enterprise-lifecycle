import {primeApi, systemApi} from '@/services/api';
import {CascadeVoString, ProjectNonInvestmentConfirmationVo} from '@/services/apis';
import { useNavigate } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import { Descriptions, List, UploadFile } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './DescriptionsStyle.css';
import useStyles from './style.style';

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/pro-otherstart', breadcrumbName: '非招商项目开工认定' },
  ];

  const [areaData, setAreaData] = useState<CascadeVoString[]>([])
  const getAdministrativeDivisionTree = async () => {
    const res = await systemApi.getAdministrativeDivisionTree();
    setAreaData(res)
  };
  // 根据 value 查找 label 的递归函数
  const findLabelByValue = (value: string, tree: CascadeVoString[]): string | undefined => {
    for (const node of tree) {
      if (node.value === value) {
        return node.label;
      }
      if (node.children && node.children.length > 0) {
        const found = findLabelByValue(value, node.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const [searchParams] = useSearchParams();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);

  const id = searchParams.get('id');
  const [data, setData] = useState<ProjectNonInvestmentConfirmationVo>();
  const getProjectNonInvestmentConfirmation = async () => {
    try {
      const data = await primeApi.getProjectNonInvestmentConfirmation({ id: id! });
      console.log(data);

      // 转换 kgzzcl 为 UploadFile[]
      if (data?.kgzzcl) {
        const converted = data.kgzzcl.map((item, index) => ({
          uid: `kg-${index}`,
          name: item.name,
          url: item.path, // 注意：path 是完整 URL，可以直接用
          status: 'done' as const,
        }));
        setFileList(converted);
      } else {
        setFileList([]);
      }

      // 转换 statisticalProjectPic 为 UploadFile[]
      if (data?.statisticalProjectPic) {
        const converted = data.statisticalProjectPic.map((item, index) => ({
          uid: `pic-${index}`,
          name: item.name,
          url: item.path,
          status: 'done' as const,
        }));
        setFileList2(converted);
      } else {
        setFileList2([]);
      }

      setData(data);
    } catch (e) {
      console.debug(e);
    }
  };

  useEffect(() => {
    getProjectNonInvestmentConfirmation();
    getAdministrativeDivisionTree()
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ backgroundColor: '#fff', width: '70%' }}>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '16px',
              padding: '45px 0 20px 0',
              fontWeight: 'bolder',
            }}
          >
            {`非招商项目开工认定表`}
          </div>
          <div style={{ padding: '0 50px 20px 50px' }}>
            <div>
              <div>
                <Descriptions bordered size="middle" column={2} className="custom-descriptions">
                  {/* 普通字段：占1列 */}
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称" span={1}>
                    {data?.name || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方名称" span={1}>
                    {data?.investor || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="市（区）" span={1}>
                    {data?.district ? findLabelByValue(data.district, areaData) || data.district : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="园区（镇街）" span={1}>
                    {data?.park ? findLabelByValue(data.park, areaData) || data.park : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目地址" span={1}>
                    {data?.projectAddress || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型" span={1}>
                    {data?.bindustry === '1'
                      ? '服务业'
                      : data?.bindustry === '2'
                      ? '工业'
                      : data?.bindustry
                      ? data?.bindustry
                      : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准部门及文号" span={1}>
                    {data?.pzwh || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准日期" span={1}>
                    {data?.pzrq ? dayjs(data.pzrq).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目代码" span={1}>
                    {data?.code || ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="统一社会信用代码"
                    span={1}
                  >
                    {data?.uscc || ''}
                  </Descriptions.Item>
                  {/* 单独占一行的字段：使用 span={2} 在2列布局下占满，xs下自动占满 */}
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="主要产品、产能及主要建设内容"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {data?.desc || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="行业代码" span={1}>
                    {data?.industryCode || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="行业分类" span={1}>
                    {data?.industryName || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label={`计划总投资（${data?.ptype===1?'亿元':'万美元'}）`} span={1}>
                    {data?.investMoney || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="固定资产投资（万元）"
                    span={1}
                  >
                    {data?.fixedInvest || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="产业方向" span={1}>
                    {data?.projTypeLabel || ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否已入库纳统"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {data?.databaseInclusionStatus ? '是' : '否'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="统计库项目编码" span={1}>
                    {/*{data?.databaseInclusionStatus*/}
                    {/*  ? data?.statisticalProjectCode*/}
                    {/*    ? data?.statisticalProjectCode*/}
                    {/*    : '-'*/}
                    {/*  : '-'}*/}
                    {data?.statisticalProjectCode===''?'-':data?.statisticalProjectCode}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="统计库项目名称" span={1}>
                    {/*{data?.databaseInclusionStatus*/}
                    {/*  ? data?.statisticalProjectName*/}
                    {/*    ? data?.statisticalProjectName*/}
                    {/*    : '-'*/}
                    {/*  : -''}*/}
                    {data?.statisticalProjectName===''?'-':data?.statisticalProjectName}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="项目相关佐证资料"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {fileList && fileList.length > 0 ? (
                      <List
                        size="small"
                        dataSource={fileList}
                        renderItem={(file: UploadFile) => (
                          <List.Item>
                            <a href={file.url} target="_blank" download={file.name}>
                              {file.name}
                            </a>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <span>无材料</span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="项目进展图片"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {fileList2 && fileList2.length > 0 ? (
                      <List
                        size="small"
                        dataSource={fileList2}
                        renderItem={(file: UploadFile) => (
                          <List.Item>
                            <a href={file.url} target="_blank" download={file.name}>
                              {file.name}
                            </a>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <span>无材料</span>
                    )}
                  </Descriptions.Item>
                  {/* 项目所在地园区（镇街）承诺 */}
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="项目所在地园区（镇街）承诺"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    该项目于
                    {data?.pzrq ? dayjs(data?.pzrq).format('YYYY年MM月DD') : '20XX年XX月XX日'}
                    完成备案手续正式开工，以上信息确切无误，附件资料真实、有效。
                    <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                      园区（镇街）：{data?.park ? findLabelByValue(data.park, areaData) || data.park : '-'}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ paddingBottom: '20px', color: '#aaa', fontSize: '12px' }}>
                  <div style={{ marginLeft: '50px', marginBottom: '10px', fontSize: '12px' }}>
                    备注：该表由企业全生命周期管理服务平台自动生成
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
export default QaState;
