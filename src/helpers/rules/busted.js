export const busted = {
    conditions: {
        all: [
            {
                fact: "totalHandValue",
                operator: "greaterThan",
                value: 21,
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
