import { useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void,
    area: string[],
    fullWidth?: boolean,
}
export default function AreaPick({year,area, setYear, fullWidth}: YearPickProps) {

    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const columns = area
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
                width: fullWidth ? '100%' : '0.8rem',
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
