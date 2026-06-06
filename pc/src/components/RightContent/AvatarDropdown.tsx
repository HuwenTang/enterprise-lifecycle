import { outLogin } from '@/services/ant-design-pro/api';
import {
  DatabaseOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import {systemApi, systemApi2} from '@/services/api';
import {message, Modal, Tree, TreeDataNode, TreeProps} from 'antd';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.realName}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await systemApi2.logout();
    const { search, pathname } = window.location;
    const now = Date.now();
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');


    // Note: There may be security issues, please note
    if (window.location.pathname !== '/login' && !redirect) {
      history.replace({
        pathname: '/login',
        search: stringify({
          redirect: pathname + search,
          t: now,
        }),
      });
      // 延迟一点再刷新，确保路由已变更
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  // Modal 显示状态
  const [modalVisible, setModalVisible] = useState(false);

  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  function transformTreeData(data) {
    return data.map(node => ({
      ...node,
      title: node.label, // 将 title 改为 name
      key: node.value, // 可选，如果你不再需要 name 属性
      children: node.children ? transformTreeData(node.children) : []
    }));
  }
  const [userList, setUserList] = useState<string[][]>()

  const grantData = async () => {
    console.log('userList',userList)
    const data = await systemApi.updateActiveAreaGrants({ requestBody:userList });
    console.log('grantData',data)
    message.success('授权成功');
    setUserList([])
    setCheckedKeys( [])
  }

  const [isShow, setIsShow] = useState(false)
  const getDataGrants = async (id: string) => {
      try{
        const data = await systemApi.getActiveAreaGrants({ });
        let list = []
        data.areas.map(item=>{
          list.push(item.id)
        })
        setUserList(list)
        setCheckedKeys( list)
        setIsShow( true)
      }catch (e){
        message.error('授权失败');
        setIsShow( false)
      }
  };

  const getAdministrativeDivisionTree = async () => {
    const  data =  await systemApi.getAdministrativeDivisionTree()
    const  data2 =  await systemApi.getActiveAreaGrants()

  console.log('data',data)
  console.log('data2',data2)
    console.log('transformedData',transformTreeData(data))
    setTreeData(transformTreeData(data))
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setUserList(checkedKeysValue)
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  //  打开弹窗
  const showDataPermissionModal = () => {

    setModalVisible(true);
  };

  //  关闭弹窗
  const handleModalClose = () => {
    if(userList?.length>0){
      grantData()
      setModalVisible(false);
    }else {
      message.error('请选择数据权限')
    }
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      if (key === 'Database') {
        getDataGrants(currentUser.userid)
        showDataPermissionModal();
        console.log('Database');
        return;
      }
      if (key === 'Question') {
        window.open('http://172.22.71.96/resources/9fe0dc47cf0e8f58ad23408e0475afb0_raw.mp4');
        return;
      }
      if (key === 'reviewVideo') {
        window.open('http://172.22.71.96/resources/1.mp4');
        return;
      }
      if (key === 'cityVideo') {
        window.open('http://172.22.71.96/resources/2.mp4');
        return;
      }
      if (key === 'countyVideo') {
        window.open('http://172.22.71.96/resources/0.mp4');
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      {/*<Spin*/}
      {/*  size="small"*/}
      {/*  style={{*/}
      {/*    marginLeft: 8,*/}
      {/*    marginRight: 8,*/}
      {/*  }}*/}
      {/*/>*/}
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.realName) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    ...(currentUser.roleIds.includes('00') || currentUser.roleIds.includes('71204871933000169')
      ? [
          {
            key: 'Database',
            icon: <DatabaseOutlined />,
            label: '数据权限',
          },
        ]
      : []),
    // {
    //   key: 'reviewVideo',
    //   icon: <PlayCircleOutlined />,
    //   label: '审核部门操作视频',
    // },
    // {
    //   key: 'cityVideo',
    //   icon: <PlayCircleOutlined />,
    //   label: '市级部门操作视频',
    // },
    // {
    //   key: 'countyVideo',
    //   icon: <PlayCircleOutlined />,
    //   label: '区县发改委操作视频',
    // },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  useEffect(() => {
    getAdministrativeDivisionTree()
    console.log('currentUser', currentUser);
  }, []);
  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <Modal
        title="数据权限修改"
        open={modalVisible} // 注意：Ant Design v5+ 使用 open，旧版用 visible
        onOk={handleModalClose}
        onCancel={()=> setModalVisible(false)}
        okText="确定"
        cancelText="关闭"
        width={520}
        centered
        destroyOnClose // 关闭后销毁内容
      >
        <div>
          <p>
            <strong>当前账号：</strong>
            {currentUser?.realName}
          </p>

          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={treeData}
          />

        </div>
      </Modal>
    </>
  );
};
