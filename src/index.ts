import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { getGameStatus } from "prodigy-api";
import { writeFile } from "fs/promises";
import path from "path";

dotenv.config();

type Patches = [string | RegExp, string][];

const getGameFile = async (version: string) => (await fetch(`https://code.prodigygame.com/code/${version}/game.min.js?v=${version}`)).text();
const getGameVersion = async () => (await getGameStatus()).gameClientVersion;

const main = async () => {
	const version = await getGameVersion();
	const gameFile = await getGameFile(version);

	const variables = [gameFile.match(/window,function\((.)/)![1], gameFile.match(/var (.)={}/)![1]] as string[];

	const patches: Patches = [
		[
			/s\),this\._game=(.)/,
			`s),this._game=$1;window.priorLodash = window._;Object.defineProperty(window.priorLodash, "game", {get: () => this._game, enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, "instance", {get: () => ${variables![0]}.instance, enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, "player", {get: () => window._.${gameFile.match(/instance.prodigy.gameContainer.get\("...-...."\).player/)?.[0]}, enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, "gameData", {get: () => ${variables![0]}.instance.game.state.states.get("Boot")._gameData, enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, "localizer", {get: () => ${variables![0]}.instance.prodigy.gameContainer.get("LocalizationService"), enumerable: true, configurable: true});Object.defineProperty(window.priorLodash, "network", {get: () => window._.player.game.input.onDown._bindings[0].context, enumerable: true, configurable: true});setInterval(() => {if(window.priorLodash!==window._){window._=priorLodash;}}, 100);`
		],
		[
			/(.)\.constants=Object/,
			"window.priorLodash = window.priorLodash || window._,window.priorLodash.constants=$1,$1.constants=Object"
		]
	];

	const patchingMethod = eval(process.env.CODE as string); // Prodigy PNP Won't Be Able To Steal This
	const patchedGameFile = patchingMethod(patches.reduce((gameFile, [regex, patch]) => gameFile.replace(regex, patch), gameFile));

	await writeFile(path.join(path.dirname("."), "game-files", `game-${version}.js`), patchedGameFile);
	await writeFile(path.join(path.dirname("."), "game-files", "current.js"), patchedGameFile);
};

main();
