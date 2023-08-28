import constants from "./../constants";
import gameSettings from "./../game-settings";
import { calculateFinalValue, isBust, isFiveCardTrick, isPontoon } from "./card-helper";

export const generateResult = (dealerCards, decks, isUpCard) => {
    let settlementResult = calculateFinalValue(dealerCards);

    if (isUpCard) {
        settlementResult = calculateFinalValue(dealerCards);
        return { result: dealerCards, settlementResult };
    }

    while (settlementResult < constants.minDealerHand) {
        dealerCards.push(decks.shift());
        settlementResult = calculateFinalValue(dealerCards);
    }

    return { result: dealerCards, settlementResult };
};

export const settle = (dealerCards, bet, odds) => {
    const totalHandValue = calculateFinalValue(bet.cards);
    const totalOfDealer = calculateFinalValue(dealerCards);

    if (isPontoon(bet.cards)) {
        return isPontoon(dealerCards) ? 1 : odds[gameSettings.payouts.pontoon];
    }

    if (isFiveCardTrick(bet.cards)) {
        return isPontoon(dealerCards) ? 0 : odds[gameSettings.payouts.fiveCardTrick];
    }

    if (isBust(bet.cards)) {
        return 0;
    }

    if (isBust(dealerCards)) {
        return odds[gameSettings.payouts.regular];
    }

    return totalHandValue > totalOfDealer ? odds[gameSettings.payouts.regular] : 0;
};

export const isSplitted = (bet) => {
    return bet.actions.includes(gameSettings.actions.split) || bet.splitFrom > 0;
};

export const isUpCards = (hands) => {
    const pontoonCount = hands.filter((hand) => isPontoon(hand.cards)).length;
    const bustCount = hands.filter((hand) => isBust(hand.cards)).length;

    return pontoonCount + bustCount === hands.length;
};
