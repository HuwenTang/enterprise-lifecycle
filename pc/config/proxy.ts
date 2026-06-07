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
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    '/system-api/': {
      target: 'http://localhost:9091',
      // target: 'http://localhost:9091',
      changeOrigin: true,
    },
    '/ythpt/': {
      // 要代理的地址
      // target: 'http://localhost:9093',
      target: 'http://localhost:9093',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/tzzhjg/': {
      // 要代理的地址
      // target: 'http://localhost:9093',
      target: 'http://localhost:9093',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/prime-api/': {
      // 要代理的地址
      // target: 'http://localhost:9092',
      target: 'http://localhost:9092',
      // target: 'http://localhost:9092',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      // ws:true
    },
    '/file/': {
      target: 'http://localhost:9000',
      changeOrigin: true,
      pathRewrite: (path: any) => path.replace(/^\/file/, '/house-repairing/file'),
      // headers: {
      //   Host: 'localhost:9000',
      // }
    },
    '/tmp/': {
      target: 'http://localhost:9091/system-api/',
      // target: 'http://localhost:9091',
      changeOrigin: true,
    },
    '/openapi': {
      target: 'http://localhost:9093',
      // target: 'http://localhost:9093',
      changeOrigin: true,
    },
    '/zsxt-api/': {
      target: 'http://localhost:9094',
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
