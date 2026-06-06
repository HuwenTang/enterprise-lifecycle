import React, { useEffect, useRef } from "react";

const TagManage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.contentWindow!.fetch = fetch;
    fetch('/ythpt/sysdata/public/api/oauth2/getYthToken.action?app_id=570056ec66244d38aad90e41a63939aa&app_secret=fcca8968fcd54c7994e4fb3b1e439fcd&grant_type=ip&userid=test04').then(res => res.json())
      .then((data: { access_token?: string }) => {
        iframe.contentWindow!.fetch(`/ythpt/test04?access_token=${data.access_token}`)
          .then(() => {
            iframe.src = '/ythpt/sysdata/app/zt.app/index_bqgl.tpg?id=data-label-lib';
          });
      });

  }, []);


  return(
    <iframe
      style={{
        border:'none'
      }}
      ref={iframeRef}
      width="100%"
      height="800"
      title=""
    >
      你的浏览器不支持iframe。
    </iframe>
  )
}

export default TagManage
