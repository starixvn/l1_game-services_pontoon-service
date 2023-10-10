export const higherPlayer = {
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
    },
    event: {
        type: "player",
        params: {
            message: "hand-higher",
            odds: 2,
        },
    },
};
