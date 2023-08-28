import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { generateResult, settle } from "./helpers/dealer";
import PontoonContainerRegistry from "./pontoon-container-registry";
import PontoonGameData from "./pontoon-game-data";
import PontoonGameDefinition from "./pontoon-game-definition";

const run = async () => {
    const gameData = new PontoonGameData(gameSettings.durations.wholeRound);

    const definition = new PontoonGameDefinition(gameSettings, generateResult, settle, gameSettings.actions, gameSettings.payouts);

    const container = new PontoonContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(definition.name, appConfigs);

    await app.run();
    await app.startGame(container);
};

run();
