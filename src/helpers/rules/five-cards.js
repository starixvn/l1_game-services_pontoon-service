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
        type: "dealer",
        params: {
            message: "five-cards",
            odds: 0,
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
        type: "player",
        params: {
            message: "five-cards",
            odds: 2.5,
        },
    },
};
