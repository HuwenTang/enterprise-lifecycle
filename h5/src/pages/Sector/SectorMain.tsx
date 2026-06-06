import {Picker, Popup, PopupPosition, Tabs} from 'react-vant'
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import InvestmentSituation from "./main/InvestmentSituation.tsx";
import AdvanceConstruction from "./main/‌AdvanceConstruction‌.tsx";
import CompanySituation from "./main/CompanySituation.tsx";
import IndustrialOperation from "./main/IndustrialOperation.tsx";

export default function SectorMain() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const [keyName, setKeyName] = useState(searchParams.get('keyName'))
    const [keyName1, setKeyName1] = useState(searchParams.get('keyName1'))
    const [state, setState] = useState<PopupPosition>('')
    const columns = [
        { text: '2025', value: 2025 },
        { text: '2024', value: 2024 },
        { text: '2023', value: 2023 },
        { text: '2022', value: 2022 },
        { text: '2021', value: 2021 },
        { text: '2020', value: 2020 },
    ]
    const onClose = () => setState('')
    const [year, setYear] = useState('2025')
    const items = [
        {
            key: 0,
            title: '招商情况'
        },{
            key: 1,
            title: '建设推进'
        },{
            key: 2,
            title: '企业情况'
        },{
            key: 3,
            title: '产业运行'
        },
    ]
  return (
      <div style={{
          fontSize: '0.14rem',
          height: '100vh',
          backgroundColor: '#fff'
      }}>
          <div style={{
              height: '0.5rem',
              backgroundColor: '#fff',
              color: '#333',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 0.2rem',
              boxSizing: 'border-box',
          }}>
              <div onClick={() => {
                  navigate(-1)
              }} style={{
                  width: '0.8rem',
                  height: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left',
              }}>
                  <img onClick={() => navigate(-1)} style={{
                  width: '0.18rem',
              }} src="/img/left.png" alt=""/>
              </div>
              <div style={{
                  fontSize: '0.16rem',
                  fontWeight: 'bolder',
                  display: 'flex',
              }}>
                  <div>
                      <span>{keyName}</span>
                      {keyName1 && <span>({keyName1})</span>}</div>
                  <img style={{
                      width: '0.2rem',
                  }} src="/img/down.png" alt=""/></div>
              <div onClick={() => setState('bottom')} style={{
                  display: 'flex',
              }}>
                  <div>{year}</div>
                  <img style={{
                      width: '0.15rem',
                  }} src="/img/downb.png" alt=""/>
              </div>
              <Popup
                  visible={state === 'bottom'}
                  style={{height: '30%'}}
                  position='bottom'
                  onClose={onClose}
              >
                  <Picker
                      columns={columns}
                      onChange={(val: string, selectRow, index: number) => {
                          console.log('选中项: ', selectRow)
                      }}
                      onCancel={onClose}
                      onConfirm={(val: string, selectRow, index: number) => {
                          setYear(selectRow.text)
                          onClose()
                      }}
                  />
              </Popup>
          </div>
          <Tabs defaultActive={0}>
              {items.map((item, index) => (
                  <Tabs.TabPane key={index} title={item.title}>
                      {
                          item.key===0&&<InvestmentSituation />
                      }
                      {
                          item.key===1&&<AdvanceConstruction />
                      }{
                          item.key===2&&<CompanySituation />
                      }{
                          item.key===3&&<IndustrialOperation />
                      }
                  </Tabs.TabPane>
              ))}
          </Tabs>
      </div>
  )
}
