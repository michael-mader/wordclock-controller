import axios from 'axios';
import chroma from 'chroma-js';

const client = axios.create({
    baseURL: 'http://192.168.0.30/',
    timeout: 1000,
});

const api = (path: string, params = {}) => {
    return client.get(path, {
        params,
    }).catch((err) => {
        console.error(err.message);
    });
};

export const color = (color: string) => {
    const rgb = chroma(color).rgb();
    return api('color', {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
    });
};

export const singleColorMode = () => {
    return api('einfarbig');
};

export const fadeMode = () => {
    return api('fade');
};

export const brightness = (b: number) => {
    return api('brightness', {
        brightness: b,
    });
};

export const regionalMode = (enabled: boolean) => {
    return api('region', {
        toggle: enabled ? 'on' : 'off',
    });
};