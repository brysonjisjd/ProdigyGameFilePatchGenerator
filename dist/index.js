var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { getGameStatus } from "prodigy-api";
import { writeFile } from "fs/promises";
import path from "path";
dotenv.config();
var getGameFile = function (version) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, fetch("https://code.prodigygame.com/code/".concat(version, "/game.min.js?v=").concat(version))];
        case 1: return [2 /*return*/, (_a.sent()).text()];
    }
}); }); };
var getGameVersion = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, getGameStatus()];
        case 1: return [2 /*return*/, (_a.sent()).gameClientVersion];
    }
}); }); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var version, gameFile, variables, patches, patchingMethod, patchedGameFile;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getGameVersion()];
            case 1:
                version = _b.sent();
                return [4 /*yield*/, getGameFile(version)];
            case 2:
                gameFile = _b.sent();
                variables = [gameFile.match(/window,function\((.)/)[1], gameFile.match(/var (.)={}/)[1]];
                patches = [
                    [
                        /s\),this\._game=(.)/,
                        "s),this._game=$1;window.priorLodash = window._;Object.defineProperty(window.priorLodash, \"game\", {get: () => this._game, enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, \"instance\", {get: () => ".concat(variables[0], ".instance, enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, \"player\", {get: () => window._.").concat((_a = gameFile.match(/instance.prodigy.gameContainer.get\("...-...."\).player/)) === null || _a === void 0 ? void 0 : _a[0], ", enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, \"gameData\", {get: () => ").concat(variables[0], ".instance.game.state.states.get(\"Boot\")._gameData, enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, \"localizer\", {get: () => ").concat(variables[0], ".instance.prodigy.gameContainer.get(\"LocalizationService\"), enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, \"network\", {get: () => window._.player.game.input.onDown._bindings[0].context, enumerable: true, configurable: true});setInterval(() => {if(window.priorLodash!==window._){window._=priorLodash;}}, 100);")
                    ],
                    [
                        /(.)\.constants=Object/,
                        "window.priorLodash = window.priorLodash || window._,window.priorLodash.constants=$1,$1.constants=Object"
                    ]
                ];
                patchingMethod = eval(process.env.CODE);
                patchedGameFile = patchingMethod(patches.reduce(function (gameFile, _a) {
                    var regex = _a[0], patch = _a[1];
                    return gameFile.replace(regex, patch);
                }, gameFile));
                return [4 /*yield*/, writeFile(path.join(path.dirname("."), "game-files", "game-".concat(version, ".js")), patchedGameFile)];
            case 3:
                _b.sent();
                return [4 /*yield*/, writeFile(path.join(path.dirname("."), "game-files", "current.js"), patchedGameFile)];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
main();
