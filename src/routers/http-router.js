import { logger, utils } from "sc-common";
import TableHttpRouter from "sc-game-base/src/table/routers/table-http-router";

export default class HttpRouter extends TableHttpRouter {
    constructor(
        appConfigs,
        gameData,
        historyQuery,
        userSessionsRepository,
        metricQuery,
        logService,
        definition,
        publisher,
        gameNotificationsRepository
    ) {
        super(appConfigs, gameData, historyQuery, userSessionsRepository, metricQuery, logService);

        this.definition = definition;
        this.publisher = publisher;
        this.gameNotificationsRepository = gameNotificationsRepository;
    }
    init(app) {
        super.init(app);

        app.post(
            "/api/void-ticket",
            utils.authentication.useAuthenticate({
                authUrl: this.appConfigs.apiSettings.authUrl,
                audiences: this.appConfigs.authenticateSettings.audiences,
            }),
            (_req, res) => this.handleVoidTicket(_req, res)
        );

        if (!this.appConfigs.disableSetResult) {
            app.post(
                "/api/set-result",
                utils.authentication.useAuthenticate({
                    authUrl: this.appConfigs.apiSettings.authUrl,
                    audiences: this.appConfigs.authenticateSettings.audiences,
                }),
                (_req, res) => this.handleSetResult(_req, res)
            );
        }
    }

    async handleVoidTicket(req, res) {
        try {
            const { Name, UserIdentify } = req?.body || {};
            if (!Name) {
                logger.logError("Player not found");
                res.send(false);
                return;
            }

            delete this.gameData.ingame[Name];
            await this.gameNotificationsRepository.deleteOne({ uid: UserIdentify, gameId: this.definition.id });
            logger.logError(`Void running ticket from api call for ${JSON.stringify(Name)}`);
            this.publisher.publishToUser(UserIdentify, { toLobby: true });
            res.send(true);
        } catch (error) {
            logger.logError(error);
            res.send(false);
        }
    }

    handleSetResult(req, res) {
        this.gameData.settlementResultFromAdmin[req.body.name] = req.body;
        logger.logError(`Set result from api: ${JSON.stringify(this.gameData.settlementResultFromAdmin[req.body.name])}`);
        res.send(true);
    }
}
