/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
const api = 'http://192.168.192.72:9091';
const api2 = 'http://192.168.192.1';
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    '/system-api/': {
      target: 'http://192.168.192.2' + ':9091',
      // target: 'http://192.168.192.1:9091',
      changeOrigin: true,
    },
    '/ythpt/': {
      // 要代理的地址
      // target: 'http://172.22.59.35',
      // target: 'http://192.168.192.1:9093',
      target: api2 + ':9093',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/tzzhjg/': {
      // 要代理的地址
      // target: 'http://172.22.59.35',
      // target: 'http://192.168.192.1:9098',
      target: api2 + ':9093',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/prime-api/': {
      // 要代理的地址
      // target: 'http://192.168.192.72:9092',
      target: 'http://192.168.192.1:9092',
      // target: api2+':9092',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      // ws:true
    },
    '/file/': {
      target: 'http://192.168.192.25:9000',
      changeOrigin: true,
      pathRewrite: (path: any) => path.replace(/^\/file/, '/house-repairing/file'),
      // headers: {
      //   Host: '192.168.192.25:9000',
      // }
    },
    '/tmp/': {
      target: api2 + ':9091/system-api/',
      // target: 'http://192.168.192.1:9090',
      changeOrigin: true,
    },
    '/openapi': {
      target: api2 + ':9093',
      // target: 'http://192.168.192.1:9093',
      changeOrigin: true,
    },
    '/zsxt-api/': {
      target: api2 + ':9094',
      changeOrigin: true,
    },
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
