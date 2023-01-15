import { Action } from "state/_types";

export const refreshNode: Action<string> = async ({state}, nodeId) => {
    console.log("refresh", nodeId)
    let node = state.recipes.nodes[nodeId]
    node.checkUsage()
    state.updated = Date.now()
}

export const increaseNode: Action<string> = async ({state}, nodeId) => {
    console.log("increase ", nodeId)
    let node = state.recipes.nodes[nodeId]
    node.increaseMachines()
    state.updated = Date.now()
}

export const decreaseNode: Action<string> = async ({state}, nodeId) => {
    console.log("decrease ", nodeId)
    let node = state.recipes.nodes[nodeId]
    node.decreaseMachines()
    state.updated = Date.now()
}

export const removeNode: Action<string> = async ({state}, nodeId) => {
    console.log("delete ", nodeId)
    delete(state.recipes.nodes[nodeId])
    state.updated = Date.now()
}