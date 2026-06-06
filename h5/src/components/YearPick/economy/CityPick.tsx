import { useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void
}
export default function CityPick({year, setYear}: YearPickProps) {

    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const columns = [
        { text: '泰州市', value: '' },
        { text: '海陵区', value: '海陵区' },
        { text: '靖江市', value: '靖江市' },
        { text: '泰兴市', value: '泰兴市' },
        { text: '兴化市', value: '兴化市' },
        { text: '姜堰区', value: '姜堰区' },
        { text: '医药高新区（高港区）', value: '医药高新区（高港区）' },
    ]
    useEffect(()=>{
        localStorage.setItem('year', year)
    },[])
    return (
        <div style={{marginRight:'0.1rem'}}>
            <div onClick={() => setState('bottom')} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height:'0.3rem',
                width:'0.8rem',

                color:'#666',
                padding:'0 0.1rem',
                backgroundColor:'#fff',
                borderRadius:'0.05rem'
            }}>
                <div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    minWidth: 0
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
