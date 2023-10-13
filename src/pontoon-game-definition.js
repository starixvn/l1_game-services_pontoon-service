import { Core } from "sc-game-base";

export default class PontoonGameDefinition extends Core.GameDefinition {
    constructor({ id = 0, name = "", durations = {} }, generateResult, settle, actions, payouts) {
        super({ id, name, durations }, generateResult, settle);
        this.actions = actions;
        this.payouts = payouts;
    }
}
