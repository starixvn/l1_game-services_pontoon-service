import awilix from "awilix";
import { Table } from "sc-game-base";
import {
    InGameConsumer,
    OutGameConsumer,
    UserDealConsumer,
    UserDoubleConsumer,
    UserHitConsumer,
    UserSplitConsumer,
    UserStandConsumer,
} from "./consumers";
import SettleGameConsumer from "./consumers/settle-game-consumer";
import GameCron from "./crons/game-cron";
import PontoonBot from "./crons/pontoon-bot";
import PontoonProcessBetQueue from "./crons/pontoon-process-bet-queue";

import { gameNotifications } from 'sc-base-database';
import { PontoonBets } from "./models/pontoon-bets";
import { PontoonRounds } from "./models/pontoon-rounds";
import RoundResultPublisher from "./publishers/round-result-publisher";
import HistoryQuery from "./query-apis/history-query";
import HttpRouter from "./routers/http-router";
import PontoonSocketRouter from "./routers/pontoon-socket-router";

const { asClass, asValue } = awilix;

export default class PontoonContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(PontoonRounds),
            betsRepository: asValue(PontoonBets),
            gameNotificationsRepository: asValue(gameNotifications),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            settleGameRoundConsumer: asClass(SettleGameConsumer).singleton().proxy(),
            userStandConsumer: asClass(UserStandConsumer).singleton(),
            userHitConsumer: asClass(UserHitConsumer).singleton(),
            userDoubleConsumer: asClass(UserDoubleConsumer).singleton(),
            userSplitConsumer: asClass(UserSplitConsumer).singleton(),
            userDealConsumer: asClass(UserDealConsumer).singleton(),
            inGameConsumer: asClass(InGameConsumer).singleton(),
            userDisconnectConsumer: asClass(OutGameConsumer).singleton(),
        });
    }

    registerPublishers() {
        super.registerPublishers();

        this.container.register({
            roundResultPublisher: asClass(RoundResultPublisher).singleton(),
        });
    }

    registerRouters() {
        super.registerRouters();

        this.container.register({
            socketRouter: asClass(PontoonSocketRouter).proxy(),
            httpRouter: asClass(HttpRouter),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            processBetQueue: asClass(PontoonProcessBetQueue).singleton().proxy(),
            gameCron: asClass(GameCron).singleton().proxy(),
            bot: asClass(PontoonBot).singleton(),
        });
    }

    registerApis() {
        super.registerApis();

        this.container.register({
            historyQuery: asClass(HistoryQuery).singleton(),
        });
    }
}
