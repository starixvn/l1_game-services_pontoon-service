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
        type: "dealer",
        params: {
            message: "pontoon",
            odds: 0,
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
        type: "player",
        params: {
            message: "pontoon",
            odds: 3.5,
        },
    },
};
