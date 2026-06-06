import React, {useEffect, useState} from "react";
import {systemApi} from "@/services/api";
import {Table, TableColumnsType} from "antd";
import {CascadeVoString} from "@/services/apis";

const columns: TableColumnsType<CascadeVoString> = [
  {
    title: '行政区划',
    dataIndex: 'label',
    key: 'label',
    width:'50%'
  },
];


const AreaManage: React.FC = () => {
  const [treeData, setTreeData] = useState<CascadeVoString[]>([])
const getAdministrativeDivisionTree = async () => {
  const  data =  await systemApi.cascadeOrganization()
  setTreeData( data)
}
  useEffect(() => {
    getAdministrativeDivisionTree()
  }, []);


  return (
    <div>
      <Table<CascadeVoString>
        columns={columns}
        rowKey={(record) => record.value ?? record.label ?? record.title ?? ''}
        dataSource={treeData}
      />
    </div>
  )
}

export default AreaManage
