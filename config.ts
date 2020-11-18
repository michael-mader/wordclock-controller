export default {
  host: "http://192.168.0.30/",
  cooldown: 2000,
  rainbow: {
    colors: ["#fff", "#f00", "#0f0", "#00f", "#fff"],
    mode: "hsl",
    stops: 360,
    interval: 5,
  },
  callmonitor: {
    colors: ["#fff", "#f00"],
    stops: 2,
    fboptions: {
      server: "192.168.0.1",
      callmonitorport: "1012",
    },
  },
  brigthness: {
    day: 100,
    evening: 70,
    night: 30,
  },
};
