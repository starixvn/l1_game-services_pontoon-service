import constants from "./../constants";
import gameSettings from "./../game-settings";
import { calculate, calculateFinalValue, isBust, isFiveCardTrick, isPontoon } from "./card-helper";

import { Engine, Rule } from "json-rules-engine";

export const generateResult = (dealerCards, decks, isUpCard, preGeneratedCards = []) => {
    if (isUpCard) {
        return { result: dealerCards, settlementResult: calculateFinalValue(dealerCards) };
    }

    let points = calculate(dealerCards);

    while (
        ((points.at(-1) < constants.minDealerHardPoint && points.length === 1) ||
            (points.length > 1 && points.at(-1) < constants.minDealerSoftPoint)) &&
        dealerCards.length < constants.maxCardsOnHand
    ) {
        dealerCards.push(preGeneratedCards.shift() ?? decks.shift());
        points = calculate(dealerCards);
    }

    return { result: dealerCards, settlementResult: points.at(-1) };
};

export const settle = async (dealerCards, bet, odds) => {
    const totalHandValue = calculateFinalValue(bet.cards);
    const totalOfDealer = calculateFinalValue(dealerCards);

    const facts = {
        totalHandValue,
        totalHandCards: bet.cards.length,
        totalOfDealer,
        totalDealerCards: dealerCards.length,
    };

    const dealerWin = {
        conditions: {
            any: [
                {
                    fact: "totalHandValue",
                    operator: "greaterThan",
                    value: 21,
                },
                {
                    fact: "totalOfDealer",
                    operator: "equal",
                    value: 21,
                },
                {
                    all: [
                        {
                            fact: "totalOfDealer",
                            operator: "greaterThanInclusive",
                            value: {
                                fact: "totalHandValue",
                            },
                        },
                        {
                            fact: "totalOfDealer",
                            operator: "lessThanInclusive",
                            value: 21,
                        },
                    ],
                },
                {
                    fact: "totalDealerCards",
                    operator: "equal",
                    value: 5,
                },
            ],
            not: [
                {
                    fact: "totalOfDealer",
                    operator: "greaterThan",
                    value: {
                        fact: 21,
                    },
                },
            ],
        },
        event: {
            type: "dealer-win",
            params: {
                odds: 0,
            },
        },
        priority: 2,
    };

    //TODO player win with regular odds
    const playerRegularOdds = {
        conditions: {
            any: [
                {
                    fact: "totalHandValue",
                    operator: "greaterThan",
                    value: {
                        fact: "totalOfDealer",
                    },
                },
                {
                    fact: "totalOfDealer",
                    operator: "greaterThan",
                    value: 21,
                },
            ],
            not: [
                {
                    fact: "totalHandValue",
                    operator: "lessThan",
                    value: 21,
                },
            ],
        },
        event: {
            type: "player-win-regular",
            params: {
                odds: odds[gameSettings.payouts.regular],
            },
        },
    };

    //TODO player win with pontoon odds
    const playerPonToonOdds = {
        conditions: {
            all: [
                {
                    fact: "totalHandValue",
                    operator: "equal",
                    value: 21,
                },
                {
                    fact: "totalHandCards",
                    operator: "equal",
                    value: 2,
                },
            ],
        },
        event: {
            type: "player-win-pontoon",
            params: {
                odds: odds[gameSettings.payouts.pontoon],
            },
        },
    };
    //TODO player win with five-cards-trickk odds?!?
    const playerFiveCardsOdds = {
        conditions: {
            all: [
                {
                    fact: "totalHandValue",
                    operator: "lessThan",
                    value: 21,
                },
                {
                    fact: "totalHandCards",
                    operator: "equal",
                    value: 5,
                },
            ],
        },
        event: {
            type: "player-win-fivecards",
            params: {
                odds: odds[gameSettings.payouts.fiveCardTrick],
            },
        },
    };

    const engine = new Engine();

    engine.addRule(new Rule(dealerWin));
    const dealerWins = await engine.run(facts);

    if (dealerWins.events.length > 0) {
        const event = dealerWins.events.pop();
        return event.params.odds;
    }

    const playerEngine = new Engine();

    playerEngine.addRule(new Rule(playerPonToonOdds));
    playerEngine.addRule(new Rule(playerFiveCardsOdds));
    playerEngine.addRule(new Rule(playerRegularOdds));

    const playerWins = await playerEngine.run(facts);

    if (playerWins.events.length > 0) {
        const odds = playerWins.events.map((event) => event.params.odds);
        return Math.max(...odds);
    }

    return 0;
};

export const isSplitted = (bet) => {
    return bet.actions.includes(gameSettings.actions.split) || bet.splitFrom > 0;
};

export const isUpCards = (hands) => {
    const pontoonCount = hands.filter((hand) => isPontoon(hand.cards)).length;
    const bustCount = hands.filter((hand) => isBust(hand.cards)).length;

    return pontoonCount + bustCount === hands.length;
};
