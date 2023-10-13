import gameSettings from "../../game-settings";
import PontoonGameData from "../../pontoon-game-data";
import PontoonGameDefinition from "../../pontoon-game-definition";
import OutGameConsumer from "../outgame-consumer";
jest.useFakeTimers();

jest.mock("sc-base-database", () => ({
    gameNotifications: {
        updateOne: () => ({
            exec: jest.fn(),
        }),
    },
}));

/** @type {PontoonGameDefinition}*/
let definition = null;
/** @type {PontoonGameData}*/
let gameData = null;

/** @type {UserDouInGameConsumerbleConsumer}*/
let consumer = null;

const realPlayer = {
    UID: 1,
    profile: {
        name: "player",
    },
    socketClient: {
        id: 123,
        emit: jest.fn(),
    },
};

beforeEach(() => {
    definition = new PontoonGameDefinition(gameSettings);
    gameData = new PontoonGameData(gameSettings.durations.wholeRound);
    gameData.gameConfigs = {
        enabled: true,
        minbet: 1,
        maxbet: 3000,
        enableFreeBet: false,
        odds: {
            regular: 2,
            pontoon: 2.5,
        },
        choices_maxbet: null,
    };

    consumer = new OutGameConsumer(definition, gameData, null);
});

describe("test outgame consumer", () => {
    it("should save running round to database, clear the game data", async () => {
        gameData.realPlayers[realPlayer.socketClient.id] = realPlayer;
        gameData.players[realPlayer.UID] = {
            id: realPlayer.UID,
            name: realPlayer.profile.name,
        };
        gameData.ingame[realPlayer.profile.name] = {
            betTracks: {
                roundId: 100,
                roundStartTime: new Date(),
            },
        };

        await consumer.consume(realPlayer.socketClient);
        jest.runAllTimers();
        
        expect(gameData.players[realPlayer.UID]).toBeUndefined();
        expect(gameData.realPlayers[realPlayer.socketClient.id]).toBeUndefined();
    });
});
