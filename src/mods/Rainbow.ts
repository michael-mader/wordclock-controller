import Mod from "./Mod";
import * as cron from 'node-cron';
import Controller from "../Controller";
import config from "../../config";
import chroma, { InterpolationMode } from 'chroma-js';

export default class Rainbow extends Mod {
    protected colors: string[] = [];
    protected idx = 0;

    constructor() {
        super();

        this.colors = chroma.scale(config.rainbow.colors).mode(config.rainbow.mode as InterpolationMode).colors(config.rainbow.stops);

        this.tasks.push(cron.schedule(`*/${config.rainbow.interval} * * * * *`, () => {
            this.rainbow();
        }, {
            scheduled: false,
        }));
    }

    rainbow() {
        this.idx = this.idx + 1 % this.colors.length;
        this.controller!.setColor(this.colors[this.idx]);
    }

    onEnabled() {
        this.rainbow();
    }
}