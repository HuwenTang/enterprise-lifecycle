import { useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void
}
export default function GdpPicker2({year, setYear}: YearPickProps) {

    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const columns = [
        { text: '全部', value: 1 },
        { text: '全部工业企业实时开票', value: 2 },
        { text: '建筑业开票', value: 3 },
        { text: '服务业开票', value: 4 },
        { text: '房地产业开票', value: 5 },
        { text: '批发业开票', value: 6 },
        { text: '零售业开票', value: 7 },
        { text: '制造业重点行业开票', value: 8 },
        { text: '服务业重点行业开票', value: 9 },
    ]
    useEffect(()=>{
        localStorage.setItem('year', year)
    },[])
    return (
        <div style={{
            backgroundColor:'#fff',
            padding: '0.1rem',
            borderRadius: '0.02rem',
            color: '#333',
        }}>
            <div onClick={() => setState('bottom')} style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '1.5rem',
                    textAlign: 'center',
                }}>{year}</div>
                <img style={{
                    width: '0.15rem',
                }}  src="/img/downb.png" alt=""/>
            </div>
            <Popup
                visible={state === 'bottom'}
                style={{ height: '30%' }}
                position='bottom'
                onClose={onClose}
            >
                <Picker
                    columns={columns}
                    onChange={(val: string, selectRow, index: number) => {
                        console.log('选中项: ', selectRow)
                    }}
                    onCancel={onClose}
                    onConfirm={(val: string, selectRow, index: number)=>{
                        setYear(selectRow.text)
                        localStorage.setItem('year', selectRow.text)
                        onClose()
                    }}
                />
            </Popup>
        </div>
    )
}
