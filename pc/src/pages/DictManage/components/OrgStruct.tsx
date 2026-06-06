import {
  Alert,
  Button,
  Form,
  FormProps,
  Input, message,
  Modal,
  Select,
  Spin,
  Tree,
  TreeProps,
  TreeSelect,
  TreeSelectProps
} from "antd";
import React, {useEffect, useState} from "react";
import {systemApi, systemApi2} from "@/services/api";
import {CascadeVoString} from "@/services/apis";
import {MenuUnfoldOutlined} from "@ant-design/icons";

type TreeNode = {
  title: string,
  key: string,
  children?: TreeNode[],
}
type FieldType = {
  enabled?: boolean;
  code?: string;
  label?: string;
  name?: string;
  path?: string;
  icon?: string;
  sort?: number;
  parentCode?: string;
};
const transformDataToTreeFormat = (data: CascadeVoString[]):TreeNode[] => {
  return data.map(item => ({
    title: item.label,
    key: item.code!,
    children: item.children ? transformDataToTreeFormat(item.children) : undefined,
  }));
};

const transformDataToTreeFormat2 = (data: CascadeVoString[]):TreeNode[] => {
  return data.map(item => ({
    title: item.label,
    value: item.code!,
    children: item.children ? transformDataToTreeFormat2(item.children) : undefined,
  }));
};


export default function OrgStruct({setOrgId, responsive, setParentId,setCatalog}){
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [defaultSelectedKey, setDefaultSelectedKey] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [treeData1, setTreeData1] = useState([])

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    if(values.parentCode===''){
      values.parentCode = null;
    }
    console.log('values', values);
    systemApi.createDictCatalog({
      systemDictCatalogDto:{
        parentCode: values.parentCode,
        label: values.label,
        code: values.code,
      }
    }).then(() => {
      loadOrganization().then(()=>setLoading(false)).catch(()=>setError(true))
      setIsModalOpen(false);
      message.success('新增成功')
    }).catch(() => {
      message.error('新增失败')
    })
    // systemApi.createOrUpdateDictItem({
    //   label: values.label,
    //   enabled: values.enabled,
    //   sort: values.sort,
    //   code: values.code,
    // }).then(() => {
    // })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onPopupScroll: TreeSelectProps['onPopupScroll'] = (e) => {
    console.log('onPopupScroll', e);
  };
  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    setValue(newValue);
    console.log('onChange', newValue);
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const getCatalog = async (orgid:string) => {
    // return await primeApi.getFormCatalog([orgid]);
  }
  const loadOrganization = async ()=>{
    const data = await systemApi2.getDictCatalogTree()
    console.log('data',data)
    const data3 = data.map(item=>{
      return {
        value: item.code,
        title: item.label,
        children: item.children,
      }
    })
    const data2 =[{
      value:"",
      title: '/',
      parentCode: null,
      children: transformDataToTreeFormat2(data),
    }]
    setTreeData1(data2);
    console.log('data2',data2)
    setTreeData(transformDataToTreeFormat(data))
    setDefaultSelectedKey(transformDataToTreeFormat(data)[0].key)
    let dekey = transformDataToTreeFormat(data)[0]
    console.log('dekey',dekey)
    console.log(transformDataToTreeFormat(data))
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    if (selectedKeys[0]) {
      setParentId(selectedKeys[0]);
    }
    // setOrgId(selectedKeys[0])
  };


  useEffect( () => {
    loadOrganization().then(()=>setLoading(false)).catch(()=>setError(true))
  }, []);
  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <Alert message={error} type="error" />;
  }
  const resStyle = {
    padding: '20px',
    minWith: '200px',
    width:'20%',
    // overflow: 'hidden',
  }
  const resStyle1 = {
    padding: '20px',
    minWith: '200px',
    width:'200px',
    // overflow: 'hidden',
  }

  return (
    <div style={responsive ? resStyle1 : resStyle} bordered={true} title="组织机构">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2>数据字典</h2>
        <MenuUnfoldOutlined style={{
          cursor: 'pointer',
        }}  onClick={showModal}/>
      </div>
      <Tree
        style={{
          width: '100%',
          backgroundColor: '#f6f6f6',
          overflow: 'hidden',
        }}
        treeData={treeData}
        defaultSelectedKeys={defaultSelectedKey}
        defaultExpandAll={false}
        onSelect={onSelect}
        showLine
      />
      <Modal title="新增目录" open={isModalOpen} footer={false} onCancel={handleCancel}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="父级目录"
            name="parentCode"
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择父级菜单"
              allowClear
              treeDefaultExpandAll={false}
              onChange={onChange}
              treeData={treeData1}
              onPopupScroll={onPopupScroll}
            />
          </Form.Item>
          <Form.Item<FieldType> label="字典名称" name="label">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="字典编码" name="code">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="字典排序" name="sort">
            <Input type="number"/>
          </Form.Item>

          <Form.Item<FieldType> label="是否启用" name="enabled">
            <Select
              defaultValue=""
              options={[
                {
                  value: true,
                  label: '是',
                },
                {
                  value: false,
                  label: '否',
                },
              ]}
            />
          </Form.Item>

          <Form.Item label={null}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
