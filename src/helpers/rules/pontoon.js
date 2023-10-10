export const pontoonDealer = {
    conditions: {
        all: [
            {
                fact: "totalOfDealer",
                operator: "equal",
                value: 21,
            },
            {
                fact: "totalDealerCards",
                operator: "equal",
                value: 2,
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

export const pontoonPlayer = {
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
        type: "settle",
        params: {
            winner: "player",
            oddsType: "pontoon",
        },
    },
};
