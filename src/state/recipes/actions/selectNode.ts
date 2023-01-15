import { Action } from "state/_types";

export const selectNode: Action<string> = async ({state}, nodeId) => {
    state.recipes.currentNodeId = nodeId
}