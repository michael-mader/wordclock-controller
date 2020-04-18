"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var chroma_js_1 = __importDefault(require("chroma-js"));
var client = axios_1.default.create({
    baseURL: 'http://192.168.0.30/',
    timeout: 1000,
});
var api = function (path, params) {
    if (params === void 0) { params = {}; }
    return client.get(path, {
        params: params,
    }).catch(function (err) {
        console.error(err.message);
    });
};
exports.color = function (color) {
    var rgb = chroma_js_1.default(color).rgb();
    return api('color', {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
    });
};
exports.singleColorMode = function () {
    return api('einfarbig');
};
exports.fadeMode = function () {
    return api('fade');
};
exports.brightness = function (b) {
    return api('brightness', {
        brightness: b,
    });
};
exports.regionalMode = function (enabled) {
    return api('region', {
        toggle: enabled ? 'on' : 'off',
    });
};
