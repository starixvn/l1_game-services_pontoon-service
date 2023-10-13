import mongoose from "mongoose";
import roundQuery from "sc-game-base/src/core/query-apis/round-query";
import gameSettings from "../../game-settings";
import PontoonGameData from "../../pontoon-game-data";
import PontoonGameDefinition from "../../pontoon-game-definition";
import InGameConsumer from "../ingame-consumer";

jest.mock("sc-game-base/src/core/query-apis/round-query");
const getBalance = jest.fn();

/** @type {PontoonGameDefinition}*/
let definition = null;
/** @type {PontoonGameData}*/
let gameData = null;

const userInfosExecMockFunc = jest.fn();
/** @type {mongoose.Model}*/
const userInfosRepository = {
    findOne: () => ({
        lean: () => ({
            exec: userInfosExecMockFunc,
        }),
    }),
};

/** @type {UserDouInGameConsumerbleConsumer}*/
let consumer = null;

const realPlayer = {
    UID: 1,
    profile: {
        name: "player",
    },
    socketClient: {
        emit: jest.fn(),
    },
    session: {
        currencyGroupId: "g1",
    },
};

const user = {
    id: 1,
    red: 5000,
    avatarId: 1,
    type: false,
};

userInfosExecMockFunc.mockReturnValue(user);

beforeEach(() => {
    definition = new PontoonGameDefinition(gameSettings);
    gameData = new PontoonGameData(gameSettings.durations.wholeRound);
    gameData.gameConfigs = {
        enabled: true,
        enableFreeBet: false,
        odds: {
            regular: 2,
            pontoon: 2.5,
        },
        choices_maxbet: null,
    };
    gameData.currencyGroupGames = [
        {
            groupId: "g1",
            minBet: 1,
            maxBet: 3000,
        },
    ];

    consumer = new InGameConsumer(definition, gameData, roundQuery, null, getBalance, userInfosRepository);
});

describe("test ingame consumer", () => {
    it("should store player into gamedata & publish to user via socket correctly", async () => {
        await consumer.consume(realPlayer);
        const expectedPlayer = {
            name: realPlayer.profile.name,
            ...user,
        };

        const expectedPayload = {
            user,
            ownBets: {},
            gameConfigs: {
                ...gameData.currencyGroupGames[0],
                enableFreeBet: gameData.gameConfigs.enableFreeBet,
                odds: gameData.gameConfigs.odds,
            },
        };
        expect(gameData.players[realPlayer.UID]).toEqual(expectedPlayer);
        expect(realPlayer.socketClient.emit).toHaveBeenCalledWith(definition.name, expectedPayload);
    });
});
