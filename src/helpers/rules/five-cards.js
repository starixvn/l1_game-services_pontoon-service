export const fiveCardsDealer = {
    conditions: {
        all: [
            {
                fact: "totalOfDealer",
                operator: "lessThanInclusive",
                value: 21,
            },
            {
                fact: "totalDealerCards",
                operator: "equal",
                value: 5,
            },
        ],
    },
    event: {
        type: "settle",
        params: {
            winner: "dealer",
            oddsType: "loose",
        },
    },
};

export const fiveCardsPlayer = {
    conditions: {
        all: [
            {
                fact: "totalHandValue",
                operator: "lessThanInclusive",
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
        type: "settle",
        params: {
            winner: "player",
            oddsType: "fiveCardTrick",
        },
    },
};
