import {useContext, useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void
}
export default function ProcessPick({year, setYear}: YearPickProps) {

    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const columns = [
        { text: '已签约', value: 1 },
        { text: '已注册', value: 2 },
        { text: '已报备', value: 3 },
        { text: '完成报备', value: 4 },
        { text: '在建（已开工）', value: 5 },
        { text: '已竣工', value: 6 },
    ]
    useEffect(()=>{
        localStorage.setItem('year', year)
    },[])
    return (
        <div >
            <div onClick={() => setState('bottom')} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height:'0.36rem',
                width:'2rem',
                borderRadius:'0.15rem',
                color:'#666',
                padding:'0 0.1rem',
                backgroundColor:'#f5f5f5',
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
