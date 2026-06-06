
import React, {useEffect, useState} from 'react';
import {Select} from "antd";
import {systemApi} from "@/services/api";

const DictSelection = (e:{catalog:string,value?:string,onChange?:(arg0: string)=>void}) => {
  const {catalog,value,onChange}  = e
  const [options, setOptions] = useState<{value:string,label:string}[]>([])
  const fetchDict = async () => {
    const res = await systemApi.getDictItems({catalog:catalog});
    setOptions(res.map((item) => ({
      value: item.code,
      label: item.label,
    })))
  };
  useEffect(() => {
    fetchDict()
  }, []);
  return (
      <Select
        value={value}
        onChange={onChange}
        options={options}
      />
  );
};

export default DictSelection;
