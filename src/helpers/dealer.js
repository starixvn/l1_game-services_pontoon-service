import constants from "./../constants";
import gameSettings from "./../game-settings";
import { calculateFinalValue, isBust, isFiveCardTrick, isPontoon } from "./card-helper";

export const generateResult = (dealerCards, decks, isUpCard, preGeneratedCards) => {
    let settlementResult = calculateFinalValue(dealerCards);

    if (isUpCard) {
        settlementResult = calculateFinalValue(dealerCards);
        return { result: dealerCards, settlementResult };
    }

    while (settlementResult < constants.minDealerHand && dealerCards.length < constants.maxCardsOnHand) {
        dealerCards.push(preGeneratedCards.shift() ?? decks.shift());
        settlementResult = calculateFinalValue(dealerCards);
    }

    return { result: dealerCards, settlementResult };
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

    if (isFiveCardTrick(bet.cards)) {
        return isFiveCardTrick(dealerCards) ? 0 : odds[gameSettings.payouts.fiveCardTrick];
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
