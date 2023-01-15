import { derived } from 'overmind';

import { MachinesState } from "state/_types";


//TODO: get rid of currentItemId, figure out what items/itemList is used for
export const state: MachinesState = {
    itemsList: derived( (state: MachinesState) => Object.values(state.items) ),
    items: {},
    currentItemId: null,
    get currentItem() {
        return this.currentItemId ? this.items[this.currentItemId] : null
    }
}