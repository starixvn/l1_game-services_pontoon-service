import { logger } from "sc-common";
import BaseEventPublishers from "sc-game-base/src/core/event-publishers/base-event-publisher";
import TableHttpRouter from "sc-game-base/src/table/routers/table-http-router";
import PontoonGameData from "../../src/pontoon-game-data";
import HttpRouter from "../../src/routers/http-router";

jest.mock("sc-base-database");
jest.mock("sc-common");

const publisher = new BaseEventPublishers();
const gameNotificationsRepository = {
    deleteOne: jest.fn(),
};

describe("HttpRouter", () => {
    const app = {
        get: jest.fn(),
        post: jest.fn(),
        calledPost: false,
    };
    const appConfigs = {
        apiSettings: {
            authUrl: "http://localhost",
        },
        authenticateSettings: {
            audiences: [],
        },
    };
    const logService = {};
    const gameData = new PontoonGameData();
    const historyQuery = {};
    const metricQuery = {};

    let router;
    beforeEach(() => {
        // Arrange
        jest.clearAllMocks();

        router = new HttpRouter(appConfigs, gameData, historyQuery, metricQuery, logService);
    });
    it("should inherit TableHttpRouter", () => {
        // Assert
        expect(router instanceof TableHttpRouter);
    });

    describe("init", () => {
        it("should run correct", () => {
            // Arrange
            app.calledPost = false;
            TableHttpRouter.prototype.init = jest.fn();
            router.handleVoidTicket = jest.fn();
            // Act
            router.init(app);

            // Assert
            expect(TableHttpRouter.prototype.init).toHaveBeenCalledWith(app);
        });
    });

    describe("handleVoidTicket", () => {
        it("should run correctly when player is valid", async () => {
            // Arrange
            const realPlayer = { UID: "abc", profile: { name: "a" } };
            const gameData = {
                ingame: { [realPlayer.profile.name]: {} },
                gameConfigs: { odds: {} },
                realPlayers: { 1: realPlayer },
            };
            const definition = { settle: jest.fn() };
            const router = new HttpRouter(null, gameData, null, null, null, null, definition, publisher, gameNotificationsRepository);
            const res = { send: jest.fn() };
            const req = {
                body: {
                    UserIdentify: "abc",
                    Name: "a",
                },
            };

            publisher.publishToUser = jest.fn();
            //Act
            await router.handleVoidTicket(req, res);

            // Assert
            expect(router.gameData.ingame).toStrictEqual({});
            expect(gameNotificationsRepository.deleteOne).toHaveBeenCalled();
            expect(logger.logError).toHaveBeenCalledWith(`Void running ticket from api call for ${JSON.stringify("a")}`);
            expect(publisher.publishToUser).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(true);
        });

        it("should run incorrectly when player is invalid", async () => {
            // Arrange
        });
    });

    describe("handleSetResult", () => {
        it("should store in gameData.settlementResultFromAdmin", async () => {
            //Arrange
            const res = { send: jest.fn() };
            const req = {
                body: {
                    name: "ceo",
                    dealer: [
                        { rank: "J", suit: 1 },
                        { rank: "A", suit: 1 },
                    ],
                    hands: [
                        {
                            pos: 1,
                            cards: [
                                { rank: "J", suit: 1 },
                                { rank: "A", suit: 1 },
                            ],
                        },
                        {
                            pos: 2,
                            cards: [
                                { rank: "2", suit: 1 },
                                { rank: "2", suit: 2 },
                                { rank: "5", suit: 1 },
                            ],
                        },
                        {
                            pos: 5,
                            cards: [
                                { rank: "2", suit: 2 },
                                { rank: "7", suit: 3 },
                            ],
                        },
                    ],
                },
            };

            //Act
            await router.handleSetResult(req, res);

            // Assert
            expect(gameData.settlementResultFromAdmin[req.body.name]).toStrictEqual(req.body);
            expect(res.send).toHaveBeenCalledWith(true);
        });
    });
});
