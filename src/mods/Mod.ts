import Controller from "../Controller";
import * as cron from 'node-cron';

export default class Mod {
    protected tasks: cron.ScheduledTask[] = [];
    protected controller?: Controller;

    setController(controller: Controller): Mod {
        this.controller = controller;

        return this;
    }

    protected onEnabled() {}

    enable(): Mod {
        if(!this.controller) {
            throw new Error('controller not set');
        }
        this.tasks.forEach(task => {
            task.start();
        });

        this.onEnabled();

        return this;
    }

    disable(): Mod {
        this.tasks.forEach(task => {
            task.stop();
        });

         return this;
    }
}