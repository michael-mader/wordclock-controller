import * as cron from 'node-cron';
import Mod from './Mod';

export default class RainbowMinutes extends Mod {
  protected colors: string[] = [];

  constructor() {
    super();

    this.colors = ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#00FFFF'];

    this.tasks.push(cron.schedule('0 * * * * *', () => {
      this.rainbow();
    }, {
      scheduled: false,
    }));
  }

  rainbow() {
    const idx = new Date().getMinutes() % 5;
        this.controller!.setColor(this.colors[idx]);
  }

  onEnabled() {
    this.rainbow();
  }
}
