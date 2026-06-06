import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {Divider, theme} from 'antd';
import React, {useEffect, useState} from 'react';
import ProCard, {StatisticCard} from "@ant-design/pro-card";
import RcResizeObserver from 'rc-resize-observer';
/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const { Statistic } = StatisticCard;

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [responsive, setResponsive] = useState(false);
  useEffect(() => {
    // getInitialState()
  }, []);
  return (
    <PageContainer>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
          <StatisticCard
            statistic={{
              title: '指标总数',
              value: 6015,
            }}
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '部门填报次数',
              value: 37028,
              description: <Statistic title="占比" value="61.5%" />,
            }}
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg"
                alt="百分比"
                width="100%"
              />
            }
            chartPlacement="left"
          />
          <StatisticCard
            statistic={{
              title: '上传文件数量',
              value: 18062,
              description: <Statistic title="占比" value="38.5%" />,
            }}
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg"
                alt="百分比"
                width="100%"
              />
            }
            chartPlacement="left"
          />
        </StatisticCard.Group>
      </RcResizeObserver>
      <div style={{
        height: 30,
      }}>

      </div>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard
          title="数据概览"
          extra="2025年2月26日 星期三"
          split={responsive ? 'horizontal' : 'vertical'}
          headerBordered
          bordered
        >
          <ProCard split="horizontal">
            <ProCard split="horizontal">
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    title: '待填报统计',
                    value: '12/56',
                    suffix: '',
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '累计填报量',
                    value: '134',
                    suffix: '次',
                  }}
                />
              </ProCard>
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    title: '月文件上传量',
                    value: 234,
                    description: (
                      <Statistic
                        title="较上月"
                        value="8.04%"
                        trend="down"
                      />
                    ),
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '年文件上传量',
                    value: 234,
                    description: (
                      <Statistic title="较上年" value="8.04%" trend="up" />
                    ),
                  }}
                />
              </ProCard>

            </ProCard>
            <StatisticCard
              title="部门使用趋势"
              chart={
                <img
                  src="https://gw.alipayobjects.com/zos/alicdn/_dZIob2NB/zhuzhuangtu.svg"
                  width="100%"
                />
              }
            />
          </ProCard>
          <StatisticCard
            title="文件分类情况"
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/qoYmFMxWY/jieping2021-03-29%252520xiawu4.32.34.png"
                alt="大盘"
                width="100%"
              />
            }
          />
        </ProCard>
      </RcResizeObserver>
    </PageContainer>
  );
};

export default Welcome;
