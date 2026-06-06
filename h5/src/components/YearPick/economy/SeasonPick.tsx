import { useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";
import {systemApi} from "../../../api.ts";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void,
    setQuarter: (year: number) => void,
    fullWidth?: boolean,
    /** 限制可选季度，如 [1, 2] 表示仅第一季度和上半年 */
    allowedQuarters?: number[],
}
const ALL_COLUMNS = [
    { text: '第一季度', value: 1 },
    { text: '上半年', value: 2 },
    { text: '第三季度', value: 3 },
    { text: '全年', value: 4 },
]
export default function SeasonPick({year, setYear,setQuarter, fullWidth, allowedQuarters}: YearPickProps) {

    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const columns = allowedQuarters
        ? ALL_COLUMNS.filter(col => allowedQuarters.includes(col.value))
        : ALL_COLUMNS

    useEffect(()=>{
        localStorage.setItem('year', year)
    },[])
    return (
        <div style={{marginRight:'0.1rem', width: fullWidth ? '100%' : 'auto'}}>
            <div onClick={() => setState('bottom')} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height:'0.3rem',
                width: fullWidth ? '100%' : 'auto',
                minWidth: fullWidth ? 'auto' : '0.8rem',
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
                        setQuarter(selectRow.value)
                        localStorage.setItem('year', selectRow.text)
                        onClose()
                    }}
                />
            </Popup>
        </div>
    )
}
