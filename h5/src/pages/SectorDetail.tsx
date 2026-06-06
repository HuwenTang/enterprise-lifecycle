import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import {Picker, Popup, PopupPosition} from 'react-vant';

export default function SectorDetail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const keyName = useState(searchParams.get('keyName'))
    const keyName1 = useState(searchParams.get('keyName1'))
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
  return (
    <div style={{
        fontSize: '0.14rem',
        height: '100vh',
        backgroundColor: '#f0f2f6'
    }}>
      <div style={{
          height: '0.5rem',
          backgroundColor: '#60a9ff',
          color: '#fff',
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
                height: '0.3rem',
                borderRadius: '0.15rem',
                backgroundColor: '#71b2ff',
                textAlign: 'center',
                lineHeight: '0.3rem',
            }}>市级视图</div>
            <div style={{
                fontSize: '0.16rem',
                fontWeight: 'bolder',
                display: 'flex',
            }} >
                <div>{keyName}{keyName1}</div>
                <img style={{
                    width: '0.2rem',
                }} src="/img/down.png" alt=""/></div>
            <div style={{
                width: '0.8rem',
            }}></div>
      </div>

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.2rem',
            boxSizing: 'border-box',
        }}>
            <div style={{
                fontSize: '0.18rem',
                fontWeight: 'bolder',
            }}>
                整体情况
            </div>
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
                        onClose()
                    }}
                />
            </Popup>
        </div>

        <div className={'content'} style={{
            padding: '0 0.2rem 0.2rem 0.2rem',
        }}>
            <div>
                <div onClick={()=>{
                    navigate(`/sectorMain?key=0&&keyName=${keyName}&&keyName1=${keyName1}`)
                }} style={{
                    fontSize: '0.16rem',
                    borderRadius: '0.1rem',
                    backgroundColor: '#d0def9',
                    padding: '0.15rem 0.2rem',
                    color: '#3f6ceb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>招商情况</div>
                    <img style={{width: '0.2rem'}} src="/img/right.png" alt=""/>
                </div>

                <div style={{
                    padding: '0.1rem 0.2rem',
                    backgroundColor: '#fff',
                }}>
                    <div style={{
                        display: 'flex',
                        marginBottom: '0.2rem',
                    }}>
                        <div style={{color: '#264099', width: '33%'}}>在谈项目</div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>项目数量（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>投资额（亿）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        marginBottom: '0.2rem',
                    }}>
                        <div style={{color: '#264099', width: '33%'}}>签约项目</div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>项目数量（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>投资额（亿）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                    }}>
                        <div style={{color: '#264099', width: '33%'}}>本月新增</div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>在谈项目（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>签约项目（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>
                </div>


                <div style={{
                    marginTop: '0.2rem',
                    fontSize: '0.16rem',
                    borderRadius: '0.1rem',
                    backgroundColor: '#d0def9',
                    padding: '0.15rem 0.2rem',
                    color: '#3f6ceb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>建设推进</div>
                    <img style={{width: '0.2rem'}} src="/img/right.png" alt=""/>
                </div>

                <div style={{
                    padding: '0.1rem 0.2rem',

                    backgroundColor: '#fff',
                }}>
                    <div style={{
                        display: 'flex',
                        marginBottom: '0.2rem',
                    }}>
                        <div style={{color: '#264099', width: '33%'}}>省重大</div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>项目数量（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>投资额（亿）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                    }}>
                        <div style={{color: '#264099', width: '33%'}}>市级重点</div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>项目数量（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>投资额（亿）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>
                </div>


                <div style={{
                    marginTop: '0.2rem',
                    fontSize: '0.16rem',
                    borderRadius: '0.1rem',
                    backgroundColor: '#d0def9',
                    padding: '0.15rem 0.2rem',
                    color: '#3f6ceb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>企业情况</div>
                    <img style={{width: '0.2rem'}} src="/img/right.png" alt=""/>
                </div>

                <div style={{
                    padding: '0.1rem 0.2rem',

                    backgroundColor: '#fff',
                }}>
                    <div style={{
                        display: 'flex',
                        marginBottom: '0.2rem',
                    }}>
                        <div style={{color: '#264099', width: '45%'}}>
                            <div>在业活跃企业（家）</div>
                            <div style={{marginTop: '0.1rem', color: '#86909c'}}>0</div>
                        </div>
                        <div style={{width: '45%', color: '#86909c'}}>
                            <div style={{color: '#264099'}}>在业活跃个体（家））</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '0.2rem',
                    fontSize: '0.16rem',
                    borderRadius: '0.1rem',
                    backgroundColor: '#d0def9',
                    padding: '0.15rem 0.2rem',
                    color: '#3f6ceb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>产业运行</div>
                    <img style={{width: '0.2rem'}} src="/img/right.png" alt=""/>
                </div>

                <div style={{
                    padding: '0.1rem 0.2rem',

                    backgroundColor: '#fff',
                }}>
                    <div style={{
                        display: 'flex',
                        marginBottom: '0.2rem',
                    }}>
                        <div style={{color: '#264099', width: '33%'}}>GDP样本单位</div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>单位数量（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                    }}>
                        <div style={{color: '#264099', width: '33%'}}>规上企业</div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>企业数量（个）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                        <div style={{width: '33%', color: '#86909c'}}>
                            <div>产值（亿）</div>
                            <div style={{marginTop: '0.1rem'}}>0</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
