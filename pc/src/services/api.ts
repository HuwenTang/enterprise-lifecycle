import { Configuration, DefaultApi} from "@/services/apis";
import {Configuration as Configuration2,DefaultApi as DefaultApi2} from '@/services/apis2'
import {SystemApiApi} from "@/services/apis/apis/SystemApiApi";
import {PrimeApiApi} from "@/services/apis/apis/PrimeApiApi";

export const systemApi = new SystemApiApi(new Configuration({basePath: '/system-api'}));
export const primeApi = new PrimeApiApi(new Configuration({basePath: '/prime-api'}));

// TODO
export const systemApi2 = new DefaultApi2(new Configuration2({basePath: '/system-api'}));
