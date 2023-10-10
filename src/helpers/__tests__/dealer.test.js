import constants from "../../constants";
import * as Dealer from "../dealer";
import * as Deck from "../deck-helper";

describe("generateResult()", () => {
    it("should auto deal until it reach min value of dealer", () => {
        const tests = [
            {
                dealer: [
                    { rank: "2", suit: 1 },
                    { rank: "5", suit: 1 },
                ],
            },
            {
                dealer: [
                    { rank: "10", suit: 1 },
                    { rank: "5", suit: 1 },
                ],
            },
            {
                dealer: [
                    { rank: "A", suit: 1 },
                    { rank: "2", suit: 1 },
                ],
            },
        ];

        tests.forEach((test) => {
            const deck = Deck.generateDecks([...test.dealer, { rank: "J", suit: 1 }, { rank: "7", suit: 1 }]);
            const result = Dealer.generateResult(test.dealer, deck, false, []);
            expect(result.settlementResult).toBeGreaterThanOrEqual(constants.minDealerHardPoint);
        });
    });

    it("should not deal since hard point reached min value of dealer", () => {
        const tests = [
            {
                dealer: [
                    { rank: "10", suit: 1 },
                    { rank: "8", suit: 1 },
                ],
                total: 18,
            },
            {
                dealer: [
                    { rank: "A", suit: 1 },
                    { rank: "9", suit: 1 },
                ],
                total: 20,
            },
            {
                dealer: [
                    { rank: "J", suit: 1 },
                    { rank: "7", suit: 1 },
                ],
                total: 17,
            },
            {
                dealer: [
                    { rank: "Q", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                total: 20,
            },
            {
                dealer: [
                    { rank: "Q", suit: 1 },
                    { rank: "A", suit: 1 },
                ],
                total: 21,
            },
        ];

        tests.forEach((test) => {
            const deck = Deck.generateDecks([...test.dealer, { rank: "J", suit: 1 }, { rank: "7", suit: 1 }]);
            expect(Dealer.generateResult(test.dealer, deck).settlementResult).toEqual(test.total);
        });
    });

    it("should deal if soft point is less than 18", () => {
        //Arrange
        const dealer = [
            { rank: "A", suit: 1 },
            { rank: "6", suit: 1 },
        ];
        const decks = Deck.generateDecks(dealer, 1);
        //Act
        const result = Dealer.generateResult(dealer, decks, false, []);
        //Assert
        expect(result.result.length).toBeGreaterThan(2);
    });
});

describe("settle()", () => {
    const odds = { regular: 2, pontoon: 3.5, fiveCardTrick: 2.5 };

    it("should return 0 if both dealer and player are pontoon", async () => {
        const test = {
            dealer: [
                { rank: "J", suit: 1 },
                { rank: "A", suit: 1 },
            ],
            bet: {
                actions: [],
                cards: [
                    { rank: "J", suit: 1 },
                    { rank: "A", suit: 1 },
                ],
            },
        };
        expect(await Dealer.settle(test.dealer, test.bet, odds)).toEqual(0);
    });

    it("should return pontoon odds if player is pontoon but dealer is not", async () => {
        const tests = [
            {
                dealer: [
                    { rank: "J", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "A", suit: 1 },
                    ],
                },
            },
        ];

        tests.forEach(async (test) => {
            expect(await Dealer.settle(test.dealer, test.bet, odds)).toEqual(odds.pontoon);
        });
    });

    it("should return pontoon odds if player is pontoon but splitted", async () => {
        const tests = [
            {
                dealer: [
                    { rank: "J", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    actions: ["split"],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "A", suit: 1 },
                    ],
                },
            },
            {
                dealer: [
                    { rank: "J", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    splitFrom: 1,
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "A", suit: 1 },
                    ],
                },
            },
        ];
        tests.forEach(async (test) => {
            expect(await Dealer.settle(test.dealer, test.bet, odds)).toEqual(odds.pontoon);
        });
    });

    it("should return 0 if player is bust", async () => {
        const tests = [
            {
                dealer: [
                    { rank: "J", suit: 1 },
                    { rank: "7", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "7", suit: 1 },
                        { rank: "5", suit: 1 },
                    ],
                },
            },
            {
                dealer: [
                    { rank: "6", suit: 1 },
                    { rank: "7", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "7", suit: 1 },
                        { rank: "5", suit: 1 },
                    ],
                },
            },
        ];

        tests.forEach(async (test) => {
            expect(await Dealer.settle(test.dealer, test.bet, odds)).toEqual(0);
        });
    });

    it("should return regular odds if player is greater than dealer and not bust", async () => {
        const tests = [
            {
                dealer: [
                    { rank: "J", suit: 1 },
                    { rank: "7", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "3", suit: 1 },
                        { rank: "5", suit: 1 },
                    ],
                },
            },
            {
                dealer: [
                    { rank: "6", suit: 1 },
                    { rank: "7", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "7", suit: 1 },
                    ],
                },
            },
            {
                dealer: [
                    { rank: "2", suit: 1 },
                    { rank: "7", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "K", suit: 1 },
                    ],
                },
            },
        ];

        tests.forEach(async (test) => {
            // Act
            const result = await Dealer.settle(test.dealer, test.bet, odds);

            // Assert
            expect(result).toEqual(odds.regular);
        });
    });

    it("should return regular odds if player is less than 21 and dealer is busted", async () => {
        const tests = [
            {
                dealer: [
                    { rank: "6", suit: 1 },
                    { rank: "7", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "J", suit: 1 },
                        { rank: "7", suit: 1 },
                    ],
                },
            },
        ];

        tests.forEach(async (test) => {
            expect(await Dealer.settle(test.dealer, test.bet, odds)).toEqual(odds.regular);
        });
    });

    it.each([
        {
            dealer: [
                { rank: "J", suit: 1 },
                { rank: "7", suit: 1 },
            ],
            bet: {
                actions: [],
                cards: [
                    { rank: "J", suit: 1 },
                    { rank: "7", suit: 1 },
                ],
            },
        },
        {
            dealer: [
                { rank: "J", suit: 1 },
                { rank: "5", suit: 1 },
                { rank: "4", suit: 1 },
            ],
            bet: {
                actions: [],
                cards: [
                    { rank: "J", suit: 1 },
                    { rank: "9", suit: 1 },
                ],
            },
        },
    ])("should return 0 if both dealer and player are the same", async (test) => {
        // Arrange
        const odds = { regular: 2, pontoon: 3.5, fiveCardTrick: 2.5 };

        // Act
        const result = await Dealer.settle(test.dealer, test.bet, odds);

        // Assert
        expect(result).toEqual(0);
    });

    it("should return fiveCardsTrick odds if player is fiveCardsTrick", async () => {
        const tests = [
            {
                dealer: [
                    { rank: "7", suit: 1 },
                    { rank: "K", suit: 1 },
                ],
                bet: {
                    actions: [],
                    cards: [
                        { rank: "2", suit: 1 },
                        { rank: "3", suit: 1 },
                        { rank: "2", suit: 1 },
                        { rank: "2", suit: 1 },
                        { rank: "2", suit: 1 },
                    ],
                },
            },
        ];

        tests.forEach(async (test) => {
            // Act
            const result = await Dealer.settle(test.dealer, test.bet, odds);

            // Assert
            expect(result).toEqual(odds.fiveCardTrick);
        });
    });
});

