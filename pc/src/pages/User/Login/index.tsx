import JsSha from 'jssha/dist/sha1';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { useModel, Helmet } from '@umijs/max';
import { Alert, message, Spin, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import { systemApi } from '@/services/api';
import { LoginDto, LoginDtoEndpointEnum } from '@/services/apis';
import { isLanxin } from '@/utils/uaUtil';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      scrollbarWidth: 'none',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const ActionIcons = () => {
  // const { styles } = useStyles();
  return (
    <>
      {/*<AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />*/}
      {/*<TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />*/}
      {/*<WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />*/}
    </>
  );
};
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const [spinLoading, setSpinLoading] = useState(true);
  const { styles } = useStyles();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const doLogin = async (form: LoginDto) => {
    try {
      const msg = await systemApi.login({ loginDto: form });
      console.log(msg);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      if(localStorage.getItem('code1')){
        location.replace('/tutorial');
        refresh();
        localStorage.removeItem('code1');
      }else {
        location.replace(urlParams.get('redirect') || '/');
        refresh();
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const getLoginCode = () =>
    new Promise((resolve: (authCode: string) => void, reject) => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code')||localStorage.getItem('code1');
      console.log('getLoginCode', code);
      if (code !== null && code !== '') {
        resolve(code);
        return;
      }
      if (isLanxin()) {
        console.log('lanxin')
        const lx = (window as any).lx;
        if (lx?.biz?.getAuthCode) {
          lx.biz.getAuthCode({
            appId: '1572864-14778368',
            success: (res: { authCode: string }) => {
              resolve(res.authCode);
              console.log('lanxinSuccess', res.authCode);
            },
            fail: (e: any) => reject(e),
          });
        } else {
          reject();
        }
      } else {
        reject();
      }
    });
  const codeLogin = async () => {
    try {
      const code = await getLoginCode();
      await doLogin({
        origin: 'taizhengtong',
        endpoint: LoginDtoEndpointEnum.Pc,
        code: code,
      });
    } finally {
      setSpinLoading(false);
    }
  };
  const passwordLogin = async (values: API.LoginParams) => {
    await doLogin({
      origin: 'password',
      endpoint: LoginDtoEndpointEnum.Pc,
      mobile: values.username,
      password: new JsSha('SHA-1', 'TEXT').update(values.password!).getHash('B64'),
    });
  };
  const { status, type: loginType } = userLoginState;

  useEffect(() => {
    console.debug(window.location.href);
    codeLogin().then();
  }, []);
  return (
    <Spin spinning={spinLoading} tip="登录中">
      <div className={styles.container}>
        <Helmet>
          <title>
            {'登录'}- {Settings.title}
          </title>
        </Helmet>
        <div
          style={{
            flex: '1',
            padding: '32px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            // logo={<img alt="logo" src="/logo.svg" />}
            title="企业全生命周期"
            // subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
            initialValues={{
              autoLogin: true,
            }}
            actions={[
              // <FormattedMessage
              //   key="loginWith"
              //   id="pages.login.loginWith"
              //   defaultMessage="其他登录方式"
              // />,
              <ActionIcons key="icons"/>,
            ]}
            onFinish={async (values) => {
              await passwordLogin(values as API.LoginParams);
            }}
          >
            <Tabs
              activeKey={type}
              onChange={setType}
              centered
              items={[
                {
                  key: 'account',
                  label: '账户密码登录',
                },
                {
                  key: 'mobile',
                  disabled: true,
                  label: '手机号登录',
                },
              ]}
            />

            {status === 'error' && loginType === 'account' && (
              <LoginMessage content={'错误的用户名和密码'}/>
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined/>,
                  }}
                  placeholder={'用户名 '}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined/>,
                  }}
                  placeholder={'密码 '}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误"/>}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined/>,
                  }}
                  name="mobile"
                  placeholder={'请输入手机号！'}
                  rules={[
                    {
                      required: true,
                      message: '手机号是必填项！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '不合法的手机号！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined/>,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={'请输入验证码！'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'秒后重新获取'}`;
                    }
                    return '获取验证码';
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '验证码是必填项！',
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    const result = await getFakeCaptcha({
                      phone,
                    });
                    if (!result) {
                      return;
                    }
                    message.success('获取验证码成功！验证码为：1234');
                  }}
                />
              </>
            )}
            {/*<div*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <ProFormCheckbox noStyle name="autoLogin">*/}
            {/*    <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />*/}
            {/*  </ProFormCheckbox>*/}
            {/*  <a*/}
            {/*    style={{*/}
            {/*      float: 'right',*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />*/}
            {/*  </a>*/}
            {/*</div>*/}
          </LoginForm>
        </div>
        <div style={{
          position: 'fixed',           // 改为 fixed，固定在视口
          bottom: 0,                   // 距离视口底部 0
          left: 0,                     // 贴住左边
          right: 0,                    // 贴住右边，使宽度占满
          zIndex: 1000,               // 确保在上方
          textAlign: 'center',
          padding: '10px',
          fontSize: '12px',
          background: '#255aec',
          color: '#fff',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        }}>主办单位：泰州市数据局
          技术支持：泰州市数据产业集团有限公司
          企业全生命平台账号开通及操作咨询：周洁（19952951525）；周一凡（15996060181）。
          数字化招商模块操作咨询：钱忠伟（17351649583）。
        </div>
        {/*<Footer />*/}
      </div>
    </Spin>
  );
};
export default Login;
