import chroma from 'chroma-js';
import fritzboxjs from 'fritzbox.js';
import { debug as debugFactory } from 'debug';
import config from '../../config';
import Mod from './Mod';

const debug = debugFactory('Callmonitor');

export default class Callmonitor extends Mod {
  protected colors: string[] = [];

  protected idx = 0;

  protected monitor: typeof fritzboxjs.Callmonitor | null = null;

  protected flashUntil = 0;

  constructor() {
    super();

    this.colors = chroma
      .scale(config.callmonitor.colors)
      .colors(config.callmonitor.stops);

    this.onInbound = this.onInbound.bind(this);
  }

  enable(): Mod {
    try {
      this.monitor = new fritzboxjs.CallMonitor(config.callmonitor.fboptions);
      this.monitor.on('inbound', this.onInbound);
    } catch (e) {
      debug(`Error creating fritzbox CallMonitor: ${e}`);
    }
    return this;
  }

  disable(): Mod {
    if (this.monitor) {
      this.monitor.off('inbound', this.onInbound);
      this.monitor = null;
    }
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onInbound(call: any) {
    console.log('Call incoming');
    console.log(call);
    this.flashUntil = new Date().getTime() + 10000;
    this.flash();
  }

  flash() {
    this.idx = (this.idx + 1) % this.colors.length;
    this.controller.setColor(this.colors[this.idx]);
    const now = new Date().getTime();
    if (now < this.flashUntil) {
      setTimeout(() => {
        this.flash();
      }, 2000);
    }
  }
}
