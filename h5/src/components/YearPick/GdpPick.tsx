import { useEffect, useState} from "react";
import {Picker, Popup, PopupPosition} from "react-vant";
import {primeApi} from "../../api.ts";

interface YearPickProps {
    year: string,
    setYear: (year: string) => void,
    list: string[]
}
export default function GdpPick({year, setYear,list}: YearPickProps) {


    const columns = list
    useEffect(()=>{
        // primeApi.listDigitalTaizhou1({
        //     category:year,
        //     page:1,
        // }).then(res=>{
        //     console.log('listDigitalTaizhou1231',res)
        // })
        localStorage.setItem('year', year)
        console.log('list',list)
    },[list])
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
                    defaultIndex={0}
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
