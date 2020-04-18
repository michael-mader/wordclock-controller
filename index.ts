import chroma from 'chroma-js';
import { color, singleColorMode, brightness } from './wordclock';
import * as cron from 'node-cron';

const rainbowColors = chroma.scale(['#f00', '#0f0', '#00f', '#f00']).mode('hsl').colors(360);

let rIdx = 0;
const rainbow = () => {
    color(rainbowColors[rIdx++ % rainbowColors.length]);
    setTimeout(() => {
        rainbow();
    }, 5000);
}

const main = async () => {
    await singleColorMode();

    if (process.argv && process.argv[process.argv.length - 1]) {
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
    brightness(70);
});

// dim even more at 00:00
cron.schedule('0 0 * * *', () => {
    brightness(30);
});

// full brigthness at 8:00
cron.schedule('0 8 * * *', () => {
    brightness(100);
});