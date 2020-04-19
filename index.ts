import chroma, { InterpolationMode } from 'chroma-js';
import { color, singleColorMode, brightness } from './wordclock';
import * as cron from 'node-cron';
import config from './config';

const rainbowColors = chroma.scale(config.rainbow.colors).mode(config.rainbow.mode as InterpolationMode).colors(config.rainbow.stops);

let rIdx = 0;
const rainbow = () => {
    rIdx = rIdx + 1 % rainbowColors.length;
    color(rainbowColors[rIdx]);
    setTimeout(() => {
        rainbow();
    }, config.rainbow.interval);
}

const main = async () => {
    if (process.argv && process.argv[process.argv.length - 1]) {
        await singleColorMode();
        rainbow();
    }
};


///////////////////////
// start
///////////////////////
main();

///////////////////////
// CRONS
///////////////////////

// dim at 21:00
cron.schedule('0 21 * * *', () => {
    brightness(config.brigthness.evening);
});

// dim even more at 00:00
cron.schedule('0 0 * * *', () => {
    brightness(config.brigthness.night);
});

// full brigthness at 6:30
cron.schedule('30 6 * * *', () => {
    brightness(config.brigthness.day);
});