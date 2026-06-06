import {Configuration, DefaultApi, PrimeApiApi} from "./apis";

export const systemApi = new DefaultApi(new Configuration({basePath: '/system-api'}));
export const primeApi = new DefaultApi(new Configuration({basePath: '/prime-api'}));
/** 与 prime 同网关，含 `/public/pre-evaluation/*` 等 OpenAPI 生成方法 */
export const primeOpenApi = new PrimeApiApi(new Configuration({basePath: '/prime-api'}));


