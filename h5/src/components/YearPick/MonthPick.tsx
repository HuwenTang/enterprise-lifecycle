import { useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void
}
export default function MonthPick({year, setYear}: YearPickProps) {

    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const columns = [
        { text: '1月', value: 1 },
        { text: '2月', value: 2 },
        { text: '3月', value: 3 },
        { text: '4月', value: 4 },
        { text: '5月', value: 5 },
        { text: '6月', value: 6 },
            { text: '7月', value: 7 },
        { text: '8月', value: 8 },
        { text: '9月', value: 9 },
        { text: '10月', value: 10 },
        { text: '11月', value: 11 },
        { text: '12月', value: 12 },
    ]
    useEffect(()=>{
        localStorage.setItem('year', year)
    },[])
    return (
        <div style={{
            backgroundColor:'#eeeff5',
            padding: '0.1rem',
            borderRadius: '0.02rem',
        }}>
            <div onClick={() => setState('bottom')} style={{
                display: 'flex',
            }}>
                <div>{year}</div>
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
