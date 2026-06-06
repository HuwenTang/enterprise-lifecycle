import {Button, Cascader, CascaderProps, Form, FormProps, Input, message, Modal, Select} from "antd";
import {systemApi, systemApi2} from "@/services/api";
import {useEffect, useState} from "react";

type FieldType = {
  username?: string;
  roles?: string[];
};

 interface AddRoleProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
   fetchRole: () => void
}
const AddRole: React.FC = (e: AddRoleProps) => {
   const {isModalOpen,setIsModalOpen,fetchRole} = e
  const [option, setOption] = useState([])
  const handleCancel = () => {
    setIsModalOpen(false);
  };
   const getOrg = async () => {
     const data = await systemApi2.cascadeOrganization()
     console.log(data)
     setOption(data)
      return data
   };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
     try {
       systemApi.createRole({
         roleDto:{
           name: values.username||'',
         }
       })
       fetchRole()
       setIsModalOpen(false)
       message.success('修改成功')
     }catch (e) {
       message.warning('修改失败')
     }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange: CascaderProps<Option>['onChange'] = (value) => {
    console.log(value);
  };
  useEffect(() => {
    getOrg()
  }, []);
  return (
    <div>
      <Modal title="新增角色" open={isModalOpen} footer={false} onCancel={handleCancel}>
        <Form
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}
          style={{maxWidth: 600}}
          initialValues={{remember: true}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="角色名称"
            name="username"
            rules={[{required: true, message: '数据权限'}]}
          >
            <Input />
          </Form.Item>

          {/*<Form.Item<FieldType>*/}
          {/*  label="数据权限"*/}
          {/*  name="roles"*/}
          {/*  rules={[{required: true, message: '数据权限'}]}*/}
          {/*>*/}
          {/*  <Cascader options={option} onChange={onChange} placeholder="Please select" />*/}
          {/*</Form.Item>*/}
          <Form.Item label={null}>
            <div style={{
              display: 'flex',
              justifyContent: 'right',
            }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddRole
