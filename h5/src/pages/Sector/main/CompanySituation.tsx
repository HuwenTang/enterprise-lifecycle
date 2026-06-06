export default function CompanySituation() {
  return (
      <div style={{
          width: "100%",
          fontSize: "0.14rem",
          padding: "0.2rem",
          boxSizing: "border-box",
      }}>
          <div style={{
              fontWeight: "bolder",
              marginBottom: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
          }}>

              <div>整体情况</div>
              <div style={{
                  display: "flex",

              }}>
                  <div style={{
                      display: "flex",
                      alignItems: "center",
                  }}>
                      <div style={{
                          height: "0.1rem",
                          width: "0.1rem",
                          backgroundColor: '#14c9c9',
                          borderRadius: "50%",
                          marginRight: "0.05rem"
                      }}></div>
                      <div>企业</div>
                  </div>
                  <div style={{
                      alignItems: "center",
                      display: "flex",
                      marginLeft: "0.1rem"
                  }}>
                      <div style={{
                          height: "0.1rem",
                          width: "0.1rem",
                          backgroundColor: '#165dff',
                          borderRadius: "50%",
                          marginRight: "0.05rem"
                      }}></div>
                      <div>个体</div>
                  </div>

              </div>
          </div>

          <div style={{
              fontWeight: "bolder",
              marginBottom: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
          }}>

              <div>市场主体情况</div>
              <div style={{
                  display: "flex",

              }}>
                  <div style={{
                      display: "flex",
                      alignItems: "center",
                  }}>
                      <div style={{
                          height: "0.1rem",
                          width: "0.1rem",
                          backgroundColor: '#14c9c9',
                          borderRadius: "50%",
                          marginRight: "0.05rem"
                      }}></div>
                      <div>企业</div>
                  </div>
                  <div style={{
                      alignItems: "center",
                      display: "flex",
                      marginLeft: "0.1rem"
                  }}>
                      <div style={{
                          height: "0.1rem",
                          width: "0.1rem",
                          backgroundColor: '#165dff',
                          borderRadius: "50%",
                          marginRight: "0.05rem"
                      }}></div>
                      <div>个体</div>
                  </div>

              </div>
          </div>

          <div style={{
              display: "flex",
              height:'0.4rem',
              backgroundColor:'#3e61f1',
              alignItems:"center",
              borderRadius:"0.05rem",
              color:'#fff',
          }}>
              <div style={{
                  width: "50%",
                  textAlign: "center",
                  borderRight: "1px solid #fff",
              }}>类型</div>
              <div style={{
                  width: "50%",
                  textAlign: "center",
              }}>数量（家）</div>
          </div>
      </div>
  );
}
