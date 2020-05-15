import Mod from './Mod'
import * as cron from 'node-cron';
import config from '../../config';

export default class Brightness extends Mod {

    constructor() {
        super();

        // dim at 21:00:02
        this.tasks.push(cron.schedule('2 0 21 * * *', () => {
            this.controller!.setBrightness(config.brigthness.evening);
        }, {
            scheduled: false,
        }));

        // dim even more at 00:00:02
        this.tasks.push(cron.schedule('2 0 0 * * *', () => {
            this.controller!.setBrightness(config.brigthness.night);
        }, {
            scheduled: false,
        }));

        // full brigthness at 6:30:02
        this.tasks.push(cron.schedule('2 30 6 * * *', () => {
            this.controller!.setBrightness(config.brigthness.day);
        }, {
            scheduled: false,
        }));
    }

    onEnabled() {
        const now = new Date();
        if(now.getHours() >= 21) {
            this.controller!.setBrightness(config.brigthness.evening);
        }else if(now.getHours() > 6 || (now.getHours() === 6 && now.getMinutes() >= 30)) {
            this.controller!.setBrightness(config.brigthness.day);
        }else{
            this.controller!.setBrightness(config.brigthness.night);
        }
    }
}