import { PageContainer } from '@ant-design/pro-components';
import { FC } from 'react';
import React from 'react';
import useStyles from './style.style';
import { useNavigate } from '@@/exports';
import {Checkbox, GetProp} from 'antd';

const Rowmsg = (e: { name: string; label: string; isBlack: boolean; labelWidth?: string ,color?:string}) => {
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
        fontSize: '12px',
        height: '50px',
        lineHeight: '50px',
        // padding: '20px',
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
          height: '100%',
          paddingLeft: '10px',
          backgroundColor: '#f5f8ff',
        }}
      >
        {label}
      </div>
      <div style={{ color: color ? color : '#333', width: '50%', paddingLeft: '10px' , borderLeft: '1px solid #eeeeee',}}>{name}</div>
    </div>
  );
};
const Rowmsg2 = (e: {title:string, name: string; label: string;name1: string; label1: string; labelWidth?: string; color?: string }) => {
  const name = e.name;
  const title = e.title;
  const label = e.label;
  const name1 = e.name1;
  const label1 = e.label1;
  const labelWidth = e.labelWidth;
  const color = e.color;
  return (
      <div style={{width: '100%',display: 'flex'}}>
        <div style={{width:'25%', height: '100px', lineHeight: '100px',backgroundColor:'#f5f8ff',borderLeft: '0.5px solid #eeeeee',paddingLeft: '10px'}}>{title}</div>
        <div style={{width:'75%'}}>
          <div style={{width: '100%', textAlign: 'left', fontSize: '14px', height: '50px', lineHeight: '50px', display: 'flex', backgroundColor: '#fff', alignItems: 'center', color: '#333', border: '0.5px solid #eeeeee',}}>
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
          <div style={{width: '100%', textAlign: 'left', fontSize: '14px', height: '50px', lineHeight: '50px', display: 'flex', backgroundColor: '#fff', alignItems: 'center', color: '#333', border: '0.5px solid #eeeeee',}}>
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

const QaTable = () => {
  const list = [
    {
      title: '第一年',
      data1: '1212',
      data2: '1212',
      wcl: '95%',
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
      wcl: '95%',
      data3: '1212',
      data4: '1090',
      data5: '1131',
      data6: '235',
      data7: '1231',
    },
    {
      title: '第三年',
      data1: '1212',
      wcl: '95%',
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
          display: 'grid',
          gridTemplateColumns: 'repeat(10,1fr)',
          backgroundColor: '#f5f8ff',
          alignItems: 'center',
          color: '#333',
          border: '0.5px solid #eeeeee',
        }}
      >
        <div style={{ border: '0.5px solid #eeeeee', height: '50px' }}></div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>
          协议开票销售
          <br />
          (万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>
          实际开票销售 <br />
          (万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
          完成率
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>
          协议税收 <br />
          (万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px',textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>
          实际税收 <br />
          (万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
          完成率
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>
          协议亩均税收 <br />
          (万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px',textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>
          实际亩均税收 <br />
          (万元)
        </div>
        <div style={{ border: '0.5px solid #eeeeee', height: '50px', textAlign: 'center' ,display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
          完成率
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
              gridTemplateColumns: 'repeat(10,1fr)',
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
              {item.wcl}
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
              {item.wcl}
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
            <div
              style={{
                backgroundColor: '#fff',
                border: '0.5px solid #eeeeee',
                height: '50px',
                paddingLeft: '10px',
              }}
            >
              {item.wcl}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const QaEffect: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/qa-effect', breadcrumbName: '项目质效' },
  ];
  const plainOptions = ['优秀', '良好', '一般'];
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
      <div style={{ backgroundColor: '#fff' }}>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '16px',
            padding: '45px 0',
            fontWeight: 'bolder',
          }}
        >
          {`新增制造业项目质效评价表`}
        </div>
        <div style={{ padding: '0 50px 20px 50px' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'项目在泰实施主体'} label={'投资方名称'} isBlack={true}></Rowmsg>
              <Rowmsg name={'是'} label={'是否属于上市企业'} isBlack={true}></Rowmsg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'——'} label={'项目名称'} isBlack={false}></Rowmsg>
              <Rowmsg name={'是'} label={'重点项目'} isBlack={false}></Rowmsg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'周丽莉'} label={'企业联系人'} isBlack={true}></Rowmsg>
              <Rowmsg name={'19826190944'} label={'联系电话'} isBlack={true}></Rowmsg>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
              <Rowmsg labelWidth={'25%'} name={'医药'} label={'产业方向'} isBlack={false}></Rowmsg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
              <Rowmsg
                labelWidth={'25%'}
                name={'浙江省xx市xx区xx街109号2栋'}
                label={'项目地址'}
                isBlack={true}
              ></Rowmsg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'2024年2月23日'} label={'协议开工时间'} isBlack={false}></Rowmsg>
              <Rowmsg name={'2024年2月23日'} label={'实际开工时间'} isBlack={false}></Rowmsg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'2024年2月23日'} label={'协议竣工时间'} isBlack={false}></Rowmsg>
              <Rowmsg name={'2024年2月23日'} label={'实际竣工时间'} isBlack={false}></Rowmsg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'323亩'} label={'申请用地面积(亩)'} isBlack={true}></Rowmsg>
              <Rowmsg name={'323亩'} label={'实际用地面积(亩)'} isBlack={true}></Rowmsg>
            </div>
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
              <Rowmsg name={'1090'} label={'协议总投资(万元/万美元)'} isBlack={true}></Rowmsg>
              <Rowmsg name={'1090'} label={'实际总投资(万元/万美元)'} isBlack={true}></Rowmsg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
              <Rowmsg
                name={'1090'}
                label={'协议投资强度(万元/亩，万美元/亩)'}
                isBlack={true}
              ></Rowmsg>
              <Rowmsg
                name={'1090'}
                label={'实际投资强度(万元/亩，万美元/亩)'}
                isBlack={true}
              ></Rowmsg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
              <Rowmsg name={'1090'} label={'协议固定资产投资(万元/万美元)'} isBlack={true}></Rowmsg>
              <Rowmsg name={'1090'} label={'实际固定资产投资(万元/万美元)'} isBlack={true}></Rowmsg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
              <Rowmsg name={'1090'} label={'协议设备投资(万元/万美元)'} isBlack={false}></Rowmsg>
              <Rowmsg name={'1090'} label={'实际设备投资(万元/万美元)'} isBlack={false}></Rowmsg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'1090'} label={'协议年耗能情况(吨、等价值)'} isBlack={true}></Rowmsg>
              <Rowmsg name={'22'} label={'实际年耗能情况(吨、等价值)'} isBlack={true}></Rowmsg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <Rowmsg name={'1090'} label={'协议年排污情况(废水、废气等'} isBlack={true}></Rowmsg>
              <Rowmsg name={'22'} label={'实际年排污情况(废水、废气等)'} isBlack={true}></Rowmsg>
            </div>
            <QaTable></QaTable>
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
              <Rowmsg name={'12'} label={'落户后获专利数'} isBlack={true}></Rowmsg>
              <Rowmsg name={'填写具体名称'} label={'落户后获省级以上科技或人才项目支持'} isBlack={true}></Rowmsg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
              <Rowmsg name={'1000'} label={'落户后获风险投资（万元/万美元）'} isBlack={true}></Rowmsg>
              <Rowmsg name={'22'} label={'落户后参赛获奖情况'} isBlack={true}></Rowmsg>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #eeeeee' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                width: '100%',
                fontSize: '14px',
                height: '50px',
                lineHeight: '50px',
                borderLeft: '1px solid #eeeeee',
              }}
            >
              <div
                style={{
                  paddingLeft: '10px',
                  backgroundColor: '#f5f8ff',
                  fontSize: '12px',
                  borderLeft: '1px solid #eeeeee',
                }}
              >
                综合评价等级
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
          <Rowmsg labelWidth={'25%'} name={'XXX部门XXX建议，XXX提示。'} label={'部门风险提示'} isBlack={true}></Rowmsg>

        </div>
        <div style={{ paddingBottom: '20px', color: '#aaa', fontSize: '12px' }}>
          <div style={{ marginLeft: '50px', marginBottom: '10px', fontSize: '12px' }}>
            注：租赁厂房项目，按2000平米：1亩折算用地面积。
          </div>

        </div>
      </div>
    </PageContainer>
  );
};
export default QaEffect;
