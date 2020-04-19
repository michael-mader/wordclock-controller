import Mod from "./Mod";
import * as cron from 'node-cron';
import config from "../../config";
import chroma, { InterpolationMode } from 'chroma-js';

export default class RainbowHour extends Mod {
    protected colors: string[] = [];

    constructor() {
        super();

        this.colors = chroma.scale(config.rainbow.colors).mode(config.rainbow.mode as InterpolationMode).colors(720);

        this.tasks.push(cron.schedule(`*/${config.rainbow.interval} * * * * *`, () => {
            this.rainbow();
        }, {
            scheduled: false,
        }));
    }

    rainbow() {
        const now = new Date();
        const seconds = now.getMinutes() * 60 + now.getSeconds();
        const idx = Math.round(seconds / 5) % this.colors.length;
        this.controller!.setColor(this.colors[idx]);
    }

    onEnabled() {
        this.rainbow();
    }
}