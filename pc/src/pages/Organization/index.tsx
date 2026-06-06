import React, {useEffect, useState} from "react";
import {systemApi, systemApi2} from "@/services/api";
import {Button, message, Modal, Table, TableColumnsType, Checkbox} from "antd";
import {CascadeVoString} from "@/services/apis";
import {SyncOutlined} from "@ant-design/icons";

interface DataType {
  label: string;
  key: React.ReactNode;
  value?: string;
  children?: DataType[];
}




const Organization: React.FC = () => {
    const [treeData, setTreeData] = useState<DataType[]>([])
    const [organizationLoading, setOrganizationLoading] = useState<boolean>(false)
    const [staffLoading, setStaffLoading] = useState<boolean>(false)
    const [showRecursiveModal, setShowRecursiveModal] = useState<boolean>(false)
    const [currentOrgId, setCurrentOrgId] = useState<string>('')
    const [onlySyncCurrent, setOnlySyncCurrent] = useState<boolean>(false)

  const syncOrganization = async () => {
    setOrganizationLoading(true);
    try {
     const data = await systemApi.syncOrganization()
      message.success(data.value)
    }catch (e) {
      console.error(e)
      message.error('同步组织架构失败')
    } finally {
      setOrganizationLoading(false);
    }
  }

  //同步组织架构员工成功
  const syncOrganizationStaff = async (id:string,isRecursive:boolean) => {
    setStaffLoading(true);
    try {
      await systemApi.syncOrganizationStaff({
        organizationId: id,
        recursive: isRecursive
      })
      message.success('同步组织架构员工成功')
    }catch (e) {
      console.error(e)
      message.error('同步组织架构员工失败')
    } finally {
      setStaffLoading(false);
    }
  }

  // 打开同步确认对话框
  const handleSyncStaffClick = (id: string) => {
    setCurrentOrgId(id);
    setShowRecursiveModal(true);
  }

  // 确认同步
    const handleConfirmSync = () => {
      setShowRecursiveModal(false);
      // 选中包含子部门时recursive为true，不选时为false
      syncOrganizationStaff(currentOrgId, onlySyncCurrent);
      // 重置复选框状态
      setOnlySyncCurrent(false);
    }
  const columns: TableColumnsType<DataType> = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>组织名称</span>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            size="small"
            loading={organizationLoading}
            onClick={syncOrganization}
          >
            同步组织架构
          </Button>
        </div>
      ),
      dataIndex: 'label',
      key: 'value',
      width:'100%',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{text}</span>
          <Button
            type="link"
            icon={<SyncOutlined />}
            size="small"
            loading={staffLoading}
            onClick={() => handleSyncStaffClick(record.value || record.key as string)}
          >
            同步组织人员
          </Button>
        </div>
      ),
    },
    // {
    //   title: '组织代码',
    //   dataIndex: 'value',
    //   key: 'value',
    //   width:'50%'
    // }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await systemApi2.cascadeOrganization();
        // 转换数据格式，确保每个项目都有必需的key属性
        const formatData = (items: CascadeVoString[]): DataType[] => {
          return items.map(item => ({
            ...item,
            key: item.value || item.label, // 使用value或label作为key
            children: item.children ? formatData(item.children) : undefined
          }));
        };
        const formattedData = formatData(data);
        setTreeData(formattedData);
      } catch (error) {
        console.error('获取组织架构失败:', error);
        message.error('获取组织架构数据失败');
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <Table<DataType>
        columns={columns}
        rowKey={'value'}
        dataSource={treeData}
      />
      <Modal
        title="同步组织人员"
        open={showRecursiveModal}
        onOk={handleConfirmSync}
        onCancel={() => {
          setShowRecursiveModal(false);
          setOnlySyncCurrent(false); // 重置复选框状态
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Checkbox
            checked={onlySyncCurrent}
            onChange={(e) => setOnlySyncCurrent(e.target.checked)}
          >
            包含子部门（该选项会影响系统使用，谨慎选择）
          </Checkbox>
        </div>
      </Modal>
    </div>
  )
}

export default Organization
