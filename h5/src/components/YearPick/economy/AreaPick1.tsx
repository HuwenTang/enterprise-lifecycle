import { useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void
    /** 固定显示值，设置后仅显示不可选择 */
    fixedValue?: string
}
export default function AreaPick({year, setYear, fixedValue}: YearPickProps) {

    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const columns = [
        { text: '2025', value: "2025" },
        { text: '2024', value: '2024' },
        { text: '2023', value: '2023' },

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
            {fixedValue != null ? (
                <div style={{ display: 'flex' }}>{fixedValue}</div>
            ) : (
                <>
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
                </>
            )}
        </div>
    )
}
