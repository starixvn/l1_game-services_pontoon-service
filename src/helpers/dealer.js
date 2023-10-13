import constants from "./../constants";
import gameSettings from "./../game-settings";
import { calculate, calculateFinalValue, isBust, isFiveCardTrick, isPontoon } from "./card-helper";

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

export const settle = (dealerCards, bet, odds) => {
    const totalHandValue = calculateFinalValue(bet.cards);
    const totalOfDealer = calculateFinalValue(dealerCards);

    if (isPontoon(dealerCards) || isBust(bet.cards)) {
        return 0;
    }

    if (isPontoon(bet.cards)) {
        return odds[gameSettings.payouts.pontoon];
    }

    const delearHasFiveCardTrick = isFiveCardTrick(dealerCards);

    if (isFiveCardTrick(bet.cards)) {
        return delearHasFiveCardTrick ? 0 : odds[gameSettings.payouts.fiveCardTrick];
    } else if (delearHasFiveCardTrick) {
        return 0;
    }

    return isBust(dealerCards) || totalHandValue > totalOfDealer ? odds[gameSettings.payouts.regular] : 0;
};

export const isSplitted = (bet) => {
    return bet.actions.includes(gameSettings.actions.split) || bet.splitFrom > 0;
};

export const isUpCards = (hands) => {
    const pontoonCount = hands.filter((hand) => isPontoon(hand.cards)).length;
    const bustCount = hands.filter((hand) => isBust(hand.cards)).length;

    return pontoonCount + bustCount === hands.length;
};
