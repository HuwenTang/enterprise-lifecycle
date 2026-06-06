
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed', // 改为 fixed，固定在视口
        bottom: 0, // 距离视口底部 0
        left: 0, // 贴住左边
        right: 0, // 贴住右边，使宽度占满
        zIndex: 1000, // 确保在上方
        textAlign: 'center',
        padding: '10px',
        fontSize: '12px',
        background: '#255aec',
        color: '#fff',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}
    >
      主办单位：泰州市数据局 技术支持：泰州市数据产业集团有限公司
      企业全生命平台账号开通及操作咨询：周洁（19952951525）；周一凡（15996060181）。
      数字化招商模块操作咨询：钱忠伟（17351649583）。
    </div>
    // <DefaultFooter
    //   style={{
    //     background: 'none',
    //   }}
    //   links={[
    //     {
    //       key: 'Ant Design Pro',
    //       title: 'Ant Design Pro',
    //       href: 'https://pro.ant.design',
    //       blankTarget: true,
    //     },
    //     {
    //       key: 'github',
    //       title: <GithubOutlined />,
    //       href: 'https://github.com/ant-design/ant-design-pro',
    //       blankTarget: true,
    //     },
    //     {
    //       key: 'Ant Design',
    //       title: 'Ant Design',
    //       href: 'https://ant.design',
    //       blankTarget: true,
    //     },
    //   ]}
    // />
  );
};

export default Footer;
