import React, { useEffect, useRef } from "react";
import { systemApi2 } from "@/services/api";
import { Button } from "antd";
import { ExpandAltOutlined } from "@ant-design/icons";

const EnterpriseSearch: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const openFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const el = iframe as HTMLIFrameElement & {
      mozRequestFullScreen?: () => void;
      webkitRequestFullscreen?: () => void;
      msRequestFullscreen?: () => void;
    };
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };
  useEffect(() => {
    const iframe = iframeRef.current;
    systemApi2.getTicket().then((res) => {
      if (iframe) {
        iframe.src = `/tzzhjg/sysdata/public/login/ssoLogin/qymsmzq/sso.action?ticket=${res}&page=2`;
      }
    });
  }, []);


  return(
    <div>
      <div style={{marginBottom: 20,display: 'flex',justifyContent: 'flex-end'}}>
        <Button onClick={openFullscreen}>
          <ExpandAltOutlined />
        </Button>

      </div>
      <iframe
        style={{
          border: 'none',
          background: 'white',
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

export default EnterpriseSearch
