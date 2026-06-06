import {useState} from "react";
import dayjs from "dayjs";

export default function PreInvestment({project}:  {project: any}) {
    const [active, setActive] = useState('1')
    const [active1, setActive1] = useState('1')
    const [active2, setActive2] = useState('1')

    const formatValue = (value: any) => {
        return value == null || value === '' ? '-' : value
    }
  return (
      <div style={{
          marginTop: '0.2rem',
          fontSize: '0.12rem',
      }}>
          <div style={{
              padding: '0.1rem 0',
              color: '#666',
              width: '100%',
              textAlign: 'center',
              marginBottom: '0.2rem',
          }}>
              更新日期：{dayjs().format('YYYY-MM-DD')}
          </div>
          <div style={{
              width: '100%',
              height: '0.32rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#737272',
          }}>
                <div  onClick={() => setActive('1')} style={{
                    height: '0.32rem',
                    lineHeight: '0.32rem',
                    width: '49%',
                    textAlign: 'center',
                    borderBottomLeftRadius: '0.16rem',
                    borderTopLeftRadius: '0.16rem',
                    backgroundColor: active === '1' ? '#4bca81' : '#e0e5ee',
                    color: active === '1' ? '#fff' : '#737272',
                }}>
                    在谈记录
                </div>
                  <div  onClick={() => setActive('2')} style={{
                      height: '0.32rem',
                      lineHeight: '0.32rem',
                      width: '49%',
                      textAlign: 'center',
                      backgroundColor: active === '2' ? '#4bca81' : '#e0e5ee',
                      color:  active === '2' ? '#fff' : '#737272',
                      borderBottomRightRadius: '0.16rem',
                      borderTopRightRadius: '0.16rem',
                  }}>
                      签约信息
                  </div>
          </div>
          {active === '1' &&
              <div style={{}}>
                  <div style={{
                      margin: '0.1rem 0',
                      display: 'flex',
                  }}>
                      <div onClick={() => setActive1('1')} style={{
                          marginRight: '0.1rem',
                          fontSize: '0.12rem',
                          width:'23%',
                          height: '0.32rem',
                          borderRadius:'0.05rem',
                          color:  active1 === '1' ? '#fff' : '#666',
                          backgroundColor: active1 === '1' ? '#337cfd' : '#eff4fd',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>基本信息</div>
                      <div onClick={() => setActive1('2')} style={{
                          fontSize: '0.12rem',
                          width:'23%',
                          height: '0.32rem',
                          borderRadius:'0.05rem',
                          color:  active1 === '2' ? '#fff' : '#666',
                          backgroundColor: active1 === '2' ? '#337cfd' : '#eff4fd',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>项目信息</div>
                  </div>
                  {
                      active1 === '1' && <div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  投资方：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.investor)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  {project.investmentFlagLabel === "内资" ? '项目总投资（亿元）' : '项目总投资（亿美元）'}
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.investmentFlagLabel === '内资'
                                      ? project.totalInvestmentCny
                                      : project.totalInvestmentUsd)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  项目类别：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.investmentFlagLabel)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  洽谈进度：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.negotiationProgress)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  项目内容：
                              </div>
                              <div style={{width: '70%', textAlign: 'left'}}>
                                  {formatValue(project.projectContent)}
                              </div>
                          </div>
                      </div>
                  }

                  {
                      active1 === '2' && <div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  初次对接时间：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {project?.firstTime ? dayjs(project?.firstTime).format('YYYY-MM-DD') : '-'}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  市(区)：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.districtName)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  园区：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.parkName)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  厂房类型：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.buildingType)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '50%', color: '#86909c'}}>
                                  拟用地面积（平方米） ：
                              </div>
                              <div style={{width: '50%', textAlign: 'right'}}>
                                  {formatValue(project.useArea)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '50%', color: '#86909c'}}>
                                  拟租厂房面积（平方米） ：
                              </div>
                              <div style={{width: '50%', textAlign: 'right'}}>
                                  {formatValue(project.rentArea)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '50%', color: '#86909c'}}>
                                  拟购厂房面积（平方米） ：
                              </div>
                              <div style={{width: '50%', textAlign: 'right'}}>
                                  {formatValue(project.buyArea)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '50%', color: '#86909c'}}>
                                  预计年销量（万元） ：
                              </div>
                              <div style={{width: '50%', textAlign: 'right'}}>
                                  {formatValue(project.yearXl)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '50%', color: '#86909c'}}>
                                  预计年税收（万元） ：
                              </div>
                              <div style={{width: '50%', textAlign: 'right'}}>
                                  {formatValue(project.yearSs)}
                              </div>
                          </div>
                      </div>
                  }

              </div>
          }
          {active === '2' &&
              <div style={{}}>
                  <div style={{
                      margin: '0.1rem 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                  }}>
                      <div onClick={() => setActive2('1')} style={{
                          marginRight: '0.1rem',
                          fontSize: '0.12rem',
                          width: '23%',
                          height: '0.32rem',
                          borderRadius: '0.05rem',
                          color: active2 === '1' ? '#fff' : '#666',
                          backgroundColor: active2 === '1' ? '#337cfd' : '#eff4fd',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>基本信息
                      </div>
                      <div onClick={() => setActive2('2')} style={{
                          fontSize: '0.12rem',
                          width: '23%',
                          height: '0.32rem',
                          borderRadius: '0.05rem',
                          color: active2 === '2' ? '#fff' : '#666',
                          backgroundColor: active2 === '2' ? '#337cfd' : '#eff4fd',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>准入信息
                      </div>
                      <div onClick={() => setActive2('3')} style={{
                          fontSize: '0.12rem',
                          width: '23%',
                          height: '0.32rem',
                          borderRadius: '0.05rem',
                          color: active2 === '3' ? '#fff' : '#666',
                          backgroundColor: active2 === '3' ? '#337cfd' : '#eff4fd',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>投资规模
                      </div>
                      <div onClick={() => setActive2('4')} style={{
                          fontSize: '0.12rem',
                          width: '23%',
                          height: '0.32rem',
                          borderRadius: '0.05rem',
                          color: active2 === '4' ? '#fff' : '#666',
                          backgroundColor: active2 === '4' ? '#337cfd' : '#eff4fd',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>预期效益
                      </div>
                  </div>
                  {
                      active2 === '1' && <div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  市(区)：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.districtName)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  园区：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.parkName)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  项目名称：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.projectName)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  项目类别：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.investmentFlagLabel)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  {project.investmentFlagLabel === "内资" ? '项目总投资（亿元）' : '项目总投资（亿美元）'}
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.investmentFlagLabel === '内资'
                                      ? project.totalInvestmentCny
                                      : project.totalInvestmentUsd)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  协议利用外资（万美元）：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.agreementForeignDirectInvestment)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  项目类型：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.projectCategory)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  产业大类名称：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.industryClassification)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  行业编码：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.nationalEconomicClassification)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  所属行业：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.projectType)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  投资方名称：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.investor)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  投资方性质：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.investorNature)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  投资方注册地：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.countryRegion)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  是否属于上市企业：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.isPubliclyTradedOrPreIPOCompanyLabel)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  是否高新技术企业：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.ifGxjs)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  是否有融资需求：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.ifGxjs)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  是否科创项目：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.isKcProj)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  QFLP外资项目：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.isQflp)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  项目信息来源：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.source)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  部门名称：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.sourceDepartmentName)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  项目简介：
                              </div>
                              <div style={{width: '70%', textAlign: 'left'}}>
                                  {formatValue(project.projectContent)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '35%', color: '#86909c'}}>
                                  项目选址位置：
                              </div>
                              <div style={{width: '65%', textAlign: 'right'}}>
                                  {formatValue(project.projectLocation)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '35%', color: '#86909c'}}>
                                  预计开工时间：
                              </div>
                              <div style={{width: '65%', textAlign: 'right'}}>
                                  {project.plannedStartTime ? dayjs(project.plannedStartTime).format('YYYY-MM-DD') : ''}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '35%', color: '#86909c'}}>
                                  预计竣工时间：
                              </div>
                              <div style={{width: '65%', textAlign: 'right'}}>
                                  {project.plannedEndTime ? dayjs(project.plannedEndTime).format('YYYY-MM-DD') : ''}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '35%', color: '#86909c'}}>
                                  {project.investmentFlagLabel === "内资" ? "注册资本（万元）" : "注册资本（万美元）"}
                              </div>
                              <div style={{width: '65%', textAlign: 'right'}}>
                                  {formatValue(project.registeredCapital)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '35%', color: '#86909c'}}>
                                  签约日期：
                              </div>
                              <div style={{width: '65%', textAlign: 'right'}}>
                                  {project.actualSigningTime ? dayjs(project.actualSigningTime).format('YYYY-MM-DD') : ''}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  签约信息统计日期：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {project.signingTime ? dayjs(project.signingTime).format('YYYY-MM-DD') : ''}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '35%', color: '#86909c'}}>
                                  成效情况说明：
                              </div>
                              <div style={{width: '65%', textAlign: 'right'}}>
                                  {formatValue(project.cgRemark)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  产业关联度：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.cyGl)}
                              </div>
                          </div>
                      </div>
                  }

                  {
                      active2 === '2' && <div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  特殊行业：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.tshy)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  准入限制：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.zrxz)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  两高项目：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.lgxm)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  重金属排放：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.zjspf)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '50%', color: '#86909c'}}>
                                  预计年耗能情况(吨标煤)：
                              </div>
                              <div style={{width: '50%', textAlign: 'right'}}>
                                  {formatValue(project.totalEnergyConsumption)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '50%', color: '#86909c'}}>
                                  预计年排污情况（废水、废气等）：
                              </div>
                              <div style={{width: '50%', textAlign: 'right'}}>
                                  {formatValue(project.wastewaterBy1)}
                              </div>
                          </div>
                      </div>
                  }

                  {
                      active2 === '3' && <div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  申请用地面积（亩）：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.appliedLandArea)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  租赁厂房面积（平方米）：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.zlLandArea)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  折算用地（亩）：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.zlLandAreaZs)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  计划总投资（万元）：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.plannedTotalInvestment)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  计划投资强度（万元/亩）：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.investmentIntensity)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '30%', color: '#86909c'}}>
                                  固定资产投资（万元）：
                              </div>
                              <div style={{width: '70%', textAlign: 'right'}}>
                                  {formatValue(project.fixedAssetInvestment)}
                              </div>
                          </div>
                      </div>
                  }
                  {
                      active2 === '4' && <div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  预期年均产值（万元）：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.yqCz)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  预期年均开票销售（万元）：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.yqKpxs)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  预期年均税收（万元）：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.yqSs)}
                              </div>
                          </div>
                          <div style={{
                              padding: '0 0.2rem',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}>
                              <div style={{width: '40%', color: '#86909c'}}>
                                  预期年均亩均税收（万元）：
                              </div>
                              <div style={{width: '60%', textAlign: 'right'}}>
                                  {formatValue(project.yqMjtax)}
                              </div>
                          </div>
                      </div>
                  }
              </div>
          }
      </div>
  );
}

