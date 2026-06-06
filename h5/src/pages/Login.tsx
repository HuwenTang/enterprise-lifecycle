import { useEffect } from "react";
import { Button, message, Spin } from "antd";
import { systemApi } from "../api.ts";
import { LoginDtoEndpointEnum } from "../apis";

export default function Login() {
    const getQueryParam = (param: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    const redirect = getQueryParam('redirect');
    const getCode = async (code: string) => {
        return await systemApi.login({
            loginDto: {
                endpoint: LoginDtoEndpointEnum.H5,
                origin: 'taizhengtong',
                code: code,
            }
        })
    }
    const pass = async (mobile: string) => {
        const data = await systemApi.login({
            loginDto: {
                endpoint: LoginDtoEndpointEnum.H5,
                origin: 'password',
                password: "lufssDYsgIgYvjIA+yf/7Mh8EiU=",
                mobile,
            }
        })
        localStorage.setItem('name', data.realName)
        localStorage.setItem('userid', data.userid)
        localStorage.setItem('role', JSON.stringify(data))
        const dept = data.organizations.map((item) => item.name)
        localStorage.setItem('dept', JSON.stringify(data.organizations))
        localStorage.setItem('org', JSON.stringify(dept))
        localStorage.removeItem('key')
        window.location.replace('/home')
    }

    useEffect(() => {
        lx.biz.getAuthCode({
            appId: "1572864-14778368",
            success: async function (res: { authCode: string }) {
                console.log(res)
                const data = await getCode(res.authCode)
                localStorage.setItem('name', data.realName)
                localStorage.setItem('userid', data.userid)
                const dept = data.organizations.map((item) => item.name)
                localStorage.setItem('dept', JSON.stringify(data.organizations))
                localStorage.setItem('org', JSON.stringify(dept))
                localStorage.setItem('role', JSON.stringify(data))
                localStorage.removeItem('key')
                if (redirect) {
                    window.location.href = redirect;
                } else {
                    window.location.replace('/home')
                }
                message.success('登录成功')
            },
            fail: function (err: unknown) {
                console.log(err)
            },
        });
    }, [redirect]);
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Spin style={{
                width: '100%',
                height: '100vh',
            }} tip=" 正在登录中." size="large">
            </Spin>
            {import.meta.env.MODE === 'development' && (
                <div>
                    <Button onClick={() => pass('18752511199')}> ztx </Button>
                    <Button onClick={() => pass('19826190920')}> jsy </Button>
                    <Button onClick={() => pass('18914409892')}> kzy </Button>
                    <Button onClick={() => pass('15996028316')}> spw </Button>
                    <Button onClick={() => pass('18994745779')}> zby </Button>
                </div>
            )}
        </div>
    )
}
