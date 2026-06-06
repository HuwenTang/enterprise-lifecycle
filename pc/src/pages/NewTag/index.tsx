import React, {useEffect, useRef, useState} from "react";
import {systemApi2} from "@/services/api";
import {Button} from "antd";
import {ExpandAltOutlined} from "@ant-design/icons";

const NewTag: React.FC = () => {
  const iframeRef  = useRef(null)
  const openFullscreen = () => {
    const iframe = iframeRef.current;

    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
      }
    }
  };
  useEffect(() => {
    const iframe = iframeRef.current!
    systemApi2.getTicket().then(res => {
      console.log(res)
      iframe.src = `/tzzhjg/sysdata/public/login/ssoLogin/qymsmzq/sso.action?ticket=${res}&page=1`

    })
    console.log(123)
  }, []);
  // useEffect(() => {
  //   const iframe = iframeRef.current!
  //   iframe.contentWindow.fetch = fetch
  //
  //   fetch('/ythpt/sysdata/public/api/oauth2/getYthToken.action?app_id=570056ec66244d38aad90e41a63939aa&app_secret=fcca8968fcd54c7994e4fb3b1e439fcd&grant_type=ip&userid=test04').then(res => res.json())
  //     .then(data=>{
  //       iframe.contentWindow.fetch(`/ythpt/test04?access_token=${data.access_token}`)
  //         .then(() => {
  //           iframe.src = '/ythpt/sysdata/app/zt.app/index_bqgl.tpg?id=data-label-lib'
  //         })
  //     })
  //
  // }, []);


  return(
    <div>
      <div style={{marginBottom: 20, display: 'flex', justifyContent: 'flex-end'}}>
        <Button onClick={openFullscreen}>
          <ExpandAltOutlined/>
        </Button>

      </div>
      <iframe
        style={{
          border: 'none',
          backgroundColor: 'white',
        }}
        ref={iframeRef}
        width="100%"
        height="800"
        title=""
      >
        你的浏览器不支持iframe。
      </iframe>
    </div>
  )
}

export default NewTag
