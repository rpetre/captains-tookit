import { derived } from 'overmind';

import { ProductsState } from "state/_types";

//TODO: what is currentItem used for?
export const state: ProductsState = {
    itemsList: derived( (state: ProductsState) => Object.values(state.items) ),
    items: {},
    currentItemId: null,
    get currentItem() {
        return this.currentItemId ? this.items[this.currentItemId] : null
    }
}