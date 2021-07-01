import * as cron from 'node-cron';
import Mod from './Mod';
import config from '../../config';

export default class Brightness extends Mod {
  constructor() {
    super();

    // dim at 21:00:02 (try 3 times)
    this.tasks.push(cron.schedule('2,4,6 0 21 * * *', () => {
            this.controller!.setBrightness(config.brigthness.evening);
    }, {
      scheduled: false,
    }));

    // dim even more at 23:00:02 (try 3 times)
    this.tasks.push(cron.schedule('2,4,6 0 23 * * *', () => {
            this.controller!.setBrightness(config.brigthness.night);
    }, {
      scheduled: false,
    }));

    // moring brigthness at 6:30:02 (try 3 times)
    this.tasks.push(cron.schedule('2,4,6 30 6 * * *', () => {
            this.controller!.setBrightness(config.brigthness.morning);
    }, {
      scheduled: false,
    }));

    // full brigthness at 7:30:02 (try 3 times)
    this.tasks.push(cron.schedule('2,4,6 30 7 * * *', () => {
            this.controller!.setBrightness(config.brigthness.day);
    }, {
      scheduled: false,
    }));
  }

  onEnabled() {
    const now = new Date();
    if (now.getHours() >= 23) {
            this.controller!.setBrightness(config.brigthness.evening);
    } else if (now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() >= 30)) {
            this.controller!.setBrightness(config.brigthness.day);
    } else if (now.getHours() > 6 || (now.getHours() === 6 && now.getMinutes() >= 30)) {
            this.controller!.setBrightness(config.brigthness.morning);
    } else {
            this.controller!.setBrightness(config.brigthness.night);
    }
  }
}
