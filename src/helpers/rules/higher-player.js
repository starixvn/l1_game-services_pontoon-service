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
        type: "settle",
        params: {
            winner: "player",
            oddsType: "regular",
        },
    },
};
