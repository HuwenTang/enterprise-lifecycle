import React from 'react';
import { Form, Input, Button } from 'antd';
import {PlusOutlined} from "@ant-design/icons";

const DynamicInputForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form:', values);
    // console.log(form.getFieldsValue)
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.List
        name="dynamicInputs"
        initialValue={[]} // 初始值可以是一个空数组
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div style={{width: '100%',display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                <Form.Item
                  {...restField}
                  name={[name, 'value']}
                  label={'input'}
                  rules={[{ required: true, message: 'This field is required!' }]}
                >
                  <Input placeholder="Dynamic Input" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'value1']}
                  label={'input'}
                  rules={[{ required: true, message: 'This field is required!' }]}
                >
                  <Input placeholder="Dynamic Input" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'value2']}
                  label={'input'}
                  rules={[{ required: true, message: 'This field is required!' }]}
                >
                  <Input placeholder="Dynamic Input" />
                </Form.Item>
              </div>

            ))}
            <Button type="dashed"  onClick={() => add()} block icon={<PlusOutlined />}>
              Add Input
            </Button>
            {errors.length > 0 && (
              <div style={{ color: 'red' }}>Please fill in all fields</div>
            )}
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicInputForm;
