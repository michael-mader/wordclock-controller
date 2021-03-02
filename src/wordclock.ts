import axios, { AxiosResponse } from "axios";
import chroma from "chroma-js";
import config from "../config";
import { debug as debugFactory } from "debug";

export type Mode = "fade" | "singleColor";

type Work = {
  request: () => Promise<any>;
  resolve: (_: any) => any;
  reject: (_: any) => any;
};

const debug = debugFactory("wordclock");

const client = axios.create({
  baseURL: config.host,
  timeout: 1000,
});

const queue: Work[] = [];
let queueStopSleep: (_: any = null) => void = () => {};

const addToQueue = async ({ request, resolve, reject }: Work) => {
  queue.push({
    request,
    resolve,
    reject,
  });

  queueStopSleep();
};

const workQueue = async () => {
  while (true) {
    if (queue.length > 0) {
      const work = queue.shift();
      await work?.request().then(work?.resolve).catch(work?.reject);
      await new Promise((resolve) => {
        setTimeout(resolve, config.cooldown);
      });
    } else {
      const p = new Promise((resolve) => {
        queueStopSleep = resolve;
      });
      await p;
    }
  }
};

const api = (path: string, params = {}): Promise<void | AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
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
};

export const status = async () => {
  const res: AxiosResponse<any> = (await api("")) as AxiosResponse<any>;
  const body: string = res.data ?? "";
  const brightnessMatches = body.match(/brightnessSelected = ([0-9]+);/);
  const status = {
    color: "",
    brightness: brightnessMatches ? parseInt(brightnessMatches[1], 10) : 100,
    region: body.indexOf("regionSelected = true;") !== -1,
    mode: (body.indexOf("fadeSelected = true;") !== -1
      ? "fade"
      : "singleColor") as Mode,
  };

  return status;
};

export const color = (color: string) => {
  const rgb = chroma(color).rgb();
  return api("color", {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
  });
};

export const singleColorMode = () => {
  return api("einfarbig");
};

export const fadeMode = () => {
  return api("fade");
};

export const brightness = (b: number) => {
  return api("brightness", {
    brightness: b,
  });
};

export const regionalMode = (enabled: boolean) => {
  return api("region", {
    toggle: enabled ? "on" : "off",
  });
};

workQueue();
