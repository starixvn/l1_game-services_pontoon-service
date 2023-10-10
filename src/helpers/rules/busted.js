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
        type: "dealer",
        params: {
            message: "player-busted",
            odds: 0,
        },
    },
};
