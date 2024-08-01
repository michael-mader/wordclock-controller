import * as cron from 'node-cron';
import Controller from '../Controller';

export default class Mod {
  protected tasks: cron.ScheduledTask[] = [];

  protected controller!: Controller;

  setController(controller: Controller): Mod {
    this.controller = controller;

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onEnabled() {}

  enable(): Mod {
    if (!this.controller) {
      throw new Error('controller not set');
    }
    this.tasks.forEach((task) => {
      task.start();
    });

    this.onEnabled();

    return this;
  }

  disable(): Mod {
    this.tasks.forEach((task) => {
      task.stop();
    });

    return this;
  }
}
