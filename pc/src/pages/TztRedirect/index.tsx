import {useEffect} from "react";

export default function TztRedirect(){
  const  getQueryParam = (param)=> {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  const redirect = getQueryParam('redirect');
  useEffect(() => {
    console.log('redirect',redirect)
    if(redirect){
      lx.biz.getAuthCode({
        appId: "1572864-14778368",
        success: async function (res) {
          // window.location.href = redirect;
        },
        fail: function (err) {
          console.log(err)
        },
      });
    }
  }, []);
}
