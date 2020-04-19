import Controller from './src/Controller';
import Brightness from './src/mods/Brightness';
import Rainbow from './src/mods/Rainbow';
import RainbowHour from './src/mods/RainbowHour';
import RainbowMinutes from './src/mods/RainbowMinutes';

const mods = {
    brightness: new Brightness(),
    rainbow: new Rainbow(),
    rainbowHour: new RainbowHour(),
    rainbowMinutes: new RainbowMinutes(),
}

const controller = new Controller([
    mods.brightness,
    mods.rainbowHour,
]);
controller.init();

