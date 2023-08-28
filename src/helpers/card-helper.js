import constants from "./../constants";

export const calculate = (cards) => {
    if (cards?.length > 0) {
        const secondHandValue = cards.reduce((total, acc) => {
            return getValue(acc) + total;
        }, 0);

        return hasAce(cards) && secondHandValue !== constants.pontoon ? calculateAce(cards, secondHandValue) : [secondHandValue];
    }

    return [0];
};

const calculateAce = (cards, total) => {
    let aceCount = cards.filter((card) => isAce(card)).length;
    let firstValue = total;
    const reducedValues = [total];

    while (aceCount > 0) {
        firstValue -= constants.reduceValueOfAce;
        reducedValues.push(firstValue);
        aceCount--;
    }

    const reversedValues = [...reducedValues].reverse();

    return reversedValues.some((value) => value <= constants.pontoon)
        ? reversedValues.filter((value) => value <= constants.pontoon)
        : [reversedValues[0]];
};

export const calculateFinalValue = (cards) => {
    const handValues = calculate(cards);

    return handValues.length > 1 ? handValues[1] : handValues[0];
};

export const isPontoon = (cards) => {
    return cards.length === 2 && calculate(cards)[0] === constants.pontoon;
};

export const isFiveCardTrick = (cards) => {
    return cards.length === 5 && calculateFinalValue(cards) <= constants.pontoon;
};

export const isBust = (cards) => {
    return calculate(cards)[0] > constants.pontoon;
};

export const hasAce = (cards) => {
    return cards.some((card) => card.rank === "A");
};

export const isAce = (card) => {
    return card.rank === "A";
};

export const isJQK = (card) => {
    return card.rank === "J" || card.rank === "Q" || card.rank === "K";
};

export const getValue = (card) => {
    if (isAce(card)) {
        return constants.aceValue;
    }
    if (isJQK(card)) {
        return constants.JQKValue;
    }

    return parseInt(card.rank);
};
