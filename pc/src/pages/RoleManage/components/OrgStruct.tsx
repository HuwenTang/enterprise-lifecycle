import {Alert, message, Spin, Tree, TreeProps} from "antd";
import {useEffect, useState} from "react";
import {primeApi, systemApi2} from "@/services/api";
import {CascadeVoString} from "@/services/apis";
import ProCard from "@ant-design/pro-card";

type TreeNode = {
  title: string,
  key: string,
  children?: TreeNode[],
}

const transformDataToTreeFormat = (data: CascadeVoString[]):TreeNode[] => {
  return data.map(item => ({
    title: item.label,
    key: item.value!,
    children: item.children ? transformDataToTreeFormat(item.children) : undefined,
  }));
};


export default function OrgStruct({setOrgId,option,setOption,responsive}){
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultSelectedKey, setDefaultSelectedKey] = useState<string[]>([]);

  // const getCatalog = async (orgid:string) => {
  //   const data = await primeApi.getFormCatalog([orgid]);
  //   return data.map((item) => ({
  //     label: item.title,
  //     value: item.code
  //   }))
  // }
const loadOrganization = async ()=>{
  const data = await systemApi2.cascadeOrganization();
  const tree = transformDataToTreeFormat(data);
  setTreeData(tree);
  const firstKey = tree?.[0]?.key;
  if (firstKey) {
    setDefaultSelectedKey([firstKey]);
    // 初始默认选中第一个组织，避免外层一直等待 orgId
    setOrgId(firstKey);
  } else {
    setDefaultSelectedKey([]);
  }
  // getCatalog('0').then(arr=>{
  //   setOption(arr)
  // });
  console.log(tree?.[0])
}

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
      console.log('selected', info);
    if (!info.selected) {
      setDefaultSelectedKey([info.node.key]);//改动1
      return;
    }
    // getCatalog(selectedKeys[0]).then(arr=>{
    //   setOption(arr)
    // })
    setOrgId(selectedKeys[0])
  };


  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadOrganization();
      } catch (e: any) {
        console.error('loadOrganization failed', e);
        if (!cancelled) setError(e?.message || '组织机构加载失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }
  const resStyle = {

    padding: '20px',
    minWidth: '200px',
    // width:'200px',
    width:'20%',
    overflow: 'hidden',
  }
  const resStyle1 = {
    padding: '20px',
    width:'20%',
    // width:'200px',
    overflow: 'hidden',
  }

  return (
      <div  style={responsive? resStyle1:resStyle}   bordered={true} title='组织机构'>
        <h2>组织机构</h2>
        <Tree
          style={
            {
              width:'100%',
              backgroundColor: '#f6f6f6',
              overflow:'hidden'
            }
          }
          treeData={treeData}
          defaultSelectedKeys={defaultSelectedKey}
          defaultExpandAll={false}
          onSelect={onSelect}
          showLine
        />
      </div>
  )
}
