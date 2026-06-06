import {useEffect, useState} from "react";
import {Modal} from "antd";
import {useNavigate} from "react-router-dom";
import {systemApi} from "../../api.ts";

export default function SectorView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        navigate(`/sectordetail?keyName=${keyName}&&keyName1=${keyName1}`)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [key,setKey] =useState( 0)
    const [key1,setKey1] =useState(-1)
    const [keyName,setKeyName] = useState('海陵区')
    const [keyName1,setKeyName1] = useState('')
    const color = {
        border: '1px solid #737272',
        width: '1.2rem',
        // height: '0.44rem',
        color: '#737272',
        fontSize: '0.18rem',
        textAlign: 'center',
        // lineHeight: '0.44rem',
        // borderRadius: '0.12rem',
        marginBottom: '0.10rem',
    }
    const colorActive = {
        border: '1px solid #737272',
        fontSize: '0.18rem',
        backgroundColor: '#737272',
        marginBottom: '0.10rem',
        color: '#fff',
        width: '1.2rem',
        // height: '0.44rem',
        textAlign: 'center',
        // lineHeight: '0.44rem',
        // borderRadius: '0.12rem',
    }
    const [cityList,setCityList] = useState([])
    const fetchSector = async () => {
        try {
            const res = await systemApi.getAdministrativeDivisionTree()
            setCityList(res)
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(()=>{
        fetchSector()
    },[])
  return (
      <>
          <div onClick={showModal} style={{
              border: '1px solid #fff',
              color: '#fff',
              width: '0.7rem',
              height: '0.24rem',
              textAlign: 'center',
              lineHeight: '0.24rem',
              borderRadius: '0.12rem',
          }}>
              板块视图
          </div>
          <Modal title={
              <span style={{
                  fontSize: '0.18rem',
              }}>
                  请选择板块
              </span>
          } okText={'确定'} cancelText={'取消'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  paddingTop:'0.2rem'
              }}>
                  <div style={{
                      // width:'30%',
                      display: 'flex',
                      flexDirection:'column',
                      alignItems:'center',
                  }}>
                      {
                          cityList.map((item,index)=>{
                              return <div onClick={()=>{
                                  setKey(index)
                                  setKeyName(item.label)
                              }} key={index} style={key===index?colorActive:color}>{item.label}</div>
                          })
                      }

                  </div>
                  <div style={{
                      // width:'30%',
                      paddingRight:'0.15rem',
                      height:'4rem',
                      overflow:'scroll'
                  }}>
                      {
                        key===0&&
                          <div>
                              {
                                  cityList[key]?.children.map((item,index)=>{
                                      return <div onClick={()=>{
                                          if(key1===index){
                                              setKey1(-2)
                                              setKeyName1('')
                                          }else {
                                              setKey1(index)
                                              setKeyName1(item.label)
                                          }
                                      }} key={index} style={key1===index?colorActive:color}>{item.label}</div>
                                  })
                              }
                          </div>
                      }
                      {
                          key===1&&
                          <div>
                              {
                                  cityList[key]?.children.map((item,index)=>{
                                      return <div onClick={()=>{
                                          if(key1===index){
                                              setKey1(-2)
                                              setKeyName1('')
                                          }else {
                                              setKey1(index)
                                              setKeyName1(item.label)
                                          }
                                      }} key={index} style={key1===index?colorActive:color}>{item.label}</div>
                                  })
                              }
                          </div>
                      }
                      {
                          key===2&& <div>
                              {
                                  cityList[key]?.children.map((item, index) => {
                                      return <div onClick={() => {
                                          if(key1===index){
                                              setKey1(-2)
                                              setKeyName1('')
                                          }else {
                                              setKey1(index)
                                              setKeyName1(item.label)
                                          }
                                      }} key={index} style={key1 === index ? colorActive : color}>{item.label}</div>
                                  })
                              }
                          </div>
                      }
                      {
                          key === 3 && <div>
                              {
                                  cityList[key]?.children.map((item, index) => {
                                      return <div onClick={() => {
                                          if(key1===index){
                                              setKey1(-2)
                                              setKeyName1('')
                                          }else {
                                              setKey1(index)
                                              setKeyName1(item.label)
                                          }
                                      }} key={index} style={key1 === index ? colorActive : color}>{item.label}</div>
                                  })
                              }
                          </div>
                      }
                      {
                          key === 4 && <div>
                              {
                                  cityList[key]?.children.map((item, index) => {
                                      return <div onClick={() => {
                                          if(key1===index){
                                              setKey1(-2)
                                              setKeyName1('')
                                          }else {
                                              setKey1(index)
                                              setKeyName1(item.label)
                                          }
                                      }} key={index} style={key1 === index ? colorActive : color}>{item.label}</div>
                                  })
                              }
                          </div>
                      }
                      {
                          key === 5 && <div>
                              {
                                  cityList[key]?.children.map((item, index) => {
                                      return <div onClick={() => {
                                          if(key1===index){
                                              setKey1(-2)
                                              setKeyName1('')
                                          }else {
                                              setKey1(index)
                                              setKeyName1(item.label)
                                          }
                                      }} key={index} style={key1 === index ? colorActive : color}>{item.label}</div>
                                  })
                              }
                          </div>
                      }
                  </div>
              </div>
          </Modal></>
  )
}
