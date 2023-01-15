import { derived } from 'overmind';

import { CategoriesState } from "state/_types";

export const state: CategoriesState = {
    itemsList: derived( (state: CategoriesState) => Object.values(state.items) ),
    items: {},
    currentItemId: null,
    get currentItem() {
        return this.currentItemId ? this.items[this.currentItemId] : null
    }
}