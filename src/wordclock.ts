/* eslint-disable no-await-in-loop */
import axios, { AxiosResponse } from 'axios';
import chroma from 'chroma-js';
import { debug as debugFactory } from 'debug';
import config from '../config';

export type Mode = 'fade' | 'singleColor';

type Work = {
  request: () => Promise<any>;
  // eslint-disable-next-line no-unused-vars
  resolve: (_: any) => any;
  // eslint-disable-next-line no-unused-vars
  reject: (_: any) => any;
};

const debug = debugFactory('wordclock');

const client = axios.create({
  baseURL: config.host,
  timeout: 1000,
});

const queue: Work[] = [];
// eslint-disable-next-line no-unused-vars
let queueStopSleep: (_?: any) => void = () => {};

const addToQueue = async ({ request, resolve, reject }: Work) => {
  queue.push({
    request,
    resolve,
    reject,
  });

  queueStopSleep();
};

const workQueue = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (queue.length > 0) {
      const work = queue.shift();
      await work?.request().then(work?.resolve).catch(work?.reject);
      await new Promise((resolve) => {
        setTimeout(resolve, config.cooldown);
      });
    } else {
      // eslint-disable-next-line no-loop-func
      const p = new Promise((resolve) => {
        queueStopSleep = resolve;
      });
      await p;
    }
  }
};

const api = (path: string, params = {}):
  Promise<void | AxiosResponse<any>> => new Promise((resolve, reject) => {
  addToQueue({
    request: () => {
      debug(`api call ${path} with ${JSON.stringify(params)}`);
      return client
        .get(path, {
          params,
        })
        .catch((err) => {
          debug(err.message);
        });
    },
    resolve,
    reject,
  });
});

export const status = async () => {
  const res: AxiosResponse<any> = (await api('')) as AxiosResponse<any>;
  const body: string = res.data ?? '';
  const brightnessMatches = body.match(/brightnessSelected = ([0-9]+);/);
  return {
    color: '',
    brightness: brightnessMatches ? parseInt(brightnessMatches[1], 10) : 100,
    region: body.indexOf('regionSelected = true;') !== -1,
    mode: (body.indexOf('fadeSelected = true;') !== -1
      ? 'fade'
      : 'singleColor') as Mode,
  };
};

export const color = (newColor: string) => {
  const rgb = chroma(newColor).rgb();
  return api('color', {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
  });
};

export const singleColorMode = () => api('einfarbig');

export const fadeMode = () => api('fade');

export const brightness = (b: number) => api('brightness', {
  brightness: b,
});

export const regionalMode = (enabled: boolean) => api('region', {
  toggle: enabled ? 'on' : 'off',
});

workQueue();
