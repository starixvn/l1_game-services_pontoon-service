import { logger } from "sc-common";
import { Core } from "sc-game-base";

import PontoonGameData from "../pontoon-game-data";
import PontoonGameDefinition from "../pontoon-game-definition";

export default class PontoonSocketRouter extends Core.Routers.BaseSocketRouter {
    /**
     * @param {PontoonGameDefinition} definition
     * @param {PontoonGameData} gameData
     */
    constructor({
        definition,
        gameData,
        userSignInConsumer,
        inGameConsumer,
        placeBetConsumer,
        userDisconnectConsumer,
        userSignInPublisher,
        historyQuery,
        logService,
        userStandConsumer,
        userHitConsumer,
        userDoubleConsumer,
        userSplitConsumer,
        userDealConsumer,
        playGamePermissionValidator
    }) {
        super({
            definition,
            gameData,
            userSignInConsumer,
            inGameConsumer,
            placeBetConsumer,
            userDisconnectConsumer,
            userSignInPublisher,
            historyQuery,
            logService,
            playGamePermissionValidator
        });

        this.userStandConsumer = userStandConsumer;
        this.userHitConsumer = userHitConsumer;
        this.userDoubleConsumer = userDoubleConsumer;
        this.userSplitConsumer = userSplitConsumer;
        this.userDealConsumer = userDealConsumer;
    }

    async handlePlaceBet(payload) {
        try {
            if (!this.verify()) {
                return;
            }

            if (payload.deal) {
                await this.userDealConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
                return;
            }

            if (payload.hit) {
                await this.userHitConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
                return;
            }

            if (payload.stand) {
                await this.userStandConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
                return;
            }

            if (payload.split) {
                await this.userSplitConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
                return;
            }

            if (payload.double) {
                await this.userDoubleConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
                return;
            }
        } catch (error) {
            logger.logError(error);
        }
    }
}
