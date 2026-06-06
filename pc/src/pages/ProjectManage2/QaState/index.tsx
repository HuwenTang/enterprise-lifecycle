import { PageContainer } from '@ant-design/pro-components';
import { FC } from 'react';
import React from 'react';
import useStyles from './style.style';
import { useNavigate } from '@@/exports';
import {Checkbox, GetProp, Steps, Tag} from 'antd';

const QaTitle = (e: { name: string }) => {
  const name = e.name;
  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        fontSize: '14px',
        padding: '20px 0',
        fontWeight: 'bolder',
        backgroundColor: '#eeeeee',
      }}
    >
      {name}
    </div>
  );
};
const Rowmsg = (e: {
  name: string;
  label: string;
  isBlack: boolean;
  labelWidth?: string;
  color?: string;
}) => {
  const name = e.name;
  const label = e.label;
  const isBlack = e.isBlack;
  const labelWidth = e.labelWidth;
  const color = e.color;
  return (
    <div
      style={{
        width: '100%',
        textAlign: 'left',
        fontSize: '13px',
        height: '50px',
        lineHeight: '50px',
        display: 'flex',
        backgroundColor: isBlack ? '#fafafa' : '#fff',
        alignItems: 'center',
        color: '#333',
        border: '0.5px solid #eeeeee',
      }}
    >
      <div
        style={{
          width: labelWidth ? labelWidth : '50%',
          paddingLeft: '5px',
          backgroundColor: '#f5f8ff',
          border: '1px solid #eeeeee',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',

        }}
      >
        {label}
      </div>
      <div style={{ color: color ? color : '#333', width: '50%', paddingLeft: '10px' }}>{name}</div>
    </div>
  );
};
const Rowmsg2 = (e: {
  title: string;
  name: string;
  label: string;
  name1: string;
  label1: string;
  labelWidth?: string;
  color?: string;
}) => {
  const name = e.name;
  const title = e.title;
  const label = e.label;
  const name1 = e.name1;
  const label1 = e.label1;
  const labelWidth = e.labelWidth;
  const color = e.color;
  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <div
        style={{
          width: '25%',
          height: '100px',
          lineHeight: '100px',
          backgroundColor: '#f5f8ff',
          borderLeft: '0.5px solid #eeeeee',
          paddingLeft: '10px',
        }}
      >
        {title}
      </div>
      <div style={{ width: '75%' }}>
        <div
          style={{
            width: '100%',
            textAlign: 'left',
            fontSize: '14px',
            height: '50px',
            lineHeight: '50px',
            display: 'flex',
            backgroundColor: '#fff',
            alignItems: 'center',
            color: '#333',
            border: '0.5px solid #eeeeee',
          }}
        >
          <div
            style={{
              width: labelWidth ? labelWidth : '20%',
              paddingLeft: '10px',
              backgroundColor: '#fff',
            }}
          >
            {label}
          </div>
          <div
            style={{
              color: color ? color : '#333',
              width: '60%',
              paddingLeft: '10px',
              borderLeft: '1px solid #eeeeee',
            }}
          >
            {name}
          </div>
        </div>
        <div
          style={{
            width: '100%',
            textAlign: 'left',
            fontSize: '14px',
            height: '50px',
            lineHeight: '50px',
            display: 'flex',
            backgroundColor: '#fff',
            alignItems: 'center',
            color: '#333',
            border: '0.5px solid #eeeeee',
          }}
        >
          <div
            style={{
              width: labelWidth ? labelWidth : '20%',
              paddingLeft: '10px',
              backgroundColor: '#fff',
            }}
          >
            {label1}
          </div>
          <div
            style={{
              color: color ? color : '#333',
              width: '60%',
              paddingLeft: '10px',
              borderLeft: '1px solid #eeeeee',
            }}
          >
            {name1}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Steps description 内反馈区：Tag 与说明文字各占 50% */
const StepFeedbackRow = (props: { tag: React.ReactNode; detail: string }) => (
  <div style={{ padding: '5px', backgroundColor: '#f0f6ff' }}>
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      <div style={{ flex: '1 1 50%', minWidth: 0 }}>{props.tag}</div>
      <div style={{ flex: '1 1 50%', minWidth: 0 }}>{props.detail}</div>
    </div>
  </div>
);

const QaTable = () => {
  const list = [
    {
      title: '第一年',
      data1: '1212',
      data2: '1212',
      data3: '1212',
      data4: '1090',
      data5: '1131',
      data6: '235',
      data7: '1231',
    },
    {
      title: '第二年',
      data1: '1212',
      data2: '1212',
      data3: '1212',
      data4: '1090',
      data5: '1131',
      data6: '235',
      data7: '1231',
    },
    {
      title: '第三年',
      data1: '1212',
      data2: '1212',
      data3: '1212',
      data4: '1090',
      data5: '1131',
      data6: '235',
      data7: '1231',
    },
  ];
  return (
    <div>
      <div
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: '12px',
          height: '50px',
          lineHeight: '50px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          backgroundColor: '#f5f8ff',
          alignItems: 'center',
          color: '#333',
          border: '0.5px solid #eeeeee',
        }}
      >
        <div style={{ border: '0.5px solid #eeeeee', height: '50px' }}></div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', paddingLeft: '10px' }}>
          预期开票销售(万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', paddingLeft: '10px' }}>
          实际开票销售(万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', paddingLeft: '10px' }}>
          预期税收(万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', paddingLeft: '10px' }}>
          实际税收(万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', paddingLeft: '10px' }}>
          预期亩均税收(万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', paddingLeft: '10px' }}>
          实际亩均税收(万元)
        </div>
      </div>
      {list.map((item, index) => {
        return (
          <div
            key={index}
            style={{
              width: '100%',
              textAlign: 'left',
              fontSize: '12px',
              height: '50px',
              lineHeight: '50px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              backgroundColor: '#f5f8ff',
              alignItems: 'center',
              color: '#333',
              border: '0.5px solid #eeeeee',
            }}
          >
            <div style={{ paddingLeft: '10px', border: '0.5px solid #eeeeee', height: '50px' }}>
              {item.title}
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #eeeeee',
                height: '50px',
                paddingLeft: '10px',
              }}
            >
              {item.data1}
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #eeeeee',
                height: '50px',
                paddingLeft: '10px',
              }}
            >
              {item.data2}
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #eeeeee',
                height: '50px',
                paddingLeft: '10px',
              }}
            >
              {item.data3}
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #eeeeee',
                height: '50px',
                paddingLeft: '10px',
              }}
            >
              {item.data4}
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #eeeeee',
                height: '50px',
                paddingLeft: '10px',
              }}
            >
              {item.data5}
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #eeeeee',
                height: '50px',
                paddingLeft: '10px',
              }}
            >
              {item.data6}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/qa-state', breadcrumbName: '项目质态' },
  ];
  const plainOptions = ['优秀', '良好', '一般'];
  const plainOptions1 = ['正常', '异常'];
  const plainOptions2 = ['强相关', '一般', '不相关'];
  const plainOptions3 = ['高', '中', '低'];
  const plainOptions4 = ['核心管理人才', '核心技术人才', '财务、市场、运营等岗位人才'];
  const plainOptions5 = ['单一依赖接待或短期融资', '自有资金占比高，且融资渠道多元'];
  const plainOptions6 = ['先进', '良好','一般'];

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ backgroundColor: '#fff', width: '50%' }}>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '16px',
              padding: '45px 0',
              fontWeight: 'bolder',
            }}
          >
            {`新增制造业项目质态评估表`}
          </div>
          <div style={{ padding: '0 50px 20px 50px' }}>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <Rowmsg name={'项目在泰实施主体'} label={'投资方名称'} isBlack={true}></Rowmsg>
                <Rowmsg name={'是'} label={'是否属于上市企业'} isBlack={true}></Rowmsg>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <Rowmsg name={'——'} label={'项目名称'} isBlack={false}></Rowmsg>
                <Rowmsg name={'市级重点项目'} label={'重点项目'} isBlack={false}></Rowmsg>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <Rowmsg name={'周丽莉'} label={'投资方联系人'} isBlack={true}></Rowmsg>
                <Rowmsg name={'6273688082'} label={'联系电话'} isBlack={true}></Rowmsg>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'药物'}
                  label={'主要产品产能及建设内容'}
                  isBlack={false}
                ></Rowmsg>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'20232128201858586'}
                  label={'行业分类及代码'}
                  isBlack={true}
                ></Rowmsg>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'医药'}
                  label={'产业方向'}
                  isBlack={false}
                ></Rowmsg>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'浙江省xx市xx区xx街109号2栋'}
                  label={'项目选址位置'}
                  isBlack={true}
                ></Rowmsg>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'123'}
                  label={'申请用地面积(亩)'}
                  isBlack={true}
                ></Rowmsg>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg name={'2025年8月'} label={'预计开工时间'} isBlack={false}></Rowmsg>
                <Rowmsg name={'2025年12月'} label={'预计竣工时间'} isBlack={false}></Rowmsg>
              </div>
              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'33'}
                  label={'注册资本(万元/万美元)'}
                  isBlack={true}
                ></Rowmsg>
              </div>
              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'12'}
                  label={'计划总投资（万元/万美元）'}
                  isBlack={false}
                ></Rowmsg>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'1090'}
                  label={'计划投资强度(万元/亩，万美元/亩)'}
                  isBlack={true}
                ></Rowmsg>
              </div>
              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'1090'}
                  label={'本期投资额(万元/万美元)'}
                  isBlack={false}
                ></Rowmsg>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                <div>
                  <Rowmsg
                    labelWidth={'25%'}
                    name={'111'}
                    label={'固定资产投资(万元/万美元)'}
                    isBlack={true}
                  ></Rowmsg>
                  <Rowmsg
                    labelWidth={'25%'}
                    name={'333'}
                    label={'设备投资(万元/万美元)'}
                    isBlack={false}
                  ></Rowmsg>
                </div>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg name={'22'} label={'专利数'} isBlack={true}></Rowmsg>
                <Rowmsg
                  name={'是  '}
                  label={'是否获得省级以上科技或人才项目支持'}
                  isBlack={true}
                ></Rowmsg>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg name={'是'} label={'风险投资额度'} isBlack={true}></Rowmsg>
                <Rowmsg name={'hx'} label={'风险投资方名称'} isBlack={true}></Rowmsg>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '150px',
                      lineHeight: '150px',
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                        paddingLeft: '10px',
                        border: '0.5px solid #eee',
                        backgroundColor: '#f6f8fe',
                      }}
                    >
                      预期产值(万元)
                    </div>
                    <div style={{ width: '50%', border: '0.5px solid #eee' }}>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第一年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第二年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第三年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '150px',
                      lineHeight: '150px',
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                        paddingLeft: '10px',
                        border: '0.5px solid #eee',
                        backgroundColor: '#f6f8fe',
                      }}
                    >
                      预期开票销售(万元)
                    </div>
                    <div style={{ width: '50%', border: '0.5px solid #eee' }}>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第一年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第二年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第三年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '150px',
                      lineHeight: '150px',
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                        paddingLeft: '10px',
                        border: '0.5px solid #eee',
                        backgroundColor: '#f6f8fe',
                      }}
                    >
                      预期税收(万元)
                    </div>
                    <div style={{ width: '50%', border: '0.5px solid #eee' }}>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第一年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第二年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第三年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '150px',
                      lineHeight: '150px',
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                        paddingLeft: '10px',
                        border: '0.5px solid #eee',
                        backgroundColor: '#f6f8fe',
                      }}
                    >
                      预期亩均税收（万元）
                    </div>
                    <div style={{ width: '50%', border: '0.5px solid #eee' }}>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第一年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第二年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                      <div
                        style={{
                          height: '50px',
                          lineHeight: '50px',
                          paddingLeft: '10px',
                          border: '0.5px solid #eee',
                          display: 'flex',
                        }}
                      >
                        <div style={{ width: '50%' }}>第三年</div>
                        <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                          333
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}></div>

              <div style={{ display: 'flex' }}>
                <Rowmsg name={'33'} label={'预计年耗能情况(吨标煤)'} isBlack={true}></Rowmsg>
                <Rowmsg name={'44'} label={'预计年排污情况(废水、废气等)'} isBlack={true}></Rowmsg>
              </div>
              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'（综合征信报告、司法诉讼记录等）'}
                  label={'投资方风险评估'}
                  isBlack={false}
                ></Rowmsg>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  产业关联度
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions2}
                    disabled
                    defaultValue={['强相关']}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'行业趋势、供需关系、竞争力、潜在客户群'}
                  label={'产品市场前景'}
                  isBlack={false}
                ></Rowmsg>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '150px',
                    lineHeight: '150px',
                  }}
                >
                  <div
                    style={{
                      width: '25%',
                      paddingLeft: '10px',
                      border: '0.5px solid #eee',
                      backgroundColor: '#f6f8fe',
                    }}
                  >
                    工艺水平
                  </div>
                  <div style={{ width: '75%', border: '0.5px solid #eee' }}>
                    <div
                      style={{
                        height: '50px',
                        lineHeight: '50px',
                        paddingLeft: '10px',
                        border: '0.5px solid #eee',
                        display: 'flex',
                      }}
                    >
                      <div style={{ width: '25%' }}>生产效率</div>
                      <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                        <Checkbox.Group
                          options={plainOptions3}
                          disabled
                          defaultValue={['高']}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        height: '50px',
                        lineHeight: '50px',
                        paddingLeft: '10px',
                        border: '0.5px solid #eee',
                        display: 'flex',
                      }}
                    >
                      <div style={{ width: '25%' }}>良品率</div>
                      <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                        <Checkbox.Group
                          options={plainOptions3}
                          disabled
                          defaultValue={['高']}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        height: '50px',
                        lineHeight: '50px',
                        paddingLeft: '10px',
                        border: '0.5px solid #eee',
                        display: 'flex',
                      }}
                    >
                      <div style={{ width: '25%' }}>整体评价</div>
                      <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: '10px' }}>
                        <Checkbox.Group
                          options={plainOptions6}
                          disabled
                          defaultValue={['先进']}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  团队力量
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions4}
                    disabled
                    defaultValue={['核心管理人才']}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  资产负债表
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions1}
                    disabled
                    defaultValue={['正常']}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  利润表
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions1}
                    disabled
                    defaultValue={['正常']}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  现金流量表
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions1}
                    disabled
                    defaultValue={['正常']}
                    onChange={onChange}
                  />
                  <span style={{ color: '#bfbfbf' }}>连续两年经营现金流为负应优先排除</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  固定资产与流动资产占比
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions1}
                    disabled
                    defaultValue={['正常']}
                    onChange={onChange}
                  />
                  <span style={{ color: '#bfbfbf' }}>优先选择流动资产占比较高的投资人</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  资金来源
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions5}
                    disabled
                    defaultValue={['单一依赖接待或短期融资']}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'高'}
                  label={'金融机构信用评级'}
                  isBlack={false}
                ></Rowmsg>
              </div>

              <div style={{ display: 'flex' }}>
                <Rowmsg
                  labelWidth={'25%'}
                  name={'高'}
                  label={'行业协会评价'}
                  isBlack={false}
                ></Rowmsg>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  纳税合规性
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions1}
                    disabled
                    defaultValue={['正常']}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  height: '50px',
                  lineHeight: '50px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                <div
                  style={{
                    width: '25%',
                    paddingLeft: '10px',
                    backgroundColor: '#f5f8ff',
                    borderLeft: '1px solid #eeeeee',
                  }}
                >
                  综合评估等级
                </div>
                <div style={{ borderLeft: '1px solid #eeeeee', paddingLeft: '10px' }}>
                  <Checkbox.Group
                    options={plainOptions}
                    disabled
                    defaultValue={['优秀']}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ paddingBottom: '20px', color: '#aaa', fontSize: '12px' }}>
            <div style={{ marginLeft: '50px', marginBottom: '10px', fontSize: '12px' }}>
              注：租赁厂房项目，按2000平米：1亩折算用地面积。
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', backgroundColor: '#fff', width: '50%', padding: '20px' }}>
        <div style={{ fontSize: '12px' }}>相关市级部门评估意见</div>
          <Steps
            direction="vertical"
            progressDot
            current={5}
            style={{ fontSize: '12px' }}
            items={[
              {
                title: '市发改',
                description: (
                  <div style={{ fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                        XXX(XXX部门)
                      </div>
                      <StepFeedbackRow
                        tag={<Tag color="#f50">未完成</Tag>}
                        detail="该项目在XXX方面存在风险，建议XXX"
                      />
                    </div>
                    <div>2022-05-01 10:12:10</div>
                  </div>
                ),
              },
              {
                title: '科技局',
                description: (
                  <div style={{ fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                        XXX(XXX部门)
                      </div>
                      <StepFeedbackRow
                        tag={<Tag color="#87d068">已完成</Tag>}
                        detail="该项目在XXX方面存在风险，建议XXX"
                      />
                    </div>
                    <div>2022-05-01 10:12:10</div>
                  </div>
                ),
              },
              {
                title: '工信局',
                description: (
                  <div style={{ fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                        XXX(XXX部门)
                      </div>
                      <StepFeedbackRow
                        tag={<Tag color="#87d068">已完成</Tag>}
                        detail="该项目在XXX方面存在风险，建议XXX"
                      />
                    </div>
                    <div>2022-05-01 10:12:10</div>
                  </div>
                ),
              },
              {
                title: '生态局',
                description: (
                  <div style={{ fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                        XXX(XXX部门)
                      </div>
                      <StepFeedbackRow
                        tag={<Tag color="#87d068">已完成</Tag>}
                        detail="该项目在XXX方面存在风险，建议XXX"
                      />
                    </div>
                    <div>2022-05-01 10:12:10</div>
                  </div>
                ),
              },
              {
                title: '应急局',
                description: (
                  <div style={{ fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                        XXX(XXX部门)
                      </div>
                      <StepFeedbackRow
                        tag={<Tag color="#87d068">已完成</Tag>}
                        detail="该项目在XXX方面存在风险，建议XXX"
                      />
                    </div>
                    <div>2022-05-01 10:12:10</div>
                  </div>
                ),
              },
              {
                title: '商务局',
                description: (
                  <div style={{ fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                        XXX(XXX部门)
                      </div>
                      <StepFeedbackRow
                        tag={<Tag color="#108ee9">超时完成</Tag>}
                        detail="该项目在XXX方面存在风险，建议XXX"
                      />
                    </div>
                    <div>2022-05-01 10:12:10</div>
                  </div>
                ),
              },
              {
                title: '税务局',
                description: (
                  <div style={{ fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                        XXX(XXX部门)
                      </div>
                      <StepFeedbackRow
                        tag={<Tag style={{ fontSize: '12px' }} color="#f50">未完成</Tag>}
                        detail="该项目在XXX方面存在风险，建议XXX"
                      />
                    </div>
                    <div>2022-05-01 10:12:10</div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </PageContainer>
  );
};
export default QaState;
