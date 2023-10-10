import constants from "./../constants";
import gameSettings from "./../game-settings";
import { calculate, calculateFinalValue, isBust, isFiveCardTrick, isPontoon } from "./card-helper";
import { busted, fiveCardsDealer, fiveCardsPlayer, pontoonDealer, pontoonPlayer, higherPlayer } from "./rules";

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

    const engine = new Engine();

    engine.addRule(new Rule(busted));
    engine.addRule(new Rule(fiveCardsDealer));
    engine.addRule(new Rule(fiveCardsPlayer));
    engine.addRule(new Rule(pontoonDealer));
    engine.addRule(new Rule(pontoonPlayer));
    engine.addRule(new Rule(higherPlayer));

    const ruleResults = await engine.run(facts);

    if (ruleResults.events.length > 0) {
        const dealerWins = ruleResults.events.filter((e) => e.params.winner === "dealer");

        if (dealerWins.length > 0) {
            return 0;
        }

        const playerWins = ruleResults.events.filter((e) => e.params.winner === "player");
        const oddsReturn = playerWins.map((e) => odds[e.params.oddsType]);

        return Math.max(...oddsReturn);
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
