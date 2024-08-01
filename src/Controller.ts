import {
  color, brightness, Mode, fadeMode, singleColorMode, regionalMode,
} from './wordclock';
import Mod from './mods/Mod';

export default class Controller {
  protected color = 'red';

  protected brightness = 100;

  protected region = true;

  protected mode: Mode = 'singleColor';

  protected mods: Mod[] = [];

  constructor(mods: Mod[] = []) {
    this.mods = mods;
  }

  async init() {
    // const currentValues = await status();
    /// /this.color = currentValues.color;
    // this.brightness = currentValues.brightness;
    // this.region = currentValues.region;
    // this.mode = currentValues.mode;

    this.mods.forEach((mod) => mod.setController(this).enable());
  }

  addMod(mod: Mod) {
    this.mods.push(mod);
    mod.enable();
  }

  removeMod(mod: Mod) {
    mod.disable();
    const idx = this.mods.indexOf(mod);
    if (idx >= 0) {
      this.mods.splice(idx, 1);
    }
  }

  setColor(newColor: string) {
    this.color = newColor;
    color(newColor);
  }

  setBrightness(newBrightness: number) {
    this.brightness = newBrightness;
    brightness(newBrightness);
  }

  setMode(newMode: Mode) {
    this.mode = newMode;
    switch (newMode) {
      case 'fade':
        fadeMode();
        break;
      case 'singleColor':
        singleColorMode();
        break;
      default:
        throw new Error(`invalid mode ${newMode}`);
    }
  }

  setRegion(newRegion: boolean) {
    this.region = newRegion;
    regionalMode(newRegion);
  }
}