describe("isUpCards()", () => {
    it("should be true if all hands are bust", () => {
        const tests = [
            {
                hands: [
                    {
                        cards: [
                            { rank: "8", suit: 1 },
                            { rank: "5", suit: 1 },
                            { rank: "K", suit: 1 },
                        ],
                        actions: [],
                    },
                    {
                        cards: [
                            { rank: "9", suit: 1 },
                            { rank: "5", suit: 1 },
                            { rank: "8", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
            {
                hands: [
                    {
                        cards: [
                            { rank: "7", suit: 1 },
                            { rank: "9", suit: 1 },
                            { rank: "7", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
        ];

        tests.forEach((test) => {
            expect(Dealer.isUpCards(test.hands)).toBeTruthy();
        });
    });

    it("should be true if all hands are pontoon", () => {
        const tests = [
            {
                hands: [
                    {
                        cards: [
                            { rank: "A", suit: 1 },
                            { rank: "K", suit: 1 },
                        ],
                        actions: [],
                    },
                    {
                        cards: [
                            { rank: "J", suit: 1 },
                            { rank: "A", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
            {
                hands: [
                    {
                        cards: [
                            { rank: "A", suit: 1 },
                            { rank: "Q", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
        ];

        tests.forEach((test) => {
            expect(Dealer.isUpCards(test.hands)).toBeTruthy();
        });
    });

    it("should be true if count of pontoon and bust are equal total hands", () => {
        const tests = [
            {
                hands: [
                    {
                        cards: [
                            { rank: "A", suit: 1 },
                            { rank: "K", suit: 1 },
                        ],
                        actions: [],
                    },
                    {
                        cards: [
                            { rank: "9", suit: 1 },
                            { rank: "5", suit: 1 },
                            { rank: "8", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
        ];

        tests.forEach((test) => {
            expect(Dealer.isUpCards(test.hands)).toBeTruthy();
        });
    });

    it("should be false if count of pontoon and bust are NOT equal total hands", () => {
        const tests = [
            {
                hands: [
                    {
                        cards: [
                            { rank: "A", suit: 1 },
                            { rank: "K", suit: 1 },
                        ],
                        actions: [],
                    },
                    {
                        cards: [
                            { rank: "9", suit: 1 },
                            { rank: "5", suit: 1 },
                            { rank: "2", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
            {
                hands: [
                    {
                        cards: [
                            { rank: "9", suit: 1 },
                            { rank: "K", suit: 1 },
                            { rank: "3", suit: 1 },
                        ],
                        actions: [],
                    },
                    {
                        cards: [
                            { rank: "9", suit: 1 },
                            { rank: "5", suit: 1 },
                            { rank: "2", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
        ];

        tests.forEach((test) => {
            expect(Dealer.isUpCards(test.hands)).toBeFalsy();
        });
    });

    it("should be true if count of pontoon and bust are equal total hands but pontoon hands were splitted", () => {
        const tests = [
            {
                hands: [
                    {
                        cards: [
                            { rank: "A", suit: 1 },
                            { rank: "K", suit: 1 },
                        ],
                        actions: ["split"],
                    },
                    {
                        cards: [
                            { rank: "9", suit: 1 },
                            { rank: "5", suit: 1 },
                            { rank: "8", suit: 1 },
                        ],
                        actions: [],
                    },
                ],
            },
        ];

        tests.forEach((test) => {
            expect(Dealer.isUpCards(test.hands)).toBeTrue();
        });
    });
});
